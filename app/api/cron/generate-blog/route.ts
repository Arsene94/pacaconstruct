import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/app/lib/supabase/admin";
import { computeNextRun } from "@/app/lib/schedule";
import { enqueueArticleGeneration } from "@/app/lib/ai/enqueue";

// Doar dispecer acum: pune topicele scadente în coadă și răspunde imediat.
export const dynamic = "force-dynamic";
export const maxDuration = 60;

type DueSchedule = {
  id: string;
  frequency: string;
  hour: number;
  day_of_week: number | null;
  day_of_month: number | null;
  posts_per_run: number;
};

/**
 * Rută declanșată de Vercel Cron (vezi vercel.json). Protejată cu CRON_SECRET.
 *
 * NU mai generează inline. Pentru fiecare programare scadentă, ia topicele
 * „idee" după scor, le marchează `in_coada` și **pune în coadă** generarea
 * (workflow Upstash durabil). Apoi reprogramează `next_run_at` și răspunde
 * rapid — fără risc de timeout, cu retry/DLQ per articol în workflow.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Neautorizat" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const now = new Date();

  const { data: due, error } = await supabase
    .from("blog_schedules")
    .select("id, frequency, hour, day_of_week, day_of_month, posts_per_run")
    .eq("is_active", true)
    .lte("next_run_at", now.toISOString())
    .returns<DueSchedule[]>();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const results: Array<{ schedule: string; queued: string[] }> = [];

  for (const schedule of due ?? []) {
    const { data: topics } = await supabase
      .from("blog_topics")
      .select("id")
      .eq("status", "idee")
      .order("score", { ascending: false })
      .limit(Math.max(1, schedule.posts_per_run));

    const queued: string[] = [];
    for (const t of topics ?? []) {
      // Marchează imediat ca să nu fie re-luat de o rulare de cron suprapusă.
      await supabase
        .from("blog_topics")
        .update({ status: "in_coada" })
        .eq("id", t.id);
      try {
        await enqueueArticleGeneration({ topicId: t.id, scheduleId: schedule.id });
        queued.push(t.id);
      } catch (err) {
        console.error(`Cron: punere în coadă eșuată pentru ${t.id}:`, err);
      }
    }

    await supabase
      .from("blog_schedules")
      .update({
        last_run_at: now.toISOString(),
        next_run_at: computeNextRun(schedule, now).toISOString(),
      })
      .eq("id", schedule.id);

    results.push({ schedule: schedule.id, queued });
  }

  return NextResponse.json({ ran: results.length, results });
}

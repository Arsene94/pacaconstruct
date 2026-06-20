"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/app/lib/dal";
import { createClient } from "@/app/lib/supabase/server";
import { computeNextRun } from "@/app/lib/schedule";
import { analyzeTopics } from "@/app/lib/ai/topics";
import { enqueueArticleGeneration } from "@/app/lib/ai/enqueue";
import type { FormState } from "@/app/actions/content";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function str(form: FormData, key: string): string {
  return String(form.get(key) ?? "").trim();
}
function bool(form: FormData, key: string): boolean {
  const v = form.get(key);
  return v === "on" || v === "true" || v === "1";
}
function int(form: FormData, key: string, fallback = 0): number {
  const n = Number.parseInt(str(form, key), 10);
  return Number.isFinite(n) ? n : fallback;
}
function intOrNull(form: FormData, key: string): number | null {
  const raw = str(form, key);
  if (!raw) return null;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) ? n : null;
}
function lines(form: FormData, key: string): string[] {
  return String(form.get(key) ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function revalidateTopics() {
  revalidatePath("/admin/blog/topice");
  revalidatePath("/admin/blog");
  revalidatePath("/blog", "layout");
}

// ─── Analiză automată de topice ──────────────────────────────────────────────

export async function analyzeTopicsAction(): Promise<void> {
  await requireAdmin();
  const topics = await analyzeTopics();
  if (topics.length === 0) {
    revalidateTopics();
    return;
  }

  const supabase = await createClient();
  // Dedup față de titlurile deja existente.
  const { data: existing } = await supabase.from("blog_topics").select("title");
  const known = new Set((existing ?? []).map((t) => t.title.toLowerCase()));

  const rows = topics
    .filter((t) => !known.has(t.title.toLowerCase()))
    .map((t) => ({
      title: t.title,
      angle: t.angle,
      category: t.category,
      rationale: t.rationale,
      signals: t.signals,
      score: t.score,
      source: "analiza",
      status: "idee",
    }));

  if (rows.length > 0) {
    await supabase.from("blog_topics").insert(rows);
  }
  revalidateTopics();
}

// ─── CRUD topice (manual) ────────────────────────────────────────────────────

function readTopicPayload(form: FormData) {
  return {
    title: str(form, "title"),
    angle: str(form, "angle"),
    category: str(form, "category"),
    rationale: str(form, "rationale"),
    signals: lines(form, "signals"),
    score: int(form, "score"),
    source: "manual",
  };
}

export async function createTopic(
  _prev: FormState,
  form: FormData,
): Promise<FormState> {
  await requireAdmin();
  const payload = readTopicPayload(form);
  if (!payload.title) return { error: "Titlul topicului este obligatoriu." };
  const supabase = await createClient();
  const { error } = await supabase.from("blog_topics").insert(payload);
  if (error) return { error: `Nu am putut salva topicul: ${error.message}` };
  revalidateTopics();
  redirect("/admin/blog/topice");
}

export async function updateTopic(
  _prev: FormState,
  form: FormData,
): Promise<FormState> {
  await requireAdmin();
  const id = str(form, "id");
  const payload = readTopicPayload(form);
  if (!id) return { error: "Lipsește identificatorul topicului." };
  if (!payload.title) return { error: "Titlul topicului este obligatoriu." };
  const supabase = await createClient();
  const { error } = await supabase
    .from("blog_topics")
    .update(payload)
    .eq("id", id);
  if (error) return { error: `Nu am putut actualiza topicul: ${error.message}` };
  revalidateTopics();
  redirect("/admin/blog/topice");
}

export async function deleteTopic(form: FormData): Promise<void> {
  await requireAdmin();
  const id = str(form, "id");
  if (id) {
    const supabase = await createClient();
    await supabase.from("blog_topics").delete().eq("id", id);
    revalidateTopics();
  }
  revalidatePath("/admin/blog/topice");
}

// ─── Generare manuală pentru topice selectate ────────────────────────────────

export async function generateSelectedTopics(form: FormData): Promise<void> {
  await requireAdmin();
  const ids = form
    .getAll("topicId")
    .map((v) => String(v))
    .filter(Boolean);
  if (ids.length === 0) {
    revalidateTopics();
    return;
  }

  const supabase = await createClient();
  await supabase
    .from("blog_topics")
    .update({ status: "in_coada" })
    .in("id", ids);

  // Pune fiecare topic în coadă (workflow durabil). Cu QStash configurat
  // întoarce imediat; fără el, `enqueueArticleGeneration` rulează sincron.
  for (const id of ids) {
    try {
      await enqueueArticleGeneration({ topicId: id });
    } catch (err) {
      console.error(`Punere în coadă eșuată pentru topicul ${id}:`, err);
    }
  }
  revalidateTopics();
}

// ─── CRUD programări ─────────────────────────────────────────────────────────

function revalidateSchedules() {
  revalidatePath("/admin/blog/schedule");
}

function readSchedulePayload(form: FormData) {
  const cfg = {
    frequency: str(form, "frequency") || "saptamanal",
    hour: int(form, "hour", 9),
    day_of_week: intOrNull(form, "day_of_week"),
    day_of_month: intOrNull(form, "day_of_month"),
  };
  return {
    name: str(form, "name"),
    ...cfg,
    posts_per_run: Math.max(1, int(form, "posts_per_run", 1)),
    is_active: bool(form, "is_active"),
    next_run_at: computeNextRun(cfg).toISOString(),
  };
}

export async function createSchedule(
  _prev: FormState,
  form: FormData,
): Promise<FormState> {
  await requireAdmin();
  const payload = readSchedulePayload(form);
  const supabase = await createClient();
  const { error } = await supabase.from("blog_schedules").insert(payload);
  if (error) return { error: `Nu am putut salva programarea: ${error.message}` };
  revalidateSchedules();
  redirect("/admin/blog/schedule");
}

export async function updateSchedule(
  _prev: FormState,
  form: FormData,
): Promise<FormState> {
  await requireAdmin();
  const id = str(form, "id");
  if (!id) return { error: "Lipsește identificatorul programării." };
  const payload = readSchedulePayload(form);
  const supabase = await createClient();
  const { error } = await supabase
    .from("blog_schedules")
    .update(payload)
    .eq("id", id);
  if (error) return { error: `Nu am putut actualiza programarea: ${error.message}` };
  revalidateSchedules();
  redirect("/admin/blog/schedule");
}

export async function deleteSchedule(form: FormData): Promise<void> {
  await requireAdmin();
  const id = str(form, "id");
  if (id) {
    const supabase = await createClient();
    await supabase.from("blog_schedules").delete().eq("id", id);
    revalidateSchedules();
  }
  revalidatePath("/admin/blog/schedule");
}

/** Rulează imediat o programare: generează N topice „idee" după scor. */
export async function runScheduleNow(form: FormData): Promise<void> {
  await requireAdmin();
  const id = str(form, "id");
  if (!id) return;
  const supabase = await createClient();

  const { data: schedule } = await supabase
    .from("blog_schedules")
    .select("posts_per_run")
    .eq("id", id)
    .maybeSingle<{ posts_per_run: number }>();
  const limit = Math.max(1, schedule?.posts_per_run ?? 1);

  const { data: topics } = await supabase
    .from("blog_topics")
    .select("id")
    .eq("status", "idee")
    .order("score", { ascending: false })
    .limit(limit);

  for (const t of topics ?? []) {
    await supabase
      .from("blog_topics")
      .update({ status: "in_coada" })
      .eq("id", t.id);
    try {
      await enqueueArticleGeneration({ topicId: t.id, scheduleId: id });
    } catch (err) {
      console.error(`Punere în coadă eșuată (schedule ${id}) pentru ${t.id}:`, err);
    }
  }

  await supabase
    .from("blog_schedules")
    .update({ last_run_at: new Date().toISOString() })
    .eq("id", id);

  revalidateSchedules();
  revalidateTopics();
}

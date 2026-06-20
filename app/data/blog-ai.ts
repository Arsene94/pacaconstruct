import { createClient } from "@/app/lib/supabase/server";

// ─── Topice ──────────────────────────────────────────────────────────────────

export type BlogTopic = {
  id: string;
  title: string;
  angle: string;
  category: string;
  rationale: string;
  source: string;
  signals: string[];
  score: number;
  status: string;
  generated_post_id: string | null;
  last_error: string | null;
  created_at: string;
};

const TOPIC_COLUMNS =
  "id, title, angle, category, rationale, source, signals, score, status, generated_post_id, last_error, created_at";

/** Toate topicele, cele neîncepute (după scor) primele. */
export async function getTopics(): Promise<BlogTopic[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_topics")
    .select(TOPIC_COLUMNS)
    .order("status", { ascending: true })
    .order("score", { ascending: false })
    .returns<BlogTopic[]>();
  if (error) throw new Error(`Nu am putut încărca topicele: ${error.message}`);
  return data ?? [];
}

export async function getTopicById(id: string): Promise<BlogTopic | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_topics")
    .select(TOPIC_COLUMNS)
    .eq("id", id)
    .maybeSingle<BlogTopic>();
  if (error) throw new Error(`Nu am putut încărca topicul: ${error.message}`);
  return data;
}

// ─── Programări ────────────────────────────────────────────────────────────────

export type BlogSchedule = {
  id: string;
  name: string;
  frequency: string;
  hour: number;
  day_of_week: number | null;
  day_of_month: number | null;
  posts_per_run: number;
  is_active: boolean;
  next_run_at: string | null;
  last_run_at: string | null;
};

const SCHEDULE_COLUMNS =
  "id, name, frequency, hour, day_of_week, day_of_month, posts_per_run, is_active, next_run_at, last_run_at";

export async function getSchedules(): Promise<BlogSchedule[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_schedules")
    .select(SCHEDULE_COLUMNS)
    .order("created_at", { ascending: false })
    .returns<BlogSchedule[]>();
  if (error) throw new Error(`Nu am putut încărca programările: ${error.message}`);
  return data ?? [];
}

export async function getScheduleById(id: string): Promise<BlogSchedule | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_schedules")
    .select(SCHEDULE_COLUMNS)
    .eq("id", id)
    .maybeSingle<BlogSchedule>();
  if (error) throw new Error(`Nu am putut încărca programarea: ${error.message}`);
  return data;
}

-- PACA CONSTRUCT — blog generat cu AI
-- Migrare 5: topice, schedule, log de generare, extinderi pe blog_posts și
-- bucket de storage pentru imaginile generate.
--
-- Modelul de acces e identic cu restul: tabelele interne (topice, schedule,
-- log) sunt vizibile/editabile doar de admin; blog_posts rămâne public la
-- citire pentru rândurile publicate (politicile lui sunt deja în migrarea 2).

-- ─── Extinderi pe blog_posts ─────────────────────────────────────────────────
alter table public.blog_posts
  add column if not exists tags            text[]  not null default '{}',
  add column if not exists sources         jsonb   not null default '[]'::jsonb,  -- [{title, url}]
  add column if not exists is_ai_generated boolean not null default false,
  add column if not exists image_prompt    text;

-- ─── Topice de blog (sursă pentru generare) ──────────────────────────────────
create table public.blog_topics (
  id                uuid primary key default gen_random_uuid(),
  title             text not null,
  angle             text not null default '',          -- unghiul/abordarea articolului
  category          text not null default '',
  rationale         text not null default '',          -- de ce e relevant pentru clienți
  source            text not null default 'manual',    -- 'manual' | 'analiza'
  signals           jsonb not null default '[]'::jsonb, -- întrebările reale din care a rezultat
  score             integer not null default 0,        -- prioritate/frecvență estimată
  status            text not null default 'idee',      -- 'idee' | 'in_coada' | 'generat' | 'esuat'
  generated_post_id uuid references public.blog_posts (id) on delete set null,
  last_error        text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index blog_topics_status_idx on public.blog_topics (status);
create index blog_topics_score_idx  on public.blog_topics (score desc);

-- Adăugăm legătura inversă pe blog_posts abia acum (blog_topics există).
alter table public.blog_posts
  add column if not exists topic_id uuid references public.blog_topics (id) on delete set null;

-- ─── Programări de generare ──────────────────────────────────────────────────
create table public.blog_schedules (
  id            uuid primary key default gen_random_uuid(),
  name          text not null default '',
  frequency     text not null default 'saptamanal',    -- 'zilnic' | 'saptamanal' | 'lunar'
  hour          integer not null default 9,            -- ora rulării (0-23)
  day_of_week   integer,                               -- 0=Duminică .. 6=Sâmbătă (pt. săptămânal)
  day_of_month  integer,                               -- 1-28 (pt. lunar)
  posts_per_run integer not null default 1,
  is_active     boolean not null default true,
  next_run_at   timestamptz,
  last_run_at   timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index blog_schedules_active_idx on public.blog_schedules (is_active, next_run_at);

-- ─── Log de generare (observabilitate) ───────────────────────────────────────
create table public.blog_generation_runs (
  id          uuid primary key default gen_random_uuid(),
  topic_id    uuid references public.blog_topics (id) on delete set null,
  schedule_id uuid references public.blog_schedules (id) on delete set null,
  post_id     uuid references public.blog_posts (id) on delete set null,
  status      text not null default 'ok',              -- 'ok' | 'eroare'
  model       text not null default '',
  image_model text not null default '',
  error       text,
  created_at  timestamptz not null default now()
);
create index blog_generation_runs_created_at_idx on public.blog_generation_runs (created_at desc);

-- ─── Triggere updated_at ─────────────────────────────────────────────────────
create trigger trg_blog_topics_updated    before update on public.blog_topics    for each row execute function public.set_updated_at();
create trigger trg_blog_schedules_updated  before update on public.blog_schedules  for each row execute function public.set_updated_at();

-- ─── RLS: tabele interne, doar admin (pattern identic cu projects) ───────────
alter table public.blog_topics          enable row level security;
alter table public.blog_schedules        enable row level security;
alter table public.blog_generation_runs  enable row level security;

create policy "blog_topics admin read"   on public.blog_topics for select using (public.is_admin());
create policy "blog_topics admin insert" on public.blog_topics for insert with check (public.is_admin());
create policy "blog_topics admin update" on public.blog_topics for update using (public.is_admin()) with check (public.is_admin());
create policy "blog_topics admin delete" on public.blog_topics for delete using (public.is_admin());

create policy "blog_schedules admin read"   on public.blog_schedules for select using (public.is_admin());
create policy "blog_schedules admin insert" on public.blog_schedules for insert with check (public.is_admin());
create policy "blog_schedules admin update" on public.blog_schedules for update using (public.is_admin()) with check (public.is_admin());
create policy "blog_schedules admin delete" on public.blog_schedules for delete using (public.is_admin());

create policy "blog_generation_runs admin read"   on public.blog_generation_runs for select using (public.is_admin());
create policy "blog_generation_runs admin insert" on public.blog_generation_runs for insert with check (public.is_admin());
create policy "blog_generation_runs admin delete" on public.blog_generation_runs for delete using (public.is_admin());

-- ─── Storage: bucket public pentru imaginile generate ────────────────────────
insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do nothing;

-- Citire publică pentru bucket-ul blog-images; scriere/ștergere doar admin.
create policy "blog-images public read"
  on storage.objects for select
  using (bucket_id = 'blog-images');

create policy "blog-images admin insert"
  on storage.objects for insert
  with check (bucket_id = 'blog-images' and public.is_admin());

create policy "blog-images admin update"
  on storage.objects for update
  using (bucket_id = 'blog-images' and public.is_admin())
  with check (bucket_id = 'blog-images' and public.is_admin());

create policy "blog-images admin delete"
  on storage.objects for delete
  using (bucket_id = 'blog-images' and public.is_admin());

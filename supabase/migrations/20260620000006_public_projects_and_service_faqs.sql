-- PACA CONSTRUCT — SEO: Q&A editabil per serviciu + portofoliu public de proiecte
-- Migrare 6: extinde `services` cu întrebări frecvente și `projects` cu câmpuri
-- publice (slug, rezumat, imagine, publicare), plus citire publică „published".

-- ─── services: întrebări frecvente editabile din admin ───────────────────────
-- Stocat ca jsonb [{question, text? -> answer}], la fel ca `processes`/`specs`.
alter table public.services
  add column if not exists faqs jsonb not null default '[]'::jsonb;  -- [{question, answer}]

-- ─── projects: câmpuri publice pentru portofoliu (/proiecte) ─────────────────
alter table public.projects
  add column if not exists slug         text,
  add column if not exists summary      text not null default '',
  add column if not exists image_src    text,
  add column if not exists image_alt    text,
  add column if not exists is_published boolean not null default false;

-- Slug unic doar când e completat (proiectele interne vechi rămân fără slug).
create unique index if not exists projects_slug_key
  on public.projects (slug) where slug is not null;

-- ─── RLS: citire publică a proiectelor PUBLICATE ─────────────────────────────
-- Se adaugă pe lângă politica existentă „projects admin read" (politicile
-- permisive de SELECT se combină cu OR): publicul vede doar `is_published`,
-- adminul vede tot. INSERT/UPDATE/DELETE rămân doar admin (politici existente).
drop policy if exists "projects public read published" on public.projects;
create policy "projects public read published"
  on public.projects for select
  using (is_published or public.is_admin());

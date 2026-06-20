-- PACA CONSTRUCT — schema inițială
-- Migrare 1/3: extensii, enum-uri, funcții helper, tabele, indexuri, triggere.
--
-- Modelul de acces (vezi docs/supabase-auth.md): doar adminii au cont, deci
-- orice utilizator autentificat este considerat admin. Conținutul publicat este
-- vizibil public; cererile (formulare) pot fi create de oricine, dar citite doar
-- de admini. Politicile RLS sunt în migrarea 2.

-- ─── Extensii ────────────────────────────────────────────────────────────────
create extension if not exists pgcrypto;     -- gen_random_uuid()

-- ─── Funcții helper ──────────────────────────────────────────────────────────

-- „Adminul" este orice sesiune autentificată (nu există sign-up public).
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select auth.role() = 'authenticated';
$$;

-- Ține `updated_at` la zi la fiecare UPDATE.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ─── Enum-uri ────────────────────────────────────────────────────────────────
create type public.project_type as enum (
  'Excavări', 'Terasamente', 'Amenajări', 'Închiriere'
);

create type public.project_status as enum (
  'Ofertat', 'Planificat', 'În execuție', 'Finalizat', 'Suspendat'
);

create type public.request_status as enum (
  'Nouă', 'În evaluare', 'Ofertat', 'Confirmat', 'Închisă'
);

create type public.request_channel as enum (
  'Formular', 'Telefon', 'Email'
);

-- ─── FAQ ─────────────────────────────────────────────────────────────────────
create table public.faq_sections (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  index_label  text not null,                       -- ex. „01"
  title        text not null,
  description  text not null default '',
  sort_order   integer not null default 0,
  is_published boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table public.faq_items (
  id           uuid primary key default gen_random_uuid(),
  section_id   uuid not null references public.faq_sections (id) on delete cascade,
  question     text not null,
  answer       text not null,
  highlights   text[] not null default '{}',
  sort_order   integer not null default 0,
  is_published boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index faq_items_section_id_idx on public.faq_items (section_id);

-- ─── Servicii ────────────────────────────────────────────────────────────────
create table public.service_groups (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  title       text not null,
  href        text not null,                         -- linkul „cap de grup"
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table public.services (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  title         text not null,
  short_title   text,
  eyebrow       text not null default '',
  description   text not null default '',
  summary_title text not null default '',
  summary       text not null default '',
  image_src     text,
  image_alt     text,
  processes     jsonb not null default '[]'::jsonb,  -- [{title, text}]
  specs         jsonb not null default '[]'::jsonb,  -- [{label, value, impact}]
  -- Apartenența la lista de „items" a unui grup din meniu (null = serviciu cap de grup).
  group_slug    text references public.service_groups (slug) on delete set null,
  in_mosaic       boolean not null default false,    -- apare în mozaicul de pe homepage
  is_mosaic_hero  boolean not null default false,    -- cardul mare 2x2 din mozaic
  is_mosaic_wide  boolean not null default false,    -- cardul lat din mozaic
  sort_order    integer not null default 0,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index services_group_slug_idx on public.services (group_slug);

-- ─── Utilaje de închiriat ────────────────────────────────────────────────────
create table public.rental_machines (
  id                   uuid primary key default gen_random_uuid(),
  slug                 text not null unique,
  category             text not null default '',
  title                text not null,
  short_description    text not null default '',
  long_description     text not null default '',
  price                text not null default '',
  image_src            text,
  image_alt            text,
  specs                jsonb not null default '[]'::jsonb,  -- [{label, value}]
  uses                 text[] not null default '{}',
  access_requirements  text[] not null default '{}',
  is_available         boolean not null default true,
  sort_order           integer not null default 0,
  is_published         boolean not null default true,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

-- ─── Blog ────────────────────────────────────────────────────────────────────
create table public.blog_posts (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  title           text not null,
  excerpt         text not null default '',
  body            text,
  category        text not null default '',
  read_time       text not null default '',
  published_at    date not null default current_date,  -- pentru sortare/filtrare
  published_label text not null default '',             -- afișaj exact (ex. „15 Oct 2024")
  image_src       text,
  image_alt       text,
  is_featured     boolean not null default false,
  is_published    boolean not null default true,
  sort_order      integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index blog_posts_published_at_idx on public.blog_posts (published_at desc);

-- ─── Proiecte (intern, doar admin) ───────────────────────────────────────────
create table public.projects (
  id          uuid primary key default gen_random_uuid(),
  code        text not null unique,
  name        text not null,
  client      text not null default '',
  type        public.project_type not null,
  location    text not null default '',
  value       text not null default '',              -- ex. „82.500 €"
  deadline    text not null default '',              -- ex. „30 Iun 2026"
  status      public.project_status not null default 'Ofertat',
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ─── Cereri servicii (intake din formularul public de contact) ───────────────
create sequence if not exists public.service_request_seq;

create table public.service_requests (
  id          uuid primary key default gen_random_uuid(),
  code        text not null unique,
  name        text not null,
  phone       text,
  email       text,
  service     text,
  location    text,
  surface     text,
  description text,
  channel     public.request_channel not null default 'Formular',
  status      public.request_status not null default 'Nouă',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index service_requests_status_idx on public.service_requests (status);
create index service_requests_created_at_idx on public.service_requests (created_at desc);

-- ─── Cereri închiriere (intake din pagina de utilaj) ─────────────────────────
create sequence if not exists public.rental_request_seq;

create table public.rental_requests (
  id          uuid primary key default gen_random_uuid(),
  code        text not null unique,
  name        text not null,
  phone       text,
  email       text,
  machine     text not null default '',
  period      text,
  location    text,
  message     text,
  status      public.request_status not null default 'Nouă',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index rental_requests_status_idx on public.rental_requests (status);
create index rental_requests_created_at_idx on public.rental_requests (created_at desc);

-- ─── Generare automată cod cerere (ex. CS-2026-0001 / CI-2026-0001) ──────────
create or replace function public.set_service_request_code()
returns trigger
language plpgsql
as $$
begin
  if new.code is null or new.code = '' then
    new.code := 'CS-' || to_char(now(), 'YYYY') || '-' ||
                lpad(nextval('public.service_request_seq')::text, 4, '0');
  end if;
  return new;
end;
$$;

create or replace function public.set_rental_request_code()
returns trigger
language plpgsql
as $$
begin
  if new.code is null or new.code = '' then
    new.code := 'CI-' || to_char(now(), 'YYYY') || '-' ||
                lpad(nextval('public.rental_request_seq')::text, 4, '0');
  end if;
  return new;
end;
$$;

create trigger trg_service_requests_code
  before insert on public.service_requests
  for each row execute function public.set_service_request_code();

create trigger trg_rental_requests_code
  before insert on public.rental_requests
  for each row execute function public.set_rental_request_code();

-- ─── Triggere updated_at ─────────────────────────────────────────────────────
create trigger trg_faq_sections_updated   before update on public.faq_sections   for each row execute function public.set_updated_at();
create trigger trg_faq_items_updated       before update on public.faq_items       for each row execute function public.set_updated_at();
create trigger trg_service_groups_updated  before update on public.service_groups  for each row execute function public.set_updated_at();
create trigger trg_services_updated        before update on public.services        for each row execute function public.set_updated_at();
create trigger trg_rental_machines_updated before update on public.rental_machines for each row execute function public.set_updated_at();
create trigger trg_blog_posts_updated      before update on public.blog_posts      for each row execute function public.set_updated_at();
create trigger trg_projects_updated        before update on public.projects        for each row execute function public.set_updated_at();
create trigger trg_service_requests_updated before update on public.service_requests for each row execute function public.set_updated_at();
create trigger trg_rental_requests_updated  before update on public.rental_requests  for each row execute function public.set_updated_at();

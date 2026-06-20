-- PACA CONSTRUCT — Sistem de email
-- Migrare: enum-uri, tabele (template-uri, contacte, grupuri, segmente,
-- campanii, jurnal trimiteri, evenimente webhook), indexuri, triggere și RLS.
--
-- RLS: admin-only prin public.is_admin() pentru TOT, cu o singură excepție —
-- contacts permite INSERT public (auto-capture din formularele de pe site),
-- dar citirea/actualizarea/ștergerea rămân doar pentru admini.

-- ─── Enum-uri ────────────────────────────────────────────────────────────────
create type public.email_category  as enum ('tranzactional', 'marketing', 'sistem');
create type public.email_audience  as enum ('user', 'admin', 'broadcast');
create type public.contact_status  as enum ('active', 'unsubscribed', 'bounced', 'complained');
create type public.email_status    as enum ('queued', 'sent', 'delivered', 'bounced', 'complained', 'opened', 'failed');
create type public.campaign_status as enum ('draft', 'scheduled', 'sending', 'sent', 'failed');

-- ─── Template-uri (conținut editabil; structura rămâne în cod via registry) ──
create table public.email_templates (
  id         uuid primary key default gen_random_uuid(),
  key        text not null unique,           -- corespunde unei intrări din emails/registry.ts
  name       text not null,
  category   public.email_category not null,
  audience   public.email_audience not null,
  subject    text not null,
  preheader  text,
  blocks     jsonb not null default '{}',    -- { title, intro, cta_label, cta_url, note, ... }
  is_active  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── Contacte (sursa de adevăr, globale pe adresă) ──────────────────────────
create table public.contacts (
  id                uuid primary key default gen_random_uuid(),
  email             text not null unique,
  name              text,
  phone             text,
  locale            text not null default 'ro',
  source            text not null default 'manual',  -- manual|import|service_request|rental_request
  marketing_consent boolean not null default false,
  consent_at        timestamptz,
  unsubscribed_at   timestamptz,
  status            public.contact_status not null default 'active',
  tags              text[] not null default '{}',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- ─── Grupuri statice + apartenențe ──────────────────────────────────────────
create table public.contact_groups (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  created_at  timestamptz not null default now()
);
create table public.contact_group_members (
  group_id   uuid not null references public.contact_groups(id) on delete cascade,
  contact_id uuid not null references public.contacts(id) on delete cascade,
  primary key (group_id, contact_id)
);

-- ─── Segmente dinamice (filtru evaluat la trimitere) ────────────────────────
create table public.contact_segments (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  definition jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- ─── Campanii broadcast ─────────────────────────────────────────────────────
create table public.email_campaigns (
  id               uuid primary key default gen_random_uuid(),
  template_key     text not null,
  audience_kind    text not null,             -- 'group' | 'segment'
  audience_id      uuid,
  subject_override text,
  status           public.campaign_status not null default 'draft',
  scheduled_at     timestamptz,
  sent_count       integer not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ─── Jurnal trimiteri (audit + status) ──────────────────────────────────────
create table public.email_messages (
  id              uuid primary key default gen_random_uuid(),
  provider_id     text,                       -- id Resend
  template_key    text not null,
  to_email        text not null,
  to_contact_id   uuid references public.contacts(id) on delete set null,
  campaign_id     uuid references public.email_campaigns(id) on delete set null,
  subject         text not null,
  category        public.email_category not null,
  status          public.email_status not null default 'queued',
  idempotency_key text unique,
  error           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ─── Evenimente webhook ─────────────────────────────────────────────────────
create table public.email_events (
  id          uuid primary key default gen_random_uuid(),
  message_id  uuid references public.email_messages(id) on delete cascade,
  provider_id text,
  event_type  text not null,
  payload     jsonb,
  occurred_at timestamptz not null default now()
);

-- ─── Indexuri ───────────────────────────────────────────────────────────────
create index contacts_status_idx        on public.contacts (status);
create index contacts_tags_idx          on public.contacts using gin (tags);
create index email_messages_status_idx  on public.email_messages (status);
create index email_messages_campaign_idx on public.email_messages (campaign_id);
create index email_messages_contact_idx on public.email_messages (to_contact_id);
create index email_messages_created_idx on public.email_messages (created_at desc);
create index email_events_message_idx   on public.email_events (message_id);
create index contact_group_members_contact_idx on public.contact_group_members (contact_id);

-- ─── Triggere updated_at (tiparul existent set_updated_at) ───────────────────
create trigger trg_email_templates_updated before update on public.email_templates for each row execute function public.set_updated_at();
create trigger trg_contacts_updated        before update on public.contacts        for each row execute function public.set_updated_at();
create trigger trg_email_campaigns_updated before update on public.email_campaigns for each row execute function public.set_updated_at();
create trigger trg_email_messages_updated  before update on public.email_messages  for each row execute function public.set_updated_at();

-- ─── RLS ────────────────────────────────────────────────────────────────────
alter table public.email_templates       enable row level security;
alter table public.contacts              enable row level security;
alter table public.contact_groups        enable row level security;
alter table public.contact_group_members enable row level security;
alter table public.contact_segments      enable row level security;
alter table public.email_campaigns       enable row level security;
alter table public.email_messages        enable row level security;
alter table public.email_events          enable row level security;

-- contacts: INSERT public (auto-capture), restul doar admin
create policy "contacts public insert" on public.contacts for insert with check (true);
create policy "contacts admin read"    on public.contacts for select using (public.is_admin());
create policy "contacts admin update"  on public.contacts for update using (public.is_admin()) with check (public.is_admin());
create policy "contacts admin delete"  on public.contacts for delete using (public.is_admin());

-- email_templates: doar admin
create policy "email_templates admin read"   on public.email_templates for select using (public.is_admin());
create policy "email_templates admin insert" on public.email_templates for insert with check (public.is_admin());
create policy "email_templates admin update" on public.email_templates for update using (public.is_admin()) with check (public.is_admin());
create policy "email_templates admin delete" on public.email_templates for delete using (public.is_admin());

-- contact_groups: doar admin
create policy "contact_groups admin read"   on public.contact_groups for select using (public.is_admin());
create policy "contact_groups admin insert" on public.contact_groups for insert with check (public.is_admin());
create policy "contact_groups admin update" on public.contact_groups for update using (public.is_admin()) with check (public.is_admin());
create policy "contact_groups admin delete" on public.contact_groups for delete using (public.is_admin());

-- contact_group_members: doar admin
create policy "contact_group_members admin read"   on public.contact_group_members for select using (public.is_admin());
create policy "contact_group_members admin insert" on public.contact_group_members for insert with check (public.is_admin());
create policy "contact_group_members admin update" on public.contact_group_members for update using (public.is_admin()) with check (public.is_admin());
create policy "contact_group_members admin delete" on public.contact_group_members for delete using (public.is_admin());

-- contact_segments: doar admin
create policy "contact_segments admin read"   on public.contact_segments for select using (public.is_admin());
create policy "contact_segments admin insert" on public.contact_segments for insert with check (public.is_admin());
create policy "contact_segments admin update" on public.contact_segments for update using (public.is_admin()) with check (public.is_admin());
create policy "contact_segments admin delete" on public.contact_segments for delete using (public.is_admin());

-- email_campaigns: doar admin
create policy "email_campaigns admin read"   on public.email_campaigns for select using (public.is_admin());
create policy "email_campaigns admin insert" on public.email_campaigns for insert with check (public.is_admin());
create policy "email_campaigns admin update" on public.email_campaigns for update using (public.is_admin()) with check (public.is_admin());
create policy "email_campaigns admin delete" on public.email_campaigns for delete using (public.is_admin());

-- email_messages: doar admin (scrierile reale vin prin service_role, care ocolește RLS)
create policy "email_messages admin read"   on public.email_messages for select using (public.is_admin());
create policy "email_messages admin insert" on public.email_messages for insert with check (public.is_admin());
create policy "email_messages admin update" on public.email_messages for update using (public.is_admin()) with check (public.is_admin());
create policy "email_messages admin delete" on public.email_messages for delete using (public.is_admin());

-- email_events: doar admin
create policy "email_events admin read"   on public.email_events for select using (public.is_admin());
create policy "email_events admin insert" on public.email_events for insert with check (public.is_admin());
create policy "email_events admin update" on public.email_events for update using (public.is_admin()) with check (public.is_admin());
create policy "email_events admin delete" on public.email_events for delete using (public.is_admin());

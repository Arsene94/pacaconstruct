-- PACA CONSTRUCT — Setări de site editabile din admin
-- Migrare 12: tabel singleton `site_settings` cu secțiuni jsonb, RLS și seed.
--
-- Modelul: un singur rând (id = 1) cu câte o coloană jsonb pe secțiune, ca
-- fiecare secțiune să fie salvată și validată independent (zod în Server Actions).
-- Tabelul e citit PUBLIC (alimentează chrome-ul public: navbar, footer, butoane
-- flotante, JSON-LD), deci NU conține secrete — cheile/notificările rămân în env.
--
-- Forma valorilor (validată în app, documentată în app/lib/settings-shared.ts):
--   phones       PhoneNumber[]  { id, label, e164, display, whatsapp,
--                                 whatsappMessage?, isPrimary, showInFloating, order }
--   contact      { emailPrimary, emailOffice, address{...}, geo{...}, mapUrl }
--   hours        OpeningHours[] { days[], opens, closes, label, closed }
--   social       { googleBusiness, facebook, instagram, linkedin, tiktok, youtube }
--   floating     FloatingConfig { enabled, position, channels{...}, showOnMobile,
--                                 showOnDesktop, expandLabels, whatsappPhoneId?, callPhoneId? }
--   announcement { enabled, text, href }

create table public.site_settings (
  id           smallint primary key default 1,
  phones       jsonb not null default '[]'::jsonb,   -- PhoneNumber[]
  contact      jsonb not null default '{}'::jsonb,   -- ContactInfo
  hours        jsonb not null default '[]'::jsonb,   -- OpeningHours[]
  social       jsonb not null default '{}'::jsonb,   -- SocialLinks
  floating     jsonb not null default '{}'::jsonb,   -- FloatingConfig
  announcement jsonb not null default '{}'::jsonb,   -- Announcement
  updated_at   timestamptz not null default now(),
  constraint site_settings_singleton check (id = 1)
);

alter table public.site_settings enable row level security;

-- Citire publică totală (alimentează chrome-ul public + JSON-LD), scriere doar admin.
create policy "site_settings public read"   on public.site_settings for select using (true);
create policy "site_settings admin insert"  on public.site_settings for insert with check (public.is_admin());
create policy "site_settings admin update"  on public.site_settings for update using (public.is_admin()) with check (public.is_admin());

create trigger trg_site_settings_updated
  before update on public.site_settings
  for each row execute function public.set_updated_at();

-- Seed: rândul singleton, gol. Appul cade pe siteConfig pentru secțiunile goale,
-- deci site-ul funcționează identic înainte de prima salvare din admin.
insert into public.site_settings (id) values (1) on conflict (id) do nothing;

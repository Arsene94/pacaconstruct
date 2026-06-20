-- PACA CONSTRUCT — Row Level Security
-- Migrare 2/3: activează RLS și definește politicile.
--
-- Reguli:
--  • Conținut public (faq, servicii, utilaje, blog): citire publică DOAR pentru
--    rândurile publicate; adminii citesc tot și au CRUD complet.
--  • service_groups: citire publică (navigație), CRUD doar admin.
--  • projects: intern — vizibile și editabile DOAR de admin.
--  • cereri (service_requests / rental_requests): oricine poate INSERA (formular
--    public), dar doar adminii pot citi / actualiza / șterge.

-- ─── Activează RLS ───────────────────────────────────────────────────────────
alter table public.faq_sections     enable row level security;
alter table public.faq_items         enable row level security;
alter table public.service_groups    enable row level security;
alter table public.services          enable row level security;
alter table public.rental_machines   enable row level security;
alter table public.blog_posts        enable row level security;
alter table public.projects          enable row level security;
alter table public.service_requests  enable row level security;
alter table public.rental_requests   enable row level security;

-- ─── Conținut publicat: citire publică „published", CRUD admin ───────────────
-- Macro repetat manual pentru fiecare tabel (PL/pgSQL n-ar aduce claritate aici).

-- faq_sections
create policy "faq_sections public read"   on public.faq_sections for select using (is_published or public.is_admin());
create policy "faq_sections admin insert"   on public.faq_sections for insert with check (public.is_admin());
create policy "faq_sections admin update"   on public.faq_sections for update using (public.is_admin()) with check (public.is_admin());
create policy "faq_sections admin delete"   on public.faq_sections for delete using (public.is_admin());

-- faq_items
create policy "faq_items public read"   on public.faq_items for select using (is_published or public.is_admin());
create policy "faq_items admin insert"   on public.faq_items for insert with check (public.is_admin());
create policy "faq_items admin update"   on public.faq_items for update using (public.is_admin()) with check (public.is_admin());
create policy "faq_items admin delete"   on public.faq_items for delete using (public.is_admin());

-- service_groups (citire publică totală — e navigație)
create policy "service_groups public read" on public.service_groups for select using (true);
create policy "service_groups admin insert" on public.service_groups for insert with check (public.is_admin());
create policy "service_groups admin update" on public.service_groups for update using (public.is_admin()) with check (public.is_admin());
create policy "service_groups admin delete" on public.service_groups for delete using (public.is_admin());

-- services
create policy "services public read"   on public.services for select using (is_published or public.is_admin());
create policy "services admin insert"   on public.services for insert with check (public.is_admin());
create policy "services admin update"   on public.services for update using (public.is_admin()) with check (public.is_admin());
create policy "services admin delete"   on public.services for delete using (public.is_admin());

-- rental_machines
create policy "rental_machines public read"   on public.rental_machines for select using (is_published or public.is_admin());
create policy "rental_machines admin insert"   on public.rental_machines for insert with check (public.is_admin());
create policy "rental_machines admin update"   on public.rental_machines for update using (public.is_admin()) with check (public.is_admin());
create policy "rental_machines admin delete"   on public.rental_machines for delete using (public.is_admin());

-- blog_posts
create policy "blog_posts public read"   on public.blog_posts for select using (is_published or public.is_admin());
create policy "blog_posts admin insert"   on public.blog_posts for insert with check (public.is_admin());
create policy "blog_posts admin update"   on public.blog_posts for update using (public.is_admin()) with check (public.is_admin());
create policy "blog_posts admin delete"   on public.blog_posts for delete using (public.is_admin());

-- ─── Proiecte: doar admin (inclusiv citire) ──────────────────────────────────
create policy "projects admin read"   on public.projects for select using (public.is_admin());
create policy "projects admin insert" on public.projects for insert with check (public.is_admin());
create policy "projects admin update" on public.projects for update using (public.is_admin()) with check (public.is_admin());
create policy "projects admin delete" on public.projects for delete using (public.is_admin());

-- ─── Cereri: INSERT public, restul doar admin ────────────────────────────────
-- service_requests
create policy "service_requests public insert" on public.service_requests for insert with check (true);
create policy "service_requests admin read"    on public.service_requests for select using (public.is_admin());
create policy "service_requests admin update"  on public.service_requests for update using (public.is_admin()) with check (public.is_admin());
create policy "service_requests admin delete"  on public.service_requests for delete using (public.is_admin());

-- rental_requests
create policy "rental_requests public insert" on public.rental_requests for insert with check (true);
create policy "rental_requests admin read"    on public.rental_requests for select using (public.is_admin());
create policy "rental_requests admin update"  on public.rental_requests for update using (public.is_admin()) with check (public.is_admin());
create policy "rental_requests admin delete"  on public.rental_requests for delete using (public.is_admin());

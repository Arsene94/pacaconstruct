-- PACA CONSTRUCT — conținut compus al campaniei
-- `payload` păstrează variabilele editate în admin (titlu, blocuri, CTA, URL),
-- ca workflow-ul de broadcast să randeze template-ul per destinatar.

alter table public.email_campaigns
  add column if not exists payload jsonb not null default '{}';

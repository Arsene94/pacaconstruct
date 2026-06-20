-- Indexuri de performanță pentru citirile publice și dispecerul de topice.
--
-- Coloanele `slug` au deja index unic implicit (not null unique). `published_at`,
-- `group_slug`, `blog_schedules(is_active,next_run_at)`, `blog_topics(status)` și
-- `blog_topics(score)` au deja indexuri (vezi migrările 0001/0005). Aici adăugăm
-- doar ce lipsește: indexuri parțiale pe rândurile publicate (citirile publice
-- filtrează implicit prin RLS `is_published`) ordonate după `sort_order`, plus un
-- index compus pentru coada de topice (status + score).

-- Listele publice de servicii: doar publicate, ordonate după sort_order.
create index if not exists services_published_sort_idx
  on public.services (sort_order)
  where is_published;

-- Lista publică de blog: doar publicate, ordonate după sort_order + dată.
create index if not exists blog_posts_published_sort_idx
  on public.blog_posts (sort_order, published_at desc)
  where is_published;

-- Lista publică de utilaje: doar publicate, ordonate după sort_order.
create index if not exists rental_machines_published_sort_idx
  on public.rental_machines (sort_order)
  where is_published;

-- Dispecerul AI alege următorul topic după status apoi scor: index compus.
create index if not exists blog_topics_status_score_idx
  on public.blog_topics (status, score desc);

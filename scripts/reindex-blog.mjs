// Backfill al indexului Upstash Search cu toate articolele publicate.
//
// Rulare (Node 20+):
//   node --env-file=.env.local scripts/reindex-blog.mjs
//
// Citește din Postgres (service_role) și face upsert în indexul „blog".
import { createClient } from "@supabase/supabase-js";
import { Search } from "@upstash/search";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("Lipsesc NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}
if (
  !process.env.UPSTASH_SEARCH_REST_URL ||
  !process.env.UPSTASH_SEARCH_REST_TOKEN
) {
  console.error("Lipsesc UPSTASH_SEARCH_REST_URL / UPSTASH_SEARCH_REST_TOKEN.");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const index = Search.fromEnv().index("blog");

const { data, error } = await supabase
  .from("blog_posts")
  .select(
    "slug, title, excerpt, body, category, read_time, published_label, image_src, image_alt, tags",
  )
  .eq("is_published", true);

if (error) {
  console.error("Eroare la citirea articolelor:", error.message);
  process.exit(1);
}

const docs = (data ?? []).map((p) => ({
  id: p.slug,
  content: {
    title: p.title ?? "",
    excerpt: p.excerpt ?? "",
    body: p.body ?? "",
    category: p.category ?? "",
    tags: Array.isArray(p.tags) ? p.tags.join(", ") : "",
  },
  metadata: {
    slug: p.slug,
    category: p.category ?? "",
    publishedLabel: p.published_label ?? "",
    readTime: p.read_time ?? "",
    imageSrc: p.image_src ?? "",
    imageAlt: p.image_alt ?? "",
  },
}));

if (docs.length === 0) {
  console.log("Niciun articol publicat de indexat.");
  process.exit(0);
}

// Upsert în loturi de 50 ca să nu trimitem payload-uri prea mari.
const BATCH = 50;
for (let i = 0; i < docs.length; i += BATCH) {
  await index.upsert(docs.slice(i, i + BATCH));
  console.log(`Indexate ${Math.min(i + BATCH, docs.length)}/${docs.length}...`);
}

console.log(`Gata. ${docs.length} articole indexate în „blog".`);

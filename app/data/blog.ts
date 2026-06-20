import { unstable_cache } from "next/cache";
import { createClient } from "@/app/lib/supabase/server";
import { createPublicClient } from "@/app/lib/supabase/public";
import { searchBlogPosts as searchIndex } from "@/app/lib/upstash/search";

/** Profil de cache pentru articolele publice (Upstash via handler Next). */
const BLOG_CACHE = { tags: ["blog"], revalidate: 600 };

export type BlogSource = { title: string; url: string };

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  body?: string;
  category: string;
  readTime: string;
  /** Eticheta lizibilă pentru afișare (ex. „12 iunie 2026"). */
  publishedAt: string;
  /** Data publicării în format ISO 8601 — pentru `<time dateTime>` și schema. */
  publishedAtISO: string;
  /** Data ultimei modificări în format ISO 8601 — pentru `dateModified`. */
  updatedAtISO: string;
  imageSrc: string;
  imageAlt: string;
  tags: string[];
  sources: BlogSource[];
};

type BlogRow = {
  slug: string;
  title: string;
  excerpt: string;
  body: string | null;
  category: string;
  read_time: string;
  published_at: string;
  published_label: string;
  updated_at: string;
  image_src: string | null;
  image_alt: string | null;
  tags: string[] | null;
  sources: unknown;
};

const BLOG_COLUMNS =
  "slug, title, excerpt, body, category, read_time, published_at, published_label, updated_at, image_src, image_alt, tags, sources, sort_order";

/** Normalizează coloana jsonb `sources` în [{title, url}] valide. */
function parseSources(value: unknown): BlogSource[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((s) => {
      const obj = s as { title?: unknown; url?: unknown };
      const url = typeof obj?.url === "string" ? obj.url : "";
      const title = typeof obj?.title === "string" && obj.title ? obj.title : url;
      return { title, url };
    })
    .filter((s) => s.url);
}

function mapPost(row: BlogRow): BlogPost {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    body: row.body ?? undefined,
    category: row.category,
    readTime: row.read_time,
    publishedAt: row.published_label,
    publishedAtISO: row.published_at,
    updatedAtISO: row.updated_at,
    imageSrc: row.image_src ?? "",
    imageAlt: row.image_alt ?? "",
    tags: row.tags ?? [],
    sources: parseSources(row.sources),
  };
}

/** Toate articolele de blog, în ordinea de afișare. */
export const getBlogPosts = unstable_cache(
  async (): Promise<BlogPost[]> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select(BLOG_COLUMNS)
      .order("sort_order")
      .returns<BlogRow[]>();

    if (error) {
      throw new Error(`Nu am putut încărca articolele: ${error.message}`);
    }
    return (data ?? []).map(mapPost);
  },
  ["blog-posts"],
  BLOG_CACHE,
);

/**
 * Caută articole. Folosește Upstash Search dacă e configurat (full-text +
 * semantic); altfel cade pe o filtrare simplă în memorie din Postgres, ca să
 * funcționeze și fără Upstash în dev.
 */
export async function searchBlogPosts(query: string): Promise<BlogPost[]> {
  const q = query.trim();
  if (!q) return [];

  const hits = await searchIndex(q, 24);
  if (hits) {
    return hits.map((h) => ({
      slug: h.slug,
      title: h.title,
      excerpt: h.excerpt,
      category: h.category,
      readTime: h.readTime,
      publishedAt: h.publishedLabel,
      // Indexul de search nu stochează datele ISO; lista de rezultate nu le
      // folosește (schema BlogPosting e generată doar pe pagina articolului).
      publishedAtISO: "",
      updatedAtISO: "",
      imageSrc: h.imageSrc || "",
      imageAlt: h.imageAlt || h.title,
      tags: [],
      sources: [],
    }));
  }

  // Fallback: Search neconfigurat → filtrare în memorie.
  const all = await getBlogPosts();
  const needle = q.toLowerCase();
  return all.filter((p) =>
    [p.title, p.excerpt, p.category, p.tags.join(" ")]
      .join(" ")
      .toLowerCase()
      .includes(needle),
  );
}

/** Articolul evidențiat (featured), sau primul disponibil ca rezervă. */
export const getFeaturedBlogPost = unstable_cache(
  async (): Promise<BlogPost | null> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select(BLOG_COLUMNS)
      .eq("is_featured", true)
      .order("sort_order")
      .limit(1)
      .maybeSingle<BlogRow>();

    if (error) {
      throw new Error(`Nu am putut încărca articolul featured: ${error.message}`);
    }
    return data ? mapPost(data) : null;
  },
  ["blog-featured"],
  BLOG_CACHE,
);

/** Un articol după slug, sau `null` dacă nu există / nu e publicat. */
export const getBlogPost = unstable_cache(
  async (slug: string): Promise<BlogPost | null> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select(BLOG_COLUMNS)
      .eq("slug", slug)
      .maybeSingle<BlogRow>();

    if (error) {
      throw new Error(`Nu am putut încărca articolul „${slug}": ${error.message}`);
    }
    return data ? mapPost(data) : null;
  },
  ["blog-post"],
  BLOG_CACHE,
);

// ─── Admin (rânduri complete, cu id) ─────────────────────────────────────────

export type AdminPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string | null;
  category: string;
  read_time: string;
  published_at: string;
  published_label: string;
  image_src: string | null;
  image_alt: string | null;
  tags: string[] | null;
  sources: BlogSource[] | null;
  is_featured: boolean;
  is_ai_generated: boolean;
  sort_order: number;
  is_published: boolean;
};

const ADMIN_BLOG_COLUMNS =
  "id, slug, title, excerpt, body, category, read_time, published_at, published_label, image_src, image_alt, tags, sources, is_featured, is_ai_generated, sort_order, is_published";

/** Toate articolele pentru panou (include draft + id). */
export async function getPostsAdmin(): Promise<AdminPost[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select(ADMIN_BLOG_COLUMNS)
    .order("sort_order")
    .returns<AdminPost[]>();
  if (error) throw new Error(`Nu am putut încărca articolele: ${error.message}`);
  return data ?? [];
}

/** Un articol după id (pentru editare). */
export async function getPostById(id: string): Promise<AdminPost | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select(ADMIN_BLOG_COLUMNS)
    .eq("id", id)
    .maybeSingle<AdminPost>();
  if (error) throw new Error(`Nu am putut încărca articolul: ${error.message}`);
  return data;
}

import "server-only";

import { Search } from "@upstash/search";

/**
 * Upstash Search — index full-text + semantic pentru articolele de blog.
 *
 * Conținutul (`content`) e indexat și căutat; `metadata` se întoarce ca-atare
 * pentru randarea rezultatelor fără a mai lovi Postgres.
 */

export type BlogSearchContent = {
  title: string;
  excerpt: string;
  body: string;
  category: string;
  tags: string;
};

export type BlogSearchMetadata = {
  slug: string;
  category: string;
  publishedLabel: string;
  readTime: string;
  imageSrc: string;
  imageAlt: string;
};

const INDEX_NAME = "blog";

export function isSearchConfigured(): boolean {
  return Boolean(
    process.env.UPSTASH_SEARCH_REST_URL && process.env.UPSTASH_SEARCH_REST_TOKEN,
  );
}

let client: Search | null = null;

function getSearch(): Search {
  if (!isSearchConfigured()) {
    throw new Error(
      "Lipsesc UPSTASH_SEARCH_REST_URL / UPSTASH_SEARCH_REST_TOKEN pentru Upstash Search.",
    );
  }
  client ??= Search.fromEnv();
  return client;
}

/** Indexul tipizat de blog, sau `null` dacă Search nu e configurat. */
export function blogIndexOrNull() {
  if (!isSearchConfigured()) return null;
  return getSearch().index<BlogSearchContent, BlogSearchMetadata>(INDEX_NAME);
}

/** Upsert (idempotent) al unui articol în index. No-op dacă Search lipsește. */
export async function indexBlogPost(doc: {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  tags: string[];
  publishedLabel: string;
  readTime: string;
  imageSrc: string;
  imageAlt: string;
}): Promise<void> {
  const index = blogIndexOrNull();
  if (!index) return;
  await index.upsert({
    id: doc.slug,
    content: {
      title: doc.title,
      excerpt: doc.excerpt,
      body: doc.body,
      category: doc.category,
      tags: doc.tags.join(", "),
    },
    metadata: {
      slug: doc.slug,
      category: doc.category,
      publishedLabel: doc.publishedLabel,
      readTime: doc.readTime,
      imageSrc: doc.imageSrc,
      imageAlt: doc.imageAlt,
    },
  });
}

/** Scoate un articol din index. No-op dacă Search lipsește. */
export async function removeBlogPost(slug: string): Promise<void> {
  const index = blogIndexOrNull();
  if (!index) return;
  await index.delete([slug]);
}

export type BlogSearchHit = {
  score: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedLabel: string;
  readTime: string;
  imageSrc: string;
  imageAlt: string;
};

/** Caută articole. Întoarce `null` dacă Search nu e configurat (fallback la DB). */
export async function searchBlogPosts(
  query: string,
  limit = 12,
): Promise<BlogSearchHit[] | null> {
  const index = blogIndexOrNull();
  if (!index) return null;
  const results = await index.search({ query, limit, reranking: true });
  return results.map((r) => ({
    score: r.score,
    slug: r.metadata?.slug ?? r.id,
    title: r.content?.title ?? "",
    excerpt: r.content?.excerpt ?? "",
    category: r.metadata?.category ?? r.content?.category ?? "",
    publishedLabel: r.metadata?.publishedLabel ?? "",
    readTime: r.metadata?.readTime ?? "",
    imageSrc: r.metadata?.imageSrc ?? "",
    imageAlt: r.metadata?.imageAlt ?? "",
  }));
}

import "server-only";

import {
  experimental_generateImage as generateImage,
  gateway,
  generateObject,
  generateText,
  stepCountIs,
} from "ai";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { createAdminClient } from "@/app/lib/supabase/admin";
import { indexBlogPost } from "@/app/lib/upstash/search";
import {
  ARTICLE_MODEL,
  IMAGE_MODEL,
  RESEARCH_MODEL,
  assertGatewayConfigured,
} from "./gateway";
import { HUMANIZER_RULES, stripDashes } from "./humanizer";

const IMAGE_BUCKET = "blog-images";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function roDateLabel(date: Date): string {
  return new Intl.DateTimeFormat("ro-RO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

/** Schema articolului produs de model (fără surse — acelea vin din web search). */
const ArticleSchema = z.object({
  title: z.string(),
  excerpt: z.string().describe("Rezumat de 1-2 propoziții pentru listă."),
  bodyMarkdown: z
    .string()
    .describe("Articol complet în Markdown, cu titluri (##) și paragrafe."),
  category: z.string(),
  tags: z.array(z.string()).min(2).max(6),
  readTime: z.string().describe("Timp estimat de citire, ex. 6 min."),
  imagePrompt: z
    .string()
    .describe(
      "Prompt în engleză pentru o fotografie tematică realistă (șantier/utilaje/teren), fără text în imagine.",
    ),
});

export type Source = { title: string; url: string };

export type TopicRow = {
  id: string;
  title: string;
  angle: string;
  category: string;
};

/** Rezultatul pasului de scriere — serializabil, ca să treacă între pașii workflow-ului. */
export type WrittenArticle = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  tags: string[];
  readTime: string;
  imagePrompt: string;
};

// ─── Pași reutilizabili (apelați atât sincron, cât și din workflow) ───────────

/** Încarcă topicul din DB sau aruncă dacă nu există. */
export async function loadTopic(topicId: string): Promise<TopicRow> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("blog_topics")
    .select("id, title, angle, category")
    .eq("id", topicId)
    .single<TopicRow>();
  if (error || !data) {
    throw new Error(`Topicul nu a fost găsit: ${error?.message ?? topicId}`);
  }
  return data;
}

/** Pasul de documentare: caută surse reale și produce un brief. */
export async function researchTopic(
  topic: TopicRow,
): Promise<{ brief: string; sources: Source[] }> {
  assertGatewayConfigured();
  const { text, sources } = await generateText({
    model: RESEARCH_MODEL,
    stopWhen: stepCountIs(6),
    tools: {
      web_search: gateway.tools.perplexitySearch({
        maxResults: 6,
        country: "RO",
        searchLanguageFilter: ["ro", "en"],
      }),
    },
    system:
      "Documentarist pentru articole de construcții și terasamente din România. Cauți pe web surse reale, actuale, de încredere și extragi faptele utile. Citezi doar pagini accesate efectiv.",
    prompt: `Documentează articolul „${topic.title}" (unghi: ${topic.angle}). Adună date concrete: norme, etape tehnice, costuri orientative, bune practici. Rezumat scurt, în puncte.`,
  });

  const seen = new Set<string>();
  const collected: Source[] = [];
  for (const s of sources ?? []) {
    const url = (s as { url?: string }).url;
    if (!url || seen.has(url)) continue;
    seen.add(url);
    collected.push({ url, title: (s as { title?: string }).title || url });
    if (collected.length >= 3) break;
  }

  return { brief: text, sources: collected };
}

/** Pasul de scriere: generează articolul umanizat și calculează slug-ul stabil. */
export async function writeArticle(
  topic: TopicRow,
  brief: string,
): Promise<WrittenArticle> {
  assertGatewayConfigured();
  const { object: article } = await generateObject({
    model: ARTICLE_MODEL,
    schema: ArticleSchema,
    system: `Redactor de blog pentru o firmă românească de construcții, terasamente, excavări și închiriere de utilaje. Scrii în română, tehnic corect și util pentru clienți. Folosești strict datele din documentare; nu inventezi cifre, norme sau surse.

${HUMANIZER_RULES}`,
    prompt: `Scrie articolul pe baza datelor de mai jos.
TITLU: ${topic.title}
UNGHI: ${topic.angle}
CATEGORIE sugerată: ${topic.category}

DOCUMENTARE:
${brief}

Cerințe: 600-1000 de cuvinte; Markdown cu subtitluri "##"; rezumat (excerpt) de 1-2 propoziții; taguri relevante; timp de citire realist; prompt de imagine în engleză pentru o fotografie tematică realistă, fără text în imagine.`,
  });

  const slug =
    slugify(article.title) ||
    slugify(topic.title) ||
    `articol-${topic.id.slice(0, 8)}`;

  // Plasă de siguranță anti em-dash (textul vine deja umanizat).
  return {
    slug,
    title: article.title,
    excerpt: stripDashes(article.excerpt),
    body: stripDashes(article.bodyMarkdown),
    category: article.category || topic.category,
    tags: article.tags,
    readTime: article.readTime,
    imagePrompt: article.imagePrompt,
  };
}

/** Generează imaginea tematică și o încarcă în storage; întoarce URL public sau null. */
export async function generateAndUploadImage(
  prompt: string,
  slug: string,
): Promise<string | null> {
  try {
    const { image } = await generateImage({
      model: IMAGE_MODEL,
      prompt,
      aspectRatio: "16:9",
    });

    const supabase = createAdminClient();
    const path = `${slug}-${Date.now()}.png`;
    const { error } = await supabase.storage
      .from(IMAGE_BUCKET)
      .upload(path, Buffer.from(image.uint8Array), {
        contentType: image.mediaType ?? "image/png",
        upsert: true,
      });
    if (error) {
      console.error("Upload imagine blog eșuat:", error.message);
      return null;
    }
    const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path);
    return data.publicUrl;
  } catch (err) {
    console.error("Generare imagine blog eșuată:", err);
    return null;
  }
}

/** Invalidează cache-ul de blog (path + tag-uri) după publicare. */
function invalidateBlog(slug: string): void {
  revalidatePath("/blog", "layout");
  revalidateTag("blog", "max");
  revalidateTag(`blog:${slug}`, "max");
}

/**
 * Pasul de publicare: inserează articolul, marchează topicul ca generat, scrie
 * runul, indexează în Upstash Search și invalidează cache-ul. Idempotent pe
 * slug (upsert), ca un retry de workflow să nu creeze duplicate.
 */
export async function publishArticle(input: {
  topic: TopicRow;
  article: WrittenArticle;
  imageSrc: string | null;
  sources: Source[];
  scheduleId?: string;
}): Promise<{ postId: string; slug: string }> {
  const { topic, article, imageSrc, sources, scheduleId } = input;
  const supabase = createAdminClient();
  const today = new Date();
  const publishedLabel = roDateLabel(today);

  const { data: inserted, error: insertErr } = await supabase
    .from("blog_posts")
    .upsert(
      {
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        body: article.body,
        category: article.category,
        read_time: article.readTime,
        published_at: today.toISOString().slice(0, 10),
        published_label: publishedLabel,
        image_src: imageSrc,
        image_alt: article.title,
        image_prompt: article.imagePrompt,
        tags: article.tags,
        sources,
        is_published: true,
        is_ai_generated: true,
        topic_id: topic.id,
      },
      { onConflict: "slug" },
    )
    .select("id")
    .single<{ id: string }>();
  if (insertErr || !inserted) {
    throw new Error(`Salvarea articolului a eșuat: ${insertErr?.message}`);
  }

  await supabase
    .from("blog_topics")
    .update({
      status: "generat",
      generated_post_id: inserted.id,
      last_error: null,
    })
    .eq("id", topic.id);

  await supabase.from("blog_generation_runs").insert({
    topic_id: topic.id,
    schedule_id: scheduleId ?? null,
    post_id: inserted.id,
    status: "ok",
    model: ARTICLE_MODEL,
    image_model: imageSrc ? IMAGE_MODEL : "",
  });

  // Indexare pentru căutare (no-op dacă Search nu e configurat).
  await indexBlogPost({
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    body: article.body,
    category: article.category,
    tags: article.tags,
    publishedLabel,
    readTime: article.readTime,
    imageSrc: imageSrc ?? "",
    imageAlt: article.title,
  });

  invalidateBlog(article.slug);

  return { postId: inserted.id, slug: article.slug };
}

/** Marchează topicul ca eșuat și scrie un run de eroare. */
export async function markTopicFailed(
  topicId: string,
  message: string,
  scheduleId?: string,
): Promise<void> {
  const supabase = createAdminClient();
  await supabase
    .from("blog_topics")
    .update({ status: "esuat", last_error: message })
    .eq("id", topicId);
  await supabase.from("blog_generation_runs").insert({
    topic_id: topicId,
    schedule_id: scheduleId ?? null,
    status: "eroare",
    model: ARTICLE_MODEL,
    image_model: "",
    error: message,
  });
}

/**
 * Orchestrator sincron: rulează toți pașii într-o singură execuție. Folosit ca
 * fallback când QStash/Workflow nu e configurat (dev/local). În producție,
 * calea implicită e workflow-ul durabil din `app/api/workflow/generate-article`.
 */
export async function generateArticleForTopic(
  topicId: string,
  opts: { scheduleId?: string } = {},
): Promise<{ postId: string; slug: string }> {
  const topic = await loadTopic(topicId);
  try {
    const { brief, sources } = await researchTopic(topic);
    const article = await writeArticle(topic, brief);
    const imageSrc = await generateAndUploadImage(article.imagePrompt, article.slug);
    return await publishArticle({
      topic,
      article,
      imageSrc,
      sources,
      scheduleId: opts.scheduleId,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await markTopicFailed(topicId, message, opts.scheduleId);
    throw err;
  }
}

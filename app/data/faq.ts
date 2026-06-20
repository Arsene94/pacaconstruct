import { unstable_cache } from "next/cache";
import { createClient } from "@/app/lib/supabase/server";
import { createPublicClient } from "@/app/lib/supabase/public";

/** Profil de cache pentru FAQ-ul public (Upstash via handler Next). */
const FAQ_CACHE = { tags: ["faq"], revalidate: 3600 };

export type FaqItem = {
  question: string;
  answer: string;
  highlights: string[];
};

export type FaqSection = {
  id: string;
  index: string;
  title: string;
  description: string;
  items: FaqItem[];
};

type FaqItemRow = {
  question: string;
  answer: string;
  highlights: string[] | null;
  sort_order: number;
};

type FaqSectionRow = {
  slug: string;
  index_label: string;
  title: string;
  description: string;
  sort_order: number;
  faq_items: FaqItemRow[] | null;
};

/**
 * Întoarce secțiunile de FAQ cu întrebările lor. Vizibilitatea (publicat/draft)
 * este aplicată de politicile RLS din Supabase în funcție de sesiune.
 */
export const getFaqSections = unstable_cache(
  async (): Promise<FaqSection[]> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("faq_sections")
      .select(
        "slug, index_label, title, description, sort_order, faq_items(question, answer, highlights, sort_order)",
      )
      .order("sort_order")
      .returns<FaqSectionRow[]>();

    if (error) {
      throw new Error(`Nu am putut încărca secțiunile de FAQ: ${error.message}`);
    }

    return (data ?? []).map((section) => ({
      id: section.slug,
      index: section.index_label,
      title: section.title,
      description: section.description,
      items: (section.faq_items ?? [])
        .slice()
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((item) => ({
          question: item.question,
          answer: item.answer,
          highlights: item.highlights ?? [],
        })),
    }));
  },
  ["faq-sections"],
  FAQ_CACHE,
);

// ─── Admin ───────────────────────────────────────────────────────────────────

export type AdminFaqItem = {
  id: string;
  section_id: string;
  section_title: string;
  question: string;
  answer: string;
  highlights: string[];
  sort_order: number;
  is_published: boolean;
};

/** Toate întrebările (cu categoria părinte) pentru panou. */
export async function getFaqItemsAdmin(): Promise<AdminFaqItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("faq_sections")
    .select(
      "id, title, sort_order, faq_items(id, section_id, question, answer, highlights, sort_order, is_published)",
    )
    .order("sort_order")
    .returns<
      {
        id: string;
        title: string;
        sort_order: number;
        faq_items:
          | {
              id: string;
              section_id: string;
              question: string;
              answer: string;
              highlights: string[] | null;
              sort_order: number;
              is_published: boolean;
            }[]
          | null;
      }[]
    >();
  if (error) throw new Error(`Nu am putut încărca întrebările: ${error.message}`);

  return (data ?? []).flatMap((section) =>
    (section.faq_items ?? [])
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((item) => ({
        id: item.id,
        section_id: item.section_id,
        section_title: section.title,
        question: item.question,
        answer: item.answer,
        highlights: item.highlights ?? [],
        sort_order: item.sort_order,
        is_published: item.is_published,
      })),
  );
}

/** O întrebare după id (pentru editare). */
export async function getFaqItemById(id: string): Promise<AdminFaqItem | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("faq_items")
    .select(
      "id, section_id, question, answer, highlights, sort_order, is_published, faq_sections(title)",
    )
    .eq("id", id)
    .maybeSingle<{
      id: string;
      section_id: string;
      question: string;
      answer: string;
      highlights: string[] | null;
      sort_order: number;
      is_published: boolean;
      faq_sections: { title: string } | null;
    }>();
  if (error) throw new Error(`Nu am putut încărca întrebarea: ${error.message}`);
  if (!data) return null;
  return {
    id: data.id,
    section_id: data.section_id,
    section_title: data.faq_sections?.title ?? "",
    question: data.question,
    answer: data.answer,
    highlights: data.highlights ?? [],
    sort_order: data.sort_order,
    is_published: data.is_published,
  };
}

/** Opțiuni pentru selectul de categorie (id + titlu). */
export async function getFaqSectionOptions(): Promise<
  { value: string; label: string }[]
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("faq_sections")
    .select("id, title, sort_order")
    .order("sort_order")
    .returns<{ id: string; title: string }[]>();
  if (error) throw new Error(`Nu am putut încărca categoriile: ${error.message}`);
  return (data ?? []).map((s) => ({ value: s.id, label: s.title }));
}

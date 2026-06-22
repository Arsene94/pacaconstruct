import { unstable_cache } from "next/cache";
import { createClient } from "@/app/lib/supabase/server";
import { createPublicClient } from "@/app/lib/supabase/public";

/** Profil de cache pentru conținutul public (citit din Upstash via handler). */
const SERVICES_CACHE = { tags: ["services"], revalidate: 3600 };

export type ServicePage = {
  slug: string;
  title: string;
  shortTitle?: string;
  eyebrow: string;
  description: string;
  summaryTitle: string;
  summary: string;
  imageSrc?: string;
  imageAlt?: string;
  processes: {
    title: string;
    text: string;
  }[];
  specs: {
    label: string;
    value: string;
    impact: string;
  }[];
  /** Întrebări frecvente specifice serviciului (editabile din admin). */
  faqs: {
    question: string;
    answer: string;
  }[];
};

export type ServiceGroup = {
  title: string;
  href: string;
  items: {
    title: string;
    href: string;
  }[];
};

export type FeaturedService = {
  id: string;
  icon: string;
  title: string;
  description: string;
  href: string;
  featured: boolean;
  wide: boolean;
};

type ServiceProcess = { title: string; text: string };
type ServiceSpec = { label: string; value: string; impact: string };
type ServiceFaq = { question: string; answer: string };

type ServiceRow = {
  slug: string;
  title: string;
  short_title: string | null;
  eyebrow: string;
  description: string;
  summary_title: string;
  summary: string;
  image_src: string | null;
  image_alt: string | null;
  processes: ServiceProcess[];
  specs: ServiceSpec[];
  faqs: ServiceFaq[] | null;
};

const SERVICE_COLUMNS =
  "slug, title, short_title, eyebrow, description, summary_title, summary, image_src, image_alt, processes, specs, faqs, sort_order";

/** Normalizează coloana jsonb `faqs` în [{question, answer}] valide. */
function parseFaqs(value: unknown): ServiceFaq[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((f) => {
      const obj = f as { question?: unknown; answer?: unknown };
      return {
        question: typeof obj?.question === "string" ? obj.question : "",
        answer: typeof obj?.answer === "string" ? obj.answer : "",
      };
    })
    .filter((f) => f.question && f.answer);
}

function mapService(row: ServiceRow): ServicePage {
  return {
    slug: row.slug,
    title: row.title,
    shortTitle: row.short_title ?? undefined,
    eyebrow: row.eyebrow,
    description: row.description,
    summaryTitle: row.summary_title,
    summary: row.summary,
    imageSrc: row.image_src ?? undefined,
    imageAlt: row.image_alt ?? undefined,
    processes: row.processes ?? [],
    specs: row.specs ?? [],
    faqs: parseFaqs(row.faqs),
  };
}

/** Toate paginile de servicii, în ordinea de afișare. */
export const getServicePages = unstable_cache(
  async (): Promise<ServicePage[]> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("services")
      .select(SERVICE_COLUMNS)
      .order("sort_order")
      .returns<ServiceRow[]>();

    if (error) {
      // Degradare grațioasă pentru prerender-ul ISR al listei de servicii.
      console.warn(`[services] getServicePages a eșuat, întorc gol: ${error.message}`);
      return [];
    }
    return (data ?? []).map(mapService);
  },
  ["service-pages"],
  SERVICES_CACHE,
);

/** O singură pagină de serviciu după slug, sau `null` dacă nu există / nu e publicată. */
export const getServicePage = unstable_cache(
  async (slug: string): Promise<ServicePage | null> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("services")
      .select(SERVICE_COLUMNS)
      .eq("slug", slug)
      .maybeSingle<ServiceRow>();

    if (error) {
      throw new Error(`Nu am putut încărca serviciul „${slug}": ${error.message}`);
    }
    return data ? mapService(data) : null;
  },
  ["service-page"],
  SERVICES_CACHE,
);

/** Grupurile din meniul de servicii, cu sub-itemele lor. */
export const getServiceGroups = unstable_cache(
  async (): Promise<ServiceGroup[]> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("service_groups")
      .select("title, href, slug, sort_order, services(title, slug, sort_order)")
      .order("sort_order")
      .returns<
        {
          title: string;
          href: string;
          slug: string;
          sort_order: number;
          services: { title: string; slug: string; sort_order: number }[] | null;
        }[]
      >();

    if (error) {
      // Degradare grațioasă: navbar-ul folosește acest getter pe FIECARE pagină
      // (inclusiv la prerender-ul ISR). O eroare de DB nu trebuie să strice
      // build-ul sau pagina; întoarcem gol și cache-ul reîncearcă la revalidare.
      console.warn(`[services] getServiceGroups a eșuat, întorc gol: ${error.message}`);
      return [];
    }

    return (data ?? []).map((group) => ({
      title: group.title,
      href: group.href,
      items: (group.services ?? [])
        .slice()
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((item) => ({
          title: item.title,
          href: `/servicii/${item.slug}`,
        })),
    }));
  },
  ["service-groups"],
  SERVICES_CACHE,
);

/** Serviciile afișate în mozaicul de pe homepage. */
export const getFeaturedServices = unstable_cache(
  async (): Promise<FeaturedService[]> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("services")
      .select(
        "slug, title, short_title, description, is_mosaic_hero, is_mosaic_wide, sort_order",
      )
      .eq("in_mosaic", true)
      .order("sort_order")
      .returns<
        {
          slug: string;
          title: string;
          short_title: string | null;
          description: string;
          is_mosaic_hero: boolean;
          is_mosaic_wide: boolean;
        }[]
      >();

    if (error) {
      // Degradare grațioasă: mozaicul de pe homepage (pagina-țintă pentru
      // Core Web Vitals) nu trebuie să strice prerender-ul ISR la o eroare DB.
      console.warn(
        `[services] getFeaturedServices a eșuat, întorc gol: ${error.message}`,
      );
      return [];
    }

    return (data ?? []).map((service, index) => ({
      id: service.slug,
      icon: String(index + 1).padStart(2, "0"),
      title: service.short_title ?? service.title,
      description: service.description,
      href: `/servicii/${service.slug}`,
      featured: service.is_mosaic_hero,
      wide: service.is_mosaic_wide,
    }));
  },
  ["featured-services"],
  SERVICES_CACHE,
);

// ─── Admin (rânduri complete, cu id) ─────────────────────────────────────────

export type AdminService = {
  id: string;
  slug: string;
  title: string;
  short_title: string | null;
  eyebrow: string;
  description: string;
  summary_title: string;
  summary: string;
  image_src: string | null;
  image_alt: string | null;
  processes: ServiceProcess[];
  specs: ServiceSpec[];
  faqs: ServiceFaq[] | null;
  group_slug: string | null;
  in_mosaic: boolean;
  is_mosaic_hero: boolean;
  is_mosaic_wide: boolean;
  sort_order: number;
  is_published: boolean;
};

const ADMIN_SERVICE_COLUMNS =
  "id, slug, title, short_title, eyebrow, description, summary_title, summary, image_src, image_alt, processes, specs, faqs, group_slug, in_mosaic, is_mosaic_hero, is_mosaic_wide, sort_order, is_published";

/** Toate serviciile pentru panou (include draft + id). */
export async function getServicesAdmin(): Promise<AdminService[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select(ADMIN_SERVICE_COLUMNS)
    .order("sort_order")
    .returns<AdminService[]>();
  if (error) throw new Error(`Nu am putut încărca serviciile: ${error.message}`);
  return data ?? [];
}

/** Un serviciu după id (pentru editare). */
export async function getServiceById(id: string): Promise<AdminService | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select(ADMIN_SERVICE_COLUMNS)
    .eq("id", id)
    .maybeSingle<AdminService>();
  if (error) throw new Error(`Nu am putut încărca serviciul: ${error.message}`);
  return data;
}

/** Opțiuni pentru selectul de grup (slug + titlu). */
export async function getServiceGroupOptions(): Promise<
  { value: string; label: string }[]
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("service_groups")
    .select("slug, title, sort_order")
    .order("sort_order")
    .returns<{ slug: string; title: string }[]>();
  if (error) throw new Error(`Nu am putut încărca grupurile: ${error.message}`);
  return (data ?? []).map((g) => ({ value: g.slug, label: g.title }));
}

import { unstable_cache } from "next/cache";
import { createClient } from "@/app/lib/supabase/server";
import { createPublicClient } from "@/app/lib/supabase/public";

export type ProjectType = "Excavări" | "Terasamente" | "Amenajări" | "Închiriere";

export type ProjectStatus =
  | "Ofertat"
  | "Planificat"
  | "În execuție"
  | "Finalizat"
  | "Suspendat";

export const PROJECT_TYPES: ProjectType[] = [
  "Excavări",
  "Terasamente",
  "Amenajări",
  "Închiriere",
];

export const PROJECT_STATUSES: ProjectStatus[] = [
  "Ofertat",
  "Planificat",
  "În execuție",
  "Finalizat",
  "Suspendat",
];

export type Project = {
  id: string;
  code: string;
  name: string;
  client: string;
  type: ProjectType;
  location: string;
  value: string;
  deadline: string;
  status: ProjectStatus;
  // Câmpuri publice (portofoliu /proiecte).
  slug: string | null;
  summary: string;
  imageSrc: string | null;
  imageAlt: string | null;
  imageBeforeSrc: string | null;
  imageBeforeAlt: string | null;
  isPublished: boolean;
};

type ProjectRow = {
  id: string;
  code: string;
  name: string;
  client: string;
  type: ProjectType;
  location: string;
  value: string;
  deadline: string;
  status: ProjectStatus;
  slug: string | null;
  summary: string;
  image_src: string | null;
  image_alt: string | null;
  image_before_src: string | null;
  image_before_alt: string | null;
  is_published: boolean;
};

const PROJECT_COLUMNS =
  "id, code, name, client, type, location, value, deadline, status, slug, summary, image_src, image_alt, image_before_src, image_before_alt, is_published, sort_order";

function mapProject(row: ProjectRow): Project {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    client: row.client,
    type: row.type,
    location: row.location,
    value: row.value,
    deadline: row.deadline,
    status: row.status,
    slug: row.slug,
    summary: row.summary,
    imageSrc: row.image_src,
    imageAlt: row.image_alt,
    imageBeforeSrc: row.image_before_src,
    imageBeforeAlt: row.image_before_alt,
    isPublished: row.is_published,
  };
}

/** Proiect public pentru portofoliul /proiecte (fără date sensibile interne). */
export type PublicProject = {
  slug: string | null;
  name: string;
  type: ProjectType;
  location: string;
  summary: string;
  imageSrc: string | null;
  imageAlt: string | null;
  imageBeforeSrc: string | null;
  imageBeforeAlt: string | null;
};

/** Coloanele publice expuse în portofoliu (fără client/valoare/termen). */
const PUBLIC_PROJECT_COLUMNS =
  "slug, name, type, location, summary, image_src, image_alt, image_before_src, image_before_alt, sort_order";

type PublicProjectRow = {
  slug: string | null;
  name: string;
  type: ProjectType;
  location: string;
  summary: string;
  image_src: string | null;
  image_alt: string | null;
  image_before_src: string | null;
  image_before_alt: string | null;
};

function mapPublicProject(row: PublicProjectRow): PublicProject {
  return {
    slug: row.slug,
    name: row.name,
    type: row.type,
    location: row.location,
    summary: row.summary,
    imageSrc: row.image_src,
    imageAlt: row.image_alt,
    imageBeforeSrc: row.image_before_src,
    imageBeforeAlt: row.image_before_alt,
  };
}

/** Profil de cache pentru portofoliul public. */
const PROJECTS_CACHE = { tags: ["projects"], revalidate: 3600 };

/**
 * Proiectele publicate, pentru portofoliul public. Folosește clientul public
 * (cookie-free); RLS returnează doar rândurile `is_published`. Nu expune
 * client/valoare/termen (date interne).
 */
export const getPublishedProjects = unstable_cache(
  async (): Promise<PublicProject[]> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("projects")
      .select(PUBLIC_PROJECT_COLUMNS)
      .eq("is_published", true)
      .order("sort_order")
      .returns<PublicProjectRow[]>();
    if (error) {
      // Degradare grațioasă pentru prerender-ul ISR al listei de proiecte.
      console.warn(`[projects] getPublicProjects a eșuat, întorc gol: ${error.message}`);
      return [];
    }
    return (data ?? []).map(mapPublicProject);
  },
  ["public-projects"],
  PROJECTS_CACHE,
);

/** Un proiect publicat după slug, pentru pagina de detaliu. */
export const getPublishedProject = unstable_cache(
  async (slug: string): Promise<PublicProject | null> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("projects")
      .select(PUBLIC_PROJECT_COLUMNS)
      .eq("is_published", true)
      .eq("slug", slug)
      .maybeSingle<PublicProjectRow>();
    if (error) {
      throw new Error(`Nu am putut încărca proiectul „${slug}": ${error.message}`);
    }
    return data ? mapPublicProject(data) : null;
  },
  ["public-project"],
  PROJECTS_CACHE,
);

/** Toate proiectele (intern, doar admin). */
export async function getProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select(PROJECT_COLUMNS)
    .order("sort_order")
    .returns<ProjectRow[]>();

  if (error) {
    throw new Error(`Nu am putut încărca proiectele: ${error.message}`);
  }
  return (data ?? []).map(mapProject);
}

/** Un proiect după id. */
export async function getProject(id: string): Promise<Project | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select(PROJECT_COLUMNS)
    .eq("id", id)
    .maybeSingle<ProjectRow>();

  if (error) {
    throw new Error(`Nu am putut încărca proiectul: ${error.message}`);
  }
  return data ? mapProject(data) : null;
}

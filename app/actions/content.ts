"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/app/lib/dal";
import { createClient } from "@/app/lib/supabase/server";
import { indexBlogPost, removeBlogPost } from "@/app/lib/upstash/search";
import { dispatchLifecycleEmail } from "@/app/lib/email/transactional";
import type { RequestStatus } from "@/app/data/requests";

/** Stare returnată formularelor de admin către `useActionState`. */
export type FormState = { error?: string } | undefined;

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Normalizează diacriticele românești la forma corectă cu virgulă dedesubt
 * (ș/ț, U+0218–021B), înlocuind variantele vechi cu sedilă (ş/ţ, U+015E–0163)
 * care apar frecvent la copy-paste. Esențial pentru consistența conținutului
 * și pentru ca motoarele de căutare și agenții AI să indexeze corect textul
 * românesc.
 */
function fixRomanianDiacritics(value: string): string {
  return value
    .replace(/ş/g, "ș") // ş → ș
    .replace(/Ş/g, "Ș") // Ş → Ș
    .replace(/ţ/g, "ț") // ţ → ț
    .replace(/Ţ/g, "Ț"); // Ţ → Ț
}

function str(form: FormData, key: string): string {
  return fixRomanianDiacritics(String(form.get(key) ?? "").trim());
}

function bool(form: FormData, key: string): boolean {
  const v = form.get(key);
  return v === "on" || v === "true" || v === "1";
}

function int(form: FormData, key: string, fallback = 0): number {
  const n = Number.parseInt(str(form, key), 10);
  return Number.isFinite(n) ? n : fallback;
}

/** Liste „un element pe linie". */
function lines(form: FormData, key: string): string[] {
  return fixRomanianDiacritics(String(form.get(key) ?? ""))
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

/** Parsează linii „a :: b :: c" în obiecte cu cheile date. */
function pairs<K extends string>(
  form: FormData,
  key: string,
  keys: K[],
): Record<K, string>[] {
  return lines(form, key).map((line) => {
    const parts = line.split("::").map((p) => p.trim());
    const obj = {} as Record<K, string>;
    keys.forEach((k, i) => {
      obj[k] = parts[i] ?? "";
    });
    return obj;
  });
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ─── Servicii ────────────────────────────────────────────────────────────────

function readServicePayload(form: FormData) {
  const title = str(form, "title");
  const slug = str(form, "slug") || slugify(title);
  return {
    slug,
    title,
    short_title: str(form, "short_title") || null,
    eyebrow: str(form, "eyebrow"),
    description: str(form, "description"),
    summary_title: str(form, "summary_title"),
    summary: str(form, "summary"),
    image_src: str(form, "image_src") || null,
    image_alt: str(form, "image_alt") || null,
    processes: pairs(form, "processes", ["title", "text"]),
    specs: pairs(form, "specs", ["label", "value", "impact"]),
    faqs: pairs(form, "faqs", ["question", "answer"]).filter(
      (f) => f.question && f.answer,
    ),
    group_slug: str(form, "group_slug") || null,
    in_mosaic: bool(form, "in_mosaic"),
    is_mosaic_hero: bool(form, "is_mosaic_hero"),
    is_mosaic_wide: bool(form, "is_mosaic_wide"),
    sort_order: int(form, "sort_order"),
    is_published: bool(form, "is_published"),
  };
}

function revalidateServices() {
  revalidatePath("/admin/servicii");
  revalidatePath("/servicii", "layout");
  revalidatePath("/");
  revalidateTag("services", "max");
}

export async function createService(
  _prev: FormState,
  form: FormData,
): Promise<FormState> {
  await requireAdmin();
  const payload = readServicePayload(form);
  if (!payload.title || !payload.slug) {
    return { error: "Titlul și slug-ul sunt obligatorii." };
  }
  const supabase = await createClient();
  const { error } = await supabase.from("services").insert(payload);
  if (error) {
    return { error: `Nu am putut salva serviciul: ${error.message}` };
  }
  revalidateServices();
  redirect("/admin/servicii");
}

export async function updateService(
  _prev: FormState,
  form: FormData,
): Promise<FormState> {
  await requireAdmin();
  const id = str(form, "id");
  const payload = readServicePayload(form);
  if (!id) return { error: "Lipsește identificatorul serviciului." };
  if (!payload.title || !payload.slug) {
    return { error: "Titlul și slug-ul sunt obligatorii." };
  }
  const supabase = await createClient();
  const { error } = await supabase.from("services").update(payload).eq("id", id);
  if (error) {
    return { error: `Nu am putut actualiza serviciul: ${error.message}` };
  }
  revalidateServices();
  redirect("/admin/servicii");
}

export async function deleteService(form: FormData): Promise<void> {
  await requireAdmin();
  const id = str(form, "id");
  if (id) {
    const supabase = await createClient();
    await supabase.from("services").delete().eq("id", id);
    revalidateServices();
  }
  revalidatePath("/admin/servicii");
}

// ─── Utilaje ─────────────────────────────────────────────────────────────────

function readRentalPayload(form: FormData) {
  const title = str(form, "title");
  const slug = str(form, "slug") || slugify(title);
  return {
    slug,
    title,
    category: str(form, "category"),
    short_description: str(form, "short_description"),
    long_description: str(form, "long_description"),
    price: str(form, "price"),
    image_src: str(form, "image_src") || null,
    image_alt: str(form, "image_alt") || null,
    specs: pairs(form, "specs", ["label", "value"]),
    uses: lines(form, "uses"),
    access_requirements: lines(form, "access_requirements"),
    is_available: bool(form, "is_available"),
    sort_order: int(form, "sort_order"),
    is_published: bool(form, "is_published"),
  };
}

function revalidateRentals() {
  revalidatePath("/admin/utilaje");
  revalidatePath("/inchiriere-utilaje", "layout");
  revalidateTag("rentals", "max");
}

export async function createRental(_prev: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const payload = readRentalPayload(form);
  if (!payload.title || !payload.slug) {
    return { error: "Titlul și slug-ul sunt obligatorii." };
  }
  const supabase = await createClient();
  const { error } = await supabase.from("rental_machines").insert(payload);
  if (error) return { error: `Nu am putut salva utilajul: ${error.message}` };
  revalidateRentals();
  redirect("/admin/utilaje");
}

export async function updateRental(_prev: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const id = str(form, "id");
  const payload = readRentalPayload(form);
  if (!id) return { error: "Lipsește identificatorul utilajului." };
  if (!payload.title || !payload.slug) {
    return { error: "Titlul și slug-ul sunt obligatorii." };
  }
  const supabase = await createClient();
  const { error } = await supabase.from("rental_machines").update(payload).eq("id", id);
  if (error) return { error: `Nu am putut actualiza utilajul: ${error.message}` };
  revalidateRentals();
  redirect("/admin/utilaje");
}

export async function deleteRental(form: FormData): Promise<void> {
  await requireAdmin();
  const id = str(form, "id");
  if (id) {
    const supabase = await createClient();
    await supabase.from("rental_machines").delete().eq("id", id);
    revalidateRentals();
  }
  revalidatePath("/admin/utilaje");
}

// ─── Blog ────────────────────────────────────────────────────────────────────

function readBlogPayload(form: FormData) {
  const title = str(form, "title");
  const slug = str(form, "slug") || slugify(title);
  const publishedAt = str(form, "published_at"); // yyyy-mm-dd
  let publishedLabel = str(form, "published_label");
  if (!publishedLabel && publishedAt) {
    publishedLabel = new Intl.DateTimeFormat("ro-RO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(publishedAt));
  }
  return {
    slug,
    title,
    excerpt: str(form, "excerpt"),
    body: str(form, "body") || null,
    category: str(form, "category"),
    read_time: str(form, "read_time"),
    published_at: publishedAt || new Date().toISOString().slice(0, 10),
    published_label: publishedLabel,
    image_src: str(form, "image_src") || null,
    image_alt: str(form, "image_alt") || null,
    tags: lines(form, "tags"),
    sources: pairs(form, "sources", ["title", "url"]).filter((s) => s.url),
    is_featured: bool(form, "is_featured"),
    sort_order: int(form, "sort_order"),
    is_published: bool(form, "is_published"),
  };
}

function revalidateBlog() {
  revalidatePath("/admin/blog");
  revalidatePath("/blog", "layout");
  revalidateTag("blog", "max");
}

/**
 * Sincronizează indexul Upstash Search cu un articol: îl (re)indexează dacă e
 * publicat, altfel îl scoate. Niciodată nu aruncă — o problemă de index nu
 * trebuie să strice salvarea din admin (no-op dacă Search nu e configurat).
 */
async function syncBlogSearch(payload: ReturnType<typeof readBlogPayload>) {
  try {
    if (payload.is_published) {
      await indexBlogPost({
        slug: payload.slug,
        title: payload.title,
        excerpt: payload.excerpt,
        body: payload.body ?? "",
        category: payload.category,
        tags: payload.tags,
        publishedLabel: payload.published_label,
        readTime: payload.read_time,
        imageSrc: payload.image_src ?? "",
        imageAlt: payload.image_alt ?? "",
      });
    } else {
      await removeBlogPost(payload.slug);
    }
  } catch (err) {
    console.error("[search] Sincronizare index blog eșuată:", err);
  }
}

export async function createPost(_prev: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const payload = readBlogPayload(form);
  if (!payload.title || !payload.slug) {
    return { error: "Titlul și slug-ul sunt obligatorii." };
  }
  const supabase = await createClient();
  const { error } = await supabase.from("blog_posts").insert(payload);
  if (error) return { error: `Nu am putut salva articolul: ${error.message}` };
  await syncBlogSearch(payload);
  revalidateBlog();
  redirect("/admin/blog");
}

export async function updatePost(_prev: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const id = str(form, "id");
  const payload = readBlogPayload(form);
  if (!id) return { error: "Lipsește identificatorul articolului." };
  if (!payload.title || !payload.slug) {
    return { error: "Titlul și slug-ul sunt obligatorii." };
  }
  const supabase = await createClient();
  const { error } = await supabase.from("blog_posts").update(payload).eq("id", id);
  if (error) return { error: `Nu am putut actualiza articolul: ${error.message}` };
  await syncBlogSearch(payload);
  revalidateBlog();
  redirect("/admin/blog");
}

export async function deletePost(form: FormData): Promise<void> {
  await requireAdmin();
  const id = str(form, "id");
  if (id) {
    const supabase = await createClient();
    // Luăm slug-ul înainte de ștergere ca să-l scoatem și din indexul de search.
    const { data: row } = await supabase
      .from("blog_posts")
      .select("slug")
      .eq("id", id)
      .maybeSingle<{ slug: string }>();
    await supabase.from("blog_posts").delete().eq("id", id);
    if (row?.slug) {
      try {
        await removeBlogPost(row.slug);
      } catch (err) {
        console.error("[search] Ștergere din index eșuată:", err);
      }
    }
    revalidateBlog();
  }
  revalidatePath("/admin/blog");
}

// ─── Proiecte ────────────────────────────────────────────────────────────────

const PROJECT_TYPE_VALUES = [
  "Excavări",
  "Terasamente",
  "Amenajări",
  "Închiriere",
] as const;
const PROJECT_STATUS_VALUES = [
  "Ofertat",
  "Planificat",
  "În execuție",
  "Finalizat",
  "Suspendat",
] as const;

type ProjectTypeValue = (typeof PROJECT_TYPE_VALUES)[number];
type ProjectStatusValue = (typeof PROJECT_STATUS_VALUES)[number];

function readProjectPayload(form: FormData) {
  const type = str(form, "type") as ProjectTypeValue;
  const status = str(form, "status") as ProjectStatusValue;
  const name = str(form, "name");
  const isPublished = bool(form, "is_published");
  const explicitSlug = str(form, "slug");
  // Slug doar dacă e dat explicit sau dacă proiectul e publicat. Proiectele
  // interne (nepublicate) rămân fără slug, ca să nu se ciocnească pe unique.
  const slug = explicitSlug ? slugify(explicitSlug) : isPublished ? slugify(name) : null;
  return {
    code: str(form, "code"),
    name,
    client: str(form, "client"),
    type: PROJECT_TYPE_VALUES.includes(type) ? type : "Excavări",
    location: str(form, "location"),
    value: str(form, "value"),
    deadline: str(form, "deadline"),
    status: PROJECT_STATUS_VALUES.includes(status) ? status : "Ofertat",
    // Câmpuri publice (portofoliu /proiecte).
    slug: slug || null,
    summary: str(form, "summary"),
    image_src: str(form, "image_src") || null, // imaginea „după" / principală
    image_alt: str(form, "image_alt") || null,
    image_before_src: str(form, "image_before_src") || null, // imaginea „înainte"
    image_before_alt: str(form, "image_before_alt") || null,
    is_published: isPublished,
    sort_order: int(form, "sort_order"),
  };
}

function revalidateProjects() {
  revalidatePath("/admin/proiecte");
  revalidatePath("/proiecte");
  revalidateTag("projects", "max");
}

export async function createProject(
  _prev: FormState,
  form: FormData,
): Promise<FormState> {
  await requireAdmin();
  const payload = readProjectPayload(form);
  if (!payload.code || !payload.name) {
    return { error: "Codul și denumirea proiectului sunt obligatorii." };
  }
  const supabase = await createClient();
  const { error } = await supabase.from("projects").insert(payload);
  if (error) return { error: `Nu am putut salva proiectul: ${error.message}` };
  revalidateProjects();
  redirect("/admin/proiecte");
}

export async function updateProject(
  _prev: FormState,
  form: FormData,
): Promise<FormState> {
  await requireAdmin();
  const id = str(form, "id");
  const payload = readProjectPayload(form);
  if (!id) return { error: "Lipsește identificatorul proiectului." };
  if (!payload.code || !payload.name) {
    return { error: "Codul și denumirea proiectului sunt obligatorii." };
  }
  const supabase = await createClient();
  const { error } = await supabase.from("projects").update(payload).eq("id", id);
  if (error) return { error: `Nu am putut actualiza proiectul: ${error.message}` };
  revalidateProjects();
  redirect("/admin/proiecte");
}

export async function deleteProject(form: FormData): Promise<void> {
  await requireAdmin();
  const id = str(form, "id");
  if (id) {
    const supabase = await createClient();
    await supabase.from("projects").delete().eq("id", id);
    revalidateProjects();
  }
  revalidatePath("/admin/proiecte");
}

// ─── FAQ (item-uri) ──────────────────────────────────────────────────────────

function revalidateFaq() {
  revalidatePath("/admin/faq");
  revalidatePath("/faq");
  revalidateTag("faq", "max");
}

function readFaqItemPayload(form: FormData) {
  return {
    section_id: str(form, "section_id"),
    question: str(form, "question"),
    answer: str(form, "answer"),
    highlights: lines(form, "highlights"),
    sort_order: int(form, "sort_order"),
    is_published: bool(form, "is_published"),
  };
}

export async function createFaqItem(
  _prev: FormState,
  form: FormData,
): Promise<FormState> {
  await requireAdmin();
  const payload = readFaqItemPayload(form);
  if (!payload.section_id) return { error: "Alege o categorie." };
  if (!payload.question || !payload.answer) {
    return { error: "Întrebarea și răspunsul sunt obligatorii." };
  }
  const supabase = await createClient();
  const { error } = await supabase.from("faq_items").insert(payload);
  if (error) return { error: `Nu am putut salva întrebarea: ${error.message}` };
  revalidateFaq();
  redirect("/admin/faq");
}

export async function updateFaqItem(
  _prev: FormState,
  form: FormData,
): Promise<FormState> {
  await requireAdmin();
  const id = str(form, "id");
  const payload = readFaqItemPayload(form);
  if (!id) return { error: "Lipsește identificatorul întrebării." };
  if (!payload.section_id) return { error: "Alege o categorie." };
  if (!payload.question || !payload.answer) {
    return { error: "Întrebarea și răspunsul sunt obligatorii." };
  }
  const supabase = await createClient();
  const { error } = await supabase.from("faq_items").update(payload).eq("id", id);
  if (error) return { error: `Nu am putut actualiza întrebarea: ${error.message}` };
  revalidateFaq();
  redirect("/admin/faq");
}

export async function deleteFaqItem(form: FormData): Promise<void> {
  await requireAdmin();
  const id = str(form, "id");
  if (id) {
    const supabase = await createClient();
    await supabase.from("faq_items").delete().eq("id", id);
    revalidateFaq();
  }
  revalidatePath("/admin/faq");
}

// ─── Cereri (servicii / închiriere) — management admin ───────────────────────

const REQUEST_STATUS_VALUES = [
  "Nouă",
  "În evaluare",
  "Ofertat",
  "Confirmat",
  "Închisă",
] as const;
type RequestStatusValue = (typeof REQUEST_STATUS_VALUES)[number];

export async function updateServiceRequestStatus(form: FormData): Promise<void> {
  await requireAdmin();
  const id = str(form, "id");
  const status = str(form, "status") as RequestStatusValue;
  if (id && REQUEST_STATUS_VALUES.includes(status)) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("service_requests")
      .update({ status })
      .eq("id", id)
      .select("id, code, name, email")
      .single<{ id: string; code: string; name: string; email: string | null }>();
    if (data?.email) {
      await dispatchLifecycleEmail({
        requestId: data.id,
        code: data.code,
        name: data.name,
        email: data.email,
        status: status as RequestStatus,
      });
    }
    revalidatePath("/admin/cereri-servicii");
  }
}

export async function deleteServiceRequest(form: FormData): Promise<void> {
  await requireAdmin();
  const id = str(form, "id");
  if (id) {
    const supabase = await createClient();
    await supabase.from("service_requests").delete().eq("id", id);
    revalidatePath("/admin/cereri-servicii");
  }
}

export async function updateRentalRequestStatus(form: FormData): Promise<void> {
  await requireAdmin();
  const id = str(form, "id");
  const status = str(form, "status") as RequestStatusValue;
  if (id && REQUEST_STATUS_VALUES.includes(status)) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("rental_requests")
      .update({ status })
      .eq("id", id)
      .select("id, code, name, email")
      .single<{ id: string; code: string; name: string; email: string | null }>();
    if (data?.email) {
      await dispatchLifecycleEmail({
        requestId: data.id,
        code: data.code,
        name: data.name,
        email: data.email,
        status: status as RequestStatus,
      });
    }
    revalidatePath("/admin/cereri-inchiriere");
  }
}

export async function deleteRentalRequest(form: FormData): Promise<void> {
  await requireAdmin();
  const id = str(form, "id");
  if (id) {
    const supabase = await createClient();
    await supabase.from("rental_requests").delete().eq("id", id);
    revalidatePath("/admin/cereri-inchiriere");
  }
}

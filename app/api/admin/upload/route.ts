import { getUser } from "@/app/lib/dal";
import { createAdminClient } from "@/app/lib/supabase/admin";
import { logger } from "@/app/lib/logger";

/**
 * Upload de imagini din formularele de admin. Primește un `file` (multipart),
 * validează tipul/dimensiunea, îl încarcă în bucket-ul public `media` cu
 * service_role și întoarce URL-ul public.
 *
 * Securitate: accesibilă doar adminilor autentificați (sesiune Supabase).
 */
export const dynamic = "force-dynamic";

const BUCKET = "media";
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/svg+xml",
]);
const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};

/** Curăță numele original pentru a-l folosi ca prefix lizibil în path. */
function slugifyName(name: string): string {
  return (
    name
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "imagine"
  );
}

export async function POST(request: Request): Promise<Response> {
  const user = await getUser();
  if (!user) {
    return Response.json({ error: "Neautorizat." }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ error: "Cerere invalidă." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return Response.json({ error: "Niciun fișier trimis." }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return Response.json(
      { error: "Tip de fișier nepermis. Folosește JPG, PNG, WebP, AVIF, GIF sau SVG." },
      { status: 415 },
    );
  }
  if (file.size > MAX_BYTES) {
    return Response.json({ error: "Fișier prea mare (max. 8 MB)." }, { status: 413 });
  }

  const folder =
    (form.get("folder") as string | null)?.replace(/[^a-z0-9-]/gi, "") || "general";
  const ext = EXT[file.type] ?? "bin";
  const path = `${folder}/${slugifyName(file.name)}-${Date.now()}.${ext}`;

  const supabase = createAdminClient();
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, Buffer.from(await file.arrayBuffer()), {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    logger.error("upload imagine admin eșuat", { message: error.message });
    return Response.json(
      { error: "Încărcarea a eșuat. Încearcă din nou." },
      { status: 500 },
    );
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return Response.json({ url: data.publicUrl });
}

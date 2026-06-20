"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/app/lib/dal";
import { createClient } from "@/app/lib/supabase/server";
import type { Database, Json } from "@/app/lib/supabase/database.types";

type SettingsInsert = Database["public"]["Tables"]["site_settings"]["Insert"];

/**
 * Acțiuni de salvare a setărilor de site. Fiecare secțiune are propria acțiune,
 * își validează payload-ul cu zod și face upsert DOAR pe coloana ei (id = 1),
 * apoi invalidează cache-ul „settings" + chrome-ul public peste tot.
 *
 * Convenții: `requireAdmin()` la început (RLS prin clientul cookie), payload-ul
 * vine ca JSON în câmpul `data` al formularului (formularele sunt Client
 * Components care serializează starea lor înainte de submit).
 */
export type SettingsFormState =
  | { ok: true; info?: string }
  | { ok: false; error: string }
  | undefined;

// ─── Scheme zod ──────────────────────────────────────────────────────────────

const E164_RE = /^\+[1-9]\d{6,14}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

const phoneSchema = z.object({
  id: z.string().min(1),
  label: z.string().trim().min(1, "Eticheta numărului e obligatorie.").max(60),
  e164: z
    .string()
    .trim()
    .regex(E164_RE, "Număr invalid. Folosește format internațional, ex: +40712345678."),
  display: z.string().trim().min(1, "Completează formatul de afișare.").max(40),
  whatsapp: z.boolean(),
  whatsappMessage: z.string().trim().max(300).optional(),
  isPrimary: z.boolean(),
  showInFloating: z.boolean(),
  order: z.number().int().min(0),
});

const phonesSchema = z
  .array(phoneSchema)
  .min(1, "Adaugă cel puțin un număr de telefon.")
  .refine(
    (arr) => arr.filter((p) => p.isPrimary).length === 1,
    "Trebuie să existe exact un număr principal.",
  )
  .refine(
    (arr) => new Set(arr.map((p) => p.id)).size === arr.length,
    "Identificatori de telefon duplicați.",
  );

const optionalUrl = z.union([z.literal(""), z.url("Link invalid.")]);
const optionalEmail = z.union([
  z.literal(""),
  z.email("Adresă de email invalidă.").max(160),
]);

const contactSchema = z.object({
  emailPrimary: z.email("Email principal invalid.").max(160),
  emailOffice: optionalEmail,
  address: z.object({
    streetAddress: z.string().trim().max(200),
    addressLocality: z.string().trim().max(120),
    addressRegion: z.string().trim().max(120),
    postalCode: z.string().trim().max(20),
    addressCountry: z.string().trim().length(2, "Codul de țară are 2 litere (ex: RO)."),
  }),
  geo: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
  mapUrl: optionalUrl,
});

const DAY_VALUES = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

const optionalTime = z.union([
  z.literal(""),
  z.string().regex(TIME_RE, "Oră invalidă (HH:MM)."),
]);

const hoursSchema = z.array(
  z.object({
    days: z.array(z.enum(DAY_VALUES)),
    opens: optionalTime,
    closes: optionalTime,
    label: z.string().trim().max(80),
    closed: z.boolean(),
  }),
);

const socialSchema = z.object({
  googleBusiness: optionalUrl,
  facebook: optionalUrl,
  instagram: optionalUrl,
  linkedin: optionalUrl,
  tiktok: optionalUrl,
  youtube: optionalUrl,
});

const floatingSchema = z.object({
  enabled: z.boolean(),
  position: z.enum(["right", "left"]),
  channels: z.object({
    whatsapp: z.boolean(),
    call: z.boolean(),
    scrollTop: z.boolean(),
    email: z.boolean(),
  }),
  showOnMobile: z.boolean(),
  showOnDesktop: z.boolean(),
  expandLabels: z.boolean(),
  whatsappPhoneId: z.string().optional(),
  callPhoneId: z.string().optional(),
});

const announcementSchema = z.object({
  enabled: z.boolean(),
  text: z.string().trim().max(200),
  href: z.string().trim().max(300).optional(),
});

// ─── Infrastructură ──────────────────────────────────────────────────────────

/** Parsează JSON din câmpul `data` al formularului (null la JSON invalid). */
function readData(form: FormData): unknown {
  const raw = form.get("data");
  if (typeof raw !== "string") return undefined;
  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

/** Validează + upsert pe o singură coloană, apoi revalidează cache-ul public. */
async function saveSection<T>(
  schema: z.ZodType<T>,
  form: FormData,
  build: (data: T) => SettingsInsert,
): Promise<SettingsFormState> {
  await requireAdmin();
  const parsed = schema.safeParse(readData(form));
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Date invalide." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("site_settings")
    .upsert({ id: 1, ...build(parsed.data) }, { onConflict: "id" });

  if (error) {
    return { ok: false, error: `Nu am putut salva: ${error.message}` };
  }

  // Invalidează cache-ul de date + chrome-ul public (navbar/footer/flotante) peste tot.
  revalidateTag("settings", "max");
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
  return { ok: true, info: "Setările au fost salvate." };
}

// ─── Acțiuni per secțiune ────────────────────────────────────────────────────

export async function updatePhones(
  _prev: SettingsFormState,
  form: FormData,
): Promise<SettingsFormState> {
  return saveSection(phonesSchema, form, (phones) => ({ phones: phones as Json }));
}

export async function updateContactSettings(
  _prev: SettingsFormState,
  form: FormData,
): Promise<SettingsFormState> {
  return saveSection(contactSchema, form, (contact) => ({ contact: contact as Json }));
}

export async function updateHours(
  _prev: SettingsFormState,
  form: FormData,
): Promise<SettingsFormState> {
  return saveSection(hoursSchema, form, (hours) => ({ hours: hours as Json }));
}

export async function updateSocial(
  _prev: SettingsFormState,
  form: FormData,
): Promise<SettingsFormState> {
  return saveSection(socialSchema, form, (social) => ({ social: social as Json }));
}

export async function updateFloatingSettings(
  _prev: SettingsFormState,
  form: FormData,
): Promise<SettingsFormState> {
  return saveSection(floatingSchema, form, (floating) => ({
    floating: floating as Json,
  }));
}

export async function updateAnnouncement(
  _prev: SettingsFormState,
  form: FormData,
): Promise<SettingsFormState> {
  return saveSection(announcementSchema, form, (announcement) => ({
    announcement: announcement as Json,
  }));
}

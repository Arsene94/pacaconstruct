"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/app/lib/dal";
import { createClient } from "@/app/lib/supabase/server";
import { logger, errorContext } from "@/app/lib/logger";
import { CONTACT_STATUSES, type ContactStatus } from "@/app/data/contacts";
import type { Json } from "@/app/lib/supabase/database.types";

/**
 * Acțiuni admin pentru contacte, grupuri și segmente. Toate verifică
 * `requireAdmin()` și validează cu zod. Folosesc clientul cookie (RLS admin).
 */

export type EmailFormState =
  | { ok: true; info?: string }
  | { ok: false; error: string }
  | undefined;

function str(form: FormData, key: string): string {
  return String(form.get(key) ?? "").trim();
}

function parseTags(raw: string): string[] {
  return Array.from(
    new Set(
      raw
        .split(/[,\n]/)
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
    ),
  );
}

const emailSchema = z.email("Adresa de email nu este validă.").max(120);

// ─── Contacte ────────────────────────────────────────────────────────────────

const contactSchema = z.object({
  email: emailSchema,
  name: z.string().max(120).optional(),
  phone: z.string().max(40).optional(),
  status: z.enum(CONTACT_STATUSES as [ContactStatus, ...ContactStatus[]]),
  marketingConsent: z.boolean(),
  tags: z.array(z.string()).default([]),
});

export async function createContact(
  _prev: EmailFormState,
  form: FormData,
): Promise<EmailFormState> {
  await requireAdmin();
  const parsed = contactSchema.safeParse({
    email: str(form, "email").toLowerCase(),
    name: str(form, "name") || undefined,
    phone: str(form, "phone") || undefined,
    status: (str(form, "status") || "active") as ContactStatus,
    marketingConsent: form.get("marketingConsent") === "on",
    tags: parseTags(str(form, "tags")),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Date invalide." };
  }
  const c = parsed.data;
  const supabase = await createClient();
  const { error } = await supabase.from("contacts").insert({
    email: c.email,
    name: c.name ?? null,
    phone: c.phone ?? null,
    status: c.status,
    marketing_consent: c.marketingConsent,
    consent_at: c.marketingConsent ? new Date().toISOString() : null,
    tags: c.tags,
    source: "manual",
  });
  if (error) {
    if (error.code === "23505") {
      return { ok: false, error: "Există deja un contact cu acest email." };
    }
    logger.error("createContact failed", errorContext(error));
    return { ok: false, error: "Nu am putut salva contactul." };
  }
  revalidatePath("/admin/email/contacts");
  return { ok: true, info: "Contact adăugat." };
}

export async function updateContact(
  _prev: EmailFormState,
  form: FormData,
): Promise<EmailFormState> {
  await requireAdmin();
  const id = str(form, "id");
  if (!id) return { ok: false, error: "Lipsește identificatorul." };
  const parsed = contactSchema.safeParse({
    email: str(form, "email").toLowerCase(),
    name: str(form, "name") || undefined,
    phone: str(form, "phone") || undefined,
    status: (str(form, "status") || "active") as ContactStatus,
    marketingConsent: form.get("marketingConsent") === "on",
    tags: parseTags(str(form, "tags")),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Date invalide." };
  }
  const c = parsed.data;
  const supabase = await createClient();
  const { error } = await supabase
    .from("contacts")
    .update({
      email: c.email,
      name: c.name ?? null,
      phone: c.phone ?? null,
      status: c.status,
      marketing_consent: c.marketingConsent,
      tags: c.tags,
      unsubscribed_at: c.status === "unsubscribed" ? new Date().toISOString() : null,
    })
    .eq("id", id);
  if (error) {
    logger.error("updateContact failed", errorContext(error));
    return { ok: false, error: "Nu am putut actualiza contactul." };
  }
  revalidatePath("/admin/email/contacts");
  return { ok: true, info: "Contact actualizat." };
}

export async function deleteContact(form: FormData): Promise<void> {
  await requireAdmin();
  const id = str(form, "id");
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("contacts").delete().eq("id", id);
  revalidatePath("/admin/email/contacts");
}

// ─── Import CSV ──────────────────────────────────────────────────────────────

/**
 * Import CSV: prima coloană = email, opțional a doua = nume, a treia = telefon.
 * Validează emailul, deduplică pe adresă, marchează source='import'. Sare peste
 * rândurile invalide și peste cele deja existente.
 */
export async function importContacts(
  _prev: EmailFormState,
  form: FormData,
): Promise<EmailFormState> {
  await requireAdmin();
  const csv = str(form, "csv");
  if (!csv) return { ok: false, error: "Lipsește conținutul CSV." };

  const rows = csv
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const seen = new Set<string>();
  const valid: { email: string; name: string | null; phone: string | null }[] = [];
  let invalid = 0;
  for (const line of rows) {
    const cols = line.split(/[,;\t]/).map((c) => c.trim());
    const email = (cols[0] ?? "").toLowerCase();
    // Sare peste un eventual header.
    if (email === "email") continue;
    const check = emailSchema.safeParse(email);
    if (!check.success) {
      invalid++;
      continue;
    }
    if (seen.has(email)) continue;
    seen.add(email);
    valid.push({ email, name: cols[1] || null, phone: cols[2] || null });
  }

  if (valid.length === 0) {
    return { ok: false, error: `Niciun email valid (${invalid} invalide).` };
  }

  const supabase = await createClient();
  // upsert pe email: nu dublează contacte existente.
  const { error, count } = await supabase.from("contacts").upsert(
    valid.map((v) => ({
      email: v.email,
      name: v.name,
      phone: v.phone,
      source: "import",
    })),
    { onConflict: "email", ignoreDuplicates: true, count: "exact" },
  );
  if (error) {
    logger.error("importContacts failed", errorContext(error));
    return { ok: false, error: "Importul a eșuat." };
  }
  revalidatePath("/admin/email/contacts");
  return {
    ok: true,
    info: `Import: ${count ?? valid.length} contacte noi, ${invalid} rânduri invalide ignorate.`,
  };
}

// ─── Grupuri ─────────────────────────────────────────────────────────────────

export async function createGroup(
  _prev: EmailFormState,
  form: FormData,
): Promise<EmailFormState> {
  await requireAdmin();
  const name = str(form, "name");
  if (!name) return { ok: false, error: "Numele grupului e obligatoriu." };
  const supabase = await createClient();
  const { error } = await supabase.from("contact_groups").insert({
    name,
    description: str(form, "description") || null,
  });
  if (error) {
    logger.error("createGroup failed", errorContext(error));
    return { ok: false, error: "Nu am putut crea grupul." };
  }
  revalidatePath("/admin/email/groups");
  return { ok: true, info: "Grup creat." };
}

export async function deleteGroup(form: FormData): Promise<void> {
  await requireAdmin();
  const id = str(form, "id");
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("contact_groups").delete().eq("id", id);
  revalidatePath("/admin/email/groups");
}

export async function addToGroup(form: FormData): Promise<void> {
  await requireAdmin();
  const groupId = str(form, "groupId");
  const contactId = str(form, "contactId");
  if (!groupId || !contactId) return;
  const supabase = await createClient();
  await supabase
    .from("contact_group_members")
    .upsert(
      { group_id: groupId, contact_id: contactId },
      { onConflict: "group_id,contact_id", ignoreDuplicates: true },
    );
  revalidatePath(`/admin/email/groups/${groupId}`);
}

export async function removeFromGroup(form: FormData): Promise<void> {
  await requireAdmin();
  const groupId = str(form, "groupId");
  const contactId = str(form, "contactId");
  if (!groupId || !contactId) return;
  const supabase = await createClient();
  await supabase
    .from("contact_group_members")
    .delete()
    .eq("group_id", groupId)
    .eq("contact_id", contactId);
  revalidatePath(`/admin/email/groups/${groupId}`);
}

// ─── Segmente ────────────────────────────────────────────────────────────────

export async function createSegment(
  _prev: EmailFormState,
  form: FormData,
): Promise<EmailFormState> {
  await requireAdmin();
  const name = str(form, "name");
  if (!name) return { ok: false, error: "Numele segmentului e obligatoriu." };

  const definition: Record<string, Json> = {};
  const source = str(form, "source");
  const tags = parseTags(str(form, "tags"));
  const days = Number.parseInt(str(form, "createdWithinDays"), 10);
  const consent = str(form, "marketingConsent");
  if (source) definition.source = source;
  if (tags.length) definition.tags = tags;
  if (Number.isFinite(days) && days > 0) definition.createdWithinDays = days;
  if (consent === "true") definition.marketingConsent = true;
  if (consent === "false") definition.marketingConsent = false;

  const supabase = await createClient();
  const { error } = await supabase.from("contact_segments").insert({ name, definition });
  if (error) {
    logger.error("createSegment failed", errorContext(error));
    return { ok: false, error: "Nu am putut crea segmentul." };
  }
  revalidatePath("/admin/email/groups");
  return { ok: true, info: "Segment creat." };
}

export async function deleteSegment(form: FormData): Promise<void> {
  await requireAdmin();
  const id = str(form, "id");
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("contact_segments").delete().eq("id", id);
  revalidatePath("/admin/email/groups");
}

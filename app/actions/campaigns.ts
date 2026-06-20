"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/app/lib/dal";
import { createClient } from "@/app/lib/supabase/server";
import { logger, errorContext } from "@/app/lib/logger";
import { renderEmail } from "@/emails/render";
import { isEmailTemplateKey } from "@/emails/registry";
import type { EmailPropsMap, EmailTemplateKey } from "@/emails/types";
import { sendEmail } from "@/app/lib/email/send";
import { triggerBroadcast } from "@/app/lib/email/broadcast";
import type { Json } from "@/app/lib/supabase/database.types";

/**
 * Acțiuni admin pentru campanii: preview, test send, creare draft, trimitere.
 * Toate requireAdmin(). Preview/test sunt apelate din composer (client).
 */

export type PreviewResult =
  | { ok: true; html: string; subject: string }
  | { ok: false; error: string };

/** Randează un template cu variabile date → HTML pentru iframe-ul de preview. */
export async function renderEmailPreview(
  templateKey: string,
  vars: Record<string, unknown>,
): Promise<PreviewResult> {
  await requireAdmin();
  if (!isEmailTemplateKey(templateKey)) {
    return { ok: false, error: "Template necunoscut." };
  }
  try {
    const rendered = await renderEmail(
      templateKey,
      vars as EmailPropsMap[EmailTemplateKey],
    );
    return { ok: true, html: rendered.html, subject: rendered.subject };
  } catch (err) {
    logger.error("renderEmailPreview failed", errorContext(err));
    return { ok: false, error: "Nu am putut randa preview-ul." };
  }
}

export type ActionResult =
  | { ok: true; info?: string; id?: string }
  | { ok: false; error: string };

/** Trimite un email de test către o adresă proprie (categorie tranzacțional). */
export async function sendTestEmail(
  templateKey: string,
  to: string,
  vars: Record<string, unknown>,
): Promise<ActionResult> {
  await requireAdmin();
  if (!isEmailTemplateKey(templateKey)) {
    return { ok: false, error: "Template necunoscut." };
  }
  if (!to || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to)) {
    return { ok: false, error: "Adresă de test invalidă." };
  }
  const result = await sendEmail({
    templateKey,
    to,
    vars: vars as EmailPropsMap[EmailTemplateKey],
    idempotencyKey: `test:${templateKey}:${randomUUID()}`,
  });
  if (!result.ok) {
    return {
      ok: false,
      error:
        result.reason === "not_configured"
          ? "Resend nu e configurat (lipsește RESEND_API_KEY)."
          : "Trimiterea testului a eșuat.",
    };
  }
  return { ok: true, info: `Test trimis către ${to}.` };
}

/** Numărul de destinatari de marketing (activi + consimțământ) dintr-o audiență. */
export async function countMarketingAudience(
  kind: "group" | "segment",
  id: string,
): Promise<number> {
  await requireAdmin();
  if (!id) return 0;
  const supabase = await createClient();
  const { resolveAudienceWith } = await import("@/app/data/contacts");
  const contacts = await resolveAudienceWith(supabase, kind, id, true);
  return contacts.length;
}

export type CreateCampaignInput = {
  templateKey: string;
  audienceKind: "group" | "segment";
  audienceId: string;
  subject?: string;
  payload: Record<string, unknown>;
  scheduledAt?: string | null;
};

/** Creează o campanie draft (sau programată). */
export async function createCampaign(input: CreateCampaignInput): Promise<ActionResult> {
  await requireAdmin();
  if (!isEmailTemplateKey(input.templateKey)) {
    return { ok: false, error: "Template necunoscut." };
  }
  if (!input.audienceId) {
    return { ok: false, error: "Alege o audiență (grup sau segment)." };
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("email_campaigns")
    .insert({
      template_key: input.templateKey,
      audience_kind: input.audienceKind,
      audience_id: input.audienceId,
      subject_override: input.subject?.trim() || null,
      payload: input.payload as Json,
      status: input.scheduledAt ? "scheduled" : "draft",
      scheduled_at: input.scheduledAt ?? null,
    })
    .select("id")
    .single<{ id: string }>();
  if (error) {
    logger.error("createCampaign failed", errorContext(error));
    return { ok: false, error: "Nu am putut crea campania." };
  }
  revalidatePath("/admin/email");
  return { ok: true, id: data.id, info: "Campanie creată." };
}

/** Pornește trimiterea unei campanii (status → sending + workflow durabil). */
export async function sendBroadcast(campaignId: string): Promise<ActionResult> {
  await requireAdmin();
  if (!campaignId) return { ok: false, error: "Lipsește campania." };
  const supabase = await createClient();
  const { data: campaign, error } = await supabase
    .from("email_campaigns")
    .select("status")
    .eq("id", campaignId)
    .maybeSingle<{ status: string }>();
  if (error || !campaign) {
    return { ok: false, error: "Campania nu există." };
  }
  if (campaign.status === "sending" || campaign.status === "sent") {
    return { ok: false, error: "Campania a fost deja trimisă." };
  }

  const { error: updErr } = await supabase
    .from("email_campaigns")
    .update({ status: "sending" })
    .eq("id", campaignId);
  if (updErr) {
    return { ok: false, error: "Nu am putut porni campania." };
  }

  await triggerBroadcast(campaignId);
  revalidatePath("/admin/email");
  return { ok: true, info: "Campanie pornită." };
}

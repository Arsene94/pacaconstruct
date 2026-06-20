import "server-only";

import {
  appBaseUrl,
  getWorkflowClient,
  isQstashConfigured,
} from "@/app/lib/upstash/qstash";
import { resolveAudienceWith, type AudienceKind } from "@/app/data/contacts";
import { logger, errorContext } from "@/app/lib/logger";
import { isEmailTemplateKey } from "@/emails/registry";
import type { EmailPropsMap, EmailTemplateKey } from "@/emails/types";
import { sendEmail } from "./send";
import { getAdminClientOrNull } from "./templates";
import { unsubscribeUrl } from "./unsubscribe";

/**
 * Motorul de broadcast: rezolvă audiența unei campanii (doar contacte active cu
 * consimțământ marketing) și trimite per-destinatar, idempotent. Rulează din
 * workflow-ul durabil (checkpoint pe chunk-uri) sau inline (fallback dev).
 */

const WORKFLOW_PATH = "/api/workflow/broadcast";
export const BROADCAST_CHUNK = 100;

export type BroadcastTarget = { id: string; email: string };

export type BroadcastPlan = {
  templateKey: EmailTemplateKey;
  payload: Record<string, unknown>;
  targets: BroadcastTarget[];
};

/** Încarcă campania + lista de destinatari (service_role). */
export async function getBroadcastPlan(
  campaignId: string,
): Promise<BroadcastPlan | null> {
  const admin = getAdminClientOrNull();
  if (!admin) return null;

  const { data: campaign, error } = await admin
    .from("email_campaigns")
    .select("template_key, audience_kind, audience_id, payload")
    .eq("id", campaignId)
    .maybeSingle<{
      template_key: string;
      audience_kind: string;
      audience_id: string | null;
      payload: Record<string, unknown>;
    }>();
  if (error || !campaign) return null;
  if (!isEmailTemplateKey(campaign.template_key)) return null;
  if (!campaign.audience_id) return null;

  const contacts = await resolveAudienceWith(
    admin,
    campaign.audience_kind as AudienceKind,
    campaign.audience_id,
    true, // doar contacte cu consimțământ marketing
  );

  return {
    templateKey: campaign.template_key,
    payload: campaign.payload ?? {},
    targets: contacts.map((c) => ({ id: c.id, email: c.email })),
  };
}

/** Trimite un chunk de destinatari; întoarce câte au fost acceptate. */
export async function sendBroadcastChunk(
  campaignId: string,
  templateKey: EmailTemplateKey,
  payload: Record<string, unknown>,
  targets: BroadcastTarget[],
): Promise<number> {
  let sent = 0;
  for (const target of targets) {
    const url = unsubscribeUrl(target.id);
    const result = await sendEmail({
      templateKey,
      to: target.email,
      vars: {
        ...payload,
        unsubscribeUrl: url ?? undefined,
      } as EmailPropsMap[typeof templateKey],
      idempotencyKey: `campaign:${campaignId}:${target.id}`,
      contactId: target.id,
      campaignId,
      listUnsubscribeUrl: url,
    });
    if (result.ok) sent++;
  }
  return sent;
}

export async function finalizeBroadcast(
  campaignId: string,
  sentCount: number,
  status: "sent" | "failed" = "sent",
): Promise<void> {
  const admin = getAdminClientOrNull();
  if (!admin) return;
  await admin
    .from("email_campaigns")
    .update({ sent_count: sentCount, status })
    .eq("id", campaignId);
}

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size));
  }
  return out;
}

/**
 * Declanșează broadcast-ul: workflow durabil dacă QStash e configurat, altfel
 * rulează inline (fallback). Nu aruncă.
 */
export async function triggerBroadcast(campaignId: string): Promise<void> {
  try {
    if (isQstashConfigured()) {
      await getWorkflowClient().trigger({
        url: `${appBaseUrl()}${WORKFLOW_PATH}`,
        body: { campaignId },
        retries: 2,
      });
      return;
    }
    // Fallback inline.
    await runBroadcastInline(campaignId);
  } catch (err) {
    logger.error("triggerBroadcast failed", { campaignId, ...errorContext(err) });
    await finalizeBroadcast(campaignId, 0, "failed");
  }
}

/** Rulează tot broadcast-ul inline (fără workflow). */
export async function runBroadcastInline(campaignId: string): Promise<void> {
  const plan = await getBroadcastPlan(campaignId);
  if (!plan) {
    await finalizeBroadcast(campaignId, 0, "failed");
    return;
  }
  let sent = 0;
  for (const part of chunk(plan.targets, BROADCAST_CHUNK)) {
    sent += await sendBroadcastChunk(campaignId, plan.templateKey, plan.payload, part);
  }
  await finalizeBroadcast(campaignId, sent, "sent");
}

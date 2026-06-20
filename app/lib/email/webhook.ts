import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { logger, errorContext } from "@/app/lib/logger";
import type { Json } from "@/app/lib/supabase/database.types";
import type { EmailStatus } from "@/app/data/email";
import { getAdminClientOrNull } from "./templates";
import { suppressContact } from "./suppression";

/**
 * Verificare semnătură Svix (folosită de webhooks Resend) + maparea
 * evenimentelor pe `email_messages.status` și `email_events`, cu supresie la
 * bounce/complaint. Implementăm schema Svix manual ca să evităm o dependență.
 */

export type SvixHeaders = {
  id: string | null;
  timestamp: string | null;
  signature: string | null;
};

const TOLERANCE_SECONDS = 5 * 60;

export function verifySvix(
  payload: string,
  headers: SvixHeaders,
  secret: string,
): boolean {
  const { id, timestamp, signature } = headers;
  if (!id || !timestamp || !signature) return false;

  // Respinge timestamp-uri prea vechi/din viitor (anti-replay).
  const ts = Number.parseInt(timestamp, 10);
  if (!Number.isFinite(ts)) return false;
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - ts) > TOLERANCE_SECONDS) return false;

  const key = Buffer.from(secret.replace(/^whsec_/, ""), "base64");
  const signedContent = `${id}.${timestamp}.${payload}`;
  const expected = createHmac("sha256", key).update(signedContent).digest("base64");
  const expectedBuf = Buffer.from(expected);

  // Header-ul poate conține mai multe semnături: „v1,sig v1,sig2".
  return signature.split(" ").some((part) => {
    const sig = part.includes(",") ? part.split(",")[1] : part;
    const sigBuf = Buffer.from(sig);
    return sigBuf.length === expectedBuf.length && timingSafeEqual(sigBuf, expectedBuf);
  });
}

type ResendEvent = {
  type: string;
  created_at?: string;
  data?: {
    email_id?: string;
    to?: string | string[];
  };
};

const STATUS_MAP: Record<string, EmailStatus> = {
  "email.sent": "sent",
  "email.delivered": "delivered",
  "email.opened": "opened",
  "email.bounced": "bounced",
  "email.complained": "complained",
  "email.failed": "failed",
};

/** Procesează un eveniment Resend: status + jurnal + supresie. */
export async function handleResendEvent(event: ResendEvent): Promise<void> {
  const admin = getAdminClientOrNull();
  if (!admin) return;

  const emailId = event.data?.email_id ?? null;
  const to = Array.isArray(event.data?.to) ? event.data?.to[0] : event.data?.to;

  let messageId: string | null = null;
  if (emailId) {
    const { data } = await admin
      .from("email_messages")
      .select("id")
      .eq("provider_id", emailId)
      .maybeSingle<{ id: string }>();
    messageId = data?.id ?? null;
  }

  const status = STATUS_MAP[event.type];
  if (status && messageId) {
    await admin.from("email_messages").update({ status }).eq("id", messageId);
  }

  await admin.from("email_events").insert({
    message_id: messageId,
    provider_id: emailId,
    event_type: event.type,
    payload: event as unknown as Json,
  });

  try {
    if (event.type === "email.bounced" && to) {
      await suppressContact(to, "bounced");
    } else if (event.type === "email.complained" && to) {
      await suppressContact(to, "complained");
    }
  } catch (err) {
    logger.error("suppress on webhook failed", errorContext(err));
  }
}

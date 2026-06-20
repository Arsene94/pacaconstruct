import "server-only";

import { Resend } from "resend";

/**
 * Client Resend singleton (server-only). Degradează grațios: `isConfigured()`
 * permite codului apelant să sară peste trimitere când cheia lipsește, fără să
 * arunce (ca pipeline-ul de notificări existent).
 */

export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY) && Boolean(fromTransactional());
}

let client: Resend | null = null;

export function getResend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("Lipsește RESEND_API_KEY pentru Resend.");
  client ??= new Resend(key);
  return client;
}

/** Adresa „from" pentru tranzacțional (cu fallback la configul vechi). */
export function fromTransactional(): string | undefined {
  return process.env.EMAIL_FROM_TRANSACTIONAL || process.env.NOTIFY_EMAIL_FROM;
}

/** Adresa „from" pentru marketing (cu fallback la tranzacțional). */
export function fromMarketing(): string | undefined {
  return (
    process.env.EMAIL_FROM_MARKETING ||
    process.env.EMAIL_FROM_TRANSACTIONAL ||
    process.env.NOTIFY_EMAIL_FROM
  );
}

export function replyToDefault(): string | undefined {
  return process.env.EMAIL_REPLY_TO || undefined;
}

/** Adresa adminului pentru notificări interne. */
export function adminTo(): string[] {
  const raw = process.env.EMAIL_ADMIN_TO || process.env.NOTIFY_EMAIL_TO || "";
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

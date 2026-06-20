import "server-only";

import { emailRegistry } from "@/emails/registry";
import type { EmailPropsMap, EmailTemplateKey } from "@/emails/types";
import { logger } from "@/app/lib/logger";
import {
  fromMarketing,
  fromTransactional,
  getResend,
  isResendConfigured,
  replyToDefault,
} from "./resend";
import { getAdminClientOrNull, resolveTemplate } from "./templates";
import { isSuppressed } from "./suppression";

/**
 * Nucleul de trimitere: randează template-ul brandat, jurnalizează în
 * `email_messages`, trimite via Resend cu `Idempotency-Key` și actualizează
 * statusul. Nu aruncă niciodată — eșecurile devin status `failed` + `error`.
 *
 * Idempotency dublă:
 *  1. constrângerea unique pe `email_messages.idempotency_key` (DB) — sărim dacă
 *     mesajul a fost deja trimis;
 *  2. header-ul `Idempotency-Key` la Resend — dedup și fără DB (degradare).
 */

export type SendEmailInput<K extends EmailTemplateKey = EmailTemplateKey> = {
  templateKey: K;
  to: string | string[];
  vars: EmailPropsMap[K];
  /** Cheie de idempotency (vezi convențiile din dispatch/intake). */
  idempotencyKey: string;
  contactId?: string | null;
  campaignId?: string | null;
  /** Pentru notificările admin: răspunsul merge la client. */
  replyTo?: string | null;
  /** Marketing: URL one-click unsubscribe (devine și header List-Unsubscribe). */
  listUnsubscribeUrl?: string | null;
};

export type SendEmailResult = {
  ok: boolean;
  skipped?: boolean;
  reason?: string;
  messageId?: string;
};

const ALREADY_SENT_STATUSES = new Set(["sent", "delivered", "opened"]);

export async function sendEmail<K extends EmailTemplateKey>(
  input: SendEmailInput<K>,
): Promise<SendEmailResult> {
  const entry = emailRegistry[input.templateKey];
  const category = entry.category;
  const isMarketing = category === "marketing";

  if (!isResendConfigured()) {
    logger.warn("email skipped — Resend neconfigurat", {
      templateKey: input.templateKey,
    });
    return { ok: false, skipped: true, reason: "not_configured" };
  }

  const recipients = Array.isArray(input.to) ? input.to : [input.to];
  if (recipients.length === 0) {
    logger.warn("email skipped — fără destinatar", {
      templateKey: input.templateKey,
    });
    return { ok: false, skipped: true, reason: "no_recipient" };
  }
  const toEmailLog = recipients.join(", ");

  // Supresie: pentru o singură adresă (tx + broadcast), verifică lista neagră.
  if (recipients.length === 1 && (await isSuppressed(recipients[0], category))) {
    logger.warn("email skipped — destinatar suprimat", {
      templateKey: input.templateKey,
    });
    return { ok: false, skipped: true, reason: "suppressed" };
  }

  const admin = getAdminClientOrNull();

  // 1. Idempotency la nivel de DB: dacă mesajul a fost deja trimis, ieșim.
  let messageId: string | undefined;
  if (admin) {
    const { data: existing } = await admin
      .from("email_messages")
      .select("id, status")
      .eq("idempotency_key", input.idempotencyKey)
      .maybeSingle<{ id: string; status: string }>();
    if (existing) {
      if (ALREADY_SENT_STATUSES.has(existing.status)) {
        return { ok: true, skipped: true, reason: "duplicate", messageId: existing.id };
      }
      messageId = existing.id;
    }
  }

  // 2. Randare (poate folosi subiect editabil din DB).
  let rendered;
  try {
    rendered = await resolveTemplate(input.templateKey, input.vars);
  } catch (err) {
    logger.error("email render failed", {
      templateKey: input.templateKey,
      error: err instanceof Error ? err.message : String(err),
    });
    return { ok: false, reason: "render_failed" };
  }

  // 3. Jurnal: inserează rândul (status queued) dacă nu există deja.
  if (admin && !messageId) {
    const { data, error } = await admin
      .from("email_messages")
      .insert({
        template_key: input.templateKey,
        to_email: toEmailLog,
        to_contact_id: input.contactId ?? null,
        campaign_id: input.campaignId ?? null,
        subject: rendered.subject,
        category,
        status: "queued",
        idempotency_key: input.idempotencyKey,
      })
      .select("id")
      .single<{ id: string }>();
    if (error) {
      // Cursă pe idempotency_key: alt proces a inserat deja — tratăm ca dublu.
      if (error.code === "23505") {
        return { ok: true, skipped: true, reason: "duplicate" };
      }
      logger.error("email log insert failed", { error: error.message });
    } else {
      messageId = data.id;
    }
  }

  // 4. Trimitere.
  const from = (isMarketing ? fromMarketing() : fromTransactional())!;
  const headers: Record<string, string> = {};
  if (isMarketing && input.listUnsubscribeUrl) {
    headers["List-Unsubscribe"] = `<${input.listUnsubscribeUrl}>`;
    headers["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click";
  }

  try {
    const res = await getResend().emails.send(
      {
        from,
        to: recipients,
        subject: rendered.subject,
        html: rendered.html,
        text: rendered.text,
        replyTo: input.replyTo ?? replyToDefault(),
        headers: Object.keys(headers).length ? headers : undefined,
      },
      { idempotencyKey: input.idempotencyKey },
    );

    if (res.error) {
      throw new Error(res.error.message);
    }

    const providerId = res.data?.id ?? null;
    if (admin && messageId) {
      await admin
        .from("email_messages")
        .update({ provider_id: providerId, status: "sent" })
        .eq("id", messageId);
    }
    return { ok: true, messageId };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logger.error("email send failed", {
      templateKey: input.templateKey,
      error: message,
    });
    if (admin && messageId) {
      await admin
        .from("email_messages")
        .update({ status: "failed", error: message.slice(0, 500) })
        .eq("id", messageId);
    }
    return { ok: false, reason: "send_failed", messageId };
  }
}

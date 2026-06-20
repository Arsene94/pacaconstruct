import "server-only";

import { appBaseUrl, getQstashOrNull } from "@/app/lib/upstash/qstash";
import { logger, errorContext } from "@/app/lib/logger";
import type { EmailTemplateKey } from "@/emails/types";
import { sendEmail, type SendEmailInput } from "./send";

const SEND_PATH = "/api/jobs/send-email";

/**
 * Generalizarea `notify.ts`: pune un email la coadă spre `/api/jobs/send-email`
 * (livrare cu retry/DLQ via QStash, fără a bloca apelantul). Dacă QStash nu e
 * configurat, trimite inline (fallback dev). Nu aruncă niciodată.
 */
export async function enqueueEmail<K extends EmailTemplateKey>(
  input: SendEmailInput<K>,
): Promise<void> {
  try {
    const qstash = getQstashOrNull();
    if (qstash) {
      await qstash.publishJSON({
        url: `${appBaseUrl()}${SEND_PATH}`,
        body: input,
        retries: 3,
      });
      return;
    }
    await sendEmail(input);
  } catch (err) {
    logger.error("enqueueEmail failed", {
      templateKey: input.templateKey,
      ...errorContext(err),
    });
  }
}

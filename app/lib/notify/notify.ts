import "server-only";

import { appBaseUrl, getQstashOrNull } from "@/app/lib/upstash/qstash";
import { sendLeadEmail, type LeadEmail } from "./email";

const NOTIFY_PATH = "/api/jobs/notify-request";

/**
 * Notifică adminul despre o cerere nouă.
 *
 * - Dacă QStash e configurat → publică un job (livrare cu retry/DLQ, fără să
 *   blocheze răspunsul către vizitator).
 * - Altfel → trimite emailul direct, în linie (fallback dev/local).
 *
 * Nu aruncă niciodată: o eroare de notificare nu trebuie să strice trimiterea
 * formularului de către client.
 */
export async function notifyNewLead(lead: LeadEmail): Promise<void> {
  try {
    const qstash = getQstashOrNull();
    if (qstash) {
      await qstash.publishJSON({
        url: `${appBaseUrl()}${NOTIFY_PATH}`,
        body: lead,
        retries: 3,
      });
      return;
    }
    await sendLeadEmail(lead);
  } catch (err) {
    console.error("[notify] Nu am putut trimite notificarea de lead:", err);
  }
}

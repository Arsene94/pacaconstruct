import "server-only";

import {
  appBaseUrl,
  getWorkflowClient,
  isQstashConfigured,
} from "@/app/lib/upstash/qstash";
import { reserveOnce } from "@/app/lib/upstash/redis";
import { generateArticleForTopic } from "./generate";

export type GenerateArticlePayload = {
  topicId: string;
  scheduleId?: string;
};

const WORKFLOW_PATH = "/api/workflow/generate-article";
/** Cât timp un topic e „blocat" după ce a fost pus în coadă (anti-dublură). */
const LOCK_TTL_SECONDS = 60 * 30;

/**
 * Pune în coadă generarea unui articol.
 *
 * - Dacă QStash e configurat → declanșează workflow-ul durabil (research →
 *   write → image → publish, fiecare pas cu retry independent). Întoarce imediat.
 * - Altfel (dev/local fără Upstash) → rulează sincron, ca să nu blochezi fluxul.
 *
 * Idempotent: o cheie Redis cu TTL împiedică re-trimiterea aceluiași topic în
 * fereastra de blocare (ex. două rulări de cron suprapuse).
 */
export async function enqueueArticleGeneration(
  payload: GenerateArticlePayload,
): Promise<{ queued: boolean }> {
  if (!isQstashConfigured()) {
    await generateArticleForTopic(payload.topicId, {
      scheduleId: payload.scheduleId,
    });
    return { queued: false };
  }

  const fresh = await reserveOnce(`genlock:${payload.topicId}`, LOCK_TTL_SECONDS);
  if (!fresh) {
    return { queued: false };
  }

  await getWorkflowClient().trigger({
    url: `${appBaseUrl()}${WORKFLOW_PATH}`,
    body: payload,
    retries: 2,
  });
  return { queued: true };
}

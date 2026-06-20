import { serve } from "@upstash/workflow/nextjs";
import {
  BROADCAST_CHUNK,
  finalizeBroadcast,
  getBroadcastPlan,
  sendBroadcastChunk,
} from "@/app/lib/email/broadcast";

/**
 * Broadcast durabil (Upstash Workflow). Rezolvă audiența o singură dată, apoi
 * trimite în chunk-uri de ≤100, fiecare cu checkpoint propriu: la retry reia
 * doar chunk-ul picat, iar idempotency (`campaign:{id}:{contactId}`) garantează
 * zero dubluri. Actualizează `sent_count` + `status` la final.
 *
 * Semnătura QStash e verificată automat de `serve`.
 */
export const maxDuration = 300;

type BroadcastPayload = { campaignId: string };

export const { POST } = serve<BroadcastPayload>(
  async (context) => {
    const { campaignId } = context.requestPayload;

    const plan = await context.run("plan", () => getBroadcastPlan(campaignId));
    if (!plan) {
      await context.run("finalize-empty", () =>
        finalizeBroadcast(campaignId, 0, "failed"),
      );
      return { sent: 0 };
    }

    const chunks: (typeof plan.targets)[] = [];
    for (let i = 0; i < plan.targets.length; i += BROADCAST_CHUNK) {
      chunks.push(plan.targets.slice(i, i + BROADCAST_CHUNK));
    }

    let sent = 0;
    for (let i = 0; i < chunks.length; i++) {
      sent += await context.run(`send-chunk-${i}`, () =>
        sendBroadcastChunk(campaignId, plan.templateKey, plan.payload, chunks[i]),
      );
    }

    await context.run("finalize", () => finalizeBroadcast(campaignId, sent, "sent"));
    return { sent };
  },
  {
    failureFunction: async ({ context }) => {
      const { campaignId } = context.requestPayload;
      await finalizeBroadcast(campaignId, 0, "failed");
    },
  },
);

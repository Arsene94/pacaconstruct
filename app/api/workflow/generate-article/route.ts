import { serve } from "@upstash/workflow/nextjs";
import type { GenerateArticlePayload } from "@/app/lib/ai/enqueue";
import {
  generateAndUploadImage,
  loadTopic,
  markTopicFailed,
  publishArticle,
  researchTopic,
  writeArticle,
} from "@/app/lib/ai/generate";

/**
 * Pipeline durabil de generare a unui articol, ca workflow Upstash. Fiecare
 * `context.run(...)` e un pas separat, cu checkpoint: la un eșec tranzitoriu se
 * reia DOAR pasul picat, fără a relua research-ul/scrierea deja făcute, și fără
 * limita de 300s pe o singură execuție.
 *
 * Verificarea semnăturii QStash e automată (din QSTASH_CURRENT/NEXT_SIGNING_KEY).
 * Declanșat de `enqueueArticleGeneration` (cron dispecer + triggere admin).
 */
export const maxDuration = 300;

export const { POST } = serve<GenerateArticlePayload>(
  async (context) => {
    const { topicId, scheduleId } = context.requestPayload;

    const topic = await context.run("load-topic", () => loadTopic(topicId));

    const research = await context.run("research", () => researchTopic(topic));

    const article = await context.run("write", () =>
      writeArticle(topic, research.brief),
    );

    const imageSrc = await context.run("image", () =>
      generateAndUploadImage(article.imagePrompt, article.slug),
    );

    const result = await context.run("publish", () =>
      publishArticle({
        topic,
        article,
        imageSrc,
        sources: research.sources,
        scheduleId,
      }),
    );

    return result;
  },
  {
    // Rulează o singură dată, după ce retry-urile QStash s-au epuizat.
    failureFunction: async ({ context, failResponse }) => {
      const { topicId, scheduleId } = context.requestPayload;
      await markTopicFailed(
        topicId,
        failResponse || "Workflow eșuat după epuizarea retry-urilor.",
        scheduleId,
      );
    },
  },
);

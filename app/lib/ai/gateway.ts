import "server-only";

/**
 * Acces centralizat la Vercel AI Gateway prin pachetul `ai`.
 *
 * Modelele se referă prin string-uri `provider/model`. Pachetul `ai` citește
 * automat cheia din `AI_GATEWAY_API_KEY`, deci nu o pasăm explicit.
 *
 * Alegerea modelelor (analiză a prețurilor din lista live
 * https://ai-gateway.vercel.sh/v1/models, iunie 2026):
 *  • Generare articol — `claude-sonnet-4.6` ($3/$15 per 1M tokeni): cel mai bun
 *    scriitor long-form din zona de cost MEDIU, la ~40% din prețul Opus 4.8
 *    ($5/$25) și jumătate față de GPT-5.5 ($5/$30). Urmărește bine regulile de
 *    stil/umanizare, fără să intre în tariful premium.
 *  • Analiză topice + documentare — `claude-sonnet-4.6`: același model, potrivit
 *    pentru raționament, extragere structurată și web search.
 *  • Imagine — `imagen-4.0-generate-001`: fotorealism bun la cost echilibrat
 *    (varianta `-ultra-generate-001` există dacă se dorește calitate maximă).
 */

/** Generarea articolului (cel mai bun scriitor din zona de cost mediu). */
export const ARTICLE_MODEL = "anthropic/claude-sonnet-4.6";

/** Analiza topicelor (raționament + output structurat). */
export const ANALYSIS_MODEL = "anthropic/claude-sonnet-4.6";

/** Documentarea cu web search (tool use). */
export const RESEARCH_MODEL = "anthropic/claude-sonnet-4.6";

/** Imaginea tematică a articolului. */
export const IMAGE_MODEL = "google/imagen-4.0-generate-001";

/** Aruncă devreme, cu mesaj clar, dacă lipsește cheia gateway-ului. */
export function assertGatewayConfigured() {
  if (!process.env.AI_GATEWAY_API_KEY) {
    throw new Error(
      "Lipsește AI_GATEWAY_API_KEY. Adaugă cheia Vercel AI Gateway în .env.local.",
    );
  }
}

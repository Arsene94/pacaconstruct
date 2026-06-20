import "server-only";

import { generateObject } from "ai";
import { z } from "zod";
import { createAdminClient } from "@/app/lib/supabase/admin";
import { ANALYSIS_MODEL, assertGatewayConfigured } from "./gateway";

/** Schema unui topic propus de model. */
const TopicSchema = z.object({
  title: z.string().describe("Titlu de articol clar, în română, fără ghilimele."),
  angle: z
    .string()
    .describe("Unghiul/abordarea concretă a articolului, 1-2 propoziții."),
  category: z
    .string()
    .describe("O categorie scurtă (ex. Excavări, Terasamente, Închiriere, Costuri)."),
  rationale: z
    .string()
    .describe("De ce e relevant pentru clienții potențiali (pe baza semnalelor)."),
  signals: z
    .array(z.string())
    .describe("Întrebările/cererile reale care au inspirat topicul."),
  score: z
    .number()
    .int()
    .min(0)
    .max(100)
    .describe("Prioritate 0-100 după cât de des/important pare subiectul."),
});

const TopicsSchema = z.object({ topics: z.array(TopicSchema).max(12) });

export type AnalyzedTopic = z.infer<typeof TopicSchema>;

/** Adună întrebări și cereri reale din DB pentru a alimenta analiza. */
async function gatherSignals() {
  const supabase = createAdminClient();
  const [faq, services, rentals] = await Promise.all([
    supabase.from("faq_items").select("question").limit(200),
    supabase
      .from("service_requests")
      .select("service, description")
      .order("created_at", { ascending: false })
      .limit(200),
    supabase
      .from("rental_requests")
      .select("machine, message")
      .order("created_at", { ascending: false })
      .limit(200),
  ]);

  const questions = (faq.data ?? []).map((r) => r.question).filter(Boolean);
  const serviceMsgs = (services.data ?? [])
    .map((r) => [r.service, r.description].filter(Boolean).join(" — "))
    .filter(Boolean);
  const rentalMsgs = (rentals.data ?? [])
    .map((r) => [r.machine, r.message].filter(Boolean).join(" — "))
    .filter(Boolean);

  return { questions, serviceMsgs, rentalMsgs };
}

/**
 * Analizează semnalele reale și produce o listă de topice. Returnează topicele
 * (nu le salvează aici — salvarea o face server action-ul, ca să poată raporta
 * câte au fost adăugate).
 */
export async function analyzeTopics(): Promise<AnalyzedTopic[]> {
  assertGatewayConfigured();
  const { questions, serviceMsgs, rentalMsgs } = await gatherSignals();

  const context = [
    "Întrebări frecvente (FAQ):",
    ...questions.map((q) => `- ${q}`),
    "",
    "Cereri de servicii (serviciu — descriere):",
    ...serviceMsgs.map((m) => `- ${m}`),
    "",
    "Cereri de închiriere utilaje (utilaj — mesaj):",
    ...rentalMsgs.map((m) => `- ${m}`),
  ].join("\n");

  const { object } = await generateObject({
    model: ANALYSIS_MODEL,
    schema: TopicsSchema,
    system:
      "Ești strateg de conținut pentru o firmă de construcții, terasamente, excavări și închiriere de utilaje din România. Pe baza întrebărilor și cererilor reale ale clienților, propui topice de blog utile, concrete, care răspund nevoilor lor. Eviți subiectele generice și duplicatele. Scrii în română.",
    prompt: `Din semnalele de mai jos, propune între 5 și 10 topice de blog distincte și relevante pentru clienții potențiali. Prioritizează subiectele care apar des sau care arată nelămuriri reale (costuri, alegerea utilajului, etape tehnice, avize, drenaj etc.).\n\n${context}`,
  });

  return object.topics;
}

import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { sendLeadEmail, type LeadEmail } from "@/app/lib/notify/email";

/**
 * Worker QStash: trimite emailul de notificare pentru o cerere nouă. Decuplat
 * de formular — dacă livrarea email-ului eșuează, QStash reîncearcă, fără să
 * afecteze vizitatorul.
 *
 * Verificarea semnăturii (QSTASH_CURRENT/NEXT_SIGNING_KEY) se construiește
 * LENEȘ, per-request: altfel `verifySignatureAppRouter` ar arunca la build când
 * cheile lipsesc (ex. în CI fără secrete).
 */
export const dynamic = "force-dynamic";

async function handler(request: Request): Promise<Response> {
  const lead = (await request.json()) as LeadEmail;
  await sendLeadEmail(lead);
  return Response.json({ ok: true });
}

export async function POST(request: Request): Promise<Response> {
  if (
    !process.env.QSTASH_CURRENT_SIGNING_KEY ||
    !process.env.QSTASH_NEXT_SIGNING_KEY
  ) {
    return Response.json(
      { error: "QStash signing keys neconfigurate." },
      { status: 503 },
    );
  }
  const verified = verifySignatureAppRouter(handler);
  return verified(request);
}

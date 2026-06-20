import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { sendEmail, type SendEmailInput } from "@/app/lib/email/send";
import type { EmailTemplateKey } from "@/emails/types";

/**
 * Worker QStash: trimite un email pus la coadă de `enqueueEmail`. Decuplat de
 * apelant — dacă livrarea eșuează, QStash reîncearcă, iar idempotency previne
 * dublurile.
 *
 * Verificarea semnăturii se construiește LENEȘ, per-request (ca la
 * notify-request): altfel `verifySignatureAppRouter` ar arunca la build când
 * cheile lipsesc (CI fără secrete).
 */
export const dynamic = "force-dynamic";

async function handler(request: Request): Promise<Response> {
  const input = (await request.json()) as SendEmailInput<EmailTemplateKey>;
  const result = await sendEmail(input);
  return Response.json({ ok: result.ok, skipped: result.skipped ?? false });
}

export async function POST(request: Request): Promise<Response> {
  if (!process.env.QSTASH_CURRENT_SIGNING_KEY || !process.env.QSTASH_NEXT_SIGNING_KEY) {
    return Response.json(
      { error: "QStash signing keys neconfigurate." },
      { status: 503 },
    );
  }
  const verified = verifySignatureAppRouter(handler);
  return verified(request);
}

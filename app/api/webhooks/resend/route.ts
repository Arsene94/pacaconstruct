import { logger } from "@/app/lib/logger";
import { handleResendEvent, verifySvix } from "@/app/lib/email/webhook";

/**
 * Webhook Resend (semnat Svix). Verifică semnătura cu RESEND_WEBHOOK_SECRET,
 * apoi actualizează statusul mesajului + scrie evenimentul + supresie la
 * bounce/complaint. Răspunde 2xx rapid ca Resend să nu reîncerce inutil.
 */
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) {
    return Response.json(
      { error: "RESEND_WEBHOOK_SECRET neconfigurat." },
      { status: 503 },
    );
  }

  const payload = await request.text();
  const ok = verifySvix(
    payload,
    {
      id: request.headers.get("svix-id"),
      timestamp: request.headers.get("svix-timestamp"),
      signature: request.headers.get("svix-signature"),
    },
    secret,
  );

  if (!ok) {
    logger.warn("resend webhook: semnătură invalidă");
    return Response.json({ error: "Semnătură invalidă." }, { status: 401 });
  }

  try {
    const event = JSON.parse(payload) as { type: string };
    await handleResendEvent(event);
  } catch (err) {
    logger.error("resend webhook handler failed", {
      error: err instanceof Error ? err.message : String(err),
    });
    // 200 ca să nu reîncerce la o eroare de procesare ne-tranzitorie.
  }

  return Response.json({ ok: true });
}

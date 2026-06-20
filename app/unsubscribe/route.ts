import { verifyToken } from "@/app/lib/email/unsubscribe";
import { getAdminClientOrNull } from "@/app/lib/email/templates";
import { logger } from "@/app/lib/logger";

/**
 * Dezabonare one-click (RFC 8058). Tokenul HMAC din URL autentifică acțiunea —
 * nu RLS — așa că folosim service_role. GET = linkul din footer (pagină de
 * confirmare); POST = List-Unsubscribe-Post din Gmail/Yahoo.
 */
export const dynamic = "force-dynamic";

async function unsubscribe(token: string): Promise<boolean> {
  const contactId = verifyToken(token);
  if (!contactId) return false;
  const admin = getAdminClientOrNull();
  if (!admin) return false;
  const { error } = await admin
    .from("contacts")
    .update({
      status: "unsubscribed",
      unsubscribed_at: new Date().toISOString(),
      marketing_consent: false,
    })
    .eq("id", contactId);
  if (error) {
    logger.error("unsubscribe failed", { error: error.message });
    return false;
  }
  return true;
}

function page(ok: boolean): string {
  const title = ok ? "Te-ai dezabonat" : "Link invalid";
  const body = ok
    ? "Nu vei mai primi emailuri de marketing de la PACA CONSTRUCT. Emailurile legate de cererile tale (confirmări, status) vor continua să fie trimise."
    : "Linkul de dezabonare este invalid sau a expirat. Scrie-ne la office@pacaconstruct.ro și te scoatem manual din listă.";
  return `<!doctype html><html lang="ro"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title></head>
<body style="margin:0;background:#fbf9f3;font-family:Arial,Helvetica,sans-serif;color:#1b1c18">
  <div style="max-width:520px;margin:48px auto;background:#fff;border:1px solid #e6e1d7">
    <div style="background:#1e2a20;padding:24px;text-align:center"><span style="color:#fff;font-size:22px;font-weight:bold;letter-spacing:1px">PACA CONSTRUCT</span></div>
    <div style="padding:32px 24px">
      <h1 style="font-size:20px;margin:0 0 12px">${title}</h1>
      <p style="font-size:15px;line-height:23px;color:#434843;margin:0">${body}</p>
    </div>
    <div style="background:#1e2a20;padding:16px;text-align:center;color:#849284;font-size:12px">© PACA CONSTRUCT SRL</div>
  </div>
</body></html>`;
}

export async function GET(request: Request): Promise<Response> {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  const ok = await unsubscribe(token);
  return new Response(page(ok), {
    status: ok ? 200 : 400,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

export async function POST(request: Request): Promise<Response> {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  const ok = await unsubscribe(token);
  return Response.json({ ok }, { status: ok ? 200 : 400 });
}

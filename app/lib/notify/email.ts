import "server-only";

import { Resend } from "resend";

/**
 * Trimitere email pentru notificarea adminului la cereri noi (lead-uri).
 * Degradează la no-op + log dacă `RESEND_API_KEY` / adresele lipsesc, ca să nu
 * pice fluxul în dev sau înainte de configurare.
 */

export type LeadEmail = {
  type: "serviciu" | "inchiriere";
  name: string;
  phone: string;
  email?: string | null;
  details: Record<string, string | null | undefined>;
};

function isConfigured(): boolean {
  return Boolean(
    process.env.RESEND_API_KEY &&
      process.env.NOTIFY_EMAIL_FROM &&
      process.env.NOTIFY_EMAIL_TO,
  );
}

let resend: Resend | null = null;

export async function sendLeadEmail(lead: LeadEmail): Promise<void> {
  if (!isConfigured()) {
    console.warn(
      `[notify] Resend neconfigurat — sar peste emailul pentru cererea „${lead.type}" de la ${lead.name}.`,
    );
    return;
  }

  resend ??= new Resend(process.env.RESEND_API_KEY!);

  const subject =
    lead.type === "serviciu"
      ? `Cerere nouă de serviciu — ${lead.name}`
      : `Cerere nouă de închiriere — ${lead.name}`;

  const rows = Object.entries(lead.details)
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td><b>${escapeHtml(k)}</b></td><td>${escapeHtml(String(v))}</td></tr>`)
    .join("");

  const html = `
    <h2>${escapeHtml(subject)}</h2>
    <table cellpadding="6" style="border-collapse:collapse">
      <tr><td><b>Nume</b></td><td>${escapeHtml(lead.name)}</td></tr>
      <tr><td><b>Telefon</b></td><td>${escapeHtml(lead.phone)}</td></tr>
      ${lead.email ? `<tr><td><b>Email</b></td><td>${escapeHtml(lead.email)}</td></tr>` : ""}
      ${rows}
    </table>`;

  await resend.emails.send({
    from: process.env.NOTIFY_EMAIL_FROM!,
    to: process.env.NOTIFY_EMAIL_TO!.split(",").map((s) => s.trim()),
    replyTo: lead.email ?? undefined,
    subject,
    html,
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

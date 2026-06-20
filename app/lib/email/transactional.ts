import "server-only";

import { appBaseUrl } from "@/app/lib/upstash/qstash";
import { logger, errorContext } from "@/app/lib/logger";
import type { RequestStatus } from "@/app/data/requests";
import type { EmailTemplateKey } from "@/emails/types";
import { enqueueEmail } from "./dispatch";
import { adminTo } from "./resend";
import { getAdminClientOrNull } from "./templates";

/**
 * Email-uri tranzacționale legate de cereri: confirmări client + notificări
 * admin la intake și pe ciclul de viață (schimbarea statusului). Plus
 * auto-capture al contactului. Totul best-effort — nu aruncă în calea
 * vizitatorului/adminului.
 */

function adminUrl(path: string): string {
  return `${appBaseUrl()}${path}`;
}

// ─── Intake ──────────────────────────────────────────────────────────────────

export type ServiceLead = {
  kind: "serviciu";
  requestId: string;
  code: string;
  name: string;
  phone: string;
  email?: string | null;
  service?: string | null;
  location?: string | null;
  surface?: string | null;
  description?: string | null;
};

export type RentalLead = {
  kind: "inchiriere";
  requestId: string;
  code: string;
  name: string;
  phone: string;
  email?: string | null;
  machine: string;
  period?: string | null;
  location?: string | null;
  message?: string | null;
};

export type IntakeLead = ServiceLead | RentalLead;

/**
 * Trimite emailul de notificare admin (mereu) + confirmarea către client (doar
 * dacă există email). Idempotent pe requestId.
 */
export async function dispatchIntakeEmails(lead: IntakeLead): Promise<void> {
  if (lead.kind === "serviciu") {
    await enqueueEmail({
      templateKey: "service_request_admin",
      to: adminTo(),
      vars: {
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
        service: lead.service,
        location: lead.location,
        surface: lead.surface,
        description: lead.description,
        adminUrl: adminUrl("/admin/cereri-servicii"),
      },
      idempotencyKey: `service_request_admin:${lead.requestId}`,
      replyTo: lead.email ?? undefined,
    });
    if (lead.email) {
      await enqueueEmail({
        templateKey: "service_request_user",
        to: lead.email,
        vars: {
          name: lead.name,
          code: lead.code,
          service: lead.service,
          location: lead.location,
          surface: lead.surface,
        },
        idempotencyKey: `service_request_user:${lead.requestId}`,
      });
    }
    return;
  }

  await enqueueEmail({
    templateKey: "rental_request_admin",
    to: adminTo(),
    vars: {
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      machine: lead.machine,
      period: lead.period,
      location: lead.location,
      message: lead.message,
      adminUrl: adminUrl("/admin/cereri-inchiriere"),
    },
    idempotencyKey: `rental_request_admin:${lead.requestId}`,
    replyTo: lead.email ?? undefined,
  });
  if (lead.email) {
    await enqueueEmail({
      templateKey: "rental_request_user",
      to: lead.email,
      vars: {
        name: lead.name,
        code: lead.code,
        machine: lead.machine,
        period: lead.period,
        accessReq: lead.message,
      },
      idempotencyKey: `rental_request_user:${lead.requestId}`,
    });
  }
}

// ─── Ciclu de viață (schimbarea statusului) ─────────────────────────────────

const STATUS_TO_TEMPLATE: Partial<Record<RequestStatus, EmailTemplateKey>> = {
  "În evaluare": "request_in_review",
  Ofertat: "request_quoted",
  Confirmat: "request_confirmed",
  Închisă: "request_closed",
};

export type LifecycleInput = {
  requestId: string;
  code: string;
  name: string;
  email: string;
  status: RequestStatus;
  /** Context opțional (link ofertă, programare, link recenzie). */
  offerUrl?: string | null;
  scheduleInfo?: string | null;
  reviewUrl?: string | null;
};

/** Trimite emailul corespunzător noului status (dacă există un template). */
export async function dispatchLifecycleEmail(input: LifecycleInput): Promise<void> {
  const templateKey = STATUS_TO_TEMPLATE[input.status];
  if (!templateKey) return; // „Nouă" sau status fără email
  if (!input.email) return;

  const idempotencyKey = `status:${input.status}:${input.requestId}`;
  const base = { name: input.name, code: input.code };

  switch (templateKey) {
    case "request_in_review":
      await enqueueEmail({
        templateKey,
        to: input.email,
        vars: base,
        idempotencyKey,
      });
      return;
    case "request_quoted":
      await enqueueEmail({
        templateKey,
        to: input.email,
        vars: { ...base, offerUrl: input.offerUrl },
        idempotencyKey,
      });
      return;
    case "request_confirmed":
      await enqueueEmail({
        templateKey,
        to: input.email,
        vars: { ...base, scheduleInfo: input.scheduleInfo },
        idempotencyKey,
      });
      return;
    case "request_closed":
      await enqueueEmail({
        templateKey,
        to: input.email,
        vars: { ...base, reviewUrl: input.reviewUrl },
        idempotencyKey,
      });
      return;
  }
}

// ─── Auto-capture contact ────────────────────────────────────────────────────

export type CaptureContactInput = {
  email: string;
  name?: string | null;
  phone?: string | null;
  source: "service_request" | "rental_request" | "manual" | "import";
  marketingConsent: boolean;
};

/**
 * Inserează sau actualizează un contact din formular. Folosește service_role
 * (RLS permite oricum doar INSERT public, dar avem nevoie și de read/update).
 * Nu retrogradează un consimțământ deja acordat; nu suprascrie nume/telefon.
 */
export async function captureContact(input: CaptureContactInput): Promise<void> {
  const admin = getAdminClientOrNull();
  if (!admin) return;
  const email = input.email.toLowerCase();
  try {
    const { data: existing } = await admin
      .from("contacts")
      .select("id, name, phone, marketing_consent, consent_at")
      .eq("email", email)
      .maybeSingle<{
        id: string;
        name: string | null;
        phone: string | null;
        marketing_consent: boolean;
        consent_at: string | null;
      }>();

    if (!existing) {
      await admin.from("contacts").insert({
        email,
        name: input.name ?? null,
        phone: input.phone ?? null,
        source: input.source,
        marketing_consent: input.marketingConsent,
        consent_at: input.marketingConsent ? new Date().toISOString() : null,
      });
      return;
    }

    // Actualizare conservatoare: completează golurile, acordă consimțământ nou.
    const update: {
      name?: string;
      phone?: string;
      marketing_consent?: boolean;
      consent_at?: string;
    } = {};
    if (!existing.name && input.name) update.name = input.name;
    if (!existing.phone && input.phone) update.phone = input.phone;
    if (input.marketingConsent && !existing.marketing_consent) {
      update.marketing_consent = true;
      update.consent_at = new Date().toISOString();
    }
    if (Object.keys(update).length > 0) {
      await admin.from("contacts").update(update).eq("id", existing.id);
    }
  } catch (err) {
    logger.error("captureContact failed", errorContext(err));
  }
}

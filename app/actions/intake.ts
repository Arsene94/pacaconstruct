"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/app/lib/supabase/server";
import { checkRateLimit, clientIp, intakeLimiter } from "@/app/lib/upstash/ratelimit";
import {
  firstIssueMessage,
  readRentalRequest,
  readServiceRequest,
  rentalRequestSchema,
  serviceRequestSchema,
} from "@/app/lib/validation";
import { logger, errorContext } from "@/app/lib/logger";
import { getAdminClientOrNull } from "@/app/lib/email/templates";
import { captureContact, dispatchIntakeEmails } from "@/app/lib/email/transactional";

const RATE_LIMIT_MESSAGE =
  "Ai trimis prea multe solicitări. Te rugăm să reîncerci peste câteva minute.";

/**
 * Acțiuni publice de intake (formulare de pe site). NU necesită autentificare.
 *
 * Inserarea folosește clientul `service_role` (validată + rate-limited) ca să
 * putem citi înapoi `id` + `code` generate de trigger — necesare pentru emailul
 * de confirmare brandat și pentru cheia de idempotency. Dacă service_role
 * lipsește, cădem pe clientul cookie (RLS, insert public) fără emailuri —
 * degradare grațioasă, ca înainte de sistemul de email.
 */

export type IntakeState = { ok: true } | { ok: false; error: string } | undefined;

const INSERT_ERROR = "Nu am putut trimite solicitarea. Încearcă din nou.";

/** Cerere de evaluare/serviciu din formularul de contact. */
export async function submitServiceRequest(
  _prev: IntakeState,
  form: FormData,
): Promise<IntakeState> {
  const parsed = serviceRequestSchema.safeParse(readServiceRequest(form));
  if (!parsed.success) {
    return { ok: false, error: firstIssueMessage(parsed.error) };
  }
  const {
    name,
    phone,
    email,
    service,
    location,
    surface,
    description,
    marketingConsent,
  } = parsed.data;

  const ip = await clientIp();
  const { ok: allowed } = await checkRateLimit(intakeLimiter, `service:${ip}`);
  if (!allowed) {
    return { ok: false, error: RATE_LIMIT_MESSAGE };
  }

  const row = {
    name,
    phone,
    email: email ?? null,
    location: location ?? null,
    surface: surface ?? null,
    description: description ?? null,
    service: service ?? null,
    channel: "Formular" as const,
  };

  const admin = getAdminClientOrNull();
  let created: { id: string; code: string } | null = null;
  if (admin) {
    const { data, error } = await admin
      .from("service_requests")
      .insert(row)
      .select("id, code")
      .single<{ id: string; code: string }>();
    if (error) {
      logger.error("service_request insert failed", {
        form: "service",
        ...errorContext(error),
      });
      return { ok: false, error: INSERT_ERROR };
    }
    created = data;
  } else {
    const supabase = await createClient();
    const { error } = await supabase.from("service_requests").insert(row);
    if (error) {
      logger.error("service_request insert failed", {
        form: "service",
        ...errorContext(error),
      });
      return { ok: false, error: INSERT_ERROR };
    }
  }

  // Best-effort: notificare admin + confirmare client + capturare contact.
  if (created) {
    await dispatchIntakeEmails({
      kind: "serviciu",
      requestId: created.id,
      code: created.code,
      name,
      phone,
      email,
      service,
      location,
      surface,
      description,
    });
  }
  if (email) {
    await captureContact({
      email,
      name,
      phone,
      source: "service_request",
      marketingConsent,
    });
  }

  revalidatePath("/admin/cereri-servicii");
  return { ok: true };
}

/** Cerere de închiriere utilaj din pagina de produs. */
export async function submitRentalRequest(
  _prev: IntakeState,
  form: FormData,
): Promise<IntakeState> {
  const parsed = rentalRequestSchema.safeParse(readRentalRequest(form));
  if (!parsed.success) {
    return { ok: false, error: firstIssueMessage(parsed.error) };
  }
  const { name, phone, email, machine, period, location, message, marketingConsent } =
    parsed.data;

  const ip = await clientIp();
  const { ok: allowed } = await checkRateLimit(intakeLimiter, `rental:${ip}`);
  if (!allowed) {
    return { ok: false, error: RATE_LIMIT_MESSAGE };
  }

  const row = {
    name,
    phone,
    email: email ?? null,
    machine: machine || "—",
    period: period ?? null,
    location: location ?? null,
    message: message ?? null,
  };

  const admin = getAdminClientOrNull();
  let created: { id: string; code: string } | null = null;
  if (admin) {
    const { data, error } = await admin
      .from("rental_requests")
      .insert(row)
      .select("id, code")
      .single<{ id: string; code: string }>();
    if (error) {
      logger.error("rental_request insert failed", {
        form: "rental",
        ...errorContext(error),
      });
      return { ok: false, error: INSERT_ERROR };
    }
    created = data;
  } else {
    const supabase = await createClient();
    const { error } = await supabase.from("rental_requests").insert(row);
    if (error) {
      logger.error("rental_request insert failed", {
        form: "rental",
        ...errorContext(error),
      });
      return { ok: false, error: INSERT_ERROR };
    }
  }

  if (created) {
    await dispatchIntakeEmails({
      kind: "inchiriere",
      requestId: created.id,
      code: created.code,
      name,
      phone,
      email,
      machine: row.machine,
      period,
      location,
      message,
    });
  }
  if (email) {
    await captureContact({
      email,
      name,
      phone,
      source: "rental_request",
      marketingConsent,
    });
  }

  revalidatePath("/admin/cereri-inchiriere");
  return { ok: true };
}

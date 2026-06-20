"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/app/lib/supabase/server";
import {
  checkRateLimit,
  clientIp,
  intakeLimiter,
} from "@/app/lib/upstash/ratelimit";
import { notifyNewLead } from "@/app/lib/notify/notify";

const RATE_LIMIT_MESSAGE =
  "Ai trimis prea multe solicitări. Te rugăm să reîncerci peste câteva minute.";

/**
 * Acțiuni publice de intake (formulare de pe site). NU necesită autentificare —
 * inserarea în tabelele de cereri este permisă tuturor de politicile RLS, dar
 * citirea/administrarea rămân doar pentru admini.
 *
 * IMPORTANT: inserarea se face fără `.select()` (return=minimal), pentru că un
 * vizitator anonim nu are drept de citire pe rândul creat (RLS).
 */

export type IntakeState =
  | { ok: true }
  | { ok: false; error: string }
  | undefined;

function value(form: FormData, key: string): string {
  return String(form.get(key) ?? "").trim();
}

/** Cerere de evaluare/serviciu din formularul de contact. */
export async function submitServiceRequest(
  _prev: IntakeState,
  form: FormData,
): Promise<IntakeState> {
  const name = value(form, "name");
  const phone = value(form, "phone");

  if (!name || !phone) {
    return { ok: false, error: "Completează numele și numărul de telefon." };
  }

  const ip = await clientIp();
  const { ok: allowed } = await checkRateLimit(intakeLimiter, `service:${ip}`);
  if (!allowed) {
    return { ok: false, error: RATE_LIMIT_MESSAGE };
  }

  const location = value(form, "location");
  const surface = value(form, "surface");
  const description = value(form, "description");
  const service = value(form, "service");

  const supabase = await createClient();
  const { error } = await supabase.from("service_requests").insert({
    name,
    phone,
    location: location || null,
    surface: surface || null,
    description: description || null,
    service: service || null,
    channel: "Formular",
  });

  if (error) {
    return {
      ok: false,
      error: "Nu am putut trimite solicitarea. Încearcă din nou.",
    };
  }

  await notifyNewLead({
    type: "serviciu",
    name,
    phone,
    details: { Serviciu: service, Locație: location, Suprafață: surface, Detalii: description },
  });

  revalidatePath("/admin/cereri-servicii");
  return { ok: true };
}

/** Cerere de închiriere utilaj din pagina de produs. */
export async function submitRentalRequest(
  _prev: IntakeState,
  form: FormData,
): Promise<IntakeState> {
  const name = value(form, "name");
  const phone = value(form, "phone");
  const machine = value(form, "machine");

  if (!name || !phone) {
    return { ok: false, error: "Completează numele și numărul de telefon." };
  }

  const ip = await clientIp();
  const { ok: allowed } = await checkRateLimit(intakeLimiter, `rental:${ip}`);
  if (!allowed) {
    return { ok: false, error: RATE_LIMIT_MESSAGE };
  }

  const email = value(form, "email");
  const period = value(form, "period");
  const location = value(form, "location");
  const message = value(form, "message");

  const supabase = await createClient();
  const { error } = await supabase.from("rental_requests").insert({
    name,
    phone,
    email: email || null,
    machine: machine || "—",
    period: period || null,
    location: location || null,
    message: message || null,
  });

  if (error) {
    return {
      ok: false,
      error: "Nu am putut trimite solicitarea. Încearcă din nou.",
    };
  }

  await notifyNewLead({
    type: "inchiriere",
    name,
    phone,
    email: email || null,
    details: { Utilaj: machine, Perioadă: period, Locație: location, Mesaj: message },
  });

  revalidatePath("/admin/cereri-inchiriere");
  return { ok: true };
}

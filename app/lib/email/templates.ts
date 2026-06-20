import "server-only";

import { createAdminClient } from "@/app/lib/supabase/admin";
import { renderEmail, type RenderedEmail } from "@/emails/render";
import type { EmailPropsMap, EmailTemplateKey } from "@/emails/types";

/**
 * Rezolvă un template pentru trimitere: structura/variabilele provin din
 * `emails/registry.ts` (cod), iar conținutul editabil (subiect override) din
 * tabelul `email_templates` (DB). Variabilele `{{...}}` din subiectul DB sunt
 * interpolate din props și curățate de CR/LF (anti header-injection).
 *
 * Citirea din DB folosește clientul `service_role` (ocolește RLS): trimiterea
 * rulează în worker/intake, fără sesiune de admin.
 */

/** Întoarce un client admin sau null dacă service_role nu e configurat. */
export function getAdminClientOrNull() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }
  return createAdminClient();
}

/** Înlocuiește `{{cheie}}` cu valoarea din `vars` (string, fără CR/LF). */
export function interpolate(template: string, vars: Record<string, unknown>): string {
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key: string) => {
    const value = vars[key];
    if (value === null || value === undefined) return "";
    return String(value)
      .replace(/[\r\n]+/g, " ")
      .trim();
  });
}

/** Subiectul editabil (DB) pentru un key, sau null dacă lipsește/inactiv. */
async function dbSubject(key: EmailTemplateKey): Promise<string | null> {
  const admin = getAdminClientOrNull();
  if (!admin) return null;
  const { data, error } = await admin
    .from("email_templates")
    .select("subject, is_active")
    .eq("key", key)
    .maybeSingle<{ subject: string; is_active: boolean }>();
  if (error || !data || !data.is_active) return null;
  return data.subject;
}

export async function resolveTemplate<K extends EmailTemplateKey>(
  key: K,
  props: EmailPropsMap[K],
): Promise<RenderedEmail> {
  const raw = await dbSubject(key);
  const subject = raw ? interpolate(raw, props as Record<string, unknown>) : undefined;
  return renderEmail(key, props, { subject });
}

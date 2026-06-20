import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

/**
 * Client Supabase cu cheia `service_role`. Ocolește RLS, deci se folosește
 * EXCLUSIV în cod server fără sesiune de utilizator (generarea AI și ruta de
 * cron), niciodată în răspunsuri către browser.
 *
 * Pentru codul care rulează în contextul unui admin autentificat folosește în
 * continuare `createClient` din `./server` (respectă RLS prin cookie-uri).
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "Lipsesc NEXT_PUBLIC_SUPABASE_URL sau SUPABASE_SERVICE_ROLE_KEY pentru clientul admin.",
    );
  }
  return createSupabaseClient<Database>(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

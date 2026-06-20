import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

/**
 * Client Supabase pentru CITIRI PUBLICE cacheabile, fără cookie-uri.
 *
 * Spre deosebire de `./server` (care citește `cookies()` și de aceea face
 * fiecare render dinamic), acesta folosește doar cheia anon, fără sesiune. E
 * sigur fiindcă RLS lasă vizitatorii anonimi să vadă doar conținutul publicat —
 * exact ce afișează paginile publice.
 *
 * Fiind cookie-free, getter-ii care îl folosesc pot fi marcați
 * `'use cache: remote'` (vezi `app/data/*.ts`) și serviți din Upstash Redis.
 */
export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      "Lipsesc NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY pentru clientul public.",
    );
  }
  return createSupabaseClient<Database>(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

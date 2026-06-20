import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./database.types";

/**
 * Client Supabase pentru cod care rulează pe server: Server Components,
 * Server Actions și Route Handlers.
 *
 * În Next.js 16 `cookies()` este asincron, deci funcția este `async`.
 * Sesiunea este stocată în cookie-uri httpOnly și citită/scrisă prin
 * API-ul `getAll`/`setAll` cerut de `@supabase/ssr`.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // `setAll` a fost apelat dintr-un Server Component, unde nu se pot
            // seta cookie-uri. Poate fi ignorat în siguranță atâta timp cât
            // `proxy.ts` reîmprospătează sesiunea (vezi app/lib/supabase/proxy.ts).
          }
        },
      },
    },
  );
}

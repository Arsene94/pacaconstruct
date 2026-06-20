import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";

/**
 * Data Access Layer (DAL) — punct central pentru verificarea sesiunii.
 *
 * Proxy-ul oferă o primă barieră (optimistă) pentru /admin, dar verificarea
 * sigură trebuie făcută cât mai aproape de date. Folosește aceste funcții în
 * Server Components, Server Actions și Route Handlers.
 *
 * `cache()` memorează rezultatul pe durata unui singur render, ca să nu
 * interogheze Supabase de mai multe ori în același request.
 */

/**
 * Întoarce utilizatorul autentificat sau `null`. Nu redirecționează.
 * `getUser()` validează tokenul cu serverul Supabase (spre deosebire de
 * `getSession()`, care doar citește cookie-ul).
 */
export const getUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

/**
 * Garantează că există un admin autentificat. Redirecționează spre /login dacă
 * nu. Întoarce utilizatorul pentru a fi folosit mai departe.
 *
 * Notă: în acest proiect doar adminii au cont, deci "autentificat" = "admin".
 * Dacă vei adăuga și alte roluri, verifică aici `user.app_metadata.role`.
 */
export const requireAdmin = cache(async () => {
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }
  return user;
});

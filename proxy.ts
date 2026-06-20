import { type NextRequest } from "next/server";
import { updateSession } from "@/app/lib/supabase/proxy";

/**
 * Proxy (fostul `middleware` din versiunile Next.js < 16).
 * Reîmprospătează sesiunea Supabase la fiecare navigare și protejează /admin.
 */
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Rulează pe toate rutele, mai puțin:
     * - _next/static (fișiere statice)
     * - _next/image (optimizare imagini)
     * - favicon.ico și fișierele media din /public
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};

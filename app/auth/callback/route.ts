import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/app/lib/supabase/server";

/**
 * Route Handler pentru finalizarea fluxului PKCE (resetare parolă / invitație).
 * Supabase trimite un `code` în link; îl schimbăm pe o sesiune și apoi
 * redirecționăm utilizatorul către pagina indicată de `next`.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/admin";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Cod lipsă sau invalid -> înapoi la recuperare, cu marcaj de eroare.
  return NextResponse.redirect(`${origin}/login/recovery?error=link_invalid`);
}

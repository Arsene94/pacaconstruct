import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Rută protejată: orice cale care începe cu unul dintre aceste prefixe
 * necesită un admin autentificat.
 */
const PROTECTED_PREFIXES = ["/admin"];

/**
 * Reîmprospătează sesiunea Supabase la fiecare request și aplică protecția
 * rutelor. Apelat din `proxy.ts` (echivalentul `middleware` în Next.js 16).
 *
 * IMPORTANT: tokenurile sunt reîmprospătate aici, iar cookie-urile actualizate
 * trebuie transmise atât către request (pentru Server Components), cât și către
 * răspuns (pentru browser). Nu adăuga logică între `createServerClient` și
 * `getUser()`, altfel pot apărea delogări intermitente.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Citirea utilizatorului declanșează reîmprospătarea tokenului dacă e cazul.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );

  // Vizitator neautentificat care încearcă să acceseze /admin -> spre /login.
  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectedFrom", pathname);
    return NextResponse.redirect(url);
  }

  // Admin deja autentificat care deschide /login -> direct în dashboard.
  if (user && pathname === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  // Trebuie returnat exact `supabaseResponse` pentru a păstra cookie-urile
  // de sesiune reîmprospătate.
  return supabaseResponse;
}

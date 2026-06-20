# Autentificare cu Supabase (acces admin)

Acest document descrie cum este integrată autentificarea Supabase în aplicația
PACA CONSTRUCT și cum o pui în funcțiune.

> **Model de acces:** doar administratorii au cont. **Nu există înregistrare
> publică** (sign-up). Conturile se creează manual din panoul Supabase. Un
> utilizator autentificat este, prin definiție, un admin.

---

## 1. Cum funcționează (pe scurt)

- Sesiunea este stocată în **cookie-uri `httpOnly`**, gestionate de
  `@supabase/ssr`.
- **`proxy.ts`** (echivalentul `middleware` din Next.js < 16) rulează la fiecare
  navigare, reîmprospătează tokenul și redirecționează vizitatorii neautentificați
  de pe `/admin` către `/login`.
- Paginile/serverul verifică din nou sesiunea prin **DAL** (`app/lib/dal.ts`),
  ca a doua barieră, mai aproape de date.
- Login / logout / resetare parolă rulează prin **Server Actions**
  (`app/actions/auth.ts`), niciodată cu credențiale expuse în client.

```
Browser ──▶ proxy.ts (refresh sesiune + protecție /admin)
                │
                ├─▶ /login  ──(Server Action: login)──▶ Supabase signInWithPassword
                │                                            │
                │                                       set cookie sesiune
                │
                └─▶ /admin  ──(DAL: requireAdmin)──▶ getUser() validat la Supabase
```

---

## 2. Variabile de mediu

Copiază `.env.example` în `.env.local` și completează din panoul Supabase
(**Project Settings → API**):

| Variabilă | Unde o găsești | Obligatorie |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL | da |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Cheia publică `anon` | da |
| `NEXT_PUBLIC_SITE_URL` | Originul public al site-ului (ex. `https://www.pacaconstruct.ro`) | doar în producție |

Cheia `anon` este publică și sigură pentru browser — accesul la date este
protejat de politicile **Row Level Security (RLS)** din Supabase. **Nu** pune
niciodată `service_role` într-o variabilă `NEXT_PUBLIC_*`.

---

## 3. Crearea conturilor de admin

Pentru că nu există sign-up public, conturile se adaugă manual:

1. Supabase Dashboard → **Authentication → Users → Add user**.
2. Completează emailul și parola. Bifează **Auto Confirm User** (altfel contul
   rămâne neconfirmat și nu se poate loga).
3. Gata — adminul se poate autentifica la `/login`.

Opțional, pentru a marca explicit rolul, poți seta în user **App Metadata**:

```json
{ "role": "admin" }
```

și apoi să verifici `user.app_metadata.role === "admin"` în `requireAdmin()`.

---

## 4. Configurare în panoul Supabase pentru resetarea parolei

Fluxul „Ai uitat parola?” trimite un email cu un link care revine în aplicație.
Pentru ca redirecturile să fie acceptate:

1. Supabase Dashboard → **Authentication → URL Configuration**.
2. **Site URL**: `http://localhost:3000` (dev) sau domeniul de producție.
3. **Redirect URLs**: adaugă
   - `http://localhost:3000/auth/callback`
   - `https://<domeniul-tău>/auth/callback`

Fără aceste intrări, linkul din email va fi respins.

---

## 5. Fișiere relevante

| Fișier | Rol |
| --- | --- |
| `app/lib/supabase/client.ts` | Client Supabase pentru componente client |
| `app/lib/supabase/server.ts` | Client Supabase pentru server (cookies async) |
| `app/lib/supabase/proxy.ts` | Reîmprospătare sesiune + protecție rute |
| `proxy.ts` | Punctul de intrare proxy (rădăcina proiectului) |
| `app/lib/dal.ts` | `getUser()` / `requireAdmin()` — verificare sigură |
| `app/actions/auth.ts` | Server Actions: `login`, `logout`, `requestPasswordReset`, `updatePassword` |
| `app/auth/callback/route.ts` | Schimbă `code`-ul din email pe o sesiune (PKCE) |
| `app/login/auth-forms.tsx` | Formularele wired la Server Actions |
| `app/login/update-password/page.tsx` | Pagina de setare a parolei noi |

---

## 6. Rute

| Rută | Acces | Descriere |
| --- | --- | --- |
| `/login` | public | Autentificare admin (redirect spre `/admin` dacă ești deja logat) |
| `/login/recovery` | public | Cerere de resetare parolă |
| `/login/update-password` | sesiune de recuperare | Setarea parolei noi |
| `/auth/callback` | public | Finalizează linkul din email |
| `/admin` | **doar admin** | Dashboard (protejat de proxy + DAL) |

---

## 7. Verificare locală

```bash
npm run dev
```

1. Fără sesiune, accesează `/admin` → ești redirecționat la `/login`.
2. Loghează-te cu un cont creat în Supabase → ajungi pe `/admin`.
3. Apasă butonul de deconectare (dreapta sus) → revii la `/login`.
4. La `/login`, fiind logat, ești dus automat la `/admin`.

> Dacă variabilele din `.env.local` lipsesc, login-ul va eșua — completează-le
> mai întâi.

---

## 8. Note de securitate

- Folosim `supabase.auth.getUser()` (validează tokenul la server), **nu**
  `getSession()`, pentru deciziile de autorizare.
- Proxy-ul este o verificare **optimistă**; bariera reală este în DAL / Server
  Actions, cât mai aproape de date.
- Mesajele de eroare la login și răspunsul la resetarea parolei sunt **generice**,
  ca să nu permită enumerarea conturilor existente.
- Orice Server Action care modifică date trebuie să apeleze `requireAdmin()`
  (sau `getUser()`) înainte de a continua.

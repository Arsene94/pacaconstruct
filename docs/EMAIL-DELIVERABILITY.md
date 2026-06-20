# Deliverability & compliance email — PACA CONSTRUCT

Ghid operațional pentru livrarea email-urilor (standarde 2026: Gmail/Yahoo/Outlook
bulk sender). Sistemul tehnic e gata; pașii de mai jos sunt **manuali**, în
dashboard-ul Resend și la registrarul DNS.

## 1. Verificarea domeniului în Resend

1. Resend → **Domains → Add Domain**.
2. Recomandat: adaugă **două subdomenii** separate, pentru reputație izolată:
   - `tx.pacaconstruct.ro` — tranzacțional (confirmări, status cereri).
   - `news.pacaconstruct.ro` — marketing (newsletter, broadcast).
     O campanie cu rată mare de unsubscribe nu va afecta livrarea confirmărilor.
3. Resend afișează înregistrările DNS de adăugat. Adaugă-le la registrar.

## 2. SPF + DKIM + DMARC

- **SPF** — record TXT pe subdomeniu (Resend îl dă), include `amazonses.com` /
  `_spf` indicat de Resend.
- **DKIM** — record(uri) CNAME/TXT generate de Resend per subdomeniu. Așteaptă
  „Verified".
- **DMARC** — record TXT pe `_dmarc.pacaconstruct.ro`:
  ```
  v=DMARC1; p=none; rua=mailto:dmarc@pacaconstruct.ro; fo=1
  ```
  Pornește cu `p=none` (monitorizare), apoi, după ce rapoartele arată aliniere
  SPF+DKIM, urcă la `p=quarantine` și în final `p=reject`.

## 3. Variabile de mediu (după verificare)

Completează în producție (vezi `.env.example`):

```
EMAIL_FROM_TRANSACTIONAL="PACA CONSTRUCT <noreply@tx.pacaconstruct.ro>"
EMAIL_FROM_MARKETING="PACA CONSTRUCT <salut@news.pacaconstruct.ro>"
EMAIL_REPLY_TO="office@pacaconstruct.ro"
EMAIL_ADMIN_TO="office@pacaconstruct.ro"
RESEND_WEBHOOK_SECRET=whsec_...        # pasul 4
EMAIL_UNSUBSCRIBE_SECRET=<random 32+ chars>
```

Generează secretul de unsubscribe: `openssl rand -base64 32`.

## 4. Webhook Resend

1. Resend → **Webhooks → Add Endpoint**.
2. URL: `https://<domeniu>/api/webhooks/resend`.
3. Evenimente: `email.sent`, `email.delivered`, `email.opened`, `email.bounced`,
   `email.complained` (+ `email.failed` dacă e disponibil).
4. Copiază **Signing Secret** (`whsec_...`) în `RESEND_WEBHOOK_SECRET`.
5. Ruta verifică semnătura Svix și respinge cererile nesemnate (401).

Efecte: statusurile se actualizează în `email_messages`; bounce/complaint
**suprimă** contactul (nu se mai trimite). Vezi dashboard la `/admin/email`.

## 5. Compliance 2026

- **One-click unsubscribe (RFC 8058)** — adăugat automat pe **marketing**
  (header `List-Unsubscribe` + `List-Unsubscribe-Post`) și ca link în footer.
  **Nu** se aplică tranzacționalelor (confirmări, status) — sunt exceptate.
- **Consimțământ** — marketing doar cu opt-in explicit (bifă pe formulare →
  `marketing_consent`). Broadcast-ul trimite doar către contacte active cu
  consimțământ.
- **Rata de spam** — ținta < 0.3% (ideal < 0.1%). Peste prag, mesajele sunt
  respinse la SMTP. Monitorizează în Resend + dashboard.
- **Listă de supresie** — bounce/complaint marchează contactul automat;
  `sendEmail` refuză trimiterea către suprimați (hard bounce blochează chiar și
  tranzacționalul).

## 6. Verificare finală

- Trimite un test din `/admin/email/campaigns/new` → „Trimite test".
- Rulează adresa pe [mail-tester.com](https://www.mail-tester.com) — țintă ≥ 9/10.
- Confirmă SPF/DKIM/DMARC „verde" în raportul mail-tester.
- Testează unsubscribe one-click din Gmail (butonul de lângă expeditor).
- Verifică în `/admin/email` că statusurile (delivered/opened) se actualizează.

## 7. Securitate (rezumat)

- Cheia Resend e `server-only`; webhook-urile sunt semnate (Svix);
  trimiterile sunt idempotente; token-ul de unsubscribe e HMAC; variabilele din
  template sunt escapate (randare React) + subiectul curățat de CR/LF;
  acțiunile de trimitere sunt `requireAdmin()` + rate-limited (Upstash).

"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { submitServiceRequest, type IntakeState } from "@/app/actions/intake";
import { pushMarketingEvent } from "@/app/lib/marketing/data-layer";
import { AttributionFields } from "@/app/components/marketing/attribution-fields";

function Field({
  id,
  label,
  placeholder,
  type = "text",
  required,
}: {
  id: string;
  label: string;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-mono text-xs uppercase tracking-[0.12em] text-stone">
        {label}
      </span>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        required={required}
        aria-required={required || undefined}
        className="h-12 w-full border-0 border-b border-olive/20 bg-transparent px-0 text-base text-carbon outline-none transition placeholder:text-muted focus:border-amber"
      />
    </label>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-8 inline-flex w-full items-center justify-center gap-2 bg-amber px-6 py-4 text-sm font-bold uppercase text-carbon transition hover:bg-[#fea943] disabled:opacity-60 md:w-auto"
    >
      {pending ? "Se trimite…" : "Trimite solicitarea"}
      <span aria-hidden="true">-&gt;</span>
    </button>
  );
}

export function ContactForm() {
  const [state, formAction] = useActionState<IntakeState, FormData>(
    submitServiceRequest,
    undefined,
  );
  const [newsletter, setNewsletter] = useState(false);

  // Conversie: la submit reușit împinge lead-ul (fără PII) și, dacă a fost
  // bifat, opt-in-ul de newsletter. Pixelii GA4/Ads/Meta/TikTok se declanșează
  // din aceste evenimente în GTM.
  useEffect(() => {
    if (!state?.ok) return;
    pushMarketingEvent({
      event: "pc_lead_submit",
      lead_type: "serviciu",
      source: "contact_form",
      currency: "RON",
    });
    if (newsletter) {
      pushMarketingEvent({
        event: "pc_newsletter_optin",
        source: "contact_form",
      });
    }
  }, [state?.ok, newsletter]);

  if (state?.ok) {
    return (
      <div
        className="border border-olive/15 bg-white p-8 shadow-xl shadow-carbon/5 md:p-12"
        role="status"
        aria-live="polite"
      >
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-strong">
          Solicitare trimisă
        </p>
        <h3 className="mt-4 font-serif-display text-3xl font-semibold text-olive">
          Am primit detaliile.
        </h3>
        <p className="mt-4 max-w-md text-base leading-7 text-stone">
          Te sunăm în curând cu pașii următori și cu o estimare.
        </p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="border border-olive/10 bg-white p-5 shadow-xl shadow-carbon/5 md:p-8"
    >
      <AttributionFields />
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-bold uppercase text-olive">Date proiect</span>
          <span className="font-mono text-xs uppercase text-muted">
            Evaluare gratuită
          </span>
        </div>
        <div className="h-1 overflow-hidden bg-limestone">
          <div className="h-full w-1/3 bg-amber" />
        </div>
      </div>

      {state && !state.ok ? (
        <div
          className="mb-6 border border-[#b91c1c]/30 bg-[#ffdad6]/40 px-4 py-3 text-sm font-semibold text-[#93000a]"
          role="alert"
        >
          {state.error}
        </div>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2">
        <Field id="name" label="Nume" placeholder="Cum te cheamă" required />
        <Field
          id="phone"
          label="Telefon"
          placeholder="Număr la care te sunăm"
          type="tel"
          required
        />
        <Field
          id="email"
          label="Email (opțional)"
          placeholder="Dacă vrei și pe email"
          type="email"
        />
        <Field id="location" label="Locație" placeholder="Orașul sau județul lucrării" />
        <Field
          id="surface"
          label="Suprafață (mp)"
          placeholder="Aproximativ, în metri pătrați"
          type="number"
        />
      </div>

      <label className="mt-6 block">
        <span className="mb-2 block font-mono text-xs uppercase tracking-[0.12em] text-stone">
          Descriere
        </span>
        <textarea
          id="description"
          name="description"
          rows={4}
          placeholder="Spune pe scurt ce ai de făcut"
          className="min-h-32 w-full resize-y border-0 border-b border-olive/20 bg-transparent px-0 py-3 text-base text-carbon outline-none transition placeholder:text-muted focus:border-amber"
        />
      </label>

      <label className="mt-6 flex items-start gap-3 text-sm text-stone">
        <input
          type="checkbox"
          name="newsletter"
          value="on"
          checked={newsletter}
          onChange={(e) => setNewsletter(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-amber"
        />
        <span>
          Vreau să primesc ocazional noutăți și oferte PACA CONSTRUCT pe email. (opțional,
          te poți dezabona oricând)
        </span>
      </label>

      <SubmitButton />
      <p className="mt-4 text-xs leading-5 text-muted">
        Trimițând formularul ești de acord să te contactăm despre solicitarea ta.
      </p>
    </form>
  );
}

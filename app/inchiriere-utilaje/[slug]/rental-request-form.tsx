"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitRentalRequest, type IntakeState } from "@/app/actions/intake";

function Field({
  name,
  label,
  placeholder,
  type = "text",
  required,
}: {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-muted">
        {label}
      </span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        aria-required={required || undefined}
        className="w-full border border-olive/15 bg-limestone px-3 py-3 text-base text-olive outline-none transition focus:border-olive"
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
      className="mt-3 bg-amber px-6 py-4 text-sm font-bold uppercase text-carbon transition hover:bg-[#fea943] disabled:opacity-60"
    >
      {pending ? "Se trimite…" : "Trimite solicitarea"}
    </button>
  );
}

export function RentalRequestForm({ machineTitle }: { machineTitle: string }) {
  const [state, formAction] = useActionState<IntakeState, FormData>(
    submitRentalRequest,
    undefined,
  );

  if (state?.ok) {
    return (
      <div
        className="border border-olive/15 bg-white p-6 text-center shadow-xl shadow-carbon/5"
        role="status"
        aria-live="polite"
      >
        <h2 className="font-serif-display text-2xl font-medium text-olive">
          Solicitare trimisă
        </h2>
        <p className="mt-3 text-sm leading-6 text-stone">
          Am primit cererea pentru <strong>{machineTitle}</strong>. Revenim cu confirmarea
          disponibilității în cel mai scurt timp.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-4">
      <input name="machine" type="hidden" value={machineTitle} />
      {state && !state.ok ? (
        <div
          className="border border-[#b91c1c]/30 bg-[#ffdad6]/40 px-3 py-2 text-sm font-semibold text-[#93000a]"
          role="alert"
        >
          {state.error}
        </div>
      ) : null}
      <Field name="name" label="Nume complet" placeholder="Ex: Ion Popescu" required />
      <Field
        name="phone"
        label="Telefon"
        placeholder="07xx xxx xxx"
        type="tel"
        required
      />
      <Field name="email" label="Email" placeholder="adresa@email.com" type="email" />
      <Field name="location" label="Locatie" placeholder="Oras / comuna" />
      <Field name="period" label="Perioada dorita" type="date" />
      <label className="flex items-start gap-3 text-sm text-stone">
        <input
          type="checkbox"
          name="newsletter"
          value="on"
          className="mt-0.5 h-4 w-4 shrink-0 accent-amber"
        />
        <span>Vreau să primesc ocazional noutăți și oferte pe email (opțional).</span>
      </label>
      <SubmitButton />
      <p className="text-xs leading-5 text-muted">
        Disponibilitatea se confirma dupa analiza proiectului si a conditiilor de acces.
      </p>
    </form>
  );
}

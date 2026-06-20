"use client";

import type { ReactNode } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { FormState } from "@/app/actions/content";
import { AdminIcon } from "./admin-icons";

/** Buton de submit cu stare „pending" preluată din contextul formularului. */
export function SubmitButton({ label = "Salvează" }: { label?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      className="flex h-9 items-center justify-center gap-2 rounded-[2px] bg-[#d88a24] px-5 text-xs font-medium leading-4 text-white shadow-sm transition-colors hover:bg-[#c27a1f] disabled:opacity-60"
      disabled={pending}
      type="submit"
    >
      <AdminIcon className="h-4 w-4" name={pending ? "history" : "check"} />
      {pending ? "Se salvează…" : label}
    </button>
  );
}

/**
 * Învelișul de formular pentru paginile de admin: leagă Server Action-ul prin
 * `useActionState` și afișează eroarea de validare returnată.
 */
export function AdminFormFrame({
  action,
  children,
  submitLabel,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  children: ReactNode;
  submitLabel?: string;
}) {
  const [state, formAction] = useActionState<FormState, FormData>(
    action,
    undefined,
  );

  return (
    <form
      action={formAction}
      className="space-y-6 rounded-[2px] border border-[#e6e1d7] bg-white p-5 shadow-sm md:p-6"
    >
      {state?.error ? (
        <div
          className="flex items-center gap-2 rounded-[2px] border border-[#b91c1c]/30 bg-[#ffdad6]/40 px-3 py-2 text-xs font-semibold text-[#93000a]"
          role="alert"
        >
          <AdminIcon className="h-4 w-4" name="warning" />
          {state.error}
        </div>
      ) : null}

      {children}

      <div className="flex items-center justify-end gap-3 border-t border-[#e6e1d7] pt-5">
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  );
}

/**
 * Buton de ștergere care cere confirmare înainte de a trimite Server Action-ul.
 * `action` primește un `FormData` cu `id`.
 */
export function DeleteButton({
  action,
  id,
  label = "Șterge",
  confirmText = "Sigur ștergi acest element? Acțiunea nu poate fi anulată.",
}: {
  action: (formData: FormData) => void | Promise<void>;
  id: string;
  label?: string;
  confirmText?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(confirmText)) {
          event.preventDefault();
        }
      }}
    >
      <input name="id" type="hidden" value={id} />
      <button
        aria-label={label}
        className="inline-flex items-center justify-center rounded-[2px] border border-[#e6e1d7] bg-[#fbf9f3] p-1.5 text-[#6b706a] transition-colors hover:border-[#b91c1c]/40 hover:text-[#b91c1c]"
        type="submit"
      >
        <AdminIcon className="h-4 w-4" name="delete" />
      </button>
    </form>
  );
}

/** Select de status care trimite formularul automat la schimbare. */
export function StatusSelect({
  action,
  id,
  value,
  options,
}: {
  action: (formData: FormData) => void | Promise<void>;
  id: string;
  value: string;
  options: string[];
}) {
  return (
    <form action={action}>
      <input name="id" type="hidden" value={id} />
      <select
        className="h-7 appearance-none rounded-[2px] border border-[#e6e1d7] bg-[#fbf9f3] pl-2 pr-6 text-[11px] font-bold text-[#171a16] outline-none focus:border-[#58683c] focus:ring-1 focus:ring-[#58683c]"
        defaultValue={value}
        name="status"
        onChange={(event) => event.currentTarget.form?.requestSubmit()}
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </form>
  );
}

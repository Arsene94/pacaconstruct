"use client";

import type { ReactNode } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  createContact,
  updateContact,
  importContacts,
  createGroup,
  createSegment,
  type EmailFormState,
} from "@/app/actions/email";
import type { Contact, ContactStatus } from "@/app/data/contacts";
import { AdminIcon } from "../admin-icons";

const STATUS_OPTIONS: ContactStatus[] = [
  "active",
  "unsubscribed",
  "bounced",
  "complained",
];

const inputClass =
  "h-9 w-full rounded-[2px] border border-[#e6e1d7] bg-white px-3 text-sm text-[#171a16] outline-none focus:border-[#58683c] focus:ring-1 focus:ring-[#58683c]";
const labelClass =
  "mb-1 block text-[11px] font-bold uppercase tracking-[0.08em] text-[#6b706a]";

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex h-9 items-center justify-center gap-2 rounded-[2px] bg-[#d88a24] px-4 text-xs font-medium text-white shadow-sm transition-colors hover:bg-[#c27a1f] disabled:opacity-60"
    >
      <AdminIcon className="h-4 w-4" name={pending ? "history" : "check"} />
      {pending ? "Se procesează…" : label}
    </button>
  );
}

function Banner({ state }: { state: EmailFormState }) {
  if (!state) return null;
  if (state.ok) {
    return (
      <div className="flex items-center gap-2 rounded-[2px] border border-[#15803d]/30 bg-[#15803d]/10 px-3 py-2 text-xs font-semibold text-[#15803d]">
        <AdminIcon className="h-4 w-4" name="check" />
        {state.info ?? "Salvat."}
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 rounded-[2px] border border-[#b91c1c]/30 bg-[#ffdad6]/40 px-3 py-2 text-xs font-semibold text-[#93000a]">
      <AdminIcon className="h-4 w-4" name="warning" />
      {state.error}
    </div>
  );
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-[2px] border border-[#e6e1d7] bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-bold text-[#171a16]">{title}</h2>
      {children}
    </section>
  );
}

export function AddContactForm() {
  const [state, action] = useActionState<EmailFormState, FormData>(
    createContact,
    undefined,
  );
  return (
    <Card title="Adaugă contact manual">
      <form action={action} className="space-y-3">
        <Banner state={state} />
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className={labelClass}>Email *</label>
            <input name="email" type="email" required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Nume</label>
            <input name="name" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Telefon</label>
            <input name="phone" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select name="status" defaultValue="active" className={inputClass}>
              {STATUS_OPTIONS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className={labelClass}>Tag-uri (separate prin virgulă)</label>
          <input name="tags" placeholder="lead, cluj" className={inputClass} />
        </div>
        <label className="flex items-center gap-2 text-sm text-[#434843]">
          <input
            type="checkbox"
            name="marketingConsent"
            className="h-4 w-4 accent-[#d88a24]"
          />
          Consimțământ marketing
        </label>
        <Submit label="Adaugă contact" />
      </form>
    </Card>
  );
}

export function ImportForm() {
  const [state, action] = useActionState<EmailFormState, FormData>(
    importContacts,
    undefined,
  );
  return (
    <Card title="Import CSV">
      <form action={action} className="space-y-3">
        <Banner state={state} />
        <p className="text-xs text-[#6b706a]">
          Un contact pe linie: <code>email, nume, telefon</code>. Emailurile invalide și
          duplicatele sunt ignorate.
        </p>
        <textarea
          name="csv"
          rows={6}
          placeholder={
            "ion@example.com, Ion Popescu, 0740000000\nmaria@example.com, Maria"
          }
          className="w-full rounded-[2px] border border-[#e6e1d7] bg-white p-3 font-mono text-xs text-[#171a16] outline-none focus:border-[#58683c]"
        />
        <Submit label="Importă" />
      </form>
    </Card>
  );
}

export function ContactEditForm({ contact }: { contact: Contact }) {
  const [state, action] = useActionState<EmailFormState, FormData>(
    updateContact,
    undefined,
  );
  return (
    <form action={action} className="space-y-3 bg-[#fbf9f3] p-4">
      <input type="hidden" name="id" value={contact.id} />
      <Banner state={state} />
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className={labelClass}>Email *</label>
          <input
            name="email"
            type="email"
            required
            defaultValue={contact.email}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Nume</label>
          <input name="name" defaultValue={contact.name ?? ""} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Telefon</label>
          <input name="phone" defaultValue={contact.phone ?? ""} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Status</label>
          <select name="status" defaultValue={contact.status} className={inputClass}>
            {STATUS_OPTIONS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className={labelClass}>Tag-uri</label>
        <input
          name="tags"
          defaultValue={contact.tags.join(", ")}
          className={inputClass}
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-[#434843]">
        <input
          type="checkbox"
          name="marketingConsent"
          defaultChecked={contact.marketingConsent}
          className="h-4 w-4 accent-[#d88a24]"
        />
        Consimțământ marketing
      </label>
      <Submit label="Salvează modificările" />
    </form>
  );
}

export function CreateGroupForm() {
  const [state, action] = useActionState<EmailFormState, FormData>(
    createGroup,
    undefined,
  );
  return (
    <Card title="Creează grup">
      <form action={action} className="space-y-3">
        <Banner state={state} />
        <div>
          <label className={labelClass}>Nume grup *</label>
          <input name="name" required className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Descriere</label>
          <input name="description" className={inputClass} />
        </div>
        <Submit label="Creează grup" />
      </form>
    </Card>
  );
}

export function CreateSegmentForm() {
  const [state, action] = useActionState<EmailFormState, FormData>(
    createSegment,
    undefined,
  );
  return (
    <Card title="Creează segment dinamic">
      <form action={action} className="space-y-3">
        <Banner state={state} />
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className={labelClass}>Nume segment *</label>
            <input name="name" required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Sursă</label>
            <select name="source" defaultValue="" className={inputClass}>
              <option value="">(oricare)</option>
              <option value="manual">manual</option>
              <option value="import">import</option>
              <option value="service_request">service_request</option>
              <option value="rental_request">rental_request</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Tag-uri (toate)</label>
            <input name="tags" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Create în ultimele (zile)</label>
            <input
              name="createdWithinDays"
              type="number"
              min={1}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Consimțământ marketing</label>
            <select name="marketingConsent" defaultValue="" className={inputClass}>
              <option value="">(oricare)</option>
              <option value="true">da</option>
              <option value="false">nu</option>
            </select>
          </div>
        </div>
        <Submit label="Creează segment" />
      </form>
    </Card>
  );
}

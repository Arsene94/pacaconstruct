import type { Metadata } from "next";
import {
  getContacts,
  countContacts,
  CONTACT_STATUSES,
  type ContactStatus,
} from "@/app/data/contacts";
import { deleteContact } from "@/app/actions/email";
import { DeleteButton } from "@/app/admin/form-client";
import { AdminContent, PageHeader, StatusBadge } from "@/app/admin/admin-ui";
import { AddContactForm, ImportForm, ContactEditForm } from "../email-client";

export const metadata: Metadata = {
  title: "Contacte | Admin PACA CONSTRUCT",
  description: "Management contacte email: adăugare, import, status, consimțământ.",
};

const STATUS_TONE: Record<ContactStatus, "success" | "neutral" | "warning" | "error"> = {
  active: "success",
  unsubscribed: "neutral",
  bounced: "warning",
  complained: "error",
};

export default async function AdminContactsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const sp = await searchParams;
  const status = CONTACT_STATUSES.includes(sp.status as ContactStatus)
    ? (sp.status as ContactStatus)
    : undefined;
  const [contacts, total, activeCount] = await Promise.all([
    getContacts({ search: sp.q, status, limit: 500 }),
    countContacts(),
    countContacts("active"),
  ]);

  return (
    <AdminContent>
      <PageHeader
        title="Contacte"
        description={`${total} contacte · ${activeCount} active`}
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <AddContactForm />
        <ImportForm />
      </div>

      <form
        method="get"
        className="flex flex-wrap items-end gap-3 rounded-[2px] border border-[#e6e1d7] bg-white p-4 shadow-sm"
      >
        <div className="flex-1">
          <label className="mb-1 block text-[11px] font-bold uppercase text-[#6b706a]">
            Caută
          </label>
          <input
            name="q"
            defaultValue={sp.q ?? ""}
            placeholder="email sau nume…"
            className="h-9 w-full rounded-[2px] border border-[#e6e1d7] bg-white px-3 text-sm outline-none focus:border-[#58683c]"
          />
        </div>
        <div>
          <label className="mb-1 block text-[11px] font-bold uppercase text-[#6b706a]">
            Status
          </label>
          <select
            name="status"
            defaultValue={status ?? ""}
            className="h-9 rounded-[2px] border border-[#e6e1d7] bg-white px-3 text-sm outline-none focus:border-[#58683c]"
          >
            <option value="">Toate</option>
            {CONTACT_STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="h-9 rounded-[2px] border border-[#e6e1d7] bg-[#fbf9f3] px-4 text-xs font-medium text-[#171a16] hover:bg-white"
        >
          Filtrează
        </button>
      </form>

      <div className="overflow-hidden rounded-[2px] border border-[#e6e1d7] bg-white shadow-sm">
        <div className="border-b border-[#e6e1d7] bg-[#fbf9f3]/70 px-4 py-2 text-xs font-bold uppercase text-[#6b706a]">
          {contacts.length} contacte
        </div>
        {contacts.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-[#6b706a]">
            Niciun contact găsit.
          </p>
        ) : (
          contacts.map((c) => (
            <details key={c.id} className="border-b border-[#e6e1d7] last:border-b-0">
              <summary className="flex cursor-pointer flex-wrap items-center gap-3 px-4 py-3 hover:bg-[#fbf9f3]/60">
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-bold text-[#171a16]">
                    {c.email}
                  </span>
                  {c.name ? (
                    <span className="block truncate text-[11px] text-[#6b706a]">
                      {c.name}
                    </span>
                  ) : null}
                </span>
                <StatusBadge tone={STATUS_TONE[c.status]} dot>
                  {c.status}
                </StatusBadge>
                {c.marketingConsent ? (
                  <StatusBadge tone="forest">opt-in</StatusBadge>
                ) : null}
                {c.tags.length > 0 ? (
                  <span className="text-[11px] text-[#6b706a]">
                    {c.tags.map((t) => `#${t}`).join(" ")}
                  </span>
                ) : null}
              </summary>
              <div className="border-t border-[#e6e1d7]">
                <ContactEditForm contact={c} />
                <div className="flex justify-end px-4 pb-4">
                  <DeleteButton
                    action={deleteContact}
                    id={c.id}
                    confirmText="Ștergi acest contact definitiv?"
                  />
                </div>
              </div>
            </details>
          ))
        )}
      </div>
    </AdminContent>
  );
}

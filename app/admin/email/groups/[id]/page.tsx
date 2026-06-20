import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGroupWithMembers, getContacts } from "@/app/data/contacts";
import { addToGroup, removeFromGroup } from "@/app/actions/email";
import {
  AdminContent,
  PageHeader,
  SecondaryLinkButton,
  StatusBadge,
} from "@/app/admin/admin-ui";

export const metadata: Metadata = {
  title: "Grup | Admin PACA CONSTRUCT",
};

export default async function AdminGroupDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const group = await getGroupWithMembers(id);
  if (!group) notFound();

  // Candidați pentru adăugare: contacte active care nu sunt deja membri.
  const memberIds = new Set(group.members.map((m) => m.id));
  const all = await getContacts({ status: "active", limit: 500 });
  const candidates = all.filter((c) => !memberIds.has(c.id));

  return (
    <AdminContent>
      <PageHeader
        title={group.name}
        description={`${group.members.length} membri${group.description ? ` · ${group.description}` : ""}`}
        actions={
          <SecondaryLinkButton icon="chevronLeft" href="/admin/email/groups">
            Înapoi
          </SecondaryLinkButton>
        }
      />

      <section className="rounded-[2px] border border-[#e6e1d7] bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-sm font-bold text-[#171a16]">Adaugă membru</h2>
        {candidates.length === 0 ? (
          <p className="text-sm text-[#6b706a]">
            Toate contactele active sunt deja în grup.
          </p>
        ) : (
          <form action={addToGroup} className="flex flex-wrap items-center gap-3">
            <input type="hidden" name="groupId" value={group.id} />
            <select
              name="contactId"
              className="h-9 min-w-[260px] rounded-[2px] border border-[#e6e1d7] bg-white px-3 text-sm outline-none focus:border-[#58683c]"
            >
              {candidates.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.email}
                  {c.name ? ` — ${c.name}` : ""}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="flex h-9 items-center gap-2 rounded-[2px] bg-[#d88a24] px-4 text-xs font-medium text-white hover:bg-[#c27a1f]"
            >
              Adaugă
            </button>
          </form>
        )}
      </section>

      <div className="overflow-hidden rounded-[2px] border border-[#e6e1d7] bg-white shadow-sm">
        <div className="border-b border-[#e6e1d7] bg-[#fbf9f3]/70 px-4 py-2 text-xs font-bold uppercase text-[#6b706a]">
          Membri
        </div>
        {group.members.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-[#6b706a]">
            Grupul nu are membri încă.
          </p>
        ) : (
          group.members.map((m) => (
            <div
              key={m.id}
              className="flex items-center gap-3 border-b border-[#e6e1d7] px-4 py-3 last:border-b-0"
            >
              <span className="min-w-0 flex-1">
                <span className="block truncate font-bold text-[#171a16]">{m.email}</span>
                {m.name ? (
                  <span className="block truncate text-[11px] text-[#6b706a]">
                    {m.name}
                  </span>
                ) : null}
              </span>
              {m.marketingConsent ? (
                <StatusBadge tone="forest">opt-in</StatusBadge>
              ) : null}
              <form action={removeFromGroup}>
                <input type="hidden" name="groupId" value={group.id} />
                <input type="hidden" name="contactId" value={m.id} />
                <button
                  type="submit"
                  aria-label="Scoate din grup"
                  className="inline-flex items-center justify-center rounded-[2px] border border-[#e6e1d7] bg-[#fbf9f3] p-1.5 text-[#6b706a] transition-colors hover:border-[#b91c1c]/40 hover:text-[#b91c1c]"
                >
                  ✕
                </button>
              </form>
            </div>
          ))
        )}
      </div>
    </AdminContent>
  );
}

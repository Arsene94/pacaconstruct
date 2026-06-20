import type { Metadata } from "next";
import Link from "next/link";
import { getGroups, getSegments } from "@/app/data/contacts";
import { deleteGroup, deleteSegment } from "@/app/actions/email";
import { DeleteButton } from "@/app/admin/form-client";
import { AdminContent, PageHeader } from "@/app/admin/admin-ui";
import { CreateGroupForm, CreateSegmentForm } from "../email-client";

export const metadata: Metadata = {
  title: "Grupuri & segmente | Admin PACA CONSTRUCT",
  description: "Grupuri statice și segmente dinamice de contacte.",
};

function segmentSummary(def: Record<string, unknown>): string {
  const parts: string[] = [];
  if (def.source) parts.push(`sursă=${def.source}`);
  if (Array.isArray(def.tags) && def.tags.length)
    parts.push(`tag-uri=${(def.tags as string[]).join(",")}`);
  if (def.createdWithinDays) parts.push(`ultimele ${def.createdWithinDays} zile`);
  if (typeof def.marketingConsent === "boolean")
    parts.push(`opt-in=${def.marketingConsent ? "da" : "nu"}`);
  return parts.length ? parts.join(" · ") : "toate contactele active";
}

export default async function AdminGroupsPage() {
  const [groups, segments] = await Promise.all([getGroups(), getSegments()]);

  return (
    <AdminContent>
      <PageHeader
        title="Grupuri & segmente"
        description={`${groups.length} grupuri · ${segments.length} segmente`}
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <CreateGroupForm />
        <CreateSegmentForm />
      </div>

      <section className="rounded-[2px] border border-[#e6e1d7] bg-white shadow-sm">
        <div className="border-b border-[#e6e1d7] bg-[#fbf9f3]/70 px-4 py-2 text-xs font-bold uppercase text-[#6b706a]">
          Grupuri statice
        </div>
        {groups.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-[#6b706a]">
            Niciun grup încă.
          </p>
        ) : (
          groups.map((g) => (
            <div
              key={g.id}
              className="flex items-center gap-3 border-b border-[#e6e1d7] px-4 py-3 last:border-b-0"
            >
              <Link
                href={`/admin/email/groups/${g.id}`}
                className="min-w-0 flex-1 font-bold text-[#171a16] hover:text-[#58683c]"
              >
                {g.name}
                {g.description ? (
                  <span className="block truncate text-[11px] font-normal text-[#6b706a]">
                    {g.description}
                  </span>
                ) : null}
              </Link>
              <span className="text-xs text-[#6b706a]">{g.memberCount} membri</span>
              <DeleteButton action={deleteGroup} id={g.id} confirmText="Ștergi grupul?" />
            </div>
          ))
        )}
      </section>

      <section className="rounded-[2px] border border-[#e6e1d7] bg-white shadow-sm">
        <div className="border-b border-[#e6e1d7] bg-[#fbf9f3]/70 px-4 py-2 text-xs font-bold uppercase text-[#6b706a]">
          Segmente dinamice
        </div>
        {segments.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-[#6b706a]">
            Niciun segment încă.
          </p>
        ) : (
          segments.map((s) => (
            <div
              key={s.id}
              className="flex items-center gap-3 border-b border-[#e6e1d7] px-4 py-3 last:border-b-0"
            >
              <span className="min-w-0 flex-1">
                <span className="block font-bold text-[#171a16]">{s.name}</span>
                <span className="block truncate text-[11px] text-[#6b706a]">
                  {segmentSummary(s.definition as Record<string, unknown>)}
                </span>
              </span>
              <DeleteButton
                action={deleteSegment}
                id={s.id}
                confirmText="Ștergi segmentul?"
              />
            </div>
          ))
        )}
      </section>
    </AdminContent>
  );
}

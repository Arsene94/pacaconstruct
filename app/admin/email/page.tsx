import type { Metadata } from "next";
import {
  getEmailStats,
  getCampaigns,
  getEmailMessages,
  type EmailStatus,
} from "@/app/data/email";
import {
  AdminContent,
  PageHeader,
  PrimaryLinkButton,
  SecondaryLinkButton,
  StatusBadge,
} from "@/app/admin/admin-ui";

export const metadata: Metadata = {
  title: "Email | Admin PACA CONSTRUCT",
  description: "Dashboard livrare email: status, campanii, jurnal.",
};

const MSG_TONE: Record<
  EmailStatus,
  "success" | "warning" | "error" | "neutral" | "forest"
> = {
  delivered: "success",
  opened: "forest",
  sent: "neutral",
  queued: "neutral",
  bounced: "warning",
  complained: "error",
  failed: "error",
};

const CAMPAIGN_TONE: Record<
  string,
  "success" | "warning" | "error" | "neutral" | "forest"
> = {
  sent: "success",
  sending: "forest",
  scheduled: "warning",
  draft: "neutral",
  failed: "error",
};

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[2px] border border-[#e6e1d7] bg-white p-4 shadow-sm">
      <div className="text-2xl font-bold text-[#171a16]">{value}</div>
      <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#6b706a]">
        {label}
      </div>
    </div>
  );
}

export default async function AdminEmailDashboard() {
  const [stats, campaigns, recent] = await Promise.all([
    getEmailStats(),
    getCampaigns(),
    getEmailMessages({ limit: 20 }),
  ]);

  return (
    <AdminContent>
      <PageHeader
        title="Email — dashboard"
        description={`${stats.total} mesaje · ${stats.delivered} livrate · ${stats.bounced + stats.complained} probleme`}
        actions={
          <>
            <SecondaryLinkButton icon="mail" href="/admin/email/contacts">
              Contacte
            </SecondaryLinkButton>
            <SecondaryLinkButton icon="personAdd" href="/admin/email/groups">
              Grupuri
            </SecondaryLinkButton>
            <PrimaryLinkButton icon="add" href="/admin/email/campaigns/new">
              Campanie nouă
            </PrimaryLinkButton>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7">
        <StatCard label="Total" value={stats.total} />
        <StatCard label="Trimise" value={stats.sent} />
        <StatCard label="Livrate" value={stats.delivered} />
        <StatCard label="Deschise" value={stats.opened} />
        <StatCard label="Bounce" value={stats.bounced} />
        <StatCard label="Reclamații" value={stats.complained} />
        <StatCard label="Eșuate" value={stats.failed} />
      </div>

      <section className="rounded-[2px] border border-[#e6e1d7] bg-white shadow-sm">
        <div className="border-b border-[#e6e1d7] bg-[#fbf9f3]/70 px-4 py-2 text-xs font-bold uppercase text-[#6b706a]">
          Campanii ({campaigns.length})
        </div>
        {campaigns.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-[#6b706a]">
            Nicio campanie încă.
          </p>
        ) : (
          campaigns.map((c) => (
            <div
              key={c.id}
              className="flex items-center gap-3 border-b border-[#e6e1d7] px-4 py-3 last:border-b-0"
            >
              <span className="min-w-0 flex-1">
                <span className="block font-bold text-[#171a16]">{c.templateKey}</span>
                <span className="block text-[11px] text-[#6b706a]">
                  {c.audienceKind} · {c.sentCount} trimise
                </span>
              </span>
              <StatusBadge tone={CAMPAIGN_TONE[c.status] ?? "neutral"} dot>
                {c.status}
              </StatusBadge>
            </div>
          ))
        )}
      </section>

      <section className="overflow-hidden rounded-[2px] border border-[#e6e1d7] bg-white shadow-sm">
        <div className="border-b border-[#e6e1d7] bg-[#fbf9f3]/70 px-4 py-2 text-xs font-bold uppercase text-[#6b706a]">
          Jurnal recent
        </div>
        {recent.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-[#6b706a]">
            Niciun email trimis încă.
          </p>
        ) : (
          recent.map((m) => (
            <div
              key={m.id}
              className="flex items-center gap-3 border-b border-[#e6e1d7] px-4 py-2.5 text-sm last:border-b-0"
            >
              <span className="min-w-0 flex-1 truncate text-[#171a16]">
                {m.subject}
                <span className="ml-2 text-[11px] text-[#6b706a]">→ {m.toEmail}</span>
              </span>
              <StatusBadge tone={MSG_TONE[m.status]}>{m.status}</StatusBadge>
            </div>
          ))
        )}
      </section>
    </AdminContent>
  );
}

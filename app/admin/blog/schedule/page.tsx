import type { Metadata } from "next";
import { deleteSchedule } from "@/app/actions/blog-ai";
import { getSchedules } from "@/app/data/blog-ai";
import { DeleteButton } from "@/app/admin/form-client";
import {
  AdminContent,
  IconLink,
  PageHeader,
  PrimaryLinkButton,
  StatusBadge,
  TableCard,
  TableFooter,
  Th,
} from "@/app/admin/admin-ui";
import { RunNowButton } from "./run-now-button";

export const metadata: Metadata = {
  title: "Programări blog | Admin PACA CONSTRUCT",
  description: "Programează generarea automată a articolelor de blog.",
};

const FREQUENCY_LABELS: Record<string, string> = {
  zilnic: "Zilnic",
  saptamanal: "Săptămânal",
  lunar: "Lunar",
};

function formatDateTime(value: string | null): string {
  if (!value) return "—";
  return new Intl.DateTimeFormat("ro-RO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default async function AdminSchedulePage() {
  const schedules = await getSchedules();

  return (
    <AdminContent>
      <PageHeader
        title="Programări blog"
        description="Reguli de generare automată. Rularea efectivă o face Vercel Cron; poți declanșa și manual."
        actions={
          <PrimaryLinkButton icon="add" href="/admin/blog/schedule/new">
            Programare nouă
          </PrimaryLinkButton>
        }
      />

      <TableCard
        minWidth={960}
        footer={
          <TableFooter
            shown={schedules.length}
            total={schedules.length}
            noun="programări"
          />
        }
      >
        <thead>
          <tr>
            <Th className="w-1/4">Nume</Th>
            <Th>Frecvență</Th>
            <Th>Articole/rulare</Th>
            <Th>Următoarea rulare</Th>
            <Th>Ultima rulare</Th>
            <Th>Status</Th>
            <Th className="text-right">Acțiuni</Th>
          </tr>
        </thead>
        <tbody>
          {schedules.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-10 text-center text-[#6b706a]">
                Nicio programare. Adaugă una pentru generare automată.
              </td>
            </tr>
          ) : (
            schedules.map((s) => (
              <tr
                className="border-b border-[#e6e1d7] transition-colors last:border-b-0 hover:bg-[#fbf9f3]/60"
                key={s.id}
              >
                <td className="px-4 py-3 font-bold text-[#171a16]">
                  {s.name || "(fără nume)"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-[#171a16]">
                  {FREQUENCY_LABELS[s.frequency] ?? s.frequency} · ora {s.hour}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-[#171a16]">
                  {s.posts_per_run}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-[#6b706a]">
                  {formatDateTime(s.next_run_at)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-[#6b706a]">
                  {formatDateTime(s.last_run_at)}
                </td>
                <td className="px-4 py-3">
                  {s.is_active ? (
                    <StatusBadge tone="success" dot>
                      Activă
                    </StatusBadge>
                  ) : (
                    <StatusBadge tone="neutral" dot>
                      Inactivă
                    </StatusBadge>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <RunNowButton id={s.id} />
                    <IconLink
                      icon="edit"
                      label="Editează"
                      href={`/admin/blog/schedule/${s.id}`}
                    />
                    <DeleteButton action={deleteSchedule} id={s.id} />
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </TableCard>
    </AdminContent>
  );
}

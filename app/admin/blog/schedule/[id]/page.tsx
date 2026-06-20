import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { updateSchedule } from "@/app/actions/blog-ai";
import { AdminContent, PageHeader } from "@/app/admin/admin-ui";
import { getScheduleById } from "@/app/data/blog-ai";
import { ScheduleForm } from "../schedule-form";

export const metadata: Metadata = {
  title: "Editează programare | Admin PACA CONSTRUCT",
  description: "Editează o programare de generare automată.",
};

export default async function EditSchedulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const schedule = await getScheduleById(id);
  if (!schedule) {
    notFound();
  }

  return (
    <AdminContent>
      <PageHeader
        title="Editează programare"
        description={schedule.name || "Programare de generare"}
      />
      <ScheduleForm action={updateSchedule} schedule={schedule} />
    </AdminContent>
  );
}

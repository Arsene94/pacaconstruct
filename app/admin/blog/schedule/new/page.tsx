import type { Metadata } from "next";
import { createSchedule } from "@/app/actions/blog-ai";
import { AdminContent, PageHeader } from "@/app/admin/admin-ui";
import { ScheduleForm } from "../schedule-form";

export const metadata: Metadata = {
  title: "Programare nouă | Admin PACA CONSTRUCT",
  description: "Adaugă o programare de generare automată.",
};

export default async function NewSchedulePage() {
  return (
    <AdminContent>
      <PageHeader
        title="Programare nouă"
        description="Definește frecvența de generare automată a articolelor."
      />
      <ScheduleForm action={createSchedule} />
    </AdminContent>
  );
}

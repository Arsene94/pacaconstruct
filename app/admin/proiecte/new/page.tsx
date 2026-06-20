import type { Metadata } from "next";
import { createProject } from "@/app/actions/content";
import { AdminContent, PageHeader } from "../../admin-ui";
import { ProjectForm } from "../project-form";

export const metadata: Metadata = {
  title: "Proiect nou | Admin PACA CONSTRUCT",
  description: "Adaugă un proiect în evidență.",
};

export default async function NewProiectPage() {
  return (
    <AdminContent>
      <PageHeader
        title="Proiect nou"
        description="Adaugă un proiect în evidență."
      />
      <ProjectForm action={createProject} />
    </AdminContent>
  );
}

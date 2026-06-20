import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { updateProject } from "@/app/actions/content";
import { getProject } from "@/app/data/projects";
import { AdminContent, PageHeader } from "../../admin-ui";
import { ProjectForm } from "../project-form";

export const metadata: Metadata = {
  title: "Editează proiect | Admin PACA CONSTRUCT",
  description: "Modifică un proiect din evidență.",
};

export default async function EditProiectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) {
    notFound();
  }

  return (
    <AdminContent>
      <PageHeader title="Editează proiect" description={project.name} />
      <ProjectForm action={updateProject} project={project} />
    </AdminContent>
  );
}

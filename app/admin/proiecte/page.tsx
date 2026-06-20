import type { Metadata } from "next";
import { deleteProject } from "@/app/actions/content";
import { getProjects, type ProjectStatus } from "@/app/data/projects";
import {
  AdminContent,
  FilterSelect,
  IconLink,
  PageHeader,
  PrimaryLinkButton,
  SearchField,
  SecondaryButton,
  StatusBadge,
  TableCard,
  TableFooter,
  Th,
  Toolbar,
} from "../admin-ui";
import { DeleteButton } from "../form-client";

export const metadata: Metadata = {
  title: "Proiecte | Admin PACA CONSTRUCT",
  description: "Evidența proiectelor și lucrărilor în derulare.",
};

const statusTone: Record<
  ProjectStatus,
  "success" | "warning" | "error" | "forest" | "neutral"
> = {
  Ofertat: "forest",
  Planificat: "neutral",
  "În execuție": "warning",
  Finalizat: "success",
  Suspendat: "error",
};

export default async function AdminProiectePage() {
  const projects = await getProjects();
  const activeValue = projects.filter(
    (project) => project.status === "În execuție",
  ).length;

  return (
    <AdminContent>
      <PageHeader
        title="Proiecte"
        description={`${projects.length} proiecte în evidență · ${activeValue} în execuție`}
        actions={
          <>
            <SecondaryButton icon="download">Export</SecondaryButton>
            <PrimaryLinkButton icon="add" href="/admin/proiecte/new">
              Proiect nou
            </PrimaryLinkButton>
          </>
        }
      />

      <Toolbar>
        <SearchField placeholder="Caută după client, cod sau locație..." />
        <div className="flex flex-wrap items-center gap-3">
          <FilterSelect
            label="Tip"
            options={["Toate", "Excavări", "Terasamente", "Amenajări", "Închiriere"]}
          />
          <FilterSelect
            label="Status"
            options={[
              "Toate",
              "Ofertat",
              "Planificat",
              "În execuție",
              "Finalizat",
              "Suspendat",
            ]}
          />
        </div>
      </Toolbar>

      <TableCard
        minWidth={1040}
        footer={
          <TableFooter shown={projects.length} total={projects.length} noun="proiecte" />
        }
      >
        <thead>
          <tr>
            <Th>Cod</Th>
            <Th className="w-1/4">Proiect</Th>
            <Th>Tip</Th>
            <Th>Locație</Th>
            <Th className="text-right">Valoare</Th>
            <Th>Termen</Th>
            <Th>Status</Th>
            <Th className="text-right">Acțiuni</Th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr
              className="border-b border-[#e6e1d7] transition-colors last:border-b-0 hover:bg-[#fbf9f3]/60"
              key={project.id}
            >
              <td className="whitespace-nowrap px-4 py-3 font-mono text-[11px] text-[#6b706a]">
                {project.code}
              </td>
              <td className="px-4 py-3">
                <div className="font-bold text-[#171a16]">{project.name}</div>
                <div className="mt-0.5 text-[11px] text-[#6b706a]">
                  {project.client}
                </div>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-[#171a16]">
                {project.type}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-[#6b706a]">
                {project.location}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-right font-semibold text-[#171a16]">
                {project.value}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-[#6b706a]">
                {project.deadline}
              </td>
              <td className="px-4 py-3">
                <StatusBadge tone={statusTone[project.status]} dot>
                  {project.status}
                </StatusBadge>
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-1">
                  <IconLink
                    href={`/admin/proiecte/${project.id}`}
                    icon="edit"
                    label="Editează"
                  />
                  <DeleteButton action={deleteProject} id={project.id} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </TableCard>
    </AdminContent>
  );
}

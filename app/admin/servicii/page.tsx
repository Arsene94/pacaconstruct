import type { Metadata } from "next";
import { deleteService } from "@/app/actions/content";
import { getServicesAdmin } from "@/app/data/services";
import { DeleteButton } from "../form-client";
import {
  AdminContent,
  FilterSelect,
  IconButton,
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

export const metadata: Metadata = {
  title: "Servicii | Admin PACA CONSTRUCT",
  description: "Administrarea paginilor de servicii publicate pe site.",
};

export default async function AdminServiciiPage() {
  const services = await getServicesAdmin();

  return (
    <AdminContent>
      <PageHeader
        title="Servicii"
        description="Paginile de servicii publicate pe site, cu procese și specificații tehnice."
        actions={
          <>
            <SecondaryButton icon="download">Export</SecondaryButton>
            <PrimaryLinkButton href="/admin/servicii/new" icon="add">
              Serviciu nou
            </PrimaryLinkButton>
          </>
        }
      />

      <Toolbar>
        <SearchField placeholder="Caută după titlu sau slug..." />
        <div className="flex flex-wrap items-center gap-3">
          <FilterSelect label="Status" options={["Toate", "Publicat", "Draft"]} />
          <FilterSelect
            label="Categorie"
            options={["Toate", "Servicii Premium", "Terasamente", "Amenajări"]}
          />
        </div>
      </Toolbar>

      <TableCard
        minWidth={920}
        footer={
          <TableFooter shown={services.length} total={services.length} noun="servicii" />
        }
      >
        <thead>
          <tr>
            <Th className="w-2/5">Serviciu</Th>
            <Th>Slug</Th>
            <Th>Imagine</Th>
            <Th>Procese</Th>
            <Th>Specificații</Th>
            <Th>Status</Th>
            <Th className="text-right">Acțiuni</Th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr
              className="border-b border-[#e6e1d7] transition-colors last:border-b-0 hover:bg-[#fbf9f3]/60"
              key={service.id}
            >
              <td className="px-4 py-3">
                <div className="font-bold text-[#171a16]">{service.title}</div>
                <div className="mt-0.5 text-[11px] uppercase tracking-wide text-[#6b706a]">
                  {service.eyebrow}
                </div>
              </td>
              <td className="whitespace-nowrap px-4 py-3 font-mono text-[11px] text-[#6b706a]">
                /{service.slug}
              </td>
              <td className="px-4 py-3">
                {service.image_src ? (
                  <StatusBadge tone="success">Da</StatusBadge>
                ) : (
                  <StatusBadge tone="neutral">Lipsă</StatusBadge>
                )}
              </td>
              <td className="px-4 py-3 text-[#171a16]">{service.processes.length}</td>
              <td className="px-4 py-3 text-[#171a16]">{service.specs.length}</td>
              <td className="px-4 py-3">
                {service.is_published ? (
                  <StatusBadge tone="success" dot>
                    Publicat
                  </StatusBadge>
                ) : (
                  <StatusBadge tone="neutral" dot>
                    Draft
                  </StatusBadge>
                )}
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-1">
                  <IconButton
                    href={`/servicii/${service.slug}`}
                    icon="openInNew"
                    label="Vezi pe site"
                  />
                  <IconLink
                    href={`/admin/servicii/${service.id}`}
                    icon="edit"
                    label="Editează"
                  />
                  <DeleteButton action={deleteService} id={service.id} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </TableCard>
    </AdminContent>
  );
}

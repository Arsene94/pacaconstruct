import type { Metadata } from "next";
import { deleteRental } from "@/app/actions/content";
import { getRentalsAdmin } from "@/app/data/rentals";
import { DeleteButton } from "@/app/admin/form-client";
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
  title: "Utilaje de închiriat | Admin PACA CONSTRUCT",
  description: "Administrarea utilajelor disponibile pentru închiriere.",
};

export default async function AdminUtilajePage() {
  const machines = await getRentalsAdmin();
  const categories = [
    "Toate",
    ...Array.from(new Set(machines.map((machine) => machine.category))),
  ];

  return (
    <AdminContent>
      <PageHeader
        title="Utilaje de închiriat"
        description="Catalogul de utilaje publicat în secțiunea de închirieri a site-ului."
        actions={
          <>
            <SecondaryButton icon="download">Export</SecondaryButton>
            <PrimaryLinkButton icon="add" href="/admin/utilaje/new">
              Utilaj nou
            </PrimaryLinkButton>
          </>
        }
      />

      <Toolbar>
        <SearchField placeholder="Caută după denumire sau slug..." />
        <div className="flex flex-wrap items-center gap-3">
          <FilterSelect label="Categorie" options={categories} />
          <FilterSelect
            label="Status"
            options={["Toate", "Disponibil", "Indisponibil"]}
          />
        </div>
      </Toolbar>

      <TableCard
        minWidth={960}
        footer={
          <TableFooter shown={machines.length} total={machines.length} noun="utilaje" />
        }
      >
        <thead>
          <tr>
            <Th className="w-2/5">Utilaj</Th>
            <Th>Categorie</Th>
            <Th>Tarif</Th>
            <Th>Specificații</Th>
            <Th>Status</Th>
            <Th className="text-right">Acțiuni</Th>
          </tr>
        </thead>
        <tbody>
          {machines.map((machine) => (
            <tr
              className="border-b border-[#e6e1d7] transition-colors last:border-b-0 hover:bg-[#fbf9f3]/60"
              key={machine.id}
            >
              <td className="px-4 py-3">
                <div className="font-bold text-[#171a16]">{machine.title}</div>
                <div className="mt-0.5 font-mono text-[11px] text-[#6b706a]">
                  /{machine.slug}
                </div>
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <StatusBadge tone="forest">{machine.category}</StatusBadge>
              </td>
              <td className="whitespace-nowrap px-4 py-3 font-semibold text-[#171a16]">
                {machine.price}
              </td>
              <td className="px-4 py-3 text-[#171a16]">{machine.specs.length}</td>
              <td className="px-4 py-3">
                {machine.is_available ? (
                  <StatusBadge tone="success" dot>
                    Disponibil
                  </StatusBadge>
                ) : (
                  <StatusBadge tone="neutral" dot>
                    Indisponibil
                  </StatusBadge>
                )}
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-1">
                  <IconButton
                    href={`/inchiriere-utilaje/${machine.slug}`}
                    icon="openInNew"
                    label="Vezi pe site"
                  />
                  <IconLink
                    href={`/admin/utilaje/${machine.id}`}
                    icon="edit"
                    label="Editează"
                  />
                  <DeleteButton action={deleteRental} id={machine.id} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </TableCard>
    </AdminContent>
  );
}

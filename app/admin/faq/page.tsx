import type { Metadata } from "next";
import { deleteFaqItem } from "@/app/actions/content";
import {
  AdminContent,
  FilterSelect,
  IconLink,
  PageHeader,
  PrimaryLinkButton,
  SearchField,
  StatusBadge,
  TableCard,
  TableFooter,
  Th,
  Toolbar,
} from "@/app/admin/admin-ui";
import { DeleteButton } from "@/app/admin/form-client";
import { getFaqItemsAdmin } from "@/app/data/faq";

export const metadata: Metadata = {
  title: "FAQ | Admin PACA CONSTRUCT",
  description: "Administrarea întrebărilor frecvente afișate pe site.",
};

export default async function AdminFaqPage() {
  const rows = await getFaqItemsAdmin();
  const categories = ["Toate", ...new Set(rows.map((row) => row.section_title))];

  return (
    <AdminContent>
      <PageHeader
        title="Întrebări frecvente"
        description={`${new Set(rows.map((row) => row.section_title)).size} categorii · ${rows.length} întrebări`}
        actions={
          <PrimaryLinkButton href="/admin/faq/new" icon="add">
            Întrebare nouă
          </PrimaryLinkButton>
        }
      />

      <Toolbar>
        <SearchField placeholder="Caută o întrebare..." />
        <FilterSelect label="Categorie" options={categories} />
      </Toolbar>

      <TableCard
        minWidth={960}
        footer={<TableFooter shown={rows.length} total={rows.length} noun="întrebări" />}
      >
        <thead>
          <tr>
            <Th>Categorie</Th>
            <Th className="w-1/3">Întrebare</Th>
            <Th className="w-2/5">Răspuns</Th>
            <Th>Puncte cheie</Th>
            <Th>Status</Th>
            <Th className="text-right">Acțiuni</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              className="border-b border-[#e6e1d7] align-top transition-colors last:border-b-0 hover:bg-[#fbf9f3]/60"
              key={row.id}
            >
              <td className="px-4 py-3">
                <StatusBadge tone="forest">{row.section_title}</StatusBadge>
              </td>
              <td className="px-4 py-3 font-semibold text-[#171a16]">
                {row.question}
              </td>
              <td className="px-4 py-3 text-[#6b706a]">
                <span className="line-clamp-2">{row.answer}</span>
              </td>
              <td className="px-4 py-3 text-[#171a16]">{row.highlights.length}</td>
              <td className="px-4 py-3">
                {row.is_published ? (
                  <StatusBadge tone="success" dot>
                    Publicat
                  </StatusBadge>
                ) : (
                  <StatusBadge tone="neutral">Draft</StatusBadge>
                )}
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-1">
                  <IconLink
                    href={`/admin/faq/${row.id}`}
                    icon="edit"
                    label="Editează"
                  />
                  <DeleteButton action={deleteFaqItem} id={row.id} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </TableCard>
    </AdminContent>
  );
}

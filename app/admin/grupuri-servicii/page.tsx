import type { Metadata } from "next";
import { deleteServiceGroup } from "@/app/actions/content";
import { getServiceGroupsAdmin } from "@/app/data/services";
import { DeleteButton } from "../form-client";
import {
  AdminContent,
  IconButton,
  IconLink,
  PageHeader,
  PrimaryLinkButton,
  StatusBadge,
  TableCard,
  TableFooter,
  Th,
} from "../admin-ui";

export const metadata: Metadata = {
  title: "Grupuri servicii | Admin PACA CONSTRUCT",
  description: "Coloanele meniului de servicii și ordinea lor.",
};

export default async function AdminServiceGroupsPage() {
  const groups = await getServiceGroupsAdmin();

  return (
    <AdminContent>
      <PageHeader
        title="Grupuri servicii"
        description="Coloanele din meniul „Servicii”. Fiecare serviciu se asignează unui grup pentru a apărea în meniu."
        actions={
          <PrimaryLinkButton href="/admin/grupuri-servicii/new" icon="add">
            Grup nou
          </PrimaryLinkButton>
        }
      />

      <TableCard
        minWidth={760}
        footer={
          <TableFooter shown={groups.length} total={groups.length} noun="grupuri" />
        }
      >
        <thead>
          <tr>
            <Th className="w-2/5">Grup</Th>
            <Th>Slug</Th>
            <Th>Link</Th>
            <Th>Servicii</Th>
            <Th>Ordine</Th>
            <Th className="text-right">Acțiuni</Th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group) => (
            <tr
              className="border-b border-[#e6e1d7] transition-colors last:border-b-0 hover:bg-[#fbf9f3]/60"
              key={group.id}
            >
              <td className="px-4 py-3">
                <div className="font-bold text-[#171a16]">{group.title}</div>
              </td>
              <td className="whitespace-nowrap px-4 py-3 font-mono text-[11px] text-[#6b706a]">
                {group.slug}
              </td>
              <td className="whitespace-nowrap px-4 py-3 font-mono text-[11px] text-[#6b706a]">
                {group.href}
              </td>
              <td className="px-4 py-3">
                {group.service_count > 0 ? (
                  <StatusBadge tone="success">{group.service_count}</StatusBadge>
                ) : (
                  <StatusBadge tone="neutral">0</StatusBadge>
                )}
              </td>
              <td className="px-4 py-3 text-[#171a16]">{group.sort_order}</td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-1">
                  <IconButton href={group.href} icon="openInNew" label="Vezi pe site" />
                  <IconLink
                    href={`/admin/grupuri-servicii/${group.id}`}
                    icon="edit"
                    label="Editează"
                  />
                  <DeleteButton action={deleteServiceGroup} id={group.id} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </TableCard>
    </AdminContent>
  );
}

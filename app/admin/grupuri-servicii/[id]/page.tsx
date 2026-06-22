import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { updateServiceGroup } from "@/app/actions/content";
import { getServiceGroupById } from "@/app/data/services";
import { AdminContent, PageHeader } from "../../admin-ui";
import { ServiceGroupForm } from "../service-group-form";

export const metadata: Metadata = {
  title: "Editează grup | Admin PACA CONSTRUCT",
};

export default async function EditServiceGroupPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const group = await getServiceGroupById(id);

  if (!group) {
    notFound();
  }

  return (
    <AdminContent>
      <PageHeader title="Editează grup" description={group.title} />
      <ServiceGroupForm action={updateServiceGroup} group={group} />
    </AdminContent>
  );
}

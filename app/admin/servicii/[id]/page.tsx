import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { updateService } from "@/app/actions/content";
import { getServiceById, getServiceGroupOptions } from "@/app/data/services";
import { AdminContent, PageHeader } from "../../admin-ui";
import { ServiceForm } from "../service-form";

export const metadata: Metadata = {
  title: "Editează serviciu | Admin PACA CONSTRUCT",
};

export default async function EditServicePage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const [service, groups] = await Promise.all([
    getServiceById(id),
    getServiceGroupOptions(),
  ]);

  if (!service) {
    notFound();
  }

  return (
    <AdminContent>
      <PageHeader title="Editează serviciu" description={service.title} />
      <ServiceForm action={updateService} groups={groups} service={service} />
    </AdminContent>
  );
}

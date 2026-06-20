import type { Metadata } from "next";
import { createService } from "@/app/actions/content";
import { getServiceGroupOptions } from "@/app/data/services";
import { AdminContent, PageHeader } from "../../admin-ui";
import { ServiceForm } from "../service-form";

export const metadata: Metadata = {
  title: "Serviciu nou | Admin PACA CONSTRUCT",
};

export default async function NewServicePage() {
  const groups = await getServiceGroupOptions();

  return (
    <AdminContent>
      <PageHeader
        title="Serviciu nou"
        description="Adaugă o pagină de serviciu nouă."
      />
      <ServiceForm action={createService} groups={groups} />
    </AdminContent>
  );
}

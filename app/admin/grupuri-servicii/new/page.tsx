import type { Metadata } from "next";
import { createServiceGroup } from "@/app/actions/content";
import { AdminContent, PageHeader } from "../../admin-ui";
import { ServiceGroupForm } from "../service-group-form";

export const metadata: Metadata = {
  title: "Grup nou | Admin PACA CONSTRUCT",
};

export default function NewServiceGroupPage() {
  return (
    <AdminContent>
      <PageHeader
        title="Grup nou"
        description="Adaugă o coloană nouă în meniul de servicii."
      />
      <ServiceGroupForm action={createServiceGroup} />
    </AdminContent>
  );
}

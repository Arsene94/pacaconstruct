import type { Metadata } from "next";
import { createRental } from "@/app/actions/content";
import { AdminContent, PageHeader } from "@/app/admin/admin-ui";
import { RentalForm } from "../rental-form";

export const metadata: Metadata = {
  title: "Utilaj nou | Admin PACA CONSTRUCT",
  description: "Adaugă un utilaj în catalog.",
};

export default async function NewRentalPage() {
  return (
    <AdminContent>
      <PageHeader
        title="Utilaj nou"
        description="Adaugă un utilaj în catalog."
      />
      <RentalForm action={createRental} />
    </AdminContent>
  );
}

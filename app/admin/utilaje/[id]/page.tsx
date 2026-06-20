import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { updateRental } from "@/app/actions/content";
import { getRentalById } from "@/app/data/rentals";
import { AdminContent, PageHeader } from "@/app/admin/admin-ui";
import { RentalForm } from "../rental-form";

export const metadata: Metadata = {
  title: "Editează utilaj | Admin PACA CONSTRUCT",
  description: "Modifică un utilaj din catalog.",
};

export default async function EditRentalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const machine = await getRentalById(id);
  if (!machine) {
    notFound();
  }

  return (
    <AdminContent>
      <PageHeader title="Editează utilaj" description={machine.title} />
      <RentalForm action={updateRental} machine={machine} />
    </AdminContent>
  );
}

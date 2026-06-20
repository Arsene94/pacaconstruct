import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { updateFaqItem } from "@/app/actions/content";
import { AdminContent, PageHeader } from "@/app/admin/admin-ui";
import { FaqItemForm } from "@/app/admin/faq/faq-form";
import { getFaqItemById, getFaqSectionOptions } from "@/app/data/faq";

export const metadata: Metadata = {
  title: "Editează întrebarea | Admin PACA CONSTRUCT",
  description: "Modifică o întrebare frecventă.",
};

export default async function EditFaqItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [item, sections] = await Promise.all([
    getFaqItemById(id),
    getFaqSectionOptions(),
  ]);

  if (!item) notFound();

  return (
    <AdminContent>
      <PageHeader title="Editează întrebarea" description={item.question} />
      <FaqItemForm action={updateFaqItem} item={item} sections={sections} />
    </AdminContent>
  );
}

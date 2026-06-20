import type { Metadata } from "next";
import { createFaqItem } from "@/app/actions/content";
import { AdminContent, PageHeader } from "@/app/admin/admin-ui";
import { FaqItemForm } from "@/app/admin/faq/faq-form";
import { getFaqSectionOptions } from "@/app/data/faq";

export const metadata: Metadata = {
  title: "Întrebare nouă | Admin PACA CONSTRUCT",
  description: "Adaugă o întrebare frecventă.",
};

export default async function NewFaqItemPage() {
  const sections = await getFaqSectionOptions();

  return (
    <AdminContent>
      <PageHeader
        title="Întrebare nouă"
        description="Adaugă o întrebare frecventă."
      />
      <FaqItemForm action={createFaqItem} sections={sections} />
    </AdminContent>
  );
}

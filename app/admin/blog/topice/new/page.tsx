import type { Metadata } from "next";
import { createTopic } from "@/app/actions/blog-ai";
import { AdminContent, PageHeader } from "@/app/admin/admin-ui";
import { TopicForm } from "../topic-form";

export const metadata: Metadata = {
  title: "Topic nou | Admin PACA CONSTRUCT",
  description: "Adaugă manual un topic de blog.",
};

export default async function NewTopicPage() {
  return (
    <AdminContent>
      <PageHeader title="Topic nou" description="Adaugă manual un subiect pentru generare." />
      <TopicForm action={createTopic} />
    </AdminContent>
  );
}

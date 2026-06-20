import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { updateTopic } from "@/app/actions/blog-ai";
import { AdminContent, PageHeader } from "@/app/admin/admin-ui";
import { getTopicById } from "@/app/data/blog-ai";
import { TopicForm } from "../topic-form";

export const metadata: Metadata = {
  title: "Editează topic | Admin PACA CONSTRUCT",
  description: "Editează un topic de blog existent.",
};

export default async function EditTopicPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const topic = await getTopicById(id);
  if (!topic) {
    notFound();
  }

  return (
    <AdminContent>
      <PageHeader title="Editează topic" description={topic.title} />
      <TopicForm action={updateTopic} topic={topic} />
    </AdminContent>
  );
}

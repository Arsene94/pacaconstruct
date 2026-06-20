import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { updatePost } from "@/app/actions/content";
import { AdminContent, PageHeader } from "@/app/admin/admin-ui";
import { getPostById } from "@/app/data/blog";
import { PostForm } from "../post-form";

export const metadata: Metadata = {
  title: "Editează articol | Admin PACA CONSTRUCT",
  description: "Editează un articol de blog existent.",
};

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) {
    notFound();
  }

  return (
    <AdminContent>
      <PageHeader title="Editează articol" description={post.title} />
      <PostForm action={updatePost} post={post} />
    </AdminContent>
  );
}

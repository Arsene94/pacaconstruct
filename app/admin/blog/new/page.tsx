import type { Metadata } from "next";
import { createPost } from "@/app/actions/content";
import { AdminContent, PageHeader } from "@/app/admin/admin-ui";
import { PostForm } from "../post-form";

export const metadata: Metadata = {
  title: "Articol nou | Admin PACA CONSTRUCT",
  description: "Scrie un articol de blog nou.",
};

export default async function NewBlogPostPage() {
  return (
    <AdminContent>
      <PageHeader
        title="Articol nou"
        description="Scrie un articol de blog nou."
      />
      <PostForm action={createPost} />
    </AdminContent>
  );
}

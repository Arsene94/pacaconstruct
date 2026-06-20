import type { Metadata } from "next";
import { getTopics } from "@/app/data/blog-ai";
import { AdminContent, PageHeader, PrimaryLinkButton } from "@/app/admin/admin-ui";
import { TopicsManager } from "./topics-client";

export const metadata: Metadata = {
  title: "Topice blog | Admin PACA CONSTRUCT",
  description: "Topice pentru generarea automată de articole de blog.",
};

export default async function AdminTopicsPage() {
  const topics = await getTopics();

  return (
    <AdminContent>
      <PageHeader
        title="Topice blog"
        description="Subiecte din care se generează articole. Analizează automat întrebările clienților sau adaugă manual."
        actions={
          <PrimaryLinkButton icon="add" href="/admin/blog/topice/new">
            Topic nou
          </PrimaryLinkButton>
        }
      />
      <TopicsManager topics={topics} />
    </AdminContent>
  );
}

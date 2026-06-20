import type { Metadata } from "next";
import { deletePost } from "@/app/actions/content";
import { getPostsAdmin } from "@/app/data/blog";
import { DeleteButton } from "@/app/admin/form-client";
import {
  AdminContent,
  FilterSelect,
  IconButton,
  IconLink,
  PageHeader,
  PrimaryLinkButton,
  SearchField,
  SecondaryButton,
  StatusBadge,
  TableCard,
  TableFooter,
  Th,
  Toolbar,
} from "../admin-ui";

export const metadata: Metadata = {
  title: "Blog | Admin PACA CONSTRUCT",
  description: "Administrarea articolelor de blog publicate pe site.",
};

export default async function AdminBlogPage() {
  const posts = await getPostsAdmin();
  const categories = [
    "Toate",
    ...Array.from(new Set(posts.map((post) => post.category))),
  ];

  return (
    <AdminContent>
      <PageHeader
        title="Articole blog"
        description="Conținutul editorial publicat în secțiunea de blog a site-ului."
        actions={
          <>
            <SecondaryButton icon="download">Export</SecondaryButton>
            <PrimaryLinkButton icon="add" href="/admin/blog/new">
              Articol nou
            </PrimaryLinkButton>
          </>
        }
      />

      <Toolbar>
        <SearchField placeholder="Caută după titlu..." />
        <div className="flex flex-wrap items-center gap-3">
          <FilterSelect label="Categorie" options={categories} />
          <FilterSelect label="Status" options={["Toate", "Publicat", "Draft"]} />
        </div>
      </Toolbar>

      <TableCard
        minWidth={960}
        footer={<TableFooter shown={posts.length} total={posts.length} noun="articole" />}
      >
        <thead>
          <tr>
            <Th className="w-2/5">Articol</Th>
            <Th>Categorie</Th>
            <Th>Timp citire</Th>
            <Th>Publicat</Th>
            <Th>Status</Th>
            <Th className="text-right">Acțiuni</Th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr
              className="border-b border-[#e6e1d7] transition-colors last:border-b-0 hover:bg-[#fbf9f3]/60"
              key={post.id}
            >
              <td className="px-4 py-3">
                <div className="font-bold text-[#171a16]">{post.title}</div>
                <div className="mt-0.5 font-mono text-[11px] text-[#6b706a]">
                  /{post.slug}
                </div>
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <StatusBadge tone="forest">{post.category}</StatusBadge>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-[#171a16]">
                {post.read_time}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-[#6b706a]">
                {post.published_label}
              </td>
              <td className="px-4 py-3">
                {post.is_published ? (
                  <StatusBadge tone="success" dot>
                    Publicat
                  </StatusBadge>
                ) : (
                  <StatusBadge tone="neutral" dot>
                    Draft
                  </StatusBadge>
                )}
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-1">
                  <IconButton
                    href={`/blog/${post.slug}`}
                    icon="openInNew"
                    label="Vezi pe site"
                  />
                  <IconLink
                    icon="edit"
                    label="Editează"
                    href={`/admin/blog/${post.id}`}
                  />
                  <DeleteButton action={deletePost} id={post.id} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </TableCard>
    </AdminContent>
  );
}

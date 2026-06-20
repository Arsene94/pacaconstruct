import type { Metadata } from "next";
import { getGroups, getSegments } from "@/app/data/contacts";
import { emailRegistry, EMAIL_TEMPLATE_KEYS } from "@/emails/registry";
import { adminTo } from "@/app/lib/email/resend";
import { AdminContent, PageHeader, SecondaryLinkButton } from "@/app/admin/admin-ui";
import { Composer } from "../composer";

export const metadata: Metadata = {
  title: "Campanie nouă | Admin PACA CONSTRUCT",
  description: "Compune și trimite o campanie email cu preview desktop/mobile.",
};

export default async function NewCampaignPage() {
  const [groups, segments] = await Promise.all([getGroups(), getSegments()]);

  const templates = EMAIL_TEMPLATE_KEYS.filter(
    (k) => emailRegistry[k].category === "marketing",
  ).map((k) => ({ value: k, label: emailRegistry[k].name }));

  const audiences = [
    ...groups.map((g) => ({
      value: `group:${g.id}`,
      label: `Grup: ${g.name} (${g.memberCount})`,
    })),
    ...segments.map((s) => ({
      value: `segment:${s.id}`,
      label: `Segment: ${s.name}`,
    })),
  ];

  return (
    <AdminContent>
      <PageHeader
        title="Campanie nouă"
        description="Alege template, audiență, compune și fă preview înainte de trimitere."
        actions={
          <SecondaryLinkButton icon="chevronLeft" href="/admin/email">
            Înapoi
          </SecondaryLinkButton>
        }
      />
      <Composer
        templates={templates}
        audiences={audiences}
        defaultTestEmail={adminTo()[0] ?? ""}
      />
    </AdminContent>
  );
}

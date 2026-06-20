import type { Metadata } from "next";
import {
  AdminContent,
  PageHeader,
  PrimaryLinkButton,
  SecondaryLinkButton,
} from "@/app/admin/admin-ui";

export const metadata: Metadata = {
  title: "Email | Admin PACA CONSTRUCT",
  description: "Centru de campanii și template-uri email.",
};

export default function AdminEmailHubPage() {
  return (
    <AdminContent>
      <PageHeader
        title="Email"
        description="Contacte, grupuri și campanii — sistemul de email PACA CONSTRUCT."
        actions={
          <>
            <SecondaryLinkButton icon="mail" href="/admin/email/contacts">
              Contacte
            </SecondaryLinkButton>
            <SecondaryLinkButton icon="personAdd" href="/admin/email/groups">
              Grupuri
            </SecondaryLinkButton>
            <PrimaryLinkButton icon="add" href="/admin/email/campaigns/new">
              Campanie nouă
            </PrimaryLinkButton>
          </>
        }
      />
      <p className="text-sm text-[#6b706a]">
        Compunerea campaniilor, preview-ul și dashboard-ul de livrare se adaugă în fazele
        următoare.
      </p>
    </AdminContent>
  );
}

import type { Metadata } from "next";
import { getSettingsAdmin } from "@/app/data/settings";
import { AdminContent, PageHeader } from "../admin-ui";
import { SettingsForms } from "./settings-forms";

// Conținut dependent de sesiune (RLS admin) → randare dinamică.
export const dynamic = "force-dynamic";

// robots:{index:false} e moștenit din layout-ul de admin.
export const metadata: Metadata = {
  title: "Setări site",
};

export default async function SettingsPage() {
  const settings = await getSettingsAdmin();

  return (
    <AdminContent>
      <PageHeader
        title="Setări site"
        description="Date de contact, butoane flotante, program, social și bara de anunț. Fiecare secțiune se salvează independent."
      />
      <SettingsForms settings={settings} />
    </AdminContent>
  );
}

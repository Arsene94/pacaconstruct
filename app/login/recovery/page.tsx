import type { Metadata } from "next";
import { RecoveryExperience } from "../auth-forms";

export const metadata: Metadata = {
  title: "Password Recovery | PACA CONSTRUCT",
  description: "Recuperare acces pentru portalul intern PACA CONSTRUCT.",
  robots: { index: false, follow: false },
};

export default function LoginRecoveryPage() {
  return <RecoveryExperience />;
}

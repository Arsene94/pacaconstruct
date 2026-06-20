import type { Metadata } from "next";
import { UpdatePasswordExperience } from "../auth-forms";

export const metadata: Metadata = {
  title: "Setare parolă nouă | PACA CONSTRUCT",
  description: "Setarea unei parole noi pentru portalul intern PACA CONSTRUCT.",
  robots: { index: false, follow: false },
};

export default function UpdatePasswordPage() {
  return <UpdatePasswordExperience />;
}

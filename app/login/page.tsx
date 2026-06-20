import type { Metadata } from "next";
import { LoginExperience } from "./auth-forms";

export const metadata: Metadata = {
  title: "Admin Login | PACA CONSTRUCT",
  description: "Portal intern de autentificare pentru administratori PACA CONSTRUCT.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return <LoginExperience />;
}

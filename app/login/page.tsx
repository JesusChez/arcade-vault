import type { Metadata } from "next";
import { Suspense } from "react";
import AuthForm from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Acceso · Arcade Vault",
  description: "Inicia sesión o crea una cuenta en Arcade Vault para guardar tus puntuaciones y entrar en el Salón de la Fama.",
};

export default function AccessPage() {
  return (
    <Suspense>
      <AuthForm />
    </Suspense>
  );
}

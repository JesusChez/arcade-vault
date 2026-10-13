import type { Metadata } from "next";
import { Suspense } from "react";
import HallOfFame from "@/components/HallOfFame";

export const metadata: Metadata = {
  title: "Salón de la Fama · Arcade Vault",
  description: "Los nombres que nunca se borran de la pantalla: las mejores puntuaciones de cada juego de Arcade Vault.",
};

export default function HallOfFamePage() {
  return (
    <Suspense>
      <HallOfFame />
    </Suspense>
  );
}

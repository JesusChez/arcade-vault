import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GamePlayer from "@/components/GamePlayer";
import { GAMES, getGame } from "@/lib/games";

export function generateStaticParams() {
  return GAMES.map((game) => ({ id: game.id }));
}

export async function generateMetadata({ params }: PageProps<"/games/[id]/play">): Promise<Metadata> {
  const { id } = await params;
  const game = getGame(id);
  if (!game) notFound();
  return {
    title: `Jugando a ${game.title} · Arcade Vault`,
    description: `Juega a ${game.title} en Arcade Vault y guarda tu puntuación en el Salón de la Fama.`,
  };
}

// Blocking route: params are read before rendering so notFound() runs before streaming
// (real 404 status for unknown ids). Known ids are fully prerendered via generateStaticParams.
export const instant = false;

export default async function GamePlayerPage({ params }: PageProps<"/games/[id]/play">) {
  const { id } = await params;
  const game = getGame(id);
  if (!game) notFound();

  return <GamePlayer game={game} />;
}

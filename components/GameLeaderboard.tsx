"use client";

import { useSavedScores } from "@/hooks/useSavedScores";
import { buildLeaderboard, formatScore } from "@/lib/scores";

const DETAIL_ROWS = 10;

function rowClass(index: number): string {
  if (index === 0) return " top1";
  if (index === 1) return " top2";
  if (index === 2) return " top3";
  return "";
}

// "Mejor global": score of row 1 of the combined leaderboard.
export function GameBestScore({ gameId }: { gameId: string }) {
  const saved = useSavedScores();
  return <>{formatScore(buildLeaderboard(gameId, saved)[0].score)}</>;
}

export default function GameLeaderboard({ gameId }: { gameId: string }) {
  const saved = useSavedScores();
  const rows = buildLeaderboard(gameId, saved).slice(0, DETAIL_ROWS);

  return (
    <div className="leaderboard">
      <h3>MEJORES PUNTUACIONES</h3>
      {rows.map((r, i) => (
        <div key={r.name} className={"lb-row" + rowClass(i)}>
          <div className="rk">#{String(r.rank).padStart(2, "0")}</div>
          <div className="pl">
            {r.name}
            <div style={{ fontSize: 10, color: "var(--ink-faint)", letterSpacing: "0.1em" }}>{r.date}</div>
          </div>
          <div className="sc">{formatScore(r.score)}</div>
        </div>
      ))}
    </div>
  );
}

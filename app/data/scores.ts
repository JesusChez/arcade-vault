import { useMemo, useSyncExternalStore } from 'react';

export interface Score {
  id: string;
  game_id: string;
  player_name: string;
  score: number;
  created_at: string;
}

const STORAGE_KEY = 'av_scores';
const EMPTY: Score[] = [];

// Sample scores so leaderboards are not empty on a fresh browser.
const SEED: [game: string, player: string, score: number, date: string][] = [
  ['asteroids', 'NEONFOX', 48200, '2026-10-02'],
  ['asteroids', 'Z3R0COOL', 41350, '2026-10-05'],
  ['asteroids', 'VAULT_07', 33900, '2026-10-09'],
  ['asteroids', 'GLITCHA', 21480, '2026-10-12'],
  ['asteroids', 'PX_KAI', 12760, '2026-10-15'],
  ['tetris', 'PX_KAI', 186400, '2026-10-01'],
  ['tetris', 'M00NRYU', 142900, '2026-10-04'],
  ['tetris', 'CYBER_LU', 98750, '2026-10-08'],
  ['tetris', 'NEONFOX', 61200, '2026-10-13'],
  ['tetris', 'ARKADYA', 28300, '2026-10-17'],
  ['arkanoid', 'GLITCHA', 28450, '2026-10-03'],
  ['arkanoid', 'ARKADYA', 24100, '2026-10-06'],
  ['arkanoid', 'VAULT_07', 19820, '2026-10-10'],
  ['arkanoid', 'Z3R0COOL', 11300, '2026-10-14'],
  ['arkanoid', 'M00NRYU', 6450, '2026-10-18'],
  ['snake', 'ARKADYA', 7820, '2026-10-02'],
  ['snake', 'CYBER_LU', 6340, '2026-10-07'],
  ['snake', 'PX_KAI', 4910, '2026-10-11'],
  ['snake', 'GLITCHA', 3280, '2026-10-16'],
  ['snake', 'NEONFOX', 1750, '2026-10-19'],
];

const SEED_SCORES: Score[] = SEED.map(([game_id, player_name, score, date], i) => ({
  id: `seed-${i}`,
  game_id,
  player_name,
  score,
  created_at: `${date}T12:00:00.000Z`,
}));

// localStorage-backed store, exposed to React through useSyncExternalStore.
const listeners = new Set<() => void>();
let cachedRaw: string | null = null;
let cachedScores: Score[] = EMPTY;

function readStoredScores(): Score[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedScores = raw ? (JSON.parse(raw) as Score[]) : EMPTY;
    } catch {
      cachedScores = EMPTY;
    }
  }
  return cachedScores;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener('storage', listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', listener);
  };
}

export function addScore(gameId: string, playerName: string, score: number) {
  const entry: Score = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    game_id: gameId,
    player_name: playerName,
    score,
    created_at: new Date().toISOString(),
  };
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([...readStoredScores(), entry]),
  );
  listeners.forEach((l) => l());
}

/** Top scores for a game, seed + this browser's saved scores. */
export function useLeaderboard(gameId: string, limit: number): Score[] {
  const stored = useSyncExternalStore(
    subscribe,
    readStoredScores,
    () => EMPTY,
  );
  return useMemo(
    () =>
      [...SEED_SCORES, ...stored]
        .filter((s) => s.game_id === gameId)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit),
    [stored, gameId, limit],
  );
}

export function formatScoreDate(iso: string) {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

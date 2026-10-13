export type SavedScore = {
  game: string; // Game.id
  name: string; // 1–10 chars, uppercase
  score: number;
  at: number; // Date.now() when saved
};

export type LeaderboardRow = {
  rank: number; // 1-based, after sorting
  name: string;
  score: number;
  date: string; // "dd/mm/yyyy"
};

const SEED_ROWS = 12;

const PLAYERS = [
  "PX_KAI", "NEONFOX", "Z3R0COOL", "M00NRYU", "VAULT_07", "GLITCHA",
  "ATARI_KID", "CYBER_LU", "MAGENTA88", "SCANLINE", "BIT_LORD", "ARKADYA",
  "DROID_X", "RGB_QUEEN", "PIXEL_DAD", "RETROVIRA", "VECTORX", "JOY_STK",
];

// Modulus of the template's linear congruential generator.
const LCG_MODULUS = 233280;

// Hash of the whole id, so games with ids of equal length get different seeds.
function hashId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) % LCG_MODULUS;
  }
  return hash;
}

export function seededScores(gameId: string): LeaderboardRow[] {
  let s = hashId(gameId);
  const rand = () => (s = (s * 9301 + 49297) % LCG_MODULUS) / LCG_MODULUS;
  const used = new Set<string>();
  const rows: LeaderboardRow[] = [];
  for (let i = 0; i < SEED_ROWS; i++) {
    let name: string;
    do {
      name = PLAYERS[Math.floor(rand() * PLAYERS.length)];
    } while (used.has(name) && used.size < PLAYERS.length);
    used.add(name);
    const base = Math.floor(50000 + rand() * 250000);
    const score = base - i * Math.floor(2000 + rand() * 4000);
    const day = String(1 + Math.floor(rand() * 28)).padStart(2, "0");
    const mon = String(1 + Math.floor(rand() * 12)).padStart(2, "0");
    rows.push({ rank: i + 1, name, score: Math.max(score, 1000), date: `${day}/${mon}/2026` });
  }
  return rows.sort((a, b) => b.score - a.score).map((r, i) => ({ ...r, rank: i + 1 }));
}

function formatDate(timestamp: number): string {
  const d = new Date(timestamp);
  const day = String(d.getDate()).padStart(2, "0");
  const mon = String(d.getMonth() + 1).padStart(2, "0");
  return `${day}/${mon}/${d.getFullYear()}`;
}

function parseDate(date: string): number {
  const [day, mon, year] = date.split("/").map(Number);
  return new Date(year, mon - 1, day).getTime();
}

type Entry = { name: string; score: number; date: string; time: number };

export function buildLeaderboard(gameId: string, saved: SavedScore[]): LeaderboardRow[] {
  const entries: Entry[] = [
    ...seededScores(gameId).map((r) => ({ name: r.name, score: r.score, date: r.date, time: parseDate(r.date) })),
    ...saved
      .filter((s) => s.game === gameId)
      .map((s) => ({ name: s.name, score: s.score, date: formatDate(s.at), time: s.at })),
  ];

  // One row per name: highest score, oldest date on ties.
  const best = new Map<string, Entry>();
  for (const entry of entries) {
    const current = best.get(entry.name);
    if (
      !current ||
      entry.score > current.score ||
      (entry.score === current.score && entry.time < current.time)
    ) {
      best.set(entry.name, entry);
    }
  }

  return [...best.values()]
    .sort((a, b) => b.score - a.score)
    .map((e, i) => ({ rank: i + 1, name: e.name, score: e.score, date: e.date }));
}

export function formatScore(n: number): string {
  return n.toLocaleString("es-ES");
}

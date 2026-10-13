// localStorage access, client only. Reads never throw; writes are ignored if storage is unavailable.
import type { SavedScore } from "@/lib/scores";

export const USER_KEY = "av:user:v1"; // JSON: { name: string } | absent
export const SCORES_KEY = "av:scores:v1"; // JSON: SavedScore[] | absent

export type User = { name: string };

const EMPTY_SCORES: SavedScore[] = [];

const listeners = new Set<() => void>();

function emitChange(): void {
  for (const listener of listeners) listener();
}

function readRaw(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeRaw(key: string, value: string | null): void {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {
    // Storage unavailable: ignore the write.
  }
  emitChange();
}

function parseJson(raw: string | null): unknown {
  if (raw === null) return undefined;
  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

function isUser(value: unknown): value is User {
  return typeof value === "object" && value !== null && typeof (value as User).name === "string";
}

function isSavedScore(value: unknown): value is SavedScore {
  if (typeof value !== "object" || value === null) return false;
  const v = value as SavedScore;
  return (
    typeof v.game === "string" &&
    typeof v.name === "string" &&
    typeof v.score === "number" &&
    Number.isFinite(v.score) &&
    typeof v.at === "number" &&
    Number.isFinite(v.at)
  );
}

function isSavedScoreList(value: unknown): value is SavedScore[] {
  return Array.isArray(value) && value.every(isSavedScore);
}

// Snapshots are cached by raw string so useSyncExternalStore gets stable references.
let userCache: { raw: string | null; value: User | null } = { raw: null, value: null };
let scoresCache: { raw: string | null; value: SavedScore[] } = { raw: null, value: EMPTY_SCORES };

export function readUser(): User | null {
  const raw = readRaw(USER_KEY);
  if (raw !== userCache.raw) {
    const parsed = parseJson(raw);
    userCache = { raw, value: isUser(parsed) ? { name: parsed.name } : null };
  }
  return userCache.value;
}

export function saveUser(user: User): void {
  writeRaw(USER_KEY, JSON.stringify({ name: user.name }));
}

export function clearUser(): void {
  writeRaw(USER_KEY, null);
}

export function readScores(): SavedScore[] {
  const raw = readRaw(SCORES_KEY);
  if (raw !== scoresCache.raw) {
    const parsed = parseJson(raw);
    scoresCache = { raw, value: isSavedScoreList(parsed) ? parsed : EMPTY_SCORES };
  }
  return scoresCache.value;
}

export function addScore(score: SavedScore): void {
  writeRaw(SCORES_KEY, JSON.stringify([...readScores(), score]));
}

export function getServerUser(): User | null {
  return null;
}

export function getServerScores(): SavedScore[] {
  return EMPTY_SCORES;
}

// Subscribes to local writes and to changes made from other tabs.
export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === USER_KEY || event.key === SCORES_KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

"use client";

import { useSyncExternalStore } from "react";
import type { SavedScore } from "@/lib/scores";
import { getServerScores, readScores, subscribe } from "@/lib/storage";

export function useSavedScores(): SavedScore[] {
  return useSyncExternalStore(subscribe, readScores, getServerScores);
}

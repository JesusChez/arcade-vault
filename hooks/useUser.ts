"use client";

import { useSyncExternalStore } from "react";
import { getServerUser, readUser, subscribe, type User } from "@/lib/storage";

export function useUser(): User | null {
  return useSyncExternalStore(subscribe, readUser, getServerUser);
}

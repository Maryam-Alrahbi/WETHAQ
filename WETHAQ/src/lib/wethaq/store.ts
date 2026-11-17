import { useCallback, useEffect, useState } from "react";
import { demoActivity, demoProfile, demoRecords, type ActivityItem, type BusinessProfile } from "./demo-data";
import type { VerificationRecord } from "./types";

/**
 * Demo persistence in the browser. Swap these for Lovable Cloud tables (records, profiles,
 * activity) when real accounts are connected — callers only use the functions below.
 */

const KEYS = {
  issued: "wethaq-demo-issued",
  profile: "wethaq-demo-profile",
  activity: "wethaq-demo-activity",
} as const;

const EVENT = "wethaq-demo-store";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event(EVENT));
}

export const getIssuedRecords = () => read<VerificationRecord[]>(KEYS.issued, []);
export const getAllRecords = () => [...getIssuedRecords(), ...demoRecords];
export const getProfile = () => read<BusinessProfile>(KEYS.profile, demoProfile);
export const getActivity = () => read<ActivityItem[]>(KEYS.activity, demoActivity);

export function saveIssuedRecord(record: VerificationRecord) {
  write(KEYS.issued, [record, ...getIssuedRecords()]);
}
export function saveProfile(profile: BusinessProfile) {
  write(KEYS.profile, profile);
}
export function addActivity(item: Omit<ActivityItem, "id" | "date">) {
  write(KEYS.activity, [
    { ...item, id: crypto.randomUUID(), date: new Date().toISOString() },
    ...getActivity(),
  ].slice(0, 30));
}
export function resetDemo() {
  Object.values(KEYS).forEach((k) => window.localStorage.removeItem(k));
  window.dispatchEvent(new Event(EVENT));
}

/** Subscribe to demo data. Renders seed data on the server, then the stored data after hydration. */
export function useDemoStore() {
  const [state, setState] = useState(() => ({
    records: demoRecords,
    profile: demoProfile,
    activity: demoActivity,
  }));
  const refresh = useCallback(
    () => setState({ records: getAllRecords(), profile: getProfile(), activity: getActivity() }),
    [],
  );
  useEffect(() => {
    refresh();
    window.addEventListener(EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [refresh]);
  return state;
}

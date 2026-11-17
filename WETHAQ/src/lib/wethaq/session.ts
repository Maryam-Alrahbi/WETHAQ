import { useEffect, useState } from "react";

/**
 * DEMO ONLY. A browser-side stand-in for real authentication: it remembers who "signed in"
 * but verifies nothing and never stores passwords. Replace with real auth (Lovable Cloud)
 * before any real user or document is involved.
 */
export type Session = { name: string; email: string; type: "individual" | "business" };

const KEY = "wethaq-demo-session";
const EVENT = "wethaq-demo-session-change";

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function signIn(session: Session) {
  window.localStorage.setItem(KEY, JSON.stringify(session));
  window.dispatchEvent(new Event(EVENT));
}

export function signOut() {
  window.localStorage.removeItem(KEY);
  window.dispatchEvent(new Event(EVENT));
}

/** `ready` is false until after hydration, so pages don't flash a signed-out state. */
export function useSession() {
  const [state, setState] = useState<{ session: Session | null; ready: boolean }>({ session: null, ready: false });
  useEffect(() => {
    const refresh = () => setState({ session: getSession(), ready: true });
    refresh();
    window.addEventListener(EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  return state;
}

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "ar";
export type Bilingual = { en: string; ar: string };

type LangContextValue = {
  lang: Lang;
  dir: "ltr" | "rtl";
  setLang: (lang: Lang) => void;
  toggle: () => void;
};

const STORAGE_KEY = "wethaq-lang";
const LangContext = createContext<LangContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "ar" || stored === "en") setLangState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const toggle = useCallback(() => setLang(lang === "en" ? "ar" : "en"), [lang, setLang]);

  return (
    <LangContext.Provider value={{ lang, dir: lang === "ar" ? "rtl" : "ltr", setLang, toggle }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside LanguageProvider");
  return ctx;
}

/** Pick the copy block for the active language. Pages keep their own { en, ar } copy objects. */
export function useCopy<T>(copy: { en: T; ar: T }): T {
  return copy[useLang().lang];
}

/** Translate a single bilingual value. */
export function useT() {
  const { lang } = useLang();
  return (value: Bilingual) => value[lang];
}

export function formatDate(iso: string, lang: Lang) {
  return new Date(iso).toLocaleDateString(lang === "ar" ? "ar-OM" : "en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatMoney(amount: number, currency: string, lang: Lang) {
  return new Intl.NumberFormat(lang === "ar" ? "ar-OM" : "en-OM", {
    style: "currency",
    currency,
    minimumFractionDigits: 3,
  }).format(amount);
}

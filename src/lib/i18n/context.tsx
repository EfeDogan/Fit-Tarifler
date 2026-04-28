"use client";

import { createContext, useContext, useState, useMemo, type ReactNode } from "react";
import { dictionaries, labelDictionaries, type Locale, type Dictionary } from "./dictionary";

type LanguageContextType = {
  locale: Locale;
  t: (key: keyof Dictionary, params?: Record<string, string | number>) => string;
  tLabel: (slug: string) => string;
  setLocale: (locale: Locale) => void;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

const STORAGE_KEY = "fit-recipe-locale";

function getInitialLocale(): Locale {
  if (typeof window === "undefined") return "tr";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "en" || stored === "tr") return stored;
  const browserLang = navigator.language.slice(0, 2);
  return browserLang === "en" ? "en" : "tr";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleRaw] = useState<Locale>(getInitialLocale);

  const value = useMemo(() => {
    const dictionary = dictionaries[locale];

    const t = (key: keyof Dictionary, params?: Record<string, string | number>) => {
      let val = dictionary[key] ?? key;
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          val = val.replace(`{${k}}`, String(v));
        });
      }
      return val;
    };

    const tLabel = (slug: string) => {
      return labelDictionaries[locale][slug] ?? slug;
    };

    const setLocale = (newLocale: Locale) => {
      setLocaleRaw(newLocale);
      localStorage.setItem(STORAGE_KEY, newLocale);
    };

    return { locale, t, tLabel, setLocale };
  }, [locale]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/lib/i18n/context";
import { availableLocales } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/dictionary";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const current = availableLocales.find((l) => l.code === locale) ?? availableLocales[0];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-black transition-colors px-2.5 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300"
      >
        <span className="text-sm">{current.flag}</span>
        <span>{current.name}</span>
        <svg
          className={`w-3 h-3 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-1.5 py-1 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[140px] z-50">
          {availableLocales.map((loc) => (
            <button
              key={loc.code}
              type="button"
              onClick={() => {
                setLocale(loc.code as Locale);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                loc.code === locale
                  ? "bg-gray-50 text-black font-medium"
                  : "text-gray-500 hover:bg-gray-50 hover:text-black"
              }`}
            >
              <span className="text-base">{loc.flag}</span>
              <span>{loc.name}</span>
              {loc.code === locale && (
                <svg className="w-3.5 h-3.5 ml-auto text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

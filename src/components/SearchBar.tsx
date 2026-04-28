"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useCallback } from "react";
import { useLanguage } from "@/lib/i18n/context";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  const buildUrl = useCallback(
    (q: string) => {
      const qs = new URLSearchParams();
      const params = Object.fromEntries(searchParams.entries());
      for (const [key, value] of Object.entries(params)) {
        if (key !== "q") qs.set(key, value);
      }
      if (q.trim()) qs.set("q", q.trim());
      const str = qs.toString();
      return `/${str ? `?${str}` : ""}`;
    },
    [searchParams]
  );

  const handleChange = useCallback(
    (value: string) => {
      setQuery(value);
      const url = buildUrl(value);
      const timer = setTimeout(() => {
        router.push(url);
      }, 300);
      return () => clearTimeout(timer);
    },
    [buildUrl, router]
  );

  const handleClear = () => {
    setQuery("");
    router.push(buildUrl(""));
  };

  return (
    <div className="relative">
      <div
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all focus-within:border-black focus-within:ring-1 focus-within:ring-black`}
      >
        <svg
          className="w-4 h-4 text-gray-400 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="shrink-0 text-gray-400 hover:text-black transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

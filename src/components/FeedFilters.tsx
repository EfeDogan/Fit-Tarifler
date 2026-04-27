"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback, useMemo } from "react";
import type { Label } from "@/types/database";

export default function FeedFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [labels, setLabels] = useState<Label[]>([]);
  const activeSlugs = useMemo(
    () => new Set(searchParams.get("labels")?.split(",").filter(Boolean) ?? []),
    [searchParams]
  );

  useEffect(() => {
    fetch("/api/labels")
      .then((res) => res.json())
      .then((data) => setLabels(data))
      .catch(() => {});
  }, []);

  const toggle = useCallback(
    (slug: string) => {
      const next = new Set(activeSlugs);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }

      const params = new URLSearchParams(searchParams.toString());
      if (next.size > 0) {
        params.set("labels", Array.from(next).join(","));
      } else {
        params.delete("labels");
      }

      router.push(`/${params.toString() ? `?${params.toString()}` : ""}`);
    },
    [activeSlugs, router, searchParams]
  );

  const clearAll = useCallback(() => {
    router.push("/");
  }, [router]);

  if (labels.length === 0) return null;

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      <button
        onClick={clearAll}
        className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
          activeSlugs.size === 0
            ? "bg-black text-white"
            : "bg-gray-50 text-gray-500 hover:bg-gray-100"
        }`}
      >
        Tümü
      </button>
      {labels.map((label) => (
        <button
          key={label.id}
          onClick={() => toggle(label.slug)}
          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            activeSlugs.has(label.slug)
              ? "text-white shadow-sm"
              : "bg-gray-50 text-gray-500 hover:bg-gray-100"
          }`}
          style={
            activeSlugs.has(label.slug)
              ? { backgroundColor: label.color }
              : {}
          }
        >
          {label.name}
        </button>
      ))}
    </div>
  );
}

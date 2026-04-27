"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback, useMemo, useOptimistic, startTransition } from "react";
import type { Label } from "@/types/database";

const CALORIE_OPTIONS = [
  { value: "", label: "Kalori" },
  { value: "200", label: "200 altı" },
  { value: "300", label: "300 altı" },
  { value: "400", label: "400 altı" },
  { value: "500", label: "500 altı" },
  { value: "600", label: "600 altı" },
  { value: "700", label: "700 altı" },
];

const PROTEIN_OPTIONS = [
  { value: "", label: "Protein" },
  { value: "10", label: "10g+" },
  { value: "15", label: "15g+" },
  { value: "20", label: "20g+" },
  { value: "25", label: "25g+" },
  { value: "30", label: "30g+" },
  { value: "40", label: "40g+" },
  { value: "50", label: "50g+" },
];

const CARBS_OPTIONS = [
  { value: "", label: "Karb" },
  { value: "10", label: "10g altı" },
  { value: "20", label: "20g altı" },
  { value: "30", label: "30g altı" },
  { value: "50", label: "50g altı" },
];

const FAT_OPTIONS = [
  { value: "", label: "Yağ" },
  { value: "5", label: "5g altı" },
  { value: "10", label: "10g altı" },
  { value: "15", label: "15g altı" },
  { value: "20", label: "20g altı" },
  { value: "30", label: "30g altı" },
];

export default function FeedFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [labels, setLabels] = useState<Label[]>([]);
  const activeSlugs = useMemo(
    () => new Set(searchParams.get("labels")?.split(",").filter(Boolean) ?? []),
    [searchParams]
  );
  const activeMaxCalories = searchParams.get("maxCalories") ?? "";
  const activeMinProtein = searchParams.get("minProtein") ?? "";
  const activeMaxCarbs = searchParams.get("maxCarbs") ?? "";
  const activeMaxFat = searchParams.get("maxFat") ?? "";

  const [optimisticSlugs, setOptimisticSlugs] = useOptimistic(activeSlugs);

  useEffect(() => {
    fetch("/api/labels")
      .then((res) => res.json())
      .then((data) => setLabels(data))
      .catch(() => {});
  }, []);

  const buildUrl = useCallback(
    (nextLabels: Set<string>, params: Record<string, string>) => {
      const qs = new URLSearchParams();
      if (nextLabels.size > 0) {
        qs.set("labels", Array.from(nextLabels).join(","));
      }
      Object.entries(params).forEach(([key, value]) => {
        if (value) qs.set(key, value);
      });
      const str = qs.toString();
      router.push(`/${str ? `?${str}` : ""}`);
    },
    [router]
  );

  const currentParams = useMemo(() => ({
    maxCalories: activeMaxCalories,
    minProtein: activeMinProtein,
    maxCarbs: activeMaxCarbs,
    maxFat: activeMaxFat,
  }), [activeMaxCalories, activeMinProtein, activeMaxCarbs, activeMaxFat]);

  const toggleLabel = useCallback(
    (slug: string) => {
      startTransition(async () => {
        setOptimisticSlugs((prev) => {
          const next = new Set(prev);
          if (next.has(slug)) next.delete(slug);
          else next.add(slug);
          return next;
        });

        const next = new Set(activeSlugs);
        if (next.has(slug)) next.delete(slug);
        else next.add(slug);
        buildUrl(next, currentParams);
      });
    },
    [activeSlugs, currentParams, buildUrl, setOptimisticSlugs]
  );

  const handleNutritionChange = useCallback(
    (key: string, value: string) => {
      startTransition(async () => {
        const params = { ...currentParams, [key]: value };
        buildUrl(activeSlugs, params);
      });
    },
    [activeSlugs, currentParams, buildUrl]
  );

  const clearAll = useCallback(() => {
    startTransition(async () => {
      setOptimisticSlugs(new Set());
      router.push("/");
    });
  }, [router, setOptimisticSlugs]);

  const hasFilters = optimisticSlugs.size > 0 || activeMaxCalories || activeMinProtein || activeMaxCarbs || activeMaxFat;

  if (labels.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={clearAll}
          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            !hasFilters
              ? "bg-black text-white"
              : "bg-gray-50 text-gray-500 hover:bg-gray-100"
          }`}
        >
          Tümü
        </button>
        {labels.map((label) => (
          <button
            key={label.id}
            onClick={() => toggleLabel(label.slug)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              optimisticSlugs.has(label.slug)
                ? "text-white shadow-sm"
                : "bg-gray-50 text-gray-500 hover:bg-gray-100"
            }`}
            style={
              optimisticSlugs.has(label.slug)
                ? { backgroundColor: label.color }
                : {}
            }
          >
            {label.name}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <select
          value={activeMinProtein}
          onChange={(e) => handleNutritionChange("minProtein", e.target.value)}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border-0 outline-none cursor-pointer appearance-none bg-gray-50 text-gray-600 hover:bg-gray-100 ${activeMinProtein ? "!bg-green-600 !text-white" : ""}`}
        >
          {PROTEIN_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              🥩 {opt.label}
            </option>
          ))}
        </select>

        <select
          value={activeMaxCalories}
          onChange={(e) => handleNutritionChange("maxCalories", e.target.value)}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border-0 outline-none cursor-pointer appearance-none bg-gray-50 text-gray-600 hover:bg-gray-100 ${activeMaxCalories ? "!bg-orange-600 !text-white" : ""}`}
        >
          {CALORIE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              🔥 {opt.label}
            </option>
          ))}
        </select>

        <select
          value={activeMaxCarbs}
          onChange={(e) => handleNutritionChange("maxCarbs", e.target.value)}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border-0 outline-none cursor-pointer appearance-none bg-gray-50 text-gray-600 hover:bg-gray-100 ${activeMaxCarbs ? "!bg-blue-600 !text-white" : ""}`}
        >
          {CARBS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              🍞 {opt.label}
            </option>
          ))}
        </select>

        <select
          value={activeMaxFat}
          onChange={(e) => handleNutritionChange("maxFat", e.target.value)}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border-0 outline-none cursor-pointer appearance-none bg-gray-50 text-gray-600 hover:bg-gray-100 ${activeMaxFat ? "!bg-yellow-600 !text-white" : ""}`}
        >
          {FAT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              🧈 {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

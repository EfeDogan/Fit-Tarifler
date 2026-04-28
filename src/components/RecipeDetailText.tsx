"use client";

import { useLanguage } from "@/lib/i18n/context";
import type { Dictionary } from "@/lib/i18n/dictionary";

export function RecipeDetailText({ textKey }: { textKey: keyof Dictionary }) {
  const { t } = useLanguage();
  return <>{t(textKey)}</>;
}

export function LabelText({ slug, fallback }: { slug: string; fallback: string }) {
  const { tLabel } = useLanguage();
  return <>{tLabel(slug) ?? fallback}</>;
}

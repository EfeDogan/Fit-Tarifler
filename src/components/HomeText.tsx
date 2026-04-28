"use client";

import { useLanguage } from "@/lib/i18n/context";
import type { Dictionary } from "@/lib/i18n/dictionary";

export function HomeText({ textKey }: { textKey: keyof Dictionary }) {
  const { t } = useLanguage();
  return <>{t(textKey)}</>;
}

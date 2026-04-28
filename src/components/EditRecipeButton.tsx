"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";

export default function EditRecipeButton({ recipeId }: { recipeId: string }) {
  const { t } = useLanguage();

  return (
    <Link
      href={`/recipe/${recipeId}/edit`}
      className="text-sm font-medium text-gray-500 hover:text-black transition-colors"
    >
      {t("recipeEdit")}
    </Link>
  );
}

"use client";

import { useRecipes } from "@/lib/recipes";
import { useLanguage } from "@/lib/i18n/context";
import { useState } from "react";

export default function DeleteRecipeButton({ recipeId }: { recipeId: string }) {
  const { deleteRecipe } = useRecipes();
  const { t } = useLanguage();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = () => {
    if (!confirm(t("recipeDeleteConfirm"))) return;
    if (deleting) return;
    setDeleting(true);
    deleteRecipe(recipeId);
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="text-sm text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
    >
      {t("recipeDelete")}
    </button>
  );
}

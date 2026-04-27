"use client";

import { useRecipes } from "@/lib/recipes";
import { useState } from "react";

export default function DeleteRecipeButton({ recipeId }: { recipeId: string }) {
  const { deleteRecipe } = useRecipes();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = () => {
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
      {deleting ? "Siliniyor..." : "Tarifi Sil"}
    </button>
  );
}

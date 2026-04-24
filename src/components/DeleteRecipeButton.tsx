"use client";

import { useRecipes } from "@/lib/recipes";

export default function DeleteRecipeButton({ recipeId }: { recipeId: string }) {
  const { deleteRecipe } = useRecipes();

  return (
    <button
      onClick={() => deleteRecipe(recipeId)}
      className="text-sm text-red-500 hover:text-red-700 transition-colors"
    >
      Tarifi Sil
    </button>
  );
}

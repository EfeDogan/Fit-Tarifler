"use client";

import { toggleLike, toggleSave } from "@/lib/actions/recipes";
import type { Recipe } from "@/types/database";

export default function LikeSaveButtons({ recipe }: { recipe: Recipe }) {
  return (
    <div className="flex items-center gap-3">
      <form action={() => toggleLike(recipe.id)}>
        <button
          type="submit"
          className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full transition-colors ${
            recipe.is_liked_by_user
              ? "bg-red-50 text-red-600"
              : "bg-gray-50 text-gray-500 hover:bg-gray-100"
          }`}
        >
          {recipe.is_liked_by_user ? "♥" : "♡"}{" "}
          {recipe.like_count ?? 0}
        </button>
      </form>

      <form action={() => toggleSave(recipe.id)}>
        <button
          type="submit"
          className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full transition-colors ${
            recipe.is_saved_by_user
              ? "bg-yellow-50 text-yellow-600"
              : "bg-gray-50 text-gray-500 hover:bg-gray-100"
          }`}
        >
          {recipe.is_saved_by_user ? "★" : "☆"} Kaydet
        </button>
      </form>
    </div>
  );
}

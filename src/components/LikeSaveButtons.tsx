"use client";

import { useOptimistic, useTransition } from "react";
import { toggleLike, toggleSave } from "@/lib/actions/recipes";
import type { Recipe } from "@/types/database";

export default function LikeSaveButtons({ recipe }: { recipe: Recipe }) {
  const [, startTransition] = useTransition();

  const [optimistic, setOptimistic] = useOptimistic({
    is_liked_by_user: recipe.is_liked_by_user ?? false,
    is_saved_by_user: recipe.is_saved_by_user ?? false,
    like_count: recipe.like_count ?? 0,
  });

  const handleLike = () => {
    startTransition(async () => {
      setOptimistic((prev) => ({
        ...prev,
        is_liked_by_user: !prev.is_liked_by_user,
        like_count: prev.is_liked_by_user
          ? Math.max(0, prev.like_count - 1)
          : prev.like_count + 1,
      }));
      await toggleLike(recipe.id);
    });
  };

  const handleSave = () => {
    startTransition(async () => {
      setOptimistic((prev) => ({
        ...prev,
        is_saved_by_user: !prev.is_saved_by_user,
      }));
      await toggleSave(recipe.id);
    });
  };

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handleLike}
        className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full transition-colors ${
          optimistic.is_liked_by_user
            ? "bg-red-50 text-red-600"
            : "bg-gray-50 text-gray-500 hover:bg-gray-100"
        }`}
      >
        {optimistic.is_liked_by_user ? "♥" : "♡"}{" "}
        {optimistic.like_count}
      </button>

      <button
        type="button"
        onClick={handleSave}
        className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full transition-colors ${
          optimistic.is_saved_by_user
            ? "bg-yellow-50 text-yellow-600"
            : "bg-gray-50 text-gray-500 hover:bg-gray-100"
        }`}
      >
        {optimistic.is_saved_by_user ? "★" : "☆"} Kaydet
      </button>
    </div>
  );
}

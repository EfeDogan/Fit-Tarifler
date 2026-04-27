"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleLike(recipeId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { count } = await supabase
    .from("likes")
    .delete({ count: "exact" })
    .eq("user_id", user.id)
    .eq("recipe_id", recipeId);

  if (count === 0) {
    await supabase.from("likes").insert({ user_id: user.id, recipe_id: recipeId });
  }

  revalidatePath(`/recipe/${recipeId}`);
}

export async function toggleSave(recipeId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { count } = await supabase
    .from("saves")
    .delete({ count: "exact" })
    .eq("user_id", user.id)
    .eq("recipe_id", recipeId);

  if (count === 0) {
    await supabase.from("saves").insert({ user_id: user.id, recipe_id: recipeId });
  }

  revalidatePath(`/recipe/${recipeId}`);
  revalidatePath("/profile");
}

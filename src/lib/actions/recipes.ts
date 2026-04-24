"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleLike(recipeId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data: existing } = await supabase
    .from("likes")
    .select()
    .eq("user_id", user.id)
    .eq("recipe_id", recipeId)
    .single();

  if (existing) {
    await supabase.from("likes").delete().eq("user_id", user.id).eq("recipe_id", recipeId);
  } else {
    await supabase.from("likes").insert({ user_id: user.id, recipe_id: recipeId });
  }

  revalidatePath(`/recipe/${recipeId}`);
  revalidatePath("/");
}

export async function toggleSave(recipeId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data: existing } = await supabase
    .from("saves")
    .select()
    .eq("user_id", user.id)
    .eq("recipe_id", recipeId)
    .single();

  if (existing) {
    await supabase.from("saves").delete().eq("user_id", user.id).eq("recipe_id", recipeId);
  } else {
    await supabase.from("saves").insert({ user_id: user.id, recipe_id: recipeId });
  }

  revalidatePath(`/recipe/${recipeId}`);
  revalidatePath("/");
  revalidatePath("/profile");
}

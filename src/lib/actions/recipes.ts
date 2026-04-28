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

export async function addComment(recipeId: string, content: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };
  if (!content.trim()) return { error: "Content is required" };

  const { error } = await supabase.from("comments").insert({
    recipe_id: recipeId,
    user_id: user.id,
    content: content.trim(),
  });

  if (error) return { error: error.message };

  revalidatePath(`/recipe/${recipeId}`);
  return { error: null };
}

export async function deleteComment(commentId: string, recipeId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  await supabase
    .from("comments")
    .delete()
    .eq("id", commentId)
    .eq("user_id", user.id);

  revalidatePath(`/recipe/${recipeId}`);
}

export async function updateRecipe(
  recipeId: string,
  data: {
    title: string;
    description: string | null;
    content: string;
    calories: number | null;
    protein: number | null;
    carbs: number | null;
    fat: number | null;
    existingImageUrls: string[];
    newImageFiles: File[];
    labelIds: string[];
  }
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "AUTH_REQUIRED" };

  const { data: recipe } = await supabase
    .from("recipes")
    .select("author_id")
    .eq("id", recipeId)
    .single();

  if (!recipe || recipe.author_id !== user.id) {
    return { error: "NOT_AUTHORIZED" };
  }

  const newUrls: string[] = [];

  for (const file of data.newImageFiles) {
    const ext = file.name.split(".").pop();
    const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("recipe-images")
      .upload(path, file);

    if (!uploadError) {
      const {
        data: { publicUrl },
      } = supabase.storage.from("recipe-images").getPublicUrl(path);
      newUrls.push(publicUrl);
    }
  }

  const image_urls = [...data.existingImageUrls, ...newUrls];

  const { error: updateError } = await supabase
    .from("recipes")
    .update({
      title: data.title,
      description: data.description,
      content: data.content,
      calories: data.calories,
      protein: data.protein,
      carbs: data.carbs,
      fat: data.fat,
      image_urls,
    })
    .eq("id", recipeId)
    .eq("author_id", user.id);

  if (updateError) {
    return { error: updateError.message };
  }

  await supabase
    .from("recipe_labels")
    .delete()
    .eq("recipe_id", recipeId);

  if (data.labelIds.length > 0) {
    const rows = data.labelIds.map((labelId) => ({
      recipe_id: recipeId,
      label_id: labelId,
    }));
    await supabase.from("recipe_labels").insert(rows);
  }

  revalidatePath(`/recipe/${recipeId}`);
  revalidatePath("/");
  revalidatePath("/profile");

  return { error: null };
}

"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const MAX_IMAGES = 3;

export function useRecipes() {
  const router = useRouter();

  const createRecipe = async (formData: FormData) => {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { error: "Giriş yapmanız gerekiyor." };

    const title = formData.get("title") as string;
    const description = (formData.get("description") as string) || null;
    const content = formData.get("content") as string;
    const labelIds = formData.getAll("labels") as string[];

    const imageFiles = formData.getAll("images") as File[];
    const image_urls: string[] = [];

    for (const file of imageFiles) {
      if (image_urls.length >= MAX_IMAGES) break;
      if (!file || file.size === 0) continue;

      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("recipe-images")
        .upload(filePath, file);

      if (!uploadError) {
        const {
          data: { publicUrl },
        } = supabase.storage.from("recipe-images").getPublicUrl(filePath);
        image_urls.push(publicUrl);
      }
    }

    const { data: recipe, error } = await supabase
      .from("recipes")
      .insert({
        title,
        description,
        content,
        image_urls,
        author_id: user.id,
      })
      .select("id")
      .single();

    if (error || !recipe) {
      return { error: error?.message || "Tarif oluşturulurken bir hata oluştu." };
    }

    if (labelIds.length > 0) {
      const recipeLabelRows = labelIds.map((labelId) => ({
        recipe_id: recipe.id,
        label_id: labelId,
      }));

      await supabase.from("recipe_labels").insert(recipeLabelRows);
    }

    router.push("/");
    router.refresh();
    return { error: null };
  };

  const deleteRecipe = async (recipeId: string) => {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase
      .from("recipes")
      .delete()
      .eq("id", recipeId)
      .eq("author_id", user.id);

    router.push("/profile");
    router.refresh();
  };

  return { createRecipe, deleteRecipe };
}

import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import EditRecipeForm from "@/components/EditRecipeForm";

export default async function EditRecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/recipe/${id}`);

  const { data: recipe } = await supabase
    .from("recipes")
    .select(`*, labels(id, name, slug, color)`)
    .eq("id", id)
    .single();

  if (!recipe) notFound();
  if (recipe.author_id !== user.id) redirect(`/recipe/${id}`);

  const { data: allLabels } = await supabase
    .from("labels")
    .select()
    .order("name");

  const existingLabelIds = (recipe.labels ?? []).map((l: { id: string }) => l.id);

  return (
    <EditRecipeForm
      recipeId={recipe.id}
      initialData={{
        title: recipe.title,
        description: recipe.description ?? "",
        content: recipe.content,
        calories: recipe.calories?.toString() ?? "",
        protein: recipe.protein?.toString() ?? "",
        carbs: recipe.carbs?.toString() ?? "",
        fat: recipe.fat?.toString() ?? "",
        imageUrls: recipe.image_urls ?? [],
        labelIds: existingLabelIds,
      }}
      allLabels={allLabels ?? []}
    />
  );
}

import { createClient } from "@/lib/supabase/server";
import RecipeCard from "@/components/RecipeCard";
import FeedFilters from "@/components/FeedFilters";
import type { Recipe } from "@/types/database";
import { Suspense } from "react";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ labels?: string; minProtein?: string; maxCalories?: string; maxCarbs?: string; maxFat?: string }>;
}) {
  const { labels: labelsParam, minProtein, maxCalories, maxCarbs, maxFat } = await searchParams;
  const supabase = await createClient();

  let recipesQuery = supabase
    .from("recipes")
    .select(`*, profiles!author_id(username), labels(id, name, slug, color)`)
    .order("created_at", { ascending: false });

  if (labelsParam) {
    const labelSlugs = labelsParam.split(",").filter(Boolean);
    if (labelSlugs.length > 0) {
      const { data: matchedLabels } = await supabase
        .from("labels")
        .select("id")
        .in("slug", labelSlugs);

      const labelIds = matchedLabels?.map((l) => l.id) ?? [];

      if (labelIds.length > 0) {
        const { data: recipeIds } = await supabase
          .from("recipe_labels")
          .select("recipe_id")
          .in("label_id", labelIds);

        const uniqueRecipeIds = [
          ...new Set(recipeIds?.map((r) => r.recipe_id) ?? []),
        ];

        if (uniqueRecipeIds.length > 0) {
          recipesQuery = recipesQuery.in("id", uniqueRecipeIds);
        } else {
          recipesQuery = recipesQuery.eq("id", "00000000-0000-0000-0000-000000000000");
        }
      }
    }
  }

  if (minProtein) {
    recipesQuery = recipesQuery.gte("protein", parseInt(minProtein));
  }
  if (maxCalories) {
    recipesQuery = recipesQuery.lte("calories", parseInt(maxCalories));
  }
  if (maxCarbs) {
    recipesQuery = recipesQuery.lte("carbs", parseInt(maxCarbs));
  }
  if (maxFat) {
    recipesQuery = recipesQuery.lte("fat", parseInt(maxFat));
  }

  const [
    { data: recipes, error: recipesError },
    { data: { user } },
  ] = await Promise.all([
    recipesQuery,
    supabase.auth.getUser(),
  ]);

  let likedRecipeIds: string[] = [];
  let savedRecipeIds: string[] = [];

  if (user) {
    const [{ data: likes }, { data: saves }] = await Promise.all([
      supabase
        .from("likes")
        .select("recipe_id")
        .eq("user_id", user.id),
      supabase
        .from("saves")
        .select("recipe_id")
        .eq("user_id", user.id),
    ]);
    likedRecipeIds = likes?.map((l) => l.recipe_id) ?? [];
    savedRecipeIds = saves?.map((s) => s.recipe_id) ?? [];
  }

  const recipesWithLikes: Recipe[] = (recipes ?? []).map((recipe) => ({
    ...recipe,
    like_count: 0,
    is_liked_by_user: likedRecipeIds.includes(recipe.id),
    is_saved_by_user: savedRecipeIds.includes(recipe.id),
  }));

  return (
    <div className="max-w-5xl mx-auto px-6">
      <div className="py-12 text-center border-b border-gray-100 mb-8">
        <h1 className="text-5xl font-bold tracking-tight mb-3">Fit Recipe</h1>
        <p className="text-gray-500 text-lg max-w-md mx-auto">
          Sağlıklı tariflerinizi paylaşın, başkalarının tariflerini keşfedin.
        </p>
      </div>

      <div className="mb-6">
        <Suspense>
          <FeedFilters />
        </Suspense>
      </div>

      {recipesError && (
        <div className="bg-red-50 text-red-600 text-sm p-4 rounded-lg my-6">
          Tarifler yüklenirken hata oluştu: {recipesError.message}
        </div>
      )}

      {!recipesError && recipesWithLikes.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-gray-400 text-lg">Henüz tarif yok.</p>
          <p className="text-gray-400 text-sm mt-2">
            İlk tarifi siz paylaşın!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {recipesWithLikes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}

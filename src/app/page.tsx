import { createClient } from "@/lib/supabase/server";
import RecipeCard from "@/components/RecipeCard";
import FeedFilters from "@/components/FeedFilters";
import SearchBar from "@/components/SearchBar";
import type { Recipe } from "@/types/database";
import { Suspense } from "react";
import { HomeText } from "@/components/HomeText";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; labels?: string; minProtein?: string; maxCalories?: string; maxCarbs?: string; maxFat?: string }>;
}) {
  const { q, labels: labelsParam, minProtein, maxCalories, maxCarbs, maxFat } = await searchParams;
  const supabase = await createClient();

  let recipesQuery = supabase
    .from("recipes")
    .select(`*, profiles!author_id(username), labels(id, name, slug, color)`)
    .order("created_at", { ascending: false });

  if (q && q.trim()) {
    recipesQuery = recipesQuery.or(
      `title.ilike.%${q.trim()}%,description.ilike.%${q.trim()}%`
    );
  }

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

  const recipeIds = (recipes ?? []).map((r) => r.id);

  const likeCountsMap = new Map<string, number>();
  const commentCountsMap = new Map<string, number>();
  let likedRecipeIds: string[] = [];
  let savedRecipeIds: string[] = [];

  if (recipeIds.length > 0) {
    const [{ data: likeCounts }, { data: commentCounts }] = await Promise.all([
      supabase
        .from("likes")
        .select("recipe_id")
        .in("recipe_id", recipeIds),
      supabase
        .from("comments")
        .select("recipe_id")
        .in("recipe_id", recipeIds),
    ]);

    if (likeCounts) {
      for (const l of likeCounts) {
        likeCountsMap.set(l.recipe_id, (likeCountsMap.get(l.recipe_id) ?? 0) + 1);
      }
    }
    if (commentCounts) {
      for (const c of commentCounts) {
        commentCountsMap.set(c.recipe_id, (commentCountsMap.get(c.recipe_id) ?? 0) + 1);
      }
    }
  }

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
    like_count: likeCountsMap.get(recipe.id) ?? 0,
    comment_count: commentCountsMap.get(recipe.id) ?? 0,
    is_liked_by_user: likedRecipeIds.includes(recipe.id),
    is_saved_by_user: savedRecipeIds.includes(recipe.id),
  }));

  const isSearchActive = !!q && q.trim().length > 0;

  return (
    <div className="max-w-5xl mx-auto px-6">
      <div className="py-12 text-center border-b border-gray-100 mb-8">
        <h1 className="text-5xl font-bold tracking-tight mb-3">Fit Recipe</h1>
        <p className="text-gray-500 text-lg max-w-md mx-auto">
          <HomeText textKey="homeHeroSubtitle" />
        </p>
      </div>

      <div className="mb-4">
        <Suspense>
          <SearchBar />
        </Suspense>
      </div>

      <div className="mb-6">
        <Suspense>
          <FeedFilters />
        </Suspense>
      </div>

      {recipesError && (
        <div className="bg-red-50 text-red-600 text-sm p-4 rounded-lg my-6">
          <HomeText textKey="homeError" /> {recipesError.message}
        </div>
      )}

      {!recipesError && recipesWithLikes.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-gray-400 text-lg">
            {isSearchActive ? <HomeText textKey="searchNoResults" /> : <HomeText textKey="homeEmpty" />}
          </p>
          {!isSearchActive && (
            <p className="text-gray-400 text-sm mt-2"><HomeText textKey="homeEmptySub" /></p>
          )}
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

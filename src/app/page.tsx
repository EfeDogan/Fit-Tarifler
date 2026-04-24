import { createClient } from "@/lib/supabase/server";
import RecipeCard from "@/components/RecipeCard";
import type { Recipe } from "@/types/database";

export default async function HomePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: recipes, error: recipesError } = await supabase
    .from("recipes")
    .select(`*, profiles!author_id(username), labels(id, name, slug, color)`)
    .order("created_at", { ascending: false });

  let likedRecipeIds: string[] = [];
  let savedRecipeIds: string[] = [];

  if (user) {
    const { data: likes } = await supabase
      .from("likes")
      .select("recipe_id")
      .eq("user_id", user.id);
    likedRecipeIds = likes?.map((l) => l.recipe_id) ?? [];

    const { data: saves } = await supabase
      .from("saves")
      .select("recipe_id")
      .eq("user_id", user.id);
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipesWithLikes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}

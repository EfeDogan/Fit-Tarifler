import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import RecipeCard from "@/components/RecipeCard";
import type { Recipe } from "@/types/database";
import { ProfileText } from "@/components/ProfileText";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select()
    .eq("id", user.id)
    .single();

  const { data: recipes, error: recipesError } = await supabase
    .from("recipes")
    .select(`*, profiles!author_id(username), labels(id, name, slug, color)`)
    .eq("author_id", user.id)
    .order("created_at", { ascending: false });

  const { data: savedRecipes, error: savedError } = await supabase
    .from("saves")
    .select("recipe_id, recipes(*, profiles!author_id(username), labels(id, name, slug, color))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const myRecipeIds = (recipes ?? []).map((r) => r.id);

  const likeCountsMap = new Map<string, number>();
  const commentCountsMap = new Map<string, number>();
  if (myRecipeIds.length > 0) {
    const [{ data: likeCounts }, { data: commentCounts }] = await Promise.all([
      supabase
        .from("likes")
        .select("recipe_id")
        .in("recipe_id", myRecipeIds),
      supabase
        .from("comments")
        .select("recipe_id")
        .in("recipe_id", myRecipeIds),
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

  const recipesWithLikes = (recipes ?? []).map((recipe) => ({
    ...recipe,
    like_count: likeCountsMap.get(recipe.id) ?? 0,
    comment_count: commentCountsMap.get(recipe.id) ?? 0,
  }));

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">
          {profile?.username}
        </h1>
        <p className="text-gray-400 text-sm mt-1">{user.email}</p>
      </div>

      <div className="mb-12">
        <h2 className="text-xl font-bold mb-5"><ProfileText textKey="profileMyRecipes" /></h2>
        {recipesError && (
          <div className="bg-red-50 text-red-600 text-sm p-4 rounded-lg">
            <ProfileText textKey="profileError" /> {recipesError.message}
          </div>
        )}
        {!recipesError && recipesWithLikes && recipesWithLikes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipesWithLikes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : !recipesError ? (
          <p className="text-gray-400 py-8"><ProfileText textKey="profileNoRecipes" /></p>
        ) : null}
      </div>

      <div>
        <h2 className="text-xl font-bold mb-5"><ProfileText textKey="profileSaved" /></h2>
        {savedError && (
          <div className="bg-red-50 text-red-600 text-sm p-4 rounded-lg">
            <ProfileText textKey="profileError" /> {savedError.message}
          </div>
        )}
        {!savedError && savedRecipes && savedRecipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedRecipes.map((save) => (
              <RecipeCard
                key={save.recipe_id}
                recipe={save.recipes as unknown as Recipe}
              />
            ))}
          </div>
        ) : !savedError ? (
          <p className="text-gray-400 py-8"><ProfileText textKey="profileNoSaved" /></p>
        ) : null}
      </div>
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import RecipeCard from "@/components/RecipeCard";
import type { Recipe } from "@/types/database";

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

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">
          {profile?.username}
        </h1>
        <p className="text-gray-400 text-sm mt-1">{user.email}</p>
      </div>

      <div className="mb-12">
        <h2 className="text-xl font-bold mb-5">Tariflerim</h2>
        {recipesError && (
          <div className="bg-red-50 text-red-600 text-sm p-4 rounded-lg">
            Hata: {recipesError.message}
          </div>
        )}
        {!recipesError && recipes && recipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : !recipesError ? (
          <p className="text-gray-400 py-8">Henüz tarif paylaşmadınız.</p>
        ) : null}
      </div>

      <div>
        <h2 className="text-xl font-bold mb-5">Kaydedilenler</h2>
        {savedError && (
          <div className="bg-red-50 text-red-600 text-sm p-4 rounded-lg">
            Hata: {savedError.message}
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
          <p className="text-gray-400 py-8">Henüz tarif kaydetmediniz.</p>
        ) : null}
      </div>
    </div>
  );
}

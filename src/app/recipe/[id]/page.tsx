import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import LikeSaveButtons from "@/components/LikeSaveButtons";
import ImageGallery from "@/components/ImageGallery";
import DeleteRecipeButton from "@/components/DeleteRecipeButton";
import type { Recipe } from "@/types/database";

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: recipe } = await supabase
    .from("recipes")
    .select(`*, profiles!author_id(username), labels(id, name, slug, color)`)
    .eq("id", id)
    .single();

  if (!recipe) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { count: likeCount } = await supabase
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("recipe_id", id);

  let isLiked = false;
  let isSaved = false;

  if (user) {
    const { data: like } = await supabase
      .from("likes")
      .select()
      .eq("user_id", user.id)
      .eq("recipe_id", id)
      .single();
    isLiked = !!like;

    const { data: save } = await supabase
      .from("saves")
      .select()
      .eq("user_id", user.id)
      .eq("recipe_id", id)
      .single();
    isSaved = !!save;
  }

  const recipeFull: Recipe = {
    ...recipe,
    like_count: likeCount ?? 0,
    is_liked_by_user: isLiked,
    is_saved_by_user: isSaved,
  };

  const isOwner = user?.id === recipe.author_id;
  const images: string[] = recipe.image_urls ?? [];

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <article>
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-medium text-gray-600">
              @{recipe.profiles?.username}
            </span>
            <span className="text-gray-300">·</span>
            <span className="text-sm text-gray-400">
              {new Date(recipe.created_at).toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight mb-4 leading-tight">
            {recipe.title}
          </h1>

          {recipe.description && (
            <p className="text-lg text-gray-500 leading-relaxed mb-4">
              {recipe.description}
            </p>
          )}

          {recipe.labels && recipe.labels.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {recipe.labels.map(
                (label: { id: string; name: string; color: string }) => (
                  <span
                    key={label.id}
                    className="px-2.5 py-1 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: label.color }}
                  >
                    {label.name}
                  </span>
                )
              )}
            </div>
          )}

          {user && <LikeSaveButtons recipe={recipeFull} />}
        </header>

        <ImageGallery images={images} />

        <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-lg">
          {recipe.content}
        </div>

        {isOwner && (
          <div className="mt-10 pt-6 border-t border-gray-100 flex items-center gap-4">
            <DeleteRecipeButton recipeId={recipe.id} />
          </div>
        )}
      </article>

      <div className="mt-10 pt-6 border-t border-gray-100">
        <Link
          href="/"
          className="text-sm text-gray-400 hover:text-black transition-colors"
        >
          ← Geri Dön
        </Link>
      </div>
    </div>
  );
}

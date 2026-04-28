import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import LikeSaveButtons from "@/components/LikeSaveButtons";
import ImageGallery from "@/components/ImageGallery";
import DeleteRecipeButton from "@/components/DeleteRecipeButton";
import CommentSection from "@/components/CommentSection";
import { RecipeDetailText, LabelText } from "@/components/RecipeDetailText";
import EditRecipeButton from "@/components/EditRecipeButton";
import type { Recipe, Comment } from "@/types/database";

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

  const [
    { data: { user } },
    { count: likeCount },
  ] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from("likes")
      .select("*", { count: "exact", head: true })
      .eq("recipe_id", id),
  ]);

  let isLiked = false;
  let isSaved = false;

  if (user) {
    const [{ data: like }, { data: save }] = await Promise.all([
      supabase
        .from("likes")
        .select()
        .eq("user_id", user.id)
        .eq("recipe_id", id)
        .single(),
      supabase
        .from("saves")
        .select()
        .eq("user_id", user.id)
        .eq("recipe_id", id)
        .single(),
    ]);
    isLiked = !!like;
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

  const { data: commentsData } = await supabase
    .from("comments")
    .select("*, profiles!user_id(username, avatar_url)")
    .eq("recipe_id", id)
    .order("created_at", { ascending: true });

  const comments: Comment[] = (commentsData ?? []).map((c) => ({
    id: c.id,
    recipe_id: c.recipe_id,
    user_id: c.user_id,
    content: c.content,
    created_at: c.created_at,
    profiles: c.profiles,
  }));

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
                (label: { id: string; name: string; slug: string; color: string }) => (
                  <span
                    key={label.id}
                    className="px-2.5 py-1 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: label.color }}
                  >
                    <LabelText slug={label.slug} fallback={label.name} />
                  </span>
                )
              )}
            </div>
          )}

          {user && <LikeSaveButtons recipe={recipeFull} />}
        </header>

        {(() => {
          const hasMacros = recipe.calories || recipe.protein || recipe.carbs || recipe.fat;
          if (!hasMacros) return null;
          return (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 p-4 bg-gray-50 rounded-xl">
              {recipe.calories != null && (
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">{recipe.calories}</div>
                  <div className="text-xs text-gray-500 mt-0.5"><RecipeDetailText textKey="kcal" /></div>
                </div>
              )}
              {recipe.protein != null && (
                <div className="text-center">
                  <div className="text-xl font-bold text-orange-600">{recipe.protein}g</div>
                  <div className="text-xs text-gray-500 mt-0.5"><RecipeDetailText textKey="proteinLabel" /></div>
                </div>
              )}
              {recipe.carbs != null && (
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-600">{recipe.carbs}g</div>
                  <div className="text-xs text-gray-500 mt-0.5"><RecipeDetailText textKey="carbsLabel" /></div>
                </div>
              )}
              {recipe.fat != null && (
                <div className="text-center">
                  <div className="text-xl font-bold text-yellow-600">{recipe.fat}g</div>
                  <div className="text-xs text-gray-500 mt-0.5"><RecipeDetailText textKey="fatLabel" /></div>
                </div>
              )}
            </div>
          );
        })()}

        <ImageGallery images={images} />

        <div
          className="prose prose-gray max-w-none text-gray-700 leading-relaxed text-lg"
          dangerouslySetInnerHTML={{ __html: recipe.content }}
        />

        {isOwner && (
          <div className="mt-10 pt-6 border-t border-gray-100 flex items-center gap-4">
            <EditRecipeButton recipeId={recipe.id} />
            <DeleteRecipeButton recipeId={recipe.id} />
          </div>
        )}
      </article>

      <div className="mt-10 pt-8 border-t border-gray-100">
        <CommentSection
          recipeId={recipe.id}
          comments={comments}
          currentUserId={user?.id ?? null}
        />
      </div>

      <div className="mt-10 pt-6 border-t border-gray-100">
        <Link
          href="/"
          className="text-sm text-gray-400 hover:text-black transition-colors"
        >
          <RecipeDetailText textKey="recipeBack" />
        </Link>
      </div>
    </div>
  );
}

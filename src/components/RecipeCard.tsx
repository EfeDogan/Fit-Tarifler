import Link from "next/link";
import Image from "next/image";
import type { Recipe } from "@/types/database";

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  const firstImage =
    recipe.image_urls && recipe.image_urls.length > 0
      ? recipe.image_urls[0]
      : null;

  return (
    <Link href={`/recipe/${recipe.id}`}>
      <article className="relative aspect-[4/5] rounded-2xl overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-xl">
        {firstImage ? (
          <Image
            src={firstImage}
            alt={recipe.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />
        )}

        {recipe.labels && recipe.labels.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            {recipe.labels.slice(0, 3).map((label) => (
              <span
                key={label.id}
                className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-white bg-black/30 backdrop-blur-sm"
                style={{ borderLeft: `2px solid ${label.color}` }}
              >
                {label.name}
              </span>
            ))}
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {recipe.calories != null && (
          <div className="absolute top-3 right-3 z-10">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-black/40 backdrop-blur-sm text-white">
              {recipe.calories} kcal
            </span>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
          <h2 className="text-white font-semibold text-[15px] leading-snug line-clamp-1 mb-1 drop-shadow-sm">
            {recipe.title}
          </h2>

          {recipe.description && (
            <p className="text-white/70 text-xs leading-relaxed line-clamp-2 mb-1.5">
              {recipe.description}
            </p>
          )}

          <div className="flex items-center gap-1.5 text-[11px] text-white/60">
            <span className="font-medium">
              {recipe.profiles?.username}
            </span>
            <span>·</span>
            <span>
              {new Date(recipe.created_at).toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "short",
              })}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

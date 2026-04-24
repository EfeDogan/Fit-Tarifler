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
      <article className="border border-gray-100 rounded-xl overflow-hidden group cursor-pointer transition-shadow hover:shadow-md">
        {firstImage ? (
          <div className="relative aspect-[4/3] bg-gray-50">
            <Image
              src={firstImage}
              alt={recipe.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          </div>
        ) : (
          <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center">
            <span className="text-gray-300 text-4xl">🍽</span>
          </div>
        )}

        <div className="p-4">
          {recipe.labels && recipe.labels.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {recipe.labels.slice(0, 3).map((label) => (
                <span
                  key={label.id}
                  className="px-2 py-0.5 rounded-full text-[11px] font-medium text-white"
                  style={{ backgroundColor: label.color }}
                >
                  {label.name}
                </span>
              ))}
            </div>
          )}

          <h2 className="text-lg font-bold mb-1 group-hover:text-gray-600 transition-colors line-clamp-1">
            {recipe.title}
          </h2>

          {recipe.description && (
            <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed mb-3">
              {recipe.description}
            </p>
          )}

          <div className="flex items-center gap-2 text-xs text-gray-400 pt-2 border-t border-gray-50">
            <span className="font-medium text-gray-500">
              {recipe.profiles?.username}
            </span>
            <span>·</span>
            <span>
              {new Date(recipe.created_at).toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "long",
              })}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

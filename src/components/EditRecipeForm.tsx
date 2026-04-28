"use client";

import { updateRecipe } from "@/lib/actions/recipes";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import type { Label } from "@/types/database";
import TiptapEditor from "@/components/TiptapEditor";
import { useLanguage } from "@/lib/i18n/context";
import Image from "next/image";

const MAX_IMAGES = 3;

export default function EditRecipeForm({
  recipeId,
  initialData,
  allLabels,
}: {
  recipeId: string;
  initialData: {
    title: string;
    description: string;
    content: string;
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
    imageUrls: string[];
    labelIds: string[];
  };
  allLabels: Label[];
}) {
  const router = useRouter();
  const { t, tLabel } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(initialData.title);
  const [description, setDescription] = useState(initialData.description);
  const [calories, setCalories] = useState(initialData.calories);
  const [protein, setProtein] = useState(initialData.protein);
  const [carbs, setCarbs] = useState(initialData.carbs);
  const [fat, setFat] = useState(initialData.fat);

  const [existingImages, setExistingImages] = useState<string[]>(initialData.imageUrls);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  const [selectedLabels, setSelectedLabels] = useState<Set<string>>(new Set(initialData.labelIds));
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const totalImages = existingImages.length + newFiles.length;

  useEffect(() => {
    return () => {
      newPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newPreviews]);

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const available = MAX_IMAGES - totalImages;
    const toAdd = files.slice(0, available);
    if (toAdd.length === 0) return;

    setNewFiles((prev) => [...prev, ...toAdd]);
    const previews = toAdd.map((f) => URL.createObjectURL(f));
    setNewPreviews((prev) => [...prev, ...previews]);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeNewFile = (index: number) => {
    URL.revokeObjectURL(newPreviews[index]);
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleLabel = (labelId: string) => {
    setSelectedLabels((prev) => {
      const next = new Set(prev);
      if (next.has(labelId)) next.delete(labelId);
      else next.add(labelId);
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const content = formData.get("content") as string;

    const result = await updateRecipe(recipeId, {
      title,
      description: description || null,
      content,
      calories: calories ? parseInt(calories) : null,
      protein: protein ? parseInt(protein) : null,
      carbs: carbs ? parseInt(carbs) : null,
      fat: fat ? parseInt(fat) : null,
      existingImageUrls: existingImages,
      newImageFiles: newFiles,
      labelIds: Array.from(selectedLabels),
    });

    if (result.error) {
      const errKey = result.error === "AUTH_REQUIRED" ? "createAuthError"
        : result.error === "NOT_AUTHORIZED" ? "editNotAuthorized"
        : "editError";
      setError(t(errKey));
      setSubmitting(false);
      return;
    }

    router.push(`/recipe/${recipeId}`);
    router.refresh();
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold tracking-tight mb-8">{t("editTitle")}</h1>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            {t("createTitleLabel")}
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            {t("createDescriptionLabel")}
          </label>
          <input
            id="description"
            name="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("createDescriptionPlaceholder")}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("createNutritionLabel")} <span className="text-gray-400 font-normal">({t("createNutritionOptional")})</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="calories" className="block text-xs text-gray-500 mb-1">{t("createCalorieLabel")}</label>
              <input
                id="calories"
                name="calories"
                type="number"
                min="0"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="protein" className="block text-xs text-gray-500 mb-1">{t("createProteinLabel")}</label>
              <input
                id="protein"
                name="protein"
                type="number"
                min="0"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="carbs" className="block text-xs text-gray-500 mb-1">{t("createCarbsLabel")}</label>
              <input
                id="carbs"
                name="carbs"
                type="number"
                min="0"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="fat" className="block text-xs text-gray-500 mb-1">{t("createFatLabel")}</label>
              <input
                id="fat"
                name="fat"
                type="number"
                min="0"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("createContentLabel")}
          </label>
          <TiptapEditor name="content" defaultValue={initialData.content} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("createImagesLabel")} ({totalImages}/{MAX_IMAGES})
          </label>

          {(existingImages.length > 0 || newPreviews.length > 0) && (
            <div className="flex gap-3 mb-3 flex-wrap">
              {existingImages.map((src, i) => (
                <div key={`ex-${i}`} className="relative group">
                  <Image
                    src={src}
                    alt={`Image ${i + 1}`}
                    width={96}
                    height={96}
                    className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(i)}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
              {newPreviews.map((src, i) => (
                <div key={`new-${i}`} className="relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`${t("createPreview")} ${i + 1}`}
                    className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewFile(i)}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-black text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {totalImages < MAX_IMAGES && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                + {t("createUploadImage")}
              </button>
              <p className="text-xs text-gray-400 mt-1">
                {t("createImagesMax", { max: MAX_IMAGES })}
              </p>
            </>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {t("createTagsLabel")}
          </label>
          <div className="flex flex-wrap gap-2">
            {allLabels.map((label) => (
              <button
                key={label.id}
                type="button"
                onClick={() => toggleLabel(label.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedLabels.has(label.id)
                    ? "text-white shadow-sm"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
                style={
                  selectedLabels.has(label.id)
                    ? { backgroundColor: label.color }
                    : {}
                }
              >
                {tLabel(label.slug)}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-black text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {submitting ? t("editSubmitting") : t("editSubmit")}
        </button>
      </form>
    </div>
  );
}

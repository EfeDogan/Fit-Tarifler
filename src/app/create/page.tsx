"use client";

import { useRecipes } from "@/lib/recipes";
import { useSearchParams } from "next/navigation";
import { Suspense, useRef, useState, useEffect } from "react";
import type { Label } from "@/types/database";
import TiptapEditor from "@/components/TiptapEditor";

const MAX_IMAGES = 3;

function CreateRecipeForm() {
  const searchParams = useSearchParams();
  const { createRecipe } = useRecipes();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState<string | null>(searchParams.get("error") ? "Tarif oluşturulurken bir hata oluştu." : null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [labels, setLabels] = useState<Label[]>([]);
  const [selectedLabels, setSelectedLabels] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/labels")
      .then((res) => res.json())
      .then((data) => setLabels(data))
      .catch(() => {});
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const available = MAX_IMAGES - selectedFiles.length;
    const toAdd = files.slice(0, available);
    if (toAdd.length === 0) return;

    setSelectedFiles((prev) => [...prev, ...toAdd]);
    const newPreviews = toAdd.map((f) => URL.createObjectURL(f));
    setPreviews((prev) => [...prev, ...newPreviews]);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
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

    formData.delete("images");
    selectedFiles.forEach((file) => {
      formData.append("images", file);
    });

    formData.delete("labels");
    selectedLabels.forEach((labelId) => {
      formData.append("labels", labelId);
    });

    const result = await createRecipe(formData);

    if (result.error) {
      setError(result.error);
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold tracking-tight mb-8">Yeni Tarif</h1>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Başlık
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            placeholder="Tarifinizin başlığı"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Kısa Açıklama
          </label>
          <input
            id="description"
            name="description"
            type="text"
            placeholder="Tarifinizin kısaca ne hakkında olduğunu yazın..."
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Besin Değerleri <span className="text-gray-400 font-normal">(opsiyonel)</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="calories" className="block text-xs text-gray-500 mb-1">Kalori (kcal)</label>
              <input
                id="calories"
                name="calories"
                type="number"
                min="0"
                placeholder="350"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="protein" className="block text-xs text-gray-500 mb-1">Protein (g)</label>
              <input
                id="protein"
                name="protein"
                type="number"
                min="0"
                placeholder="30"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="carbs" className="block text-xs text-gray-500 mb-1">Karbonhidrat (g)</label>
              <input
                id="carbs"
                name="carbs"
                type="number"
                min="0"
                placeholder="25"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="fat" className="block text-xs text-gray-500 mb-1">Yağ (g)</label>
              <input
                id="fat"
                name="fat"
                type="number"
                min="0"
                placeholder="12"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Tarif İçeriği
          </label>
          <TiptapEditor name="content" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Görseller ({selectedFiles.length}/{MAX_IMAGES})
          </label>

          {previews.length > 0 && (
            <div className="flex gap-3 mb-3 flex-wrap">
              {previews.map((src, i) => (
                <div key={i} className="relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`Önizleme ${i + 1}`}
                    className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-black text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {selectedFiles.length < MAX_IMAGES && (
            <>
              <input
                ref={fileInputRef}
                id="images-input"
                name="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 file:cursor-pointer"
              />
              <p className="text-xs text-gray-400 mt-1">
                En fazla {MAX_IMAGES} görsel yükleyebilirsiniz
              </p>
            </>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Etiketler
          </label>
          <div className="flex flex-wrap gap-2">
            {labels.map((label) => (
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
                {label.name}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-black text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {submitting ? "Paylaşılıyor..." : "Tarifi Paylaş"}
        </button>
      </form>
    </div>
  );
}

export default function CreateRecipePage() {
  return (
    <Suspense>
      <CreateRecipeForm />
    </Suspense>
  );
}

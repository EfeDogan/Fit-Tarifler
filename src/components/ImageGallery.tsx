"use client";

import Image from "next/image";
import { useState } from "react";

export default function ImageGallery({ images }: { images: string[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="relative rounded-xl overflow-hidden">
        <Image
          src={images[activeIndex]}
          alt={`Tarif görseli ${activeIndex + 1}`}
          width={800}
          height={400}
          className="w-full object-cover max-h-[400px]"
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 mt-3">
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`relative rounded-lg overflow-hidden transition-all ${
                i === activeIndex
                  ? "ring-2 ring-black ring-offset-2"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={src}
                alt={`Küçük görsel ${i + 1}`}
                width={80}
                height={80}
                className="w-20 h-20 object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

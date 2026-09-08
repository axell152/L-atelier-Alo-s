'use client';
import { useState } from 'react';

export default function ProductGallery({ images, title }) {
  const [index, setIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-white rounded-3xl border border-[#EFECE6] overflow-hidden shadow-xs flex items-center justify-center text-[#6B5B52]">
        Aucune image
      </div>
    );
  }

  const prev = () => setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="space-y-3">
      <div className="relative aspect-square bg-white rounded-3xl border border-[#EFECE6] overflow-hidden shadow-xs group">
        <img
          src={images[index]}
          alt={`${title} — photo ${index + 1}`}
          className="w-full h-full object-cover"
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Photo précédente"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-xs border border-[#EFECE6] shadow-sm flex items-center justify-center text-[#4A3B32] hover:bg-white transition"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Photo suivante"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-xs border border-[#EFECE6] shadow-sm flex items-center justify-center text-[#4A3B32] hover:bg-white transition"
            >
              ›
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xs text-xs font-semibold text-[#5A3E36] px-2.5 py-1 rounded-full shadow-sm">
              {index + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex items-center justify-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Aller à la photo ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === index ? 'w-6 bg-[#5A3E36]' : 'w-2 bg-[#E8DFD6]'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

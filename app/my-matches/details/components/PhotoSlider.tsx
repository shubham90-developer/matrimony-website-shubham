"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { MapPin, X, ChevronLeft, ChevronRight } from "lucide-react";

interface PhotoSliderProps {
  images: string[];
  name: string;
  age?: number;
  location?: string;
}

export function PhotoSlider({ images, name, age, location }: PhotoSliderProps) {
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const goTo = (i: number) => {
    setIndex(Math.max(0, Math.min(images.length - 1, i)));
  };

  return (
    <>
      <div className="relative aspect-3/4 w-full overflow-hidden bg-slate-900">
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="absolute inset-0 z-10 cursor-zoom-in"
          aria-label="Open photo"
        />

        <Image
          src={images[index]}
          alt={`${name} photo ${index + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 740px"
          className="object-cover"
          priority={index === 0}
        />

        {/* progress bars */}
        {images.length > 1 && (
          <div className="absolute left-3 right-3 top-3 z-20 flex gap-1">
            {images.map((_, i) => (
              <div key={i} className="h-0.75 flex-1 overflow-hidden">
                <div
                  className={`h-full bg-white transition-all ${
                    i <= index ? "w-full" : "w-0"
                  }`}
                />
              </div>
            ))}
          </div>
        )}

        {/* tap zones */}
        {images.length > 1 && (
          <>
            <button
              aria-label="Previous photo"
              onClick={(e) => {
                e.stopPropagation();
                goTo(index - 1);
              }}
              className="absolute inset-y-0 left-0 z-20 w-1/3"
            />
            <button
              aria-label="Next photo"
              onClick={(e) => {
                e.stopPropagation();
                goTo(index + 1);
              }}
              className="absolute inset-y-0 right-0 z-20 w-1/3"
            />
          </>
        )}

        {/* bottom gradient + info */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-black/75 to-transparent" />
        <div className="pointer-events-none absolute bottom-4 left-4 right-4 z-20 flex items-end justify-between">
          <div>
            <p className="text-xl font-semibold text-white">
              {name}
              {age ? `, ${age}` : ""}
            </p>
            {location && (
              <p className="mt-0.5 flex items-center gap-1 text-sm text-white/85">
                <MapPin className="h-3.5 w-3.5" />
                {location}
              </p>
            )}
          </div>
          {images.length > 1 && (
            <span className="rounded-full bg-black/40 px-2.5 py-1 text-xs text-white/90">
              {index + 1} / {images.length}
            </span>
          )}
        </div>
      </div>

      {lightboxOpen && (
        <ImageLightbox
          images={images}
          index={index}
          onChange={goTo}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}

interface ImageLightboxProps {
  images: string[];
  index: number;
  onClose: () => void;
  onChange: (index: number) => void;
}

function ImageLightbox({
  images,
  index,
  onClose,
  onChange,
}: ImageLightboxProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft")
        onChange((index - 1 + images.length) % images.length);
      if (e.key === "ArrowRight") onChange((index + 1) % images.length);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [index, images.length, onChange, onClose]);

  const goPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange((index - 1 + images.length) % images.length);
  };

  const goNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange((index + 1) % images.length);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex cursor-pointer items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            <X size={16} /> Close
          </button>
        </div>

        <div className="relative h-[70vh] w-full overflow-hidden rounded-2xl bg-slate-900 sm:h-[75vh]">
          <Image
            src={images[index]}
            alt={`photo ${index + 1}`}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 640px"
            priority
          />

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous photo"
                className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next photo"
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white">
            {index + 1} / {images.length}
          </span>
        </div>

        {images.length > 1 && (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {images.map((src, i) => (
              <button
                type="button"
                key={src + i}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(i);
                }}
                aria-label={`View photo ${i + 1}`}
                className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                  i === index
                    ? "border-rose-500"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={src}
                  alt={`thumb ${i + 1}`}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

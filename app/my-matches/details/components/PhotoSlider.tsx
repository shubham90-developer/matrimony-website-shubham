"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin } from "lucide-react";

interface PhotoSliderProps {
  images: string[];
  name: string;
  age?: number;
  location?: string;
}

export function PhotoSlider({ images, name, age, location }: PhotoSliderProps) {
  const [index, setIndex] = useState(0);

  const goTo = (i: number) => {
    setIndex(Math.max(0, Math.min(images.length - 1, i)));
  };

  return (
    <div className="relative aspect-3/4 w-full overflow-hidden  bg-slate-900">
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
        <div className="absolute left-3 right-3 top-3 flex gap-1">
          {images.map((_, i) => (
            <div key={i} className="h-0.75 flex-1 overflow-hidden ">
              <div
                className={`h-full bg-white transition-all ${
                  i < index ? "w-full" : i === index ? "w-full" : "w-0"
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
            onClick={() => goTo(index - 1)}
            className="absolute inset-y-0 left-0 w-1/3"
          />
          <button
            aria-label="Next photo"
            onClick={() => goTo(index + 1)}
            className="absolute inset-y-0 right-0 w-1/3"
          />
        </>
      )}

      {/* bottom gradient + info */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-black/75 to-transparent" />
      <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-end justify-between">
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
  );
}

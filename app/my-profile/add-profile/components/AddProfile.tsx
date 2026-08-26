"use client";

import { useRef, useState } from "react";
import { ChevronLeft, Plus, X } from "lucide-react";
import Link from "next/link";

const MAX_PHOTOS = 6;

interface PhotoItem {
  id: string;
  url: string;
  file: File;
}

const AddProfile = () => {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const remainingSlots = MAX_PHOTOS - photos.length;
    const toAdd = files.slice(0, remainingSlots).map((file) => ({
      id: crypto.randomUUID(),
      url: URL.createObjectURL(file),
      file,
    }));
    setPhotos((prev) => [...prev, ...toAdd]);
    e.target.value = ""; // allow re-selecting the same file later
  };

  const handleDelete = (id: string) => {
    setPhotos((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((p) => p.id !== id);
    });
  };

  return (
    <div className="rounded-xl border border-gray-200 p-4">
      <div className="relative mb-4 flex items-center justify-center border-b border-dashed border-gray-200 py-3">
        <Link
          href="/my-profile"
          className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:bg-slate-100"
          aria-label="Go back"
        >
          <ChevronLeft size={20} />
        </Link>
        <h3 className="font-serif text-xl font-semibold text-slate-900">
          Add Profile
        </h3>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFilesSelected}
      />

      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="relative aspect-square overflow-hidden rounded-xl"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.url}
              alt=""
              className="h-full w-full object-cover"
            />
            <button
              onClick={() => handleDelete(photo.id)}
              aria-label="Delete photo"
              className="absolute cursor-pointer right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-rose-600 text-white shadow-sm transition hover:bg-rose-700"
            >
              <X size={12} />
            </button>
            {index === 0 && (
              <span className="absolute bottom-1.5 left-1.5 rounded-md bg-black/55 px-1.5 py-0.5 text-[9px] font-semibold text-white">
                Primary
              </span>
            )}
          </div>
        ))}

        {photos.length < MAX_PHOTOS && (
          <button
            onClick={() => inputRef.current?.click()}
            className="flex aspect-square flex-col items-center cursor-pointer justify-center gap-1 rounded-xl border-[1.5px] border-dashed border-slate-300 text-slate-400 transition hover:border-rose-300 hover:text-rose-500"
          >
            <Plus size={20} />
            <span className="text-[11px] font-medium">Add Photo</span>
          </button>
        )}
      </div>

      {photos.length > 0 && (
        <p className="mt-3 text-xs text-slate-400">
          {photos.length}/{MAX_PHOTOS} photos added
        </p>
      )}
    </div>
  );
};

export default AddProfile;

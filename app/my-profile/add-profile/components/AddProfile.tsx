"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, Plus, X } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  useGetMyProfileQuery,
  useUploadProfilePhotosMutation,
  useRemoveProfilePhotoMutation,
} from "@/Redux/profileApi";

const MAX_PHOTOS = 6;

// Local, not-yet-uploaded photos (picked from disk, previewed via blob URL)
interface PendingPhoto {
  id: string;
  url: string;
  file: File;
}

const AddProfile = () => {
  const { data, isLoading, isError } = useGetMyProfileQuery();
  const [uploadPhotos, { isLoading: isUploading }] =
    useUploadProfilePhotosMutation();
  const [removePhoto, { isLoading: isRemoving }] =
    useRemoveProfilePhotoMutation();

  // photos already saved on the profile (URLs from the backend)
  const [savedPhotos, setSavedPhotos] = useState<string[]>([]);
  // photos picked locally, not uploaded yet
  const [pendingPhotos, setPendingPhotos] = useState<PendingPhoto[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (data?.data?.photos) {
      setSavedPhotos(data.data.photos);
    }
  }, [data]);

  const totalCount = savedPhotos.length + pendingPhotos.length;

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const remainingSlots = MAX_PHOTOS - totalCount;
    const toAdd = files.slice(0, remainingSlots).map((file) => ({
      id: crypto.randomUUID(),
      url: URL.createObjectURL(file),
      file,
    }));
    setPendingPhotos((prev) => [...prev, ...toAdd]);
    e.target.value = ""; // allow re-selecting the same file later
  };

  const handleDeletePending = (id: string) => {
    setPendingPhotos((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((p) => p.id !== id);
    });
  };

  const handleDeleteSaved = async (url: string) => {
    try {
      await removePhoto(url).unwrap();
      setSavedPhotos((prev) => prev.filter((p) => p !== url));
      toast.success("Photo removed");
    } catch (err) {
      toast.error("Failed to remove photo");
    }
  };

  const handleUpload = async () => {
    if (pendingPhotos.length === 0) return;

    try {
      await uploadPhotos(pendingPhotos.map((p) => p.file)).unwrap();
      pendingPhotos.forEach((p) => URL.revokeObjectURL(p.url));
      setPendingPhotos([]);
      toast.success("Photos uploaded successfully");
    } catch (err) {
      toast.error("Failed to upload photos");
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-sm text-slate-500">Loading...</div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-sm text-rose-500">
        Could not load profile.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 p-4">
      <div className="relative mb-4 flex items-center justify-center border-b border-dashed border-gray-200 py-3">
        {/* Back Button */}
        <Link
          href="/my-profile"
          className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md"
          aria-label="Go back to my profile"
        >
          <ChevronLeft size={20} strokeWidth={2} />
        </Link>

        {/* Title */}
        <div className="text-center">
          <h3 className="font-serif text-xl font-semibold leading-tight text-slate-900">
            My Photos
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Capture and cherish your beautiful moments
          </p>
        </div>
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
        {/* already-saved photos from the backend */}
        {savedPhotos.map((url, index) => (
          <div
            key={url}
            className="relative aspect-square overflow-hidden rounded-xl"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="h-full w-full object-cover" />
            <button
              onClick={() => handleDeleteSaved(url)}
              disabled={isRemoving}
              aria-label="Delete photo"
              className="absolute cursor-pointer right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-rose-600 text-white shadow-sm transition hover:bg-rose-700 disabled:opacity-50"
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

        {/* locally picked, not-yet-uploaded photos */}
        {pendingPhotos.map((photo, index) => (
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
              onClick={() => handleDeletePending(photo.id)}
              aria-label="Delete photo"
              className="absolute cursor-pointer right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-rose-600 text-white shadow-sm transition hover:bg-rose-700"
            >
              <X size={12} />
            </button>
            {savedPhotos.length === 0 && index === 0 && (
              <span className="absolute bottom-1.5 left-1.5 rounded-md bg-black/55 px-1.5 py-0.5 text-[9px] font-semibold text-white">
                Primary
              </span>
            )}
            <span className="absolute bottom-1.5 right-1.5 rounded-md bg-amber-500/90 px-1.5 py-0.5 text-[9px] font-semibold text-white">
              Pending
            </span>
          </div>
        ))}

        {totalCount < MAX_PHOTOS && (
          <button
            onClick={() => inputRef.current?.click()}
            className="flex aspect-square w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-[1.5px] border-dashed border-slate-300 bg-slate-50 px-4 text-center transition hover:border-rose-300"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-pink-500 to-rose-500 shadow-lg shadow-rose-200">
              <Plus size={26} className="text-white" strokeWidth={2.5} />
            </span>

            <span className="flex flex-col gap-0.5">
              <span className="text-sm font-bold text-slate-900">Add More</span>
              <span className="text-[11px] leading-snug text-slate-400">
                Upload more photos
                <br />
                to make your story complete
              </span>
            </span>
          </button>
        )}
      </div>

      {totalCount > 0 && (
        <p className="mt-3 text-xs text-slate-400">
          {totalCount}/{MAX_PHOTOS} photos added
        </p>
      )}

      {pendingPhotos.length > 0 && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="cursor-pointer rounded-full bg-rose-500 px-4 py-2 font-serif text-sm text-white transition hover:bg-rose-600 disabled:opacity-50"
          >
            {isUploading
              ? "Uploading..."
              : `Upload ${pendingPhotos.length} Photo${pendingPhotos.length > 1 ? "s" : ""}`}
          </button>
        </div>
      )}
    </div>
  );
};

export default AddProfile;

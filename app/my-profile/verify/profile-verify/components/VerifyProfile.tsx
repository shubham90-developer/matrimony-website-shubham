"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ThemeBtnOne from "@/app/components/ThemeBtnOne";
import { Camera, ChevronLeft, ImageUp, ShieldCheck } from "lucide-react";

const Verification = () => {
  const selfieInputRef = useRef<HTMLInputElement>(null);
  const aadharInputRef = useRef<HTMLInputElement>(null);

  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [aadharFile, setAadharFile] = useState<File | null>(null);

  const handleSelfieChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelfiePreview(URL.createObjectURL(file));
  };

  const handleAadharChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAadharFile(file);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      {/* Header */}
      <div className="relative mb-8 flex items-center justify-center border-b border-dashed border-gray-200 pb-4">
        <Link
          href="/my-profile"
          className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:bg-slate-100"
        >
          <ChevronLeft size={20} />
        </Link>

        <h3 className="font-serif text-xl font-semibold text-slate-900">
          Verify Profile
        </h3>
      </div>

      {/* Intro */}
      <div className="text-center">
        <h2 className="text-lg font-bold text-slate-900 xs:text-xl">
          Complete your verification
        </h2>
        <p className="mt-1 text-xs text-slate-500 xs:text-sm">
          This helps us build a safe &amp; trusted community
        </p>
      </div>

      {/* Secure info banner */}
      <div className="mt-4 flex items-start gap-3 rounded-2xl bg-rose-50 p-3.5 xs:mt-5 xs:p-4">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rose-500">
          <ShieldCheck size={15} className="text-white" />
        </span>
        <p className="text-xs leading-relaxed text-slate-600 xs:text-sm">
          Your information is 100% secure and will never be shared with others
        </p>
      </div>

      {/* Add a Selfie */}
      <div className="mt-6 xs:mt-8">
        <div className="flex items-center gap-2">
          <Camera size={16} className="text-slate-700" />
          <h4 className="text-sm font-bold text-slate-900 xs:text-base">
            Add a Selfie
          </h4>
          <span className="rounded-full border border-rose-300 bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-500 xs:text-[11px]">
            Required
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-500 xs:text-sm">
          Take a clear selfie. Make sure your face is clearly visible.
        </p>

        <input
          ref={selfieInputRef}
          type="file"
          accept="image/*"
          capture="user"
          className="hidden"
          onChange={handleSelfieChange}
        />

        <button
          type="button"
          onClick={() => selfieInputRef.current?.click()}
          className="mt-3 flex aspect-square w-full cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border-[1.5px] border-dashed border-slate-300 bg-white text-center transition hover:border-rose-300"
        >
          {selfiePreview ? (
            <div className="relative h-full w-full">
              <Image
                src={selfiePreview}
                alt="Selfie preview"
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <>
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 xs:h-14 xs:w-14">
                <Camera size={22} className="text-rose-500" />
              </span>
              <span className="flex flex-col gap-1 px-4">
                <span className="text-sm font-bold text-slate-900 xs:text-base">
                  Click to Take a Selfie
                </span>
                <span className="text-xs text-slate-500 xs:text-sm">
                  or upload from gallery
                </span>
              </span>
            </>
          )}
        </button>
      </div>

      <div className="mt-6 border-t border-dashed border-slate-200 xs:mt-8" />

      {/* Upload Aadhar card */}
      <div className="mt-6 xs:mt-8">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-bold text-slate-900 xs:text-base">
            Upload Aadhar card
          </h4>
          <span className="rounded-full border border-rose-300 bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-500 xs:text-[11px]">
            Required
          </span>
        </div>
        <p className="mt-1 text-xs leading-relaxed text-slate-500 xs:text-sm">
          Upload clear image of your valid Aadhar card (front side) Only support
          jpg, png
        </p>

        <input
          ref={aadharInputRef}
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={handleAadharChange}
        />

        <div className="mt-3 flex flex-col items-center justify-center gap-3 rounded-2xl border-[1.5px] border-dashed border-slate-300 bg-white px-4 py-8 text-center xs:py-10">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 xs:h-14 xs:w-14">
            <ImageUp size={22} className="text-slate-500" />
          </span>

          <span className="text-sm font-bold text-slate-900 xs:text-base">
            {aadharFile ? aadharFile.name : "Upload Front Aadhar Image"}
          </span>

          <button
            type="button"
            onClick={() => aadharInputRef.current?.click()}
            className="cursor-pointer rounded-full border border-rose-300 bg-rose-50 px-6 py-2 text-xs font-bold text-rose-500 transition hover:bg-rose-100 xs:text-sm"
          >
            Upload
          </button>

          <span className="text-[11px] text-slate-400 xs:text-xs">
            JPG, PNG or PDF (max 5MB)
          </span>
        </div>
      </div>

      {/* Submit */}
      <ThemeBtnOne
        text="Submit for Verification"
        url="#"
        className="mt-8 w-full cursor-pointer rounded-full bg-rose-600 py-3.5 text-sm font-bold text-white hover:bg-rose-700 xs:py-4 xs:text-base"
      />
    </div>
  );
};

export default Verification;

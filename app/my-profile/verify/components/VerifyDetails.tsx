"use client";

import ThemeBtnOne from "@/app/components/ThemeBtnOne";
import { BadgeCheck, ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const VerifyDetails = () => {
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

      {/* Content */}
      <div className="mx-auto max-w-xl text-center">
        {/* Profile Image */}
        <div className="relative mx-auto mb-8 h-64 w-56 rounded-md bg-gray-100 p-4 shadow-sm">
          <div className="relative h-full w-full overflow-hidden rounded">
            <Image
              src="/img/matches/1.jpg" // Replace with your image
              alt="Profile"
              fill
              className="object-cover"
            />
          </div>

          {/* Gold Badge */}
          <div className="absolute bottom-5 right-2 flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-yellow-300 via-yellow-400 to-yellow-600 shadow-lg">
            <BadgeCheck className="h-8 w-8 text-white" />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-4xl font-bold leading-tight text-slate-900 font-serif">
          Stand out with a verified{" "}
          <span className="text-yellow-600">Gold Badge</span>
        </h2>

        {/* Description */}
        <p className="mx-auto mt-5 max-w-lg text-lg leading-8 text-slate-500">
          Upgrade to unlock more visibility, gain trust instantly, and get more
          responses.
        </p>

        {/* Button */}
        <ThemeBtnOne
          text="Verify now"
          url="/my-profile/verify/profile-verify"
          className="mt-10 w-full rounded-full bg-rose-500 py-4 text-lg font-semibold text-white hover:bg-rose-600 cursor-pointer font-serif"
        />

        {/* Footer */}
        <p className="mt-8 text-base text-slate-500">
          Get access to full photo album, share contact details &amp; more.
        </p>
      </div>
    </div>
  );
};

export default VerifyDetails;

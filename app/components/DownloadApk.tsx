"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const DownloadApk = () => {
  return (
    <section className="w-full bg-[#FDF8F3] py-0 px-5 sm:px-8 lg:px-8">
      <div className="mx-auto flex max-w-7xl bg-rose-100 py-15 px-8 flex-col items-center gap-14 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
        {/* Left: copy + download card */}
        <div className="w-full max-w-md text-center lg:text-left">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl font-serif">
            Download the Tuza Maza Jamla.com app
          </h2>
          <p className="mt-3 text-lg text-slate-600">
            Connect with your matches anytime, anywhere
          </p>

          <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm sm:p-7">
            <p className="text-center text-[15px] text-slate-700 sm:text-left">
              Point your phone camera at the QR code or use one of the download
              links below
            </p>

            <div className="mt-5 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
              <Image
                src="/img/download apk/3.png"
                alt="QR code to download the app"
                width={200}
                height={100}
                className="h-25 w-35 shrink-0 sm:h-30 sm:w-40"
              />

              <div className="flex flex-col items-center gap-2.5 sm:items-start">
                <Link
                  href="https://play.google.com/store/apps/details?id=com.Tuza Maza Jamla.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {" "}
                  <Image
                    src="/img/download apk/1.png"
                    alt="Download on the App Store"
                    width={160}
                    height={48}
                    className="h-auto w-40"
                  />
                </Link>
                <Link
                  href="https://play.google.com/store/apps/details?id=com.Tuza Maza Jamla.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/img/download apk/2.png"
                    alt="Get it on Google Play"
                    width={160}
                    height={48}
                    className="h-auto w-40"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right: phone mockup */}
        <div className="relative w-full">
          <div className="relative h-107.5 sm:h-120">
            <Image
              src="/img/download apk/4.png"
              alt="Tuza Maza Jamla.com app screenshot on a phone"
              fill
              sizes="(min-width: 1024px) 420px, 90vw"
              className="object-cover md:object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadApk;

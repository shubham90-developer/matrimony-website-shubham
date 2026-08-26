"use client";

import React from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

type PressRelease = {
  id: string;
  title: string;
  outlet: string;
  date: string;
  excerpt: string;
  image: string;
  href: string;
};

const releases: PressRelease[] = [
  {
    id: "series-a",
    title: "Raises Series A funding to expand verified matchmaking",
    outlet: "Economic Times",
    date: "May 2026",
    excerpt:
      "The platform announced a new funding round to grow its trust and safety team and expand into new cities.",
    image: "/img/press/1.jpg",
    href: "#",
  },
  {
    id: "trust-safety-award",
    title: "Wins 'Excellence in Trust & Safety' at TechCircle Awards",
    outlet: "TechCircle",
    date: "March 2026",
    excerpt:
      "Recognized for its verification-first approach to online matchmaking and proactive fraud prevention.",
    image: "/img/press/2.webp",
    href: "#",
  },
  {
    id: "45k-marriages",
    title: "Crosses 45,000 successful marriages milestone",
    outlet: "YourStory",
    date: "January 2026",
    excerpt:
      "A look at how the platform's verification model has shaped outcomes for families across India.",
    image: "/img/press/3.jpg",
    href: "#",
  },
  {
    id: "app-relaunch",
    title: "Launches redesigned app with AI-assisted matchmaking",
    outlet: "Mint",
    date: "October 2025",
    excerpt:
      "The updated app introduces smarter recommendations while keeping manual search front and center.",
    image: "/img/press/2.webp",
    href: "#",
  },
  {
    id: "safety-feature",
    title: "Introduces family-verified badge to curb fake profiles",
    outlet: "Business Standard",
    date: "August 2025",
    excerpt:
      "A new verification layer lets family members co-sign a profile, adding an extra layer of trust.",
    image: "/img/press/3.jpg",
    href: "#",
  },
];

const Press = () => {
  return (
    <div className="w-full bg-[#FDF8F3] py-0 px-5 sm:px-8 lg:px-8">
      <div className="mx-auto max-w-7xl  bg-white p-8 py-15">
        {/* Heading */}
        <div className="text-center">
          <span className="rounded-full bg-rose-100 px-4 py-1 text-xs font-bold tracking-widest text-rose-600 uppercase">
            Press & Media
          </span>
          <h1 className="mx-auto mt-3 max-w-2xl font-serif text-3xl font-bold text-slate-900 sm:text-4xl">
            In the <span className="text-rose-600">News</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-slate-500">
            The latest coverage and announcements from newsrooms writing about
            us.
          </p>
        </div>

        {/* Newspaper-style news list */}
        <div className="mt-14 space-y-6">
          {releases.map((release, i) => (
            <a
              key={release.id}
              href={release.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex flex-col gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-start ${
                i === 0 ? "" : ""
              }`}
            >
              <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-xl sm:h-32 sm:w-48">
                <Image
                  src={release.image}
                  alt={release.title}
                  fill
                  className="object-cover grayscale transition duration-300 group-hover:grayscale-0"
                  sizes="(max-width: 640px) 100vw, 192px"
                />
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                  <span className="font-serif text-sm font-bold uppercase tracking-wide text-rose-600">
                    {release.outlet}
                  </span>
                  <span className="text-slate-300">&middot;</span>
                  <span className="text-white bg-rose-500 px-2 py-0.5 rounded-full">
                    {release.date}
                  </span>
                </div>
                <h2 className="mt-2 font-serif text-xl font-bold leading-snug text-slate-900 group-hover:text-rose-600 sm:text-2xl">
                  {release.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {release.excerpt}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-rose-600">
                  Read full story
                  <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Press;

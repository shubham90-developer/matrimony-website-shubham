"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Quote, ChevronLeft, ChevronRight, Heart } from "lucide-react";

type Story = {
  names: string;
  location: string;
  weddingDate: string;
  quote: string;
  initials: string;
  image: string; // path to couple photo
};

const stories: Story[] = [
  {
    names: "Ananya & Rohan",
    location: "Mumbai, Maharashtra",
    weddingDate: "Married Feb 2025",
    quote:
      "We matched within two weeks of creating our profiles. The advanced search filters helped us find someone who truly shared our values. Forever grateful to this platform!",
    initials: "AR",
    image: "/img/testimonials/1.jpg",
  },
  {
    names: "Priya & Karan",
    location: "Bengaluru, Karnataka",
    weddingDate: "Married Nov 2024",
    quote:
      "The Blue Tick verification gave us both confidence that we were talking to real, genuine profiles. What started as a simple 'interest' turned into our happily ever after.",
    initials: "PK",
    image: "/img/testimonials/2.jpg",
  },
  {
    names: "Meera & Arjun",
    location: "Jaipur, Rajasthan",
    weddingDate: "Married Jan 2025",
    quote:
      "Long distance felt impossible until we found each other here. The AI matchmaking understood exactly what we were looking for, right down to our family values.",
    initials: "MA",
    image: "/img/testimonials/3.jpg",
  },
  {
    names: "Divya & Sameer",
    location: "Pune, Maharashtra",
    weddingDate: "Married Mar 2025",
    quote:
      "We were skeptical about matrimonial sites, but within a month of upgrading to Paid membership, we connected. Three months later, Sameer proposed. Highly recommend!",
    initials: "DS",
    image: "/img/testimonials/4.jpg",
  },
];

const RealStories = () => {
  const [index, setIndex] = useState(0);

  const goTo = (i: number) => {
    const total = stories.length;
    setIndex(((i % total) + total) % total);
  };

  const active = stories[index];

  return (
    <section className="w-full bg-[#FDF8F3] py-0 px-5 sm:px-8 lg:px-8">
      <div className="mx-auto max-w-7xl bg-white p-8 py-15">
        {/* Heading */}
        <div className="text-center">
          <span className="text-xs font-bold tracking-widest text-black bg-rose-100 px-4 py-1 rounded-full">
            SUCCESS STORIES
          </span>
          <h2 className="mt-1 font-serif text-3xl font-bold text-slate-900 sm:text-4xl">
            <span className="text-rose-600">Real</span> Stories, Real Couples
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-slate-500">
            Every day, thousands of members find their perfect match. Here are a
            few of the love stories that began right here.
          </p>
        </div>

        {/* Story card */}
        <div className="relative mt-12">
          <div className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_50px_-20px_rgba(15,23,42,0.15)] sm:grid-cols-2">
            {/* Couple photo */}
            <div className="relative h-64 w-full sm:h-full sm:min-h-95">
              <Image
                src={active.image}
                alt={`${active.names} wedding photo`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/0 to-black/0 sm:bg-linear-to-r sm:from-black/30 sm:via-black/0 sm:to-black/0" />
              <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 backdrop-blur-sm sm:hidden">
                <p className="text-sm font-semibold text-slate-900">
                  {active.names}
                </p>
                <Heart
                  className="h-3.5 w-3.5 text-rose-500"
                  fill="currentColor"
                />
              </div>
            </div>

            {/* Quote content */}
            <div className="flex flex-col justify-center p-8 sm:p-12">
              <Quote
                className="h-10 w-10 text-rose-200"
                strokeWidth={1.5}
                fill="currentColor"
              />

              <p className="mt-4 font-serif text-xl leading-relaxed text-slate-800 sm:text-2xl">
                &quot;{active.quote}&quot;
              </p>

              <div className="mt-8 flex items-center gap-4">
                <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-full bg-rose-100 text-lg font-semibold text-rose-600 sm:flex">
                  {active.initials}
                </div>
                <div>
                  <div className="hidden items-center gap-2 sm:flex">
                    <p className="text-[15px] font-semibold text-slate-900">
                      {active.names}
                    </p>
                    <Heart
                      className="h-3.5 w-3.5 text-rose-500"
                      fill="currentColor"
                    />
                  </div>
                  <p className="text-sm text-slate-500">
                    {active.location} &middot; {active.weddingDate}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Nav arrows */}
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Previous story"
            className="absolute cursor-pointer left-0 top-1/2 hidden -translate-x-5 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white p-3 text-slate-500 shadow-md transition hover:bg-rose-50 hover:text-rose-600 sm:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Next story"
            className="absolute cursor-pointer right-0 top-1/2 hidden -translate-y-1/2 translate-x-5 items-center justify-center rounded-full border border-slate-200 bg-white p-3 text-slate-500 shadow-md transition hover:bg-rose-50 hover:text-rose-600 sm:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Thumbnail selector */}
        <div className="mt-6 flex items-center justify-center gap-3">
          {stories.map((story, i) => (
            <button
              key={story.names}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to ${story.names} story`}
              className={`relative h-12 w-12 overflow-hidden rounded-full ring-offset-2 transition-all ${
                i === index
                  ? "ring-2 ring-rose-500"
                  : "opacity-60 ring-1 ring-slate-200 hover:opacity-100"
              }`}
            >
              <Image
                src={story.image}
                alt={story.names}
                fill
                className="object-cover"
                sizes="48px"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RealStories;

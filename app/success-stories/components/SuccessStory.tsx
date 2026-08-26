"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Heart, MapPin, Quote } from "lucide-react";

type Story = {
  id: string;
  names: string;
  location: string;
  month: string;
  quote: string;
  image: string;
};

const storiesByYear: Record<string, Story[]> = {
  "2025": [
    {
      id: "ananya-rohan",
      names: "Ananya & Rohan",
      location: "Mumbai, Maharashtra",
      month: "February",
      quote:
        "We matched within two weeks of creating our profiles. The advanced search filters helped us find someone who truly shared our values.",
      image: "/img/success-story/1.jpg",
    },
    {
      id: "meera-arjun",
      names: "Meera & Arjun",
      location: "Jaipur, Rajasthan",
      month: "January",
      quote:
        "Long distance felt impossible until we found each other here. The matchmaking understood exactly what we were looking for.",
      image: "/img/success-story/2.jpg",
    },
    {
      id: "divya-sameer",
      names: "Divya & Sameer",
      location: "Pune, Maharashtra",
      month: "March",
      quote:
        "We were skeptical about matrimonial sites, but within a month we connected. Three months later, Sameer proposed.",
      image: "/img/success-story/3.jpg",
    },
  ],
  "2024": [
    {
      id: "priya-karan",
      names: "Priya & Karan",
      location: "Bengaluru, Karnataka",
      month: "November",
      quote:
        "The Blue Tick verification gave us both confidence that we were talking to genuine profiles. A simple 'interest' turned into forever.",
      image: "/img/success-story/1.jpg",
    },
    {
      id: "isha-varun",
      names: "Isha & Varun",
      location: "Ahmedabad, Gujarat",
      month: "August",
      quote:
        "Our families connected first, then we did. The whole process felt warm and respectful of how we wanted to find each other.",
      image: "/img/success-story/2.jpg",
    },
    {
      id: "neha-aditya",
      names: "Neha & Aditya",
      location: "Chandigarh, Punjab",
      month: "May",
      quote:
        "We were both busy professionals with little time to search. The daily match recommendations made all the difference.",
      image: "/img/success-story/3.jpg",
    },
    {
      id: "kavya-rahul",
      names: "Kavya & Rahul",
      location: "Kochi, Kerala",
      month: "February",
      quote:
        "Even living in different countries, the video call feature let us truly get to know each other before meeting in person.",
      image: "/img/success-story/2.jpg",
    },
  ],
  "2023": [
    {
      id: "simran-vikram",
      names: "Simran & Vikram",
      location: "Delhi NCR",
      month: "December",
      quote:
        "After two failed setups through relatives, we finally found each other here in under a month.",
      image: "/img/success-story/1.jpg",
    },
    {
      id: "pooja-nikhil",
      names: "Pooja & Nikhil",
      location: "Hyderabad, Telangana",
      month: "July",
      quote:
        "The horoscope matching combined with real conversation gave both our families peace of mind.",
      image: "/img/success-story/2.jpg",
    },
  ],
  "2022": [
    {
      id: "shreya-aman",
      names: "Shreya & Aman",
      location: "Lucknow, Uttar Pradesh",
      month: "October",
      quote:
        "We nearly missed each other's profiles. So glad the platform kept suggesting a second look.",
      image: "/img/success-story/3.jpg",
    },
  ],
};

const years = Object.keys(storiesByYear).sort((a, b) => Number(b) - Number(a));

const SuccessStory = () => {
  const [activeYear, setActiveYear] = useState(years[0]);
  const activeStories = storiesByYear[activeYear];

  return (
    <section className="w-full bg-[#FDF8F3] py-0 px-5 sm:px-8 lg:px-8">
      <div className="mx-auto max-w-7xl  bg-white p-8 py-15">
        {/* Heading */}
        <div className="text-center">
          <span className="rounded-full bg-rose-100 px-4 py-1 text-xs font-bold tracking-widest text-black">
            SUCCESS STORIES
          </span>
          <h2 className="mt-3 font-serif text-3xl font-bold text-slate-900 sm:text-4xl">
            A Timeline of{" "}
            <span className="text-rose-600">Happily Ever Afters</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-slate-500">
            Browse the couples who found each other here, one year at a time.
          </p>
        </div>

        {/* Mobile year selector */}
        <div className="mt-10 flex gap-2 overflow-x-auto pb-2 lg:hidden">
          {years.map((year) => {
            const isActive = year === activeYear;
            return (
              <button
                key={year}
                type="button"
                onClick={() => setActiveYear(year)}
                className={`shrink-0 rounded-full px-5 py-2 font-serif text-base font-semibold transition-all ${
                  isActive
                    ? "bg-rose-600 text-white shadow-sm shadow-rose-200"
                    : "bg-rose-50 text-slate-400"
                }`}
              >
                {year}
                <span className="ml-1.5 text-xs font-normal opacity-70">
                  {storiesByYear[year].length}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-col gap-10 lg:mt-14 lg:flex-row lg:gap-14">
          {/* Left: vertical timeline rail */}
          <div className="hidden shrink-0 lg:block lg:w-36">
            <div className="relative">
              <div className="absolute bottom-2 left-1.75 top-2 w-px bg-rose-100" />
              <ul className="relative space-y-1">
                {years.map((year) => {
                  const isActive = year === activeYear;
                  return (
                    <li key={year}>
                      <button
                        type="button"
                        onClick={() => setActiveYear(year)}
                        className="group flex w-full items-center gap-4 py-3 text-left"
                      >
                        <span
                          className={`relative z-10 h-3.5 w-3.5 shrink-0 rounded-full border-2 transition-all ${
                            isActive
                              ? "border-rose-600 bg-rose-600 ring-4 ring-rose-100"
                              : "border-rose-200 bg-white group-hover:border-rose-400"
                          }`}
                        />
                        <span>
                          <span
                            className={`block font-serif text-xl font-semibold leading-none transition-colors ${
                              isActive
                                ? "text-rose-600"
                                : "text-slate-300 group-hover:text-slate-500"
                            }`}
                          >
                            {year}
                          </span>
                          <span
                            className={`mt-1 block text-xs transition-colors ${
                              isActive ? "text-slate-500" : "text-slate-300"
                            }`}
                          >
                            {storiesByYear[year].length}{" "}
                            {storiesByYear[year].length === 1
                              ? "story"
                              : "stories"}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Right: story cards */}
          <div
            key={activeYear}
            className="grid flex-1 animate-[fadeIn_0.35s_ease-out] grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
          >
            {activeStories.map((story) => (
              <div
                key={story.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-rose-100 hover:shadow-[0_20px_45px_-25px_rgba(225,29,72,0.35)]"
              >
                <div className="relative aspect-4/3 w-full overflow-hidden bg-rose-50">
                  <Image
                    src={story.image}
                    alt={`${story.names} wedding photo`}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/0 to-black/0" />
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-rose-600 backdrop-blur-sm">
                    <Heart className="h-3 w-3" fill="currentColor" />
                    {story.month} {activeYear}
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <Quote
                    className="h-5 w-5 text-rose-200"
                    strokeWidth={1.5}
                    fill="currentColor"
                  />
                  <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
                    {story.quote}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                    <p className="font-serif text-base font-semibold text-slate-900">
                      {story.names}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <MapPin className="h-3.5 w-3.5" />
                      {story.location.split(",")[0]}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default SuccessStory;

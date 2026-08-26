"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import Image from "next/image";
import ThemeBtnOne from "@/app/components/ThemeBtnOne";

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

type Slide = {
  id: string;
  image: string;
  eyebrow: string;
  heading: string;
  subheading: string;
  ctaLabel: string;
};

const SLIDES: Slide[] = [
  {
    id: "slide-1",
    image: "/img/home-banner/1.jpg",
    eyebrow: "India's Most Trusted Matrimony Service",
    heading: "Every Love Story Begins With Trust",
    subheading:
      "Join 5 crore+ members who found their perfect life partner with verified profiles and personalised matchmaking.",
    ctaLabel: "Register for Free",
  },
  {
    id: "slide-2",
    image: "/img/home-banner/2.jpg",
    eyebrow: "India's Most Trusted Matrimony Service",
    heading: "Every Love Story Begins With Trust",
    subheading:
      "Join 5 crore+ members who found their perfect life partner with verified profiles and personalised matchmaking.",
    ctaLabel: "Register for Free",
  },
];

const AUTOPLAY_MS = 5500;

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

const HeroBanner = () => {
  const [active, setActive] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((index: number) => {
    setActive((index + SLIDES.length) % SLIDES.length);
  }, []);

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  // Autoplay
  useEffect(() => {
    if (isHovering) return;
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % SLIDES.length);
    }, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovering]);

  return (
    <section
      className="relative w-full overflow-hidden bg-slate-900"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      aria-roledescription="carousel"
      aria-label="Homepage highlights"
    >
      <div className="relative h-[50vh] min-h-100">
        {/* Slides */}
        {SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === active ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            aria-hidden={index !== active}
          >
            {/* Background image */}
            {/* Background image */}
            <Image
              src={slide.image}
              alt=""
              fill
              priority={index === 0}
              sizes="100vw"
              quality={100}
              className="object-cover"
            />
            {/* Scrim: dark on the left for legibility, rose brand gradient on the right where text sits */}
            <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/30 to-transparent" />
            <div className="absolute inset-0 bg-linear-to-l from-rose-700/70 via-rose-600/20 to-transparent" />
            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
          </div>
        ))}

        {/* Text content — centered on mobile, right-aligned from sm up */}
        <div className="relative z-10 mx-auto flex h-full max-w-6xl items-center px-5 sm:px-8 lg:px-8">
          <div className="mx-auto w-full max-w-2xl text-center sm:ml-auto sm:mr-0 sm:text-right">
            {SLIDES.map((slide, index) => (
              <div
                key={slide.id}
                className={`transition-all duration-700 ease-out ${
                  index === active
                    ? "relative opacity-100 translate-y-0"
                    : "pointer-events-none absolute inset-0 opacity-0 translate-y-3"
                }`}
                aria-hidden={index !== active}
              >
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-[12px] font-semibold text-rose-100 backdrop-blur-sm">
                  <Heart
                    className="h-3.5 w-3.5 fill-rose-300 text-rose-300"
                    strokeWidth={0}
                  />
                  {slide.eyebrow}
                </span>

                <h1 className="mt-2 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-[44px] font-serif tracking-wider">
                  {slide.heading}
                </h1>

                <p className="mt-2 mx-auto max-w-md text-[12px] leading-relaxed text-slate-200 sm:ml-auto sm:mr-0">
                  {slide.subheading}
                </p>

                <div className="mt-7 flex flex-col-reverse items-center justify-center gap-3 sm:flex-row sm:items-center sm:justify-end">
                  <ThemeBtnOne
                    text={slide.ctaLabel}
                    url="/register"
                    className="py-4 rounded-full font-serif px-5 bg-rose-500 text-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Arrows */}
        <button
          onClick={prev}
          aria-label="Previous slide"
          className="group absolute left-3 cursor-pointer top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/25 sm:flex"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={next}
          aria-label="Next slide"
          className="group absolute right-3 cursor-pointer top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/25 sm:flex"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 sm:bottom-6">
          {SLIDES.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => goTo(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === active}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === active
                  ? "w-7 bg-rose-500"
                  : "w-1.5 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;

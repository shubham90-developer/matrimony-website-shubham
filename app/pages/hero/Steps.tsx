import React from "react";
import { SlidersHorizontal, Search, HeartHandshake } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import ThemeBtnOne from "@/app/components/ThemeBtnOne";

type Step = {
  number: string;
  icon: LucideIcon;
  title: string;
  description: string;
};

const STEPS: Step[] = [
  {
    number: "01",
    icon: SlidersHorizontal,
    title: "Define Your Preferences",
    description:
      "Tell us who you're looking for — age, values, location, and more.",
  },
  {
    number: "02",
    icon: Search,
    title: "Browse Profiles",
    description: "Explore verified matches picked around what matters to you.",
  },
  {
    number: "03",
    icon: HeartHandshake,
    title: "Send Interest & Connect",
    description: "Start a conversation and take the next step, together.",
  },
];

const Steps = () => {
  return (
    <section className="w-full bg-[#FDF8F3] py-0 px-5 sm:px-8 lg:px-8">
      <div className="mx-auto max-w-7xl  bg-white p-8 py-15">
        {/* Heading */}
        <div className="text-center">
          <p className="text-xs font-bold capitalize tracking-[0.2em] text-black bg-rose-100 inline-block px-4 py-1 rounded-full">
            A Journey In Three Steps
          </p>
          <h2 className="mt-2 font-serif text-4xl text-slate-900 sm:text-[42px] font-bold">
            Find the <span className="text-rose-600">One for You</span>
          </h2>
        </div>

        {/* Thread of steps */}
        <div className="relative mt-16">
          {/* Desktop thread — horizontal dashed line through the badges */}
          <div
            className="absolute top-9 left-9 right-9 hidden sm:block"
            style={{ borderTop: "2px dashed #E4C08A" }}
          />

          <div className="flex flex-col gap-14 sm:flex-row sm:justify-between sm:gap-6">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="relative flex items-start gap-5 sm:flex-col sm:items-center sm:text-center"
                >
                  {/* Mobile thread — vertical dashed line between badges */}
                  {i < STEPS.length - 1 && (
                    <span
                      className="absolute left-9 top-18 z-0 h-24 sm:hidden"
                      style={{ borderLeft: "2px dashed #E4C08A" }}
                    />
                  )}

                  {/* Badge */}
                  <div className="relative z-10 flex h-18 w-18 shrink-0 items-center justify-center rounded-full bg-white ring-1 ring-rose-100 shadow-[0_8px_20px_-6px_rgba(190,24,93,0.18)]">
                    <Icon className="h-7 w-7 text-rose-600" strokeWidth={1.5} />
                    {/* Number charm */}
                    <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-[#FDF8F3]">
                      {step.number}
                    </span>
                  </div>

                  {/* Copy */}
                  <div className="relative z-10 sm:mt-3">
                    <h3 className="font-serif text-lg font-semibold text-slate-900">
                      {step.title}
                    </h3>
                    <p className="mt-1 max-w-47.5 text-sm leading-relaxed text-slate-500 sm:mx-auto">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 flex justify-center">
          <ThemeBtnOne
            text="Get Started"
            url="/register"
            className="py-3 px-4 rounded-full font-serif mt-5 bg-rose-500 text-white"
          />
        </div>
      </div>
    </section>
  );
};

export default Steps;

"use client";

import React from "react";
import { HandCoins, BadgeCheck, Sparkles } from "lucide-react";
import ThemeBtnOne from "@/app/components/ThemeBtnOne";

type ExperienceItem = {
  icon: React.ElementType;
  title: string;
  description: string;
};

const experienceItems: ExperienceItem[] = [
  {
    icon: HandCoins,
    title: "30 Day Money Back Guarantee",
    description:
      "Get matched with someone special within 30 days, or we'll refund your money—guaranteed!",
  },
  {
    icon: BadgeCheck,
    title: "Blue Tick to find your Green Flag",
    description:
      "Did you know our blue-tick profiles get 40% more connection requests than others?",
  },
  {
    icon: Sparkles,
    title: "Matchmaking Powered by AI",
    description:
      'Cutting-edge technology with two decades of matchmaking expertise to help you find "the one".',
  },
];

const ShadiExperience = () => {
  return (
    <section className="w-full bg-[#FDF8F3] py-0 px-5 sm:px-8 lg:px-8">
      <div className="mx-auto max-w-7xl bg-white p-8 py-15">
        <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl font-serif">
          The Tuza Maza Jamla.com &nbsp;
          <span className="text-rose-600">Experience</span>
        </h2>

        {/* Feature cards */}
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {experienceItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 p-6 hover:bg-rose-100"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-50">
                  <Icon className="h-7 w-7 text-rose-600" strokeWidth={2} />
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900 font-serif">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* VIP Tuza Maza Jamla.combanner */}
        <div className="mt-8 flex flex-col items-start gap-6 rounded-2xl bg-purple-50 p-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-8">
            <p className="max-w-md text-lg text-slate-800">
              Experience the world of elite personalised matchmaking by{" "}
              <span className="font-medium">Tuza Maza Jamla.com</span>
            </p>
          </div>

          <ThemeBtnOne
            text="Register Now"
            url="/register"
            className="py-3 px-4 rounded-full font-serif mt-5 bg-rose-500 text-white"
          />
        </div>
      </div>
    </section>
  );
};

export default ShadiExperience;

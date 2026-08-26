"use client";

import React from "react";
import { Check, X } from "lucide-react";
import ThemeBtnOne from "./ThemeBtnOne";

type PlanFeature = {
  label: string;
  included: boolean;
};

const freeFeatures: PlanFeature[] = [
  { label: "Browse Profiles", included: true },
  { label: "Shortlist & Send Interest", included: true },
  { label: "Message & chat with unlimited users", included: true },
  { label: "Get up to 3x more matches daily", included: false },
  { label: "Unlock access to advanced search", included: false },
  { label: "View contact details", included: false },
  { label: "Get 3 free Spotlights", included: false },
];

const paidFeatures: PlanFeature[] = [
  { label: "Browse Profiles", included: true },
  { label: "Shortlist & Send Interest", included: true },
  { label: "Message & chat with unlimited users", included: true },
  { label: "Get up to 3x more matches daily", included: true },
  { label: "Unlock access to advanced search", included: true },
  { label: "View contact details", included: true },
  { label: "Get 3 free Spotlights", included: true },
];

const Plans = () => {
  return (
    <section className="w-full bg-[#FDF8F3] py-0 px-5 sm:px-8 lg:px-8 ">
      <div className="mx-auto max-w-7xl bg-white p-8 py-15 relative">
        {/* split background: cream on top, navy on bottom */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-rose-100" />

        <div className="relative mx-auto max-w-4xl px-6  sm:px-8">
          {/* Heading */}
          <div className="text-center">
            <h2 className="font-serif text-3xl font-bold text-slate-900 sm:text-4xl">
              <span className="text-rose-600">Membership</span> Plans
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-slate-500">
              Upgrade your plan as per your customized requirements. With a paid
              membership, you can seamlessly connect with your prospects and get
              more responses. Here are some key benefits:
            </p>
          </div>

          {/* Cards */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 sm:items-start">
            {/* Free plan */}
            <div className="rounded-2xl bg-white p-7 shadow-[0_10px_30px_-12px_rgba(15,23,42,0.15)] sm:mt-16">
              <span className="mb-3 block h-0.5 w-8 bg-rose-500" />
              <h3 className="text-2xl font-semibold text-slate-900">Free</h3>

              <ul className="mt-6 flex flex-col gap-4">
                {freeFeatures.map((feature) => (
                  <li key={feature.label} className="flex items-center gap-3">
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                        feature.included
                          ? "border-rose-500 text-rose-500"
                          : "border-slate-300 text-slate-300"
                      }`}
                    >
                      {feature.included ? (
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      ) : (
                        <X className="h-3.5 w-3.5" strokeWidth={3} />
                      )}
                    </span>
                    <span
                      className={`text-[15px] ${
                        feature.included ? "text-slate-800" : "text-slate-400"
                      }`}
                    >
                      {feature.label}
                    </span>
                  </li>
                ))}
              </ul>

              <ThemeBtnOne
                url="/register"
                text="Register Free"
                className="py-3 px-4 rounded-full font-serif mt-5 bg-rose-500 text-white cursor-pointer"
              />
            </div>

            {/* Paid plan */}
            <div className="relative rounded-2xl bg-linear-to-b from-rose-500 to-rose-600 p-7 shadow-[0_20px_45px_-15px_rgba(225,29,72,0.55)]">
              <span className="absolute right-7 top-7 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                Popular
              </span>

              <span className="mb-3 block h-0.5 w-8 bg-white" />
              <h3 className="text-2xl font-semibold text-white">Paid</h3>

              <ul className="mt-6 flex flex-col gap-4">
                {paidFeatures.map((feature) => (
                  <li key={feature.label} className="flex items-center gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/70 text-white">
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                    <span className="text-[15px] font-medium text-white">
                      {feature.label}
                    </span>
                  </li>
                ))}
              </ul>

              <ThemeBtnOne
                url="/membership"
                text="  Browse Membership Plans"
                className="mt-5 py-3 px-4 bg-white rounded-full font-serif text-xs cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Plans;

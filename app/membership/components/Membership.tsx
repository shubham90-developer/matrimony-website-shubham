"use client";

import React, { useState } from "react";
import { Check, Crown, Sparkles, Heart, Star } from "lucide-react";

type Plan = {
  id: string;
  name: string;
  tagline: string;
  duration: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  icon: React.ElementType;
  featured?: boolean;
  features: string[];
};

const plans: Plan[] = [
  {
    id: "gold",
    name: "Gold",
    tagline: "For a focused start",
    duration: "3 Months",
    price: 2999,
    originalPrice: 4499,
    icon: Star,
    features: [
      "20 profile views per day",
      "Send unlimited interests",
      "View contact details",
      "Basic search filters",
      "Email support",
    ],
  },
  {
    id: "prime-gold",
    name: "Prime Gold",
    tagline: "For a serious search",
    duration: "3 Months",
    price: 5999,
    originalPrice: 8999,
    icon: Crown,
    features: [
      "Unlimited profile views",
      "Send unlimited interests",
      "View contact details",
      "Advanced search filters",
      "Highlighted profile listing",
      "Priority chat support",
    ],
  },
  {
    id: "till-you-marry",
    name: "Till You Marry",
    tagline: "For the ones who don't want to search twice",
    duration: "Valid until you marry",
    price: 9999,
    originalPrice: 28999,
    discount: "65% OFF",
    icon: Sparkles,
    featured: true,
    features: [
      "Unlimited profile views, forever",
      "Send unlimited interests",
      "View contact details",
      "Advanced search filters",
      "Highlighted + top profile listing",
      "Dedicated relationship manager",
      "Free horoscope matching",
      "No renewal, ever",
    ],
  },
];

const Membership = () => {
  const [selected, setSelected] = useState("till-you-marry");

  return (
    <section className="w-full bg-[#FDF8F3] py-0 px-5 sm:px-8 lg:px-8">
      <div className="mx-auto max-w-7xl  bg-white p-8 py-15">
        {/* Heading */}
        <div className="text-center">
          <span className="rounded-full bg-rose-100 px-4 py-1 text-xs font-bold tracking-widest text-black">
            MEMBERSHIP PLANS
          </span>
          <h2 className="mt-3 font-serif text-3xl font-bold text-slate-900 sm:text-4xl">
            Choose How You Want to{" "}
            <span className="text-rose-600">Find Them</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-slate-500">
            Every plan unlocks genuine, verified profiles. Pick the pace that
            matches your search.
          </p>
        </div>

        {/* Plans */}
        <div className="mt-14 grid grid-cols-1 items-start gap-6 md:grid-cols-3 md:gap-5 lg:gap-6">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isSelected = selected === plan.id;
            const savings =
              plan.originalPrice && plan.originalPrice > plan.price
                ? Math.round(
                    ((plan.originalPrice - plan.price) / plan.originalPrice) *
                      100,
                  )
                : null;

            return (
              <div
                key={plan.id}
                onClick={() => setSelected(plan.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setSelected(plan.id);
                }}
                className={`relative flex cursor-pointer flex-col rounded-3xl border bg-white p-7 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 ${
                  plan.featured
                    ? "border-rose-600 shadow-[0_25px_60px_-25px_rgba(225,29,72,0.45)] md:-translate-y-3"
                    : isSelected
                      ? "border-rose-300 shadow-lg"
                      : "border-slate-200 hover:border-rose-200 hover:shadow-md"
                }`}
              >
                {/* Ribbon */}
                {plan.featured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="flex items-center gap-1.5 rounded-full bg-rose-600 px-4 py-1.5 text-xs font-bold tracking-wide text-white shadow-md shadow-rose-200">
                      <Heart className="h-3 w-3" fill="currentColor" />
                      MOST LOVED CHOICE
                    </span>
                  </div>
                )}

                {plan.discount && (
                  <span className="absolute right-5 top-6 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-600">
                    {plan.discount}
                  </span>
                )}

                {/* Icon + name */}
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-full ${
                    plan.featured
                      ? "bg-rose-600 text-white"
                      : "bg-rose-50 text-rose-600"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-serif text-2xl font-bold text-slate-900">
                  {plan.name}
                </h3>
                <p className="mt-1 text-sm text-slate-500">{plan.tagline}</p>

                {/* Price */}
                <div className="mt-6 flex items-end gap-2">
                  <span className="font-serif text-4xl font-bold text-slate-900">
                    &#8377;{plan.price.toLocaleString("en-IN")}
                  </span>
                  {plan.originalPrice && (
                    <span className="mb-1 text-sm text-slate-400 line-through">
                      &#8377;{plan.originalPrice.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs font-medium text-slate-400">
                  {plan.duration}
                  {savings ? ` · you save ${savings}%` : ""}
                </p>

                {/* CTA */}
                <button
                  type="button"
                  className={`mt-6 cursor-pointer w-full rounded-full py-3 text-sm font-bold font-serif transition ${
                    plan.featured
                      ? "bg-rose-600 text-white hover:bg-rose-700"
                      : "bg-rose-50 text-rose-600 hover:bg-rose-100"
                  }`}
                >
                  {plan.featured
                    ? "Start Till You Marry"
                    : `Choose ${plan.name}`}
                </button>

                {/* Features */}
                <ul className="mt-7 space-y-3 border-t border-slate-100 pt-6">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-sm text-slate-600"
                    >
                      <Check
                        className={`mt-0.5 h-4 w-4 shrink-0 ${
                          plan.featured ? "text-rose-600" : "text-emerald-500"
                        }`}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Reassurance line */}
        <p className="mt-10 text-center text-xs text-slate-400">
          All plans include Blue Tick profile verification. Prices are inclusive
          of taxes. Cancel your renewal any time.
        </p>
      </div>
    </section>
  );
};

export default Membership;

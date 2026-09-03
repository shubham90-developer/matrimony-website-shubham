"use client";

import React, { useState } from "react";
import {
  Check,
  Crown,
  Star,
  Gem,
  Trophy,
  Infinity as InfinityIcon,
  Calendar,
  Phone,
  PhoneCall,
  MessageSquare,
  Eye,
  Heart,
  TrendingUp,
  Sparkles,
  Tag,
  LucideIcon,
} from "lucide-react";

interface Feature {
  icon: LucideIcon;
  text: string;
}

interface Plan {
  id: string;
  tabLabel: string;
  tabSub: string;
  icon: LucideIcon;
  headerTitle: string;
  headerTagline: string;
  price: number;
  originalPrice?: number; // struck-through "before discount" price
  months: number | null; // null = "till you marry" (no fixed term)
  features: Feature[];
  highlight?: boolean; // pulled out as the full-width featured plan
}

const PLANS: Plan[] = [
  {
    id: "1m",
    tabLabel: "1 Month",
    tabSub: "₹99",
    icon: Star,
    headerTitle: "1 Month",
    headerTagline: "Get started and explore your matches",
    price: 99,
    months: 1,
    features: [
      { icon: Calendar, text: "Valid for 1 month" },
      { icon: Phone, text: "View up to 10 phone numbers" },
      { icon: MessageSquare, text: "Send unlimited messages" },
      { icon: Heart, text: "Send 5 interests" },
      { icon: PhoneCall, text: "Make 5 calls" },
      { icon: Eye, text: "View 10 horoscopes" },
    ],
  },
  {
    id: "3m",
    tabLabel: "3 Months",
    tabSub: "₹499",
    icon: Crown,
    headerTitle: "3 Months",
    headerTagline: "Unlock more features & get the best experience",
    price: 499,
    originalPrice: 699,
    months: 3,
    features: [
      { icon: Calendar, text: "Valid for 3 months" },
      { icon: Phone, text: "View up to 50 phone numbers" },
      { icon: MessageSquare, text: "Send unlimited messages" },
      { icon: Eye, text: "Unlimited horoscope views" },
      { icon: Heart, text: "Send unlimited interests" },
      { icon: PhoneCall, text: "Make 15 calls" },
    ],
  },
  {
    id: "6m",
    tabLabel: "6 Months",
    tabSub: "₹1,999",
    icon: Gem,
    headerTitle: "6 Months",
    headerTagline: "More visibility, more matches",
    price: 1999,
    originalPrice: 2999,
    months: 6,
    features: [
      { icon: Calendar, text: "Valid for 6 months" },
      { icon: Phone, text: "View up to 100 phone numbers" },
      { icon: MessageSquare, text: "Send unlimited messages" },
      { icon: Heart, text: "Send unlimited interests" },
      { icon: PhoneCall, text: "Make up to 30 calls" },
      { icon: Eye, text: "Unlimited horoscope views" },
      { icon: TrendingUp, text: "Priority profile visibility" },
    ],
  },
  {
    id: "12m",
    tabLabel: "12 Months",
    tabSub: "₹3,999",
    icon: Trophy,
    headerTitle: "12 Months",
    headerTagline: "Best for long-term matchmaking",
    price: 3999,
    originalPrice: 5999,
    months: 12,
    features: [
      { icon: Calendar, text: "Valid for 12 months" },
      { icon: Phone, text: "View up to 200 phone numbers" },
      { icon: MessageSquare, text: "Send unlimited messages" },
      { icon: Heart, text: "Send unlimited interests" },
      { icon: PhoneCall, text: "Make up to 50 calls" },
      { icon: Eye, text: "Unlimited horoscope views" },
      { icon: TrendingUp, text: "Priority profile visibility" },
      { icon: Sparkles, text: "Best for long-term matchmaking" },
    ],
  },
  {
    id: "tillmarry",
    tabLabel: "Till U Marry",
    tabSub: "₹9,999",
    icon: InfinityIcon,
    headerTitle: "Till You Marry",
    headerTagline: "No renewals — stay covered until the big day",
    price: 9999,
    originalPrice: 14999,
    months: null,
    highlight: true,
    features: [
      { icon: Calendar, text: "Valid until you get married" },
      { icon: Phone, text: "View unlimited phone numbers" },
      { icon: MessageSquare, text: "Send unlimited messages" },
      { icon: Heart, text: "Send unlimited interests" },
      { icon: PhoneCall, text: "Make unlimited calls" },
      { icon: Eye, text: "Unlimited horoscope views" },
      { icon: TrendingUp, text: "Priority profile visibility" },
      { icon: Sparkles, text: "Best plan for serious matchmaking" },
    ],
  },
];

const REGULAR_PLANS = PLANS.filter((p) => !p.highlight);
const TOP_PLAN = PLANS.find((p) => p.highlight)!;

const discountPercent = (plan: Plan) =>
  plan.originalPrice
    ? Math.round(((plan.originalPrice - plan.price) / plan.originalPrice) * 100)
    : null;

const Membership = () => {
  const [activeId, setActiveId] = useState(REGULAR_PLANS[0].id);
  const activePlan = PLANS.find((p) => p.id === activeId) ?? PLANS[0];
  const ActiveIcon = activePlan.icon;
  const perMonth =
    activePlan.months && activePlan.months > 1
      ? Math.round(activePlan.price / activePlan.months)
      : null;
  const savePct = discountPercent(activePlan);

  return (
    <section className="w-full bg-[#FDF8F3] px-5 py-10">
      <div className="mx-auto max-w-xl">
        {/* Regular plan tabs */}
        <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {REGULAR_PLANS.map((plan) => {
            const Icon = plan.icon;
            const isActive = activeId === plan.id;
            return (
              <button
                key={plan.id}
                type="button"
                onClick={() => setActiveId(plan.id)}
                className={`flex shrink-0 cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-all ${
                  isActive
                    ? "border-transparent bg-linear-to-r from-rose-500 to-rose-500 text-white shadow-md shadow-amber-200"
                    : "border-slate-200 bg-white text-slate-600"
                }`}
              >
                <Icon
                  className={`h-3.5 w-3.5 ${isActive ? "text-white" : "text-slate-400"}`}
                  fill={isActive ? "currentColor" : "none"}
                />
                <span className="flex flex-col items-start leading-none">
                  <span>{plan.tabLabel}</span>
                  <span
                    className={`mt-0.5 text-[10px] font-normal ${isActive ? "text-white/80" : "text-slate-400"}`}
                  >
                    {plan.tabSub}
                  </span>
                </span>
                {isActive && (
                  <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-white/25">
                    <Check className="h-2.5 w-2.5 text-white" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Top plan — full width, own row, stands out from the scroll */}
        <button
          type="button"
          onClick={() => setActiveId(TOP_PLAN.id)}
          className={`mt-2 flex w-full cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all ${
            activeId === TOP_PLAN.id
              ? "border-transparent bg-linear-to-r from-[#2b1a0e] via-[#1a1108] to-black shadow-md shadow-amber-900/30"
              : "border-amber-200 bg-linear-to-r from-amber-50 to-white"
          }`}
        >
          <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-rose-300 via-amber-500 to-rose-600">
            <TOP_PLAN.icon
              className="h-4.5 w-4.5 text-white"
              fill="currentColor"
            />
          </span>
          <span className="flex-1">
            <span
              className={`block text-sm font-bold ${activeId === TOP_PLAN.id ? "text-white" : "text-slate-900"}`}
            >
              {TOP_PLAN.tabLabel}
            </span>
            <span
              className={`block text-[11px] ${activeId === TOP_PLAN.id ? "text-white/60" : "text-slate-400"}`}
            >
              Best value · one-time payment
            </span>
          </span>
          <span className="flex flex-col items-end">
            <span
              className={`text-sm font-bold ${activeId === TOP_PLAN.id ? "text-white" : "text-slate-900"}`}
            >
              {TOP_PLAN.tabSub}
            </span>
            {TOP_PLAN.originalPrice && (
              <span
                className={`text-[10px] line-through ${activeId === TOP_PLAN.id ? "text-white/40" : "text-slate-400"}`}
              >
                ₹{TOP_PLAN.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </span>
        </button>

        {/* Detail card */}
        <div className="mt-5 overflow-hidden rounded-4xl bg-white shadow-[0_25px_60px_-25px_rgba(0,0,0,0.25)]">
          {/* Header */}
          <div className="relative overflow-hidden bg-linear-to-br from-[#2b1a0e] via-[#1a1108] to-black px-7 pb-14 pt-7">
            {/* Diagonal gold streaks */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -right-6 -top-10 h-56 w-40 rotate-20 bg-linear-to-b from-amber-400/25 via-amber-500/10 to-transparent" />
              <div className="absolute right-6 -top-10 h-56 w-24 rotate-20 bg-linear-to-b from-amber-300/15 via-transparent to-transparent" />
              <div className="absolute -right-16 top-4 h-56 w-16 rotate-20 bg-linear-to-b from-amber-500/20 via-transparent to-transparent" />
            </div>

            <div className="relative flex items-center gap-4">
              {/* Coin badge */}
              <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-linear-to-br from-rose-300 via-amber-500 to-rose-600 shadow-lg shadow-amber-900/50" />
                <div className="absolute inset-0.75 rounded-full border-2 border-amber-200/40" />
                <ActiveIcon
                  className="relative h-7 w-7 text-white"
                  fill="currentColor"
                />
                <Sparkles
                  className="absolute -right-1 -top-1 h-4 w-4 text-amber-200"
                  fill="currentColor"
                />
              </div>

              <div>
                <h3 className="font-serif text-2xl font-bold text-white">
                  {activePlan.headerTitle}
                </h3>
                <p className="mt-0.5 text-xs text-white/60">
                  {activePlan.headerTagline}
                </p>
              </div>
            </div>
          </div>

          {/* Price panel */}
          <div className="mt-0 rounded-[28px] rounded-t-none bg-[#FDF3E2] px-6 pb-5 pt-5">
            <div className="flex items-end gap-2">
              <span className="font-serif text-4xl font-bold text-slate-900">
                ₹{activePlan.price.toLocaleString("en-IN")}
              </span>
              {activePlan.originalPrice && (
                <span className="mb-1 text-base text-slate-400 line-through">
                  ₹{activePlan.originalPrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>

            {savePct !== null && (
              <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                <Tag className="h-3 w-3" />
                Save ₹
                {(activePlan.originalPrice! - activePlan.price).toLocaleString(
                  "en-IN",
                )}{" "}
                ({savePct}%)
              </span>
            )}

            {perMonth && (
              <p className="mt-2 text-sm text-slate-500">
                ₹{perMonth.toLocaleString("en-IN")} per month
              </p>
            )}
          </div>

          {/* Features */}
          <ul className="px-7 pt-2">
            {activePlan.features.map((f) => {
              const Icon = f.icon;
              return (
                <li
                  key={f.text}
                  className="flex items-center gap-3 border-b border-slate-100 py-3.5 last:border-b-0"
                >
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-rose-500">
                    <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                  </span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm text-slate-700">{f.text}</span>
                </li>
              );
            })}
          </ul>

          {/* CTA */}
          <div className="px-7 pb-7 pt-5">
            <button
              type="button"
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-linear-to-r from-rose-500 to-rose-500 py-3.5 text-sm font-bold font-serif text-white shadow-md shadow-amber-200 transition hover:opacity-90"
            >
              <ActiveIcon className="h-4 w-4" fill="currentColor" />
              Choose {activePlan.headerTitle}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Membership;

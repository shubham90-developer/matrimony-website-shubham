"use client";

import React, { useState } from "react";
import {
  Check,
  Crown,
  Star,
  Gem,
  Calendar,
  Phone,
  MessageSquare,
  Eye,
  Tag,
  Sparkles,
} from "lucide-react";

const TABS = [
  { id: "gold", label: "Gold", sub: "4 month", icon: Crown },
  { id: "prime", label: "Prime Gold", sub: "3 month", icon: Star },
  { id: "tillumarry", label: "Till U Marry", sub: "999 month", icon: Gem },
];

const FEATURES = [
  { icon: Calendar, text: "Valid for 3 months" },
  { icon: Phone, text: "View 50 phone numbers" },
  { icon: MessageSquare, text: "Send unlimited messages" },
  { icon: Eye, text: "Unlimited horoscope views" },
];

const Membership = () => {
  const [activeTab, setActiveTab] = useState("gold");

  return (
    <section className="w-full bg-[#FDF8F3] py-10 px-5">
      <div className="mx-auto max-w-sm">
        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-xs cursor-pointer font-semibold transition-all ${
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
                  <span>{tab.label}</span>
                  <span
                    className={`mt-0.5 text-[10px] font-normal ${isActive ? "text-white/80" : "text-slate-400"}`}
                  >
                    {tab.sub}
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
                <Crown
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
                  Gold
                </h3>
                <p className="mt-0.5 text-xs text-white/60">
                  Unlock more features &amp; get the best experience
                </p>
              </div>
            </div>
          </div>

          {/* Price panel */}
          <div className="mt-0 rounded-[28px] rounded-t-none bg-[#FDF3E2] px-6 pb-5 pt-5">
            <div className="flex items-end gap-2">
              <span className="font-serif text-4xl font-bold text-slate-900">
                ₹5500
              </span>
              <span className="mb-1 text-base text-slate-400 line-through">
                ₹7500
              </span>
            </div>
            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
              <Tag className="h-3 w-3" />
              Save ₹2000 (27%)
            </span>
            <p className="mt-2 text-sm text-slate-500">₹1375 per month</p>
          </div>

          {/* Features */}
          <ul className="px-7 pt-2">
            {FEATURES.map((f) => {
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
              disabled
              className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full bg-linear-to-r from-rose-500 to-rose-500 py-3.5 text-sm font-bold font-serif text-white shadow-md shadow-amber-200"
            >
              <Crown className="h-4 w-4" fill="currentColor" />
              Subscribed
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/25">
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Membership;

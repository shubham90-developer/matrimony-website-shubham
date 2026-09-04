"use client";

import React from "react";
import Link from "next/link";
import {
  Inbox,
  CheckCircle2,
  Send,
  ChevronRight,
  Heart,
  User,
  Sparkles,
} from "lucide-react";

interface InterestsPanelProps {
  receivedCount?: number;
  acceptedCount?: number;
  sentCount?: number;
  viewAllHref?: string;
  hasReceivedInterests?: boolean;
}

function FilterPill({
  icon: Icon,
  label,
  count,
  activeColor,
  href,
}: {
  icon: React.ElementType;
  label: string;
  count: number;
  activeColor: "rose" | "green" | "blue";
  href: string;
}) {
  const colorMap = {
    rose: {
      border: "border-rose-400",
      bg: "bg-rose-50",
      iconBg: "bg-rose-500",
    },
    green: {
      border: "border-green-400",
      bg: "bg-green-50",
      iconBg: "bg-green-500",
    },
    blue: {
      border: "border-blue-400",
      bg: "bg-blue-50",
      iconBg: "bg-blue-500",
    },
  }[activeColor];

  return (
    <Link
      href={href}
      className={`group flex items-center gap-1.5 sm:gap-2.5 rounded-full border px-2.5 py-2 sm:px-4 sm:py-2.5 transition-all duration-200 ${colorMap.border} ${colorMap.bg} hover:-translate-y-0.5 hover:shadow-md min-w-0`}
    >
      <span
        className={`flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-full ${colorMap.iconBg}`}
      >
        <Icon size={12} className="text-white sm:hidden" />
        <Icon size={14} className="hidden text-white sm:block" />
      </span>

      <span className="truncate text-xs font-semibold text-slate-800 sm:text-sm">
        {label}
      </span>

      <span className="ml-auto flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-slate-800 px-1.5 text-[10px] font-bold text-white sm:text-xs">
        {count}
      </span>

      <ChevronRight
        size={14}
        className="hidden shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 sm:block"
      />
    </Link>
  );
}

function EmptyIllustration() {
  return (
    <div className="relative mx-auto flex h-32 w-full max-w-44 items-center justify-center sm:h-40 sm:max-w-55">
      <div className="absolute inset-0 rounded-full bg-linear-to-br from-rose-100 via-pink-50 to-transparent blur-sm" />

      <Sparkles className="absolute left-2 top-3 h-3 w-3 text-rose-200 sm:top-4 sm:h-4 sm:w-4" />
      <Sparkles className="absolute right-2 top-6 h-2.5 w-2.5 text-rose-200 sm:right-3 sm:top-8 sm:h-3 sm:w-3" />

      <div className="absolute -bottom-1 left-2 h-12 w-8 -rotate-12 rounded-t-full bg-linear-to-t from-rose-100 to-rose-50 sm:left-4 sm:h-16 sm:w-10" />
      <div className="absolute -bottom-1 right-2 h-12 w-8 rotate-12 rounded-t-full bg-linear-to-t from-rose-100 to-rose-50 sm:right-4 sm:h-16 sm:w-10" />

      <div className="relative z-10 flex h-24 w-18 flex-col items-center gap-1.5 rounded-2xl bg-white p-2 shadow-md sm:h-32 sm:w-24 sm:gap-2 sm:p-3">
        <div className="flex h-9 w-full items-center justify-center rounded-lg bg-rose-50 sm:h-12">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-400 sm:h-6 sm:w-6">
            <User size={11} className="text-white sm:hidden" />
            <User size={14} className="hidden text-white sm:block" />
          </span>
        </div>

        <div className="h-1.5 w-full rounded-full bg-slate-100" />
        <div className="h-1.5 w-3/4 self-start rounded-full bg-slate-100" />

        <div className="mt-auto flex w-full items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-200" />
          <span className="h-1.5 w-1.5 rounded-full bg-rose-200" />
        </div>
      </div>

      <div className="absolute bottom-1 right-4 z-20 flex h-8 w-8 items-center justify-center rounded-2xl bg-white shadow-md sm:bottom-2 sm:right-6 sm:h-10 sm:w-10">
        <Heart size={15} className="fill-rose-500 text-rose-500 sm:hidden" />
        <Heart
          size={18}
          className="hidden fill-rose-500 text-rose-500 sm:block"
        />
      </div>
    </div>
  );
}

const InterestsPanel = ({
  receivedCount = 0,
  acceptedCount = 0,
  sentCount = 0,
  viewAllHref = "/my-matches/interests",
  hasReceivedInterests = false,
}: InterestsPanelProps) => {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
          Interests
        </h2>
      </div>

      {/* Interest Routes */}
      <div className="mt-4 grid grid-cols-3 gap-1.5 sm:flex sm:gap-3">
        <FilterPill
          icon={Inbox}
          label="Received"
          count={receivedCount}
          activeColor="rose"
          href="/my-matches/interests/received"
        />

        <FilterPill
          icon={CheckCircle2}
          label="Accepted"
          count={acceptedCount}
          activeColor="green"
          href="/my-matches/interests/accepted"
        />

        <FilterPill
          icon={Send}
          label="Sent"
          count={sentCount}
          activeColor="blue"
          href="/my-matches/interests/sent"
        />
      </div>

      {/* Content Card */}
      <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:rounded-3xl sm:p-8">
        {!hasReceivedInterests ? (
          <div className="flex flex-col items-center text-center">
            <EmptyIllustration />

            <h3 className="mt-4 text-base font-bold text-slate-900 sm:text-lg">
              Receive interest with Spotlight!
            </h3>

            <p className="mt-2 max-w-xs text-xs leading-relaxed text-slate-500 sm:text-sm">
              Remain on top of the list and increase your chances of receiving
              more interests
            </p>
          </div>
        ) : (
          <div className="text-sm text-slate-500">
            Interests list goes here...
          </div>
        )}
      </div>
    </div>
  );
};

export default InterestsPanel;

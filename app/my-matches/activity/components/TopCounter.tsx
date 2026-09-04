"use client";

import React from "react";
import Link from "next/link";
import { Eye, Star, Ban, ChevronRight } from "lucide-react";

interface StatCardData {
  title: string;
  count: number;
  icon: React.ElementType;
  gradient: string;
  href: string;
}

const cards: StatCardData[] = [
  {
    title: "Viewed You",
    count: 13,
    icon: Eye,
    gradient: "from-indigo-400 via-violet-500 to-purple-500",
    href: "/my-matches/viewed-you",
  },
  {
    title: "Shortlisted",
    count: 1,
    icon: Star,
    gradient: "from-pink-500 via-rose-500 to-pink-600",
    href: "/my-profile/shortlist",
  },
  {
    title: "Blocked Profiles",
    count: 4,
    icon: Ban,
    gradient: "from-slate-500 via-slate-600 to-slate-700",
    href: "/my-profile/block",
  },
];

function StatCard({ title, count, icon: Icon, gradient, href }: StatCardData) {
  return (
    <Link
      href={href}
      className={`group relative flex flex-col overflow-hidden rounded-xl xs:rounded-2xl sm:rounded-3xl bg-linear-to-br ${gradient} p-2.5 xs:p-3 sm:p-4 md:p-5 shadow-lg transition-transform duration-300 hover:-translate-y-1 active:scale-[0.98]`}
    >
      {/* decorative faint icon in the background, like the reference */}
      <Icon
        className="pointer-events-none absolute -bottom-2 -right-2 h-12 w-12 xs:-bottom-3 xs:-right-3 xs:h-16 xs:w-16 sm:-bottom-4 sm:-right-4 sm:h-24 sm:w-24 md:h-28 md:w-28 text-white/10"
        strokeWidth={1.5}
      />

      <div className="relative flex items-start justify-between">
        <div className="flex h-7 w-7 xs:h-8 xs:w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-white/25 backdrop-blur-sm">
          <Icon
            className="h-3.5 w-3.5 xs:h-4 xs:w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white"
            strokeWidth={2}
          />
        </div>

        <span className="flex h-4.5 w-4.5 xs:h-5 xs:w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 items-center justify-center rounded-full bg-white/20 text-white transition-transform duration-300 group-hover:translate-x-0.5">
          <ChevronRight size={10} className="sm:hidden" />
          <ChevronRight size={12} className="hidden xs:block sm:hidden" />
          <ChevronRight size={16} className="hidden sm:block" />
        </span>
      </div>

      <div className="relative mt-1.5 xs:mt-2 sm:mt-3 md:mt-4">
        <p className="text-base xs:text-lg sm:text-2xl md:text-3xl font-bold text-white">
          {count}
        </p>
        <p className="mt-0.5 text-[10px] xs:text-[11px] sm:text-xs md:text-sm font-medium text-white/90 leading-tight line-clamp-2">
          {title}
        </p>
      </div>
    </Link>
  );
}

const TopStats = () => {
  return (
    <div className="grid grid-cols-3 gap-1.5 xs:gap-2 sm:gap-3 md:gap-4">
      {cards.map((card) => (
        <StatCard key={card.title} {...card} />
      ))}
    </div>
  );
};

export default TopStats;

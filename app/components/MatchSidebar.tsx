"use client";

import { ChevronRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGetMyProfileQuery } from "@/Redux/profileApi";

const FALLBACK_IMAGE = "/img/profile/1.jpg";

const SIDEBAR = [
  { label: "Matches", url: "/my-matches/matches" },
  { label: "Activity", url: "/my-matches/activity" },
  { label: "Search", url: "/my-matches/search" },
  { label: "Messenger", url: "/my-matches/messenger", dot: true },
  { label: "Upgrade", url: "/membership", badge: "60% Off" },
];

export default function MatchSidebar() {
  const pathname = usePathname();
  const { data } = useGetMyProfileQuery();

  const profile = data?.data;
  const firstName = profile?.basicDetails?.firstName || "there";
  const matrimonyId = profile?.matrimonyId || "";
  const avatar = profile?.photos?.[0] || FALLBACK_IMAGE;

  return (
    <aside className="hidden h-fit w-full max-w-sm overflow-hidden rounded-3xl border border-rose-100 bg-white shadow-[0_10px_40px_rgba(244,63,94,0.08)] md:block">
      {/* Profile Header */}
      <div className="relative overflow-hidden bg-linear-to-br from-rose-50 via-pink-50 to-orange-50 px-5 pb-6 pt-6">
        {/* Decorative circles */}
        <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-rose-200/30 blur-2xl" />
        <div className="absolute -bottom-10 -left-10 h-24 w-24 rounded-full bg-orange-200/30 blur-2xl" />

        <div className="relative flex items-center gap-4">
          {/* Avatar */}
          <div className="rounded-full bg-linear-to-tr from-rose-500 via-pink-500 to-orange-400 p-0.75 shadow-lg shadow-rose-200">
            <div className="rounded-full bg-white p-0.5">
              <Image
                src={avatar}
                alt={firstName}
                width={64}
                height={64}
                className="h-16 w-16 rounded-full object-cover"
              />
            </div>
          </div>

          {/* User Info */}
          <div className="min-w-0 flex-1">
            <p className="mb-0.5 text-xs font-semibold uppercase tracking-wider text-rose-500">
              Welcome back
            </p>

            <h2 className="truncate font-serif text-xl font-bold text-slate-900">
              Hi {firstName}! 👋
            </h2>

            {matrimonyId && (
              <p className="mt-1 text-xs font-medium text-slate-500">
                ID: {matrimonyId}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-3">
        {SIDEBAR.map((item) => {
          const isActive = pathname === item.url;

          return (
            <Link
              key={item.label}
              href={item.url}
              className={`group mb-1.5 flex w-full items-center justify-between rounded-xl px-4 py-3 transition-all duration-200 ${
                isActive
                  ? "bg-linear-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-200"
                  : "text-slate-600 hover:bg-rose-50 hover:text-rose-600"
              }`}
            >
              <span className="flex items-center gap-2.5 font-semibold">
                {item.label}

                {/* Messenger notification */}
                {item.dot && (
                  <span
                    className={`relative flex h-2.5 w-2.5 ${
                      isActive ? "bg-white" : "bg-rose-500"
                    } rounded-full`}
                  >
                    {!isActive && (
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-60" />
                    )}
                  </span>
                )}

                {/* Upgrade badge */}
                {item.badge && (
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-linear-to-r from-emerald-500 to-green-500 text-white shadow-sm"
                    }`}
                  >
                    <Sparkles size={10} />
                    {item.badge}
                  </span>
                )}
              </span>

              <ChevronRight
                size={17}
                strokeWidth={2}
                className={`transition-transform duration-200 ${
                  isActive
                    ? "translate-x-0 text-white"
                    : "text-slate-400 group-hover:translate-x-1 group-hover:text-rose-500"
                }`}
              />
            </Link>
          );
        })}
      </nav>

      {/* Upgrade CTA */}
      <div className="mx-4 mb-4 overflow-hidden rounded-2xl bg-linear-to-br from-rose-500 via-pink-500 to-orange-400 p-4 text-white shadow-lg shadow-rose-200">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-white/80">
              Find your perfect match
            </p>

            <h3 className="mt-1 text-sm font-bold">Upgrade your membership</h3>
          </div>

          <Sparkles size={20} className="text-yellow-200" />
        </div>

        <Link
          href="/membership"
          className="mt-3 inline-flex items-center gap-1 rounded-lg bg-white px-3 py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-50"
        >
          Upgrade Now
          <ChevronRight size={14} />
        </Link>
      </div>
    </aside>
  );
}

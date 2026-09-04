"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Activity, MessageCircle, Crown } from "lucide-react";

const MENU = [
  {
    label: "Home",
    url: "/my-matches/matches",
    icon: Home,
  },
  {
    label: "Activity",
    url: "/my-matches/activity",
    icon: Activity,
  },
  {
    label: "Chat",
    url: "/my-matches/messenger",
    icon: MessageCircle,
  },
  {
    label: "Packages",
    url: "/membership",
    icon: Crown,
  },
];

const MobileNavbar = () => {
  const pathname = usePathname();

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(10px,env(safe-area-inset-bottom))] md:hidden">
      <nav className="mx-auto flex max-w-md items-center justify-around rounded-2xl border border-rose-100 bg-white px-2 py-2 shadow-[0_-5px_30px_rgba(244,63,94,0.15)]">
        {MENU.map((item) => {
          const Icon = item.icon;

          const isActive =
            item.url === "/" ? pathname === "/" : pathname.startsWith(item.url);

          return (
            <Link
              key={item.label}
              href={item.url}
              className={`relative flex min-w-17 flex-col items-center justify-center rounded-xl px-3 py-2 transition-all duration-200 ${
                isActive
                  ? "text-rose-600"
                  : "text-slate-400 hover:text-rose-500"
              }`}
            >
              {/* Active background */}
              {isActive && (
                <span className="absolute inset-0 rounded-xl bg-linear-to-br from-rose-50 to-pink-50" />
              )}

              {/* Icon */}
              <span
                className={`relative flex h-9 w-9 items-center justify-center rounded-xl transition-all ${
                  isActive
                    ? "bg-linear-to-br from-rose-500 to-pink-500 text-white shadow-md shadow-rose-200"
                    : ""
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />

                {/* Chat notification */}
                {item.label === "Chat" && (
                  <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-rose-500" />
                )}
              </span>

              {/* Label */}
              <span
                className={`relative mt-1 text-[10px] font-bold ${
                  isActive ? "text-rose-600" : "text-black"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default MobileNavbar;

"use client";

import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SIDEBAR = [
  { label: "Matches", url: "/my-matches/matches" },
  { label: "Activity", url: "/my-matches/activity" },
  { label: "Search", url: "/my-matches/search" },
  { label: "Messenger", url: "/my-matches/messenger", dot: true },
  { label: "Upgrade", url: "/membership", badge: "60% Off" },
];

export default function MatchSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-fit rounded-2xl border border-stone-200 bg-white p-5 md:block">
      <div className="flex items-center gap-3">
        <Image
          src="/img/profile/1.jpg"
          alt="Suraj"
          width={56}
          height={56}
          className="h-14 w-14 rounded-full object-cover"
        />

        <div>
          <h2 className="font-serif font-bold text-slate-900">Hi Suraj!</h2>
          <p className="text-sm text-black">UXZZ5861</p>
        </div>
      </div>

      <nav className="mt-4 border-t border-stone-100 pt-2">
        {SIDEBAR.map((item) => (
          <Link
            key={item.label}
            href={item.url}
            className={`flex w-full items-center justify-between border-b border-dashed border-gray-200 px-3 py-3 transition ${
              pathname === item.url
                ? "bg-rose-50 text-rose-600"
                : "text-stone-500 hover:bg-rose-50"
            }`}
          >
            <span className="flex items-center gap-2 font-semibold">
              {item.label}

              {item.dot && (
                <span className="h-2 w-2 rounded-full bg-rose-500" />
              )}

              {item.badge && (
                <span className="rounded bg-emerald-500 px-1.5 py-0.5 text-[10px] text-white">
                  {item.badge}
                </span>
              )}
            </span>

            <ChevronRight size={16} />
          </Link>
        ))}
      </nav>
    </aside>
  );
}

"use client";

import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGetMyProfileQuery } from "@/Redux/profileApi";

const FALLBACK_IMAGE = "/img/profile/1.jpg";

const SIDEBAR = [
  { label: "My Profile", url: "/my-profile" },
  { label: "Add Profile", url: "/my-profile/add-profile" },
  { label: "About Me", url: "/my-profile/about-me" },
  { label: "Basic Details", url: "/my-profile/basic-details" },
  { label: "Education", url: "/my-profile/education" },
  { label: "Career", url: "/my-profile/career" },
  { label: "Family", url: "/my-profile/family" },
  { label: "Contact", url: "/my-profile/contact" },
  { label: "Kundali & Astro", url: "/my-profile/kundali" },
  { label: "Interests", url: "/my-profile/interest" },
  { label: "Verify Profile", url: "/my-profile/verify" },
];

// Cycled per item for a colorful arrow-badge accent
const ACCENTS = [
  {
    bg: "bg-rose-50",
    text: "text-rose-500",
    active: "from-rose-500 to-pink-500",
  },
  {
    bg: "bg-amber-50",
    text: "text-amber-500",
    active: "from-amber-500 to-orange-500",
  },
  {
    bg: "bg-violet-50",
    text: "text-violet-500",
    active: "from-violet-500 to-purple-500",
  },
  {
    bg: "bg-emerald-50",
    text: "text-emerald-500",
    active: "from-emerald-500 to-teal-500",
  },
  { bg: "bg-sky-50", text: "text-sky-500", active: "from-sky-500 to-blue-500" },
];

export default function MyProfileSidebar() {
  const pathname = usePathname();
  const { data, isLoading } = useGetMyProfileQuery();
  const profile = data?.data;

  const firstName = profile?.basicDetails?.firstName;
  const greeting = firstName ? `Hi ${firstName}!` : "Hi there!";
  const matrimonyId = profile?.matrimonyId ?? "";
  const photoSrc =
    profile?.photos && profile.photos.length > 0
      ? profile.photos[0]
      : FALLBACK_IMAGE;

  return (
    <aside className="h-fit rounded-2xl border border-stone-200 bg-white p-3.5 xs:p-4 md:p-5">
      {/* Profile summary */}
      <div className="flex items-center gap-3 rounded-2xl bg-linear-to-br from-rose-50 via-orange-50 to-amber-50 p-3">
        <div className="relative shrink-0 rounded-full bg-linear-to-br from-rose-400 via-pink-400 to-amber-400 p-[2.5px]">
          <Image
            src={photoSrc}
            alt={firstName ?? "Profile"}
            width={56}
            height={56}
            className="h-11 w-11 rounded-full border-2 border-white object-cover xs:h-12 xs:w-12 md:h-14 md:w-14"
          />
        </div>

        <div className="min-w-0">
          {isLoading ? (
            <>
              <div className="h-3.5 w-24 animate-pulse rounded bg-white/60 xs:h-4" />
              <div className="mt-2 h-3 w-16 animate-pulse rounded bg-white/60" />
            </>
          ) : (
            <>
              <h2 className="truncate font-serif text-sm font-bold text-slate-900 xs:text-base">
                {greeting}
              </h2>
              <p className="truncate text-xs font-medium text-rose-500 xs:text-sm">
                Member ID:- {matrimonyId}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Nav: horizontal scroll on mobile/tablet, vertical stack on desktop */}
      <nav
        className="
          mt-3.5 flex gap-2 overflow-x-auto pt-3
          [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden
          xs:mt-4 xs:pt-3.5
          md:mt-4 md:flex-col md:gap-1.5 md:overflow-visible md:pt-2
        "
      >
        {SIDEBAR.map((item, index) => {
          const isActive = pathname === item.url;
          const accent = ACCENTS[index % ACCENTS.length];
          return (
            <Link
              key={item.label}
              href={item.url}
              className={`flex shrink-0 items-center justify-between gap-2.5 whitespace-nowrap rounded-full px-3.5 py-2 text-xs font-semibold transition-all xs:text-sm
                md:w-full md:shrink md:rounded-xl md:px-3 md:py-2.5 md:text-sm
                ${
                  isActive
                    ? `bg-linear-to-r ${accent.active} text-white shadow-md shadow-rose-100`
                    : `${accent.bg} ${accent.text} hover:brightness-95 md:bg-stone-50 md:text-slate-600`
                }`}
            >
              <span>{item.label}</span>
              <span
                className={`hidden h-6 w-6 items-center justify-center rounded-full md:flex ${
                  isActive
                    ? "bg-white/25 text-white"
                    : `${accent.bg} ${accent.text}`
                }`}
              >
                <ChevronRight size={14} />
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

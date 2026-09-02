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
      <div className="flex items-center gap-2.5 xs:gap-3">
        <Image
          src={photoSrc}
          alt={firstName ?? "Profile"}
          width={56}
          height={56}
          className="h-11 w-11 shrink-0 rounded-full object-cover xs:h-12 xs:w-12 md:h-14 md:w-14"
        />

        <div className="min-w-0">
          {isLoading ? (
            <>
              <div className="h-3.5 w-24 animate-pulse rounded bg-stone-100 xs:h-4" />
              <div className="mt-2 h-3 w-16 animate-pulse rounded bg-stone-100" />
            </>
          ) : (
            <>
              <h2 className="truncate font-serif text-sm font-bold text-slate-900 xs:text-base">
                {greeting}
              </h2>
              <p className="truncate text-xs text-black xs:text-sm">
                {matrimonyId}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Nav: horizontal scroll on mobile/tablet, vertical stack on desktop */}
      <nav
        className="
          mt-3.5 flex gap-2 overflow-x-auto border-t border-stone-100 pt-3
          [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
          xs:mt-4 xs:pt-3.5
          md:mt-4 md:flex-col md:gap-0 md:overflow-visible md:pt-2
        "
      >
        {SIDEBAR.map((item) => {
          const isActive = pathname === item.url;
          return (
            <Link
              key={item.label}
              href={item.url}
              className={`flex shrink-0 items-center justify-between gap-2 whitespace-nowrap rounded-full px-3.5 py-2 text-xs font-semibold transition xs:text-sm
                md:w-full md:shrink md:rounded-none md:border-b md:border-dashed md:border-gray-200 md:px-3 md:py-3 md:text-sm
                ${
                  isActive
                    ? "bg-rose-50 text-rose-600"
                    : "bg-stone-50 text-stone-500 hover:bg-rose-50 md:bg-transparent"
                }`}
            >
              <span>{item.label}</span>
              <ChevronRight size={16} className="hidden md:block" />
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

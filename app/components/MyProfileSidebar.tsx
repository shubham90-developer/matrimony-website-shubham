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
    <aside className="hidden h-fit rounded-2xl border border-stone-200 bg-white p-5 md:block">
      <div className="flex items-center gap-3">
        <Image
          src={photoSrc}
          alt={firstName ?? "Profile"}
          width={56}
          height={56}
          className="h-14 w-14 rounded-full object-cover"
        />

        <div>
          {isLoading ? (
            <>
              <div className="h-4 w-24 animate-pulse rounded bg-stone-100" />
              <div className="mt-2 h-3 w-16 animate-pulse rounded bg-stone-100" />
            </>
          ) : (
            <>
              <h2 className="font-serif font-bold text-slate-900">
                {greeting}
              </h2>
              <p className="text-sm text-black">{matrimonyId}</p>
            </>
          )}
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
            </span>

            <ChevronRight size={16} />
          </Link>
        ))}
      </nav>
    </aside>
  );
}

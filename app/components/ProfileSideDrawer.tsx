"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  X,
  SquarePen,
  Heart,
  Sparkles,
  ShieldCheck,
  Headphones,
  ChevronRight,
  Gem,
  Logs,
  Star,
  LocateFixed,
  CalendarDays,
  BadgeCheck,
  UserRound,
} from "lucide-react";
import ThemeBtnOne from "./ThemeBtnOne";

const MENU = [
  {
    icon: SquarePen,
    label: "Edit Profile",
    subtitle: "Keep your profile updated",
    href: "/my-profile",
    bg: "bg-gradient-to-br from-purple-50 to-violet-50",
    iconBg: "bg-gradient-to-br from-violet-500 to-purple-600",
    arrow: "bg-violet-100 text-violet-600",
  },
  {
    icon: Heart,
    label: "Partner Preferences",
    subtitle: "Find your perfect match",
    href: "/my-profile/partner-preferences",
    bg: "bg-gradient-to-br from-pink-50 to-rose-50",
    iconBg: "bg-gradient-to-br from-pink-500 to-rose-500",
    arrow: "bg-pink-100 text-pink-600",
  },
  {
    icon: Sparkles,
    label: "Astrology Services",
    subtitle: "Get expert astrology guidance",
    href: "/download-apk",
    badge: "NEW",
    bg: "bg-gradient-to-br from-violet-50 to-indigo-50",
    iconBg: "bg-gradient-to-br from-violet-500 to-purple-600",
    arrow: "bg-violet-100 text-violet-600",
  },
  {
    icon: Star,
    label: "Shortlist Profiles",
    subtitle: "Your shortlisted profiles",
    href: "/my-profile/shortlist",
    bg: "bg-gradient-to-br from-amber-50 to-yellow-50",
    iconBg: "bg-gradient-to-br from-amber-400 to-yellow-500",
    arrow: "bg-amber-100 text-amber-600",
  },
  {
    icon: LocateFixed,
    label: "Block Profiles",
    subtitle: "Manage blocked profiles",
    href: "/my-profile/block",
    bg: "bg-gradient-to-br from-slate-50 to-gray-50",
    iconBg: "bg-gradient-to-br from-slate-500 to-gray-600",
    arrow: "bg-slate-100 text-slate-600",
  },
  {
    icon: ShieldCheck,
    label: "Safety Center",
    subtitle: "Your safety is our priority",
    href: "/safety",
    bg: "bg-gradient-to-br from-cyan-50 to-teal-50",
    iconBg: "bg-gradient-to-br from-cyan-400 to-teal-500",
    arrow: "bg-cyan-100 text-cyan-600",
  },
  {
    icon: Gem,
    label: "Upgrade Membership",
    subtitle: "Unlock premium features",
    href: "/membership",
    bg: "bg-gradient-to-br from-yellow-50 to-amber-50",
    iconBg: "bg-gradient-to-br from-yellow-400 to-amber-500",
    arrow: "bg-yellow-100 text-amber-600",
  },
  {
    icon: UserRound,
    label: "Bio Data Maker",
    subtitle: "Create your biodata in minutes",
    href: "/download-apk",
    badge: "NEW",
    bg: "bg-gradient-to-br from-pink-50 to-rose-50",
    iconBg: "bg-gradient-to-br from-pink-500 to-fuchsia-500",
    arrow: "bg-pink-100 text-pink-600",
  },
  {
    icon: Headphones,
    label: "Help & Support",
    subtitle: "Get assistance anytime",
    href: "/help",
    bg: "bg-gradient-to-br from-violet-50 to-purple-50",
    iconBg: "bg-gradient-to-br from-violet-500 to-purple-600",
    arrow: "bg-violet-100 text-violet-600",
  },
  {
    icon: Heart,
    label: "Success Story",
    subtitle: "Real stories, real happiness",
    href: "/success-stories",
    bg: "bg-gradient-to-br from-emerald-50 to-teal-50",
    iconBg: "bg-gradient-to-br from-emerald-400 to-teal-500",
    arrow: "bg-emerald-100 text-emerald-600",
  },
];

export default function ProfileSideDrawer() {
  const [open, setOpen] = useState(false);

  // Logout
  const handleLogout = () => {
    setOpen(false);

    // Remove common authentication values.
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("auth");

    // Redirect to login.
    window.location.href = "/auth/sign-in";
  };

  return (
    <>
      {/* =========================================================
          MENU BUTTON
      ========================================================= */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open profile menu"
        className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white text-slate-600 shadow-sm transition-all duration-300 hover:border-pink-400 hover:bg-pink-50 hover:text-pink-600 hover:shadow-md"
      >
        <Logs size={21} strokeWidth={2} />
      </button>

      {/* =========================================================
          OVERLAY
      ========================================================= */}
      <div
        className={`fixed inset-0 z-9999 bg-black/50 backdrop-blur-[1px] transition-opacity duration-300 ${
          open
            ? "visible opacity-100"
            : "pointer-events-none invisible opacity-0"
        }`}
        onClick={() => setOpen(false)}
      >
        {/* =====================================================
            RIGHT SIDE DRAWER
        ===================================================== */}
        <aside
          onClick={(e) => e.stopPropagation()}
          className={`absolute right-0 top-0 flex h-full w-[90%] max-w-147.5 flex-col overflow-hidden bg-white shadow-2xl transition-transform duration-300 ease-out ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* ===================================================
              HEADER
          =================================================== */}
          <div className="relative shrink-0 overflow-hidden bg-linear-to-br from-rose-600 via-pink-500 to-rose-400 px-5 pb-5 pt-5 sm:px-6">
            {/* Decorative circles */}
            <div className="absolute -right-20 -top-24 h-60 w-60 rounded-full bg-white/10" />

            <div className="absolute right-0 top-0 h-full w-1/3 bg-white/5" />

            {/* CLOSE BUTTON */}
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="absolute right-4 top-4 z-20 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white text-rose-500 shadow-lg transition-all duration-200 hover:scale-105 hover:bg-rose-50"
            >
              <X size={22} strokeWidth={2.2} />
            </button>

            {/* PROFILE */}
            <div className="relative z-10 flex items-center gap-4 pr-12">
              <div className="relative shrink-0">
                <Image
                  src="/img/profile/1.jpg"
                  alt="Profile"
                  width={90}
                  height={90}
                  priority
                  className="h-18 w-18 rounded-full border-[3px] border-white object-cover shadow-lg sm:h-19.5 sm:w-19.5"
                />

                {/* Verified */}
                <span className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 ring-2 ring-white">
                  <BadgeCheck size={14} className="" fill="white" />
                </span>
              </div>

              <div className="min-w-0 text-white">
                <h2 className="truncate text-[19px] font-semibold tracking-tight sm:text-[21px]">
                  Suraj Jamdade
                </h2>

                <p className="mt-0.5 text-[12px] font-medium text-white/90 sm:text-[13px]">
                  Member ID : UXZZ5789
                </p>
              </div>
            </div>
          </div>

          {/* ===================================================
              SCROLL AREA
          =================================================== */}
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-white px-4 pb-5 pt-4 scrollbar-none [&::-webkit-scrollbar]:hidden sm:px-5">
            {/* =================================================
                MENU
            ================================================= */}
            <nav className="space-y-3">
              {MENU.map(
                ({
                  icon: Icon,
                  label,
                  subtitle,
                  href,
                  badge,
                  bg,
                  iconBg,
                  arrow,
                }) => (
                  <Link
                    key={label}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`group flex min-h-19.5 items-center justify-between rounded-[19px] border border-black/5 px-3.5 py-3 shadow-sm transition-all duration-300 hover:-translate-y-px hover:shadow-md sm:min-h-20.5 sm:px-4 ${bg}`}
                  >
                    {/* LEFT CONTENT */}
                    <div className="flex min-w-0 items-center gap-3.5 sm:gap-4">
                      {/* ICON */}
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] text-white shadow-md transition-transform duration-300 group-hover:scale-105 sm:h-13 sm:w-13 ${iconBg}`}
                      >
                        <Icon size={23} strokeWidth={2} />
                      </div>

                      {/* TEXT */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="truncate text-[14px] font-bold leading-tight text-slate-800 sm:text-[15px]">
                            {label}
                          </h3>

                          {badge && (
                            <span className="shrink-0 rounded-full bg-rose-500 px-2 py-0.5 text-[8px] font-bold text-white">
                              {badge}
                            </span>
                          )}
                        </div>

                        <p className="mt-1 truncate text-[10px] font-medium leading-tight tracking-wide text-slate-500 sm:text-[11px]">
                          {subtitle}
                        </p>
                      </div>
                    </div>

                    {/* ARROW */}
                    <span
                      className={`ml-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300 group-hover:translate-x-1 ${arrow}`}
                    >
                      <ChevronRight size={18} strokeWidth={2.5} />
                    </span>
                  </Link>
                ),
              )}
            </nav>

            {/* =================================================
                GOLD MEMBERSHIP
            ================================================= */}
            <div className="relative mt-4 overflow-hidden rounded-[22px] border-2 border-amber-300 bg-linear-to-br from-white via-amber-50 to-yellow-50 p-4 shadow-sm">
              {/* Decorative */}
              <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-amber-200/20" />

              {/* GOLD HEADER */}
              <div className="relative flex items-start gap-3">
                {/* Crown */}
                <div className="flex h-17.5 w-17.5 shrink-0 items-center justify-center rounded-[15px] ">
                  <Image
                    src="/img/profile/2.png"
                    alt="Crown"
                    width={70}
                    height={70}
                  />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <h3 className="text-[18px] font-bold text-slate-800 font-serif">
                      Gold
                    </h3>

                    <span className="rounded-full border border-amber-300 bg-amber-100 px-2 py-0.5 text-[8px] font-bold text-amber-600">
                      ★ Premium Member
                    </span>
                  </div>

                  <p className="mt-0.5 text-[10px] font-medium text-slate-500">
                    Enjoy exclusive benefits and priority support
                  </p>
                </div>
              </div>

              {/* =================================================
                  FEATURES
              ================================================= */}
              <div className="mt-4 grid grid-cols-4 border-t border-dashed border-amber-200 pt-3">
                {/* FEATURE 1 */}
                <div className="border-r border-amber-100 px-1 text-center">
                  <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full border border-amber-200 text-amber-500">
                    <Star size={17} />
                  </div>

                  <p className="mt-1.5 text-[8px] font-bold leading-tight text-black">
                    Premium Features
                  </p>

                  <p className="mt-0.5 text-[8px] leading-tight text-slate-400">
                    Unlock premium
                  </p>
                </div>

                {/* FEATURE 2 */}
                <div className="border-r border-amber-100 px-1 text-center">
                  <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full border border-amber-200 text-amber-500">
                    <Headphones size={17} />
                  </div>

                  <p className="mt-1.5 text-[8px] font-bold leading-tight text-black">
                    Priority Support
                  </p>

                  <p className="mt-0.5 text-[8px] leading-tight text-slate-400">
                    Get help faster
                  </p>
                </div>

                {/* FEATURE 3 */}
                <div className="border-r border-amber-100 px-1 text-center">
                  <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full border border-amber-200 text-amber-500">
                    <Heart size={17} />
                  </div>

                  <p className="mt-1.5 text-[8px] font-bold leading-tight text-black">
                    Exclusive Access
                  </p>

                  <p className="mt-0.5 text-[8px] leading-tight text-slate-400">
                    Special offers
                  </p>
                </div>

                {/* FEATURE 4 */}
                <div className="px-1 text-center">
                  <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full border border-amber-200 text-amber-500">
                    <ShieldCheck size={17} />
                  </div>

                  <p className="mt-1.5 text-[8px] font-bold leading-tight text-black">
                    Secure & Trusted
                  </p>

                  <p className="mt-0.5 text-[10px] leading-tight text-slate-400">
                    Your data is safe
                  </p>
                </div>
              </div>

              {/* =================================================
                  MEMBERSHIP STATUS
              ================================================= */}
              <div className="mt-4 flex items-center justify-between gap-2 border-t border-dashed border-amber-200 pt-3">
                {/* DATE */}
                <div className="flex items-center gap-2">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white">
                    <CalendarDays size={21} className="text-rose-500" />
                  </div>

                  <div>
                    <p className="text-[9px] text-slate-500">Valid till</p>

                    <p className="text-[13px] font-bold text-slate-800">
                      31 Aug 2026
                    </p>
                  </div>
                </div>

                {/* ACTIVE */}
                <div className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-[14px] font-bold text-white">
                    ✓
                  </span>

                  <div>
                    <p className="text-[10px] font-bold text-emerald-600">
                      Active
                    </p>

                    <p className="text-[7px] text-slate-400">
                      Membership active
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* =================================================
                LOGOUT BUTTON
            ================================================= */}
            <div className="mt-4">
              <ThemeBtnOne
                type="button"
                onClick={handleLogout}
                text="Logout"
                className="w-50 bg-rose-500 text-white py-4 cursor-pointer px-4 rounded-full font-serif"
              />
            </div>

            {/* Bottom spacing */}
            <div className="h-3" />
          </div>
        </aside>
      </div>
    </>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
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
} from "lucide-react";
import ThemeBtnOne from "./ThemeBtnOne";
import Image from "next/image";

const MENU = [
  {
    icon: SquarePen,
    label: "Edit Profile",
    href: "/my-profile",
  },
  {
    icon: Heart,
    label: "Partner Preferences",
    href: "/my-profile/partner-preferences",
  },
  {
    icon: Sparkles,
    label: "Astrology Services",
    href: "/my-profile/astrology-services",
  },
  {
    icon: Star,
    label: "Shortlist Profiles",
    href: "/my-profile/shortlist",
  },
  {
    icon: LocateFixed,
    label: "Block Profiles",
    href: "/my-profile/block",
  },

  {
    icon: ShieldCheck,
    label: "Safety Centre",
    href: "/safety",
  },
  {
    icon: Headphones,
    label: "Help & Support",
    href: "/help",
  },
];

export default function ProfileSideDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Menu Button */}
      <button
        onClick={() => setOpen(true)}
        className="flex cursor-pointer h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-slate-600 transition hover:bg-rose-100 hover:border-pink-500 hover:text-pink-600 hover:shadow-md"
      >
        <Logs size={22} />
      </button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-999 bg-black/40 transition-opacity duration-300 ${
          open
            ? "visible opacity-100"
            : "invisible opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      >
        {/* Drawer */}
        <aside
          onClick={(e) => e.stopPropagation()}
          className={`absolute right-0 top-0 h-full w-[90%] max-w-sm bg-white shadow-2xl transition-transform duration-300 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="relative border-b bg-linear-to-br from-orange-50 via-rose-50 to-rose-100 p-6">
            <button
              onClick={() => setOpen(false)}
              className="absolute cursor-pointer bg-rose-500 right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full borde text-white"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-4">
              <Image
                src="/img/profile/1.jpg"
                alt="Profile"
                width={100}
                height={100}
                className="h-16 w-16 rounded-full object-cover ring-2 ring-rose-500"
              />

              <div>
                <h2 className="text-lg font-bold text-gray-900 font-serif">
                  Suraj Jamdade
                </h2>
                <p className="text-sm text-black">ID · UXZZ5789</p>
              </div>
            </div>
          </div>

          {/* Membership */}
          <div className="p-5">
            <ThemeBtnOne
              text="Upgrade Membership"
              url="/membership"
              icon={<Gem size={18} />}
              className="mt-2 cursor-pointer flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-rose-600 to-rose-700 py-3 font-semibold text-white"
            />

            <p className="mt-2 text-center text-xs text-amber-700">
              Flat 60% Off
            </p>
          </div>

          {/* Menu */}
          <nav className="px-3">
            {MENU.map(({ icon: Icon, label, href }) => (
              <Link
                key={label}
                href={href}
                onClick={() => setOpen(false)}
                className="flex border-b border-dashed border-gray-200 items-center justify-between rounded-xl px-3 py-3 transition hover:bg-rose-50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                    <Icon size={18} />
                  </div>

                  <span className="font-bold text-xs">{label}</span>
                </div>

                <ChevronRight size={18} />
              </Link>
            ))}
          </nav>

          <div className="mt-auto border-t p-5 text-center text-xs text-rose-500 font-bold">
            Member since 2023
          </div>
        </aside>
      </div>
    </>
  );
}

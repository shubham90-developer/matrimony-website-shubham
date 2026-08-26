"use client";

import {
  Baby,
  Blocks,
  Briefcase,
  Calendar,
  ChevronLeft,
  Cigarette,
  Crown,
  Dumbbell,
  Flag,
  GraduationCap,
  Heart,
  Home,
  Languages,
  Leaf,
  MapPin,
  MessageCircle,
  Moon,
  MoreVertical,
  Ruler,
  Send,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  UserRound,
  Utensils,
  Wallet,
  Wine,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { PhotoSlider } from "./PhotoSlider";

/* ---------------- Mock data (swap for a real fetch later) ---------------- */

const profile = {
  name: "A Shinde",
  age: 25,
  id: "TKW***789",
  lastSeen: "25-Jul-26",
  tag: "Just Joined",
  status: "Online",
  managedBy: "Parent",
  images: ["/img/matches/1.jpg", "/img/matches/2.jpg", "/img/matches/3.jpg"],
  height: "5'4\"",
  city: "Solapur, India",
  religion: "Hindu",
  caste: "Maratha Kunbi",
  income: "Rs. 2 - 3 Lakh per Annum",
  motherTongue: "Marathi",
  marital: "Never Married",
  about:
    "I am A Shinde, a 25-year-old from Solapur, Maharashtra, with a Master's degree in Commerce. Currently seeking job opportunities, I am eager to build a meaningful life with a supportive partner who values family and personal growth.",
  education: "M.Com - Post Graduation",
  career: "Looking for job",
  careerNote: "Not working currently",
  familyHeadline:
    "Father is a Businessman/Entrepreneur & Mother is a Homemaker",
  siblings: "1 Brother (Married)",
  familyAbout:
    "My father is a farmer My mother is a homemaker My younger brother is in college",
  livingSituation: "Living with parents",
  dob: "30 May, 2001",
  matchPercent: 9,
  matchTotal: 9,
  diet: "Veg",
  drinking: "No",
  smoking: "No",
  fitness: "Yes",
  sleep: "Yes",
  manglik: "no",
};

const TABS = ["About Me", "Family", "Looking For"] as const;
type Tab = (typeof TABS)[number];

/* ---------------- Small building blocks ---------------- */

function InfoRow({
  icon: Icon,
  children,
}: {
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <p className="flex items-center gap-2 text-sm font-semibold text-stone-600">
      <Icon size={15} className="shrink-0 text-stone-400" />
      {children}
    </p>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-serif text-lg font-bold text-slate-900">{children}</h2>
  );
}

/* ---------------- Tab content ---------------- */

function AboutMeTab() {
  return (
    <div className="space-y-8">
      <p className="text-sm leading-relaxed text-stone-600">{profile.about}</p>

      <div className="space-y-3">
        <SectionTitle>Education</SectionTitle>
        <InfoRow icon={GraduationCap}>{profile.education}</InfoRow>
      </div>

      <div className="space-y-3">
        <SectionTitle>Contact</SectionTitle>
        <div className="rounded-2xl bg-rose-50 p-4">
          <p className="text-sm font-bold text-slate-900">
            Go Premium to contact matches
          </p>
          <p className="mt-1 text-sm text-stone-600">
            Initiate a voice or a video call with the profiles you like by
            upgrading to a membership
          </p>
          <Link
            href="/membership"
            className="mt-2 inline-block text-sm font-bold text-rose-600 hover:text-rose-700"
          >
            Upgrade Now &rarr;
          </Link>
        </div>
      </div>

      <div className="space-y-3">
        <SectionTitle>Career</SectionTitle>
        <InfoRow icon={Briefcase}>{profile.career}</InfoRow>
        <p className="pl-5.75 text-xs text-black">{profile.careerNote}</p>
      </div>
    </div>
  );
}

function FamilyTab() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <SectionTitle>Family</SectionTitle>
        <InfoRow icon={Home}>{profile.familyHeadline}</InfoRow>
        <InfoRow icon={Baby}>{profile.siblings}</InfoRow>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-bold text-slate-900">About her family</p>
        <p className="text-sm leading-relaxed text-stone-600">
          {profile.familyAbout}
        </p>
      </div>

      <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600">
        {profile.livingSituation}
      </span>

      <div className="space-y-3">
        <SectionTitle>Kundli and Astro</SectionTitle>
        <InfoRow icon={Calendar}>{profile.dob}</InfoRow>
        <InfoRow icon={Calendar}>Manglik: {profile.manglik}</InfoRow>
      </div>
    </div>
  );
}

function LookingForTab() {
  const pct = Math.round((profile.matchPercent / profile.matchTotal) * 100);

  return (
    <div className="space-y-4">
      <div>
        <SectionTitle>Who is she looking for...</SectionTitle>
        <p className="mt-1 text-sm text-stone-500">
          These are her desired partner qualities
        </p>
      </div>

      <div className="rounded-2xl border border-stone-200 p-4">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide text-stone-400">
          <span>Her Preference</span>
          <span>You Match</span>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-stone-200">
            <Image
              src={profile.images[0]}
              alt="Her preference"
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>

          <div className="flex-1">
            <div className="h-2 w-full overflow-hidden rounded-full bg-stone-100">
              <div
                className="h-full rounded-full bg-rose-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="mt-1 text-xs font-semibold text-stone-500">
              You match {profile.matchPercent}/{profile.matchTotal} of her
              preference
            </p>
          </div>

          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-stone-200">
            <Image
              src="/img/profile/me.jpg"
              alt="You"
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Page ---------------- */

const actions = [
  {
    icon: Heart,
    label: "Interest",
    href: "/my-profile",
    variant: "active",
  },
  {
    icon: Star,
    label: "Shortlist",
    href: "/my-matches/shortlist",
  },
  {
    icon: MessageCircle,
    label: "Chat",
    href: "/my-matches/chat",
  },
  {
    icon: Crown,
    label: "Upgrade",
    href: "/membership",
    variant: "gold",
  },
];

const MyMatchesDetails = () => {
  const [activeTab, setActiveTab] = useState<Tab>("About Me");
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <section>
      <div className="border border-gray-200 p-4 rounded-xl">
        <Link
          href="/my-matches/matches"
          className="mb-4 -ml-1 flex h-9 w-9 border border-slate-200 cursor-pointer items-center justify-center rounded-full text-slate-900 hover:bg-slate-100 transition"
        >
          <ChevronLeft size={18} />
        </Link>

        {/* Header photo */}
        <div className="relative h-105 sm:h-125 lg:h-155 w-full overflow-hidden rounded-2xl bg-linear-to-b from-slate-700 to-slate-900">
          <PhotoSlider images={profile.images} name={profile.name} />

          <div className="absolute left-4 top-4 z-10 flex flex-wrap items-center gap-2">
            {profile.tag && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm border border-stone-200 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                <Send size={12} className="text-orange-500" />
                {profile.tag}
              </span>
            )}

            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${
                profile.status === "Online"
                  ? "bg-emerald-500 text-white"
                  : "bg-slate-100 text-slate-600 border border-slate-200"
              }`}
            >
              {profile.status === "Online" && (
                <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
              )}
              {profile.status}
            </span>
          </div>
          <div className="absolute right-3 top-3 z-20" ref={menuRef}>
            <button
              type="button"
              aria-label="More options"
              onClick={() => setOpenMenu((prev) => !prev)}
              className="flex h-10 w-10 bg-gray-300 cursor-pointer items-center justify-center rounded-full  text-black backdrop-blur transition hover:bg-black/60 hover:text-white"
            >
              {openMenu ? <X size={18} /> : <MoreVertical size={18} />}
            </button>

            {openMenu && (
              <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                <button className="flex border-b border-dashed border-gray-200 cursor-pointer w-full items-center gap-3 px-4 py-3 text-sm hover:bg-slate-100">
                  <Blocks size={16} className="text-pink-500" />
                  Block Profile
                </button>

                <button className="flex border-b border-dashed border-gray-200 cursor-pointer w-full items-center gap-3 px-4 py-3 text-sm hover:bg-slate-100">
                  <Share2 size={16} className="text-blue-500" />
                  Share Profile
                </button>

                <button className="flex border-b border-dashed border-gray-200 cursor-pointer w-full items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50">
                  <Flag size={16} />
                  Report Profile
                </button>
              </div>
            )}
          </div>

          <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-xs font-semibold text-white">
            Last seen on {profile.lastSeen}
          </div>
        </div>

        {/* Name row */}
        <div className="mt-4">
          <div className="flex items-center gap-1.5">
            <h1 className="font-serif text-2xl font-bold text-slate-900">
              {profile.name}, {profile.age}
            </h1>
            <ShieldCheck size={18} className="text-emerald-500" />
          </div>
          <p className="mt-1 text-sm font-bold text-rose-500 ">
            ID - {profile.id}
          </p>
          <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-cyan-100 px-3 py-1.5 text-sm font-medium text-cyan-800 shadow-sm">
            <UserRound size={16} />
            <span>
              Profile managed by <strong>{profile.managedBy}</strong>
            </span>
          </p>
        </div>

        {/* Info grid */}
        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 border-y border-stone-100 py-4 ">
          <InfoRow icon={Ruler}>{profile.height}</InfoRow>
          <InfoRow icon={MapPin}>{profile.city}</InfoRow>
          <InfoRow icon={Heart}>
            {profile.religion} &middot; {profile.caste}
          </InfoRow>
          <InfoRow icon={Wallet}>{profile.income}</InfoRow>
          <InfoRow icon={Languages}>{profile.motherTongue}</InfoRow>
          <InfoRow icon={Sparkles}>{profile.marital}</InfoRow>
        </div>

        {/* Habits */}
        <div className="mt-3">
          <div className="mb-6 flex items-center gap-2">
            <Leaf className="h-5 w-5 text-emerald-600" />
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Lifestyle & Habits
              </h3>
              <p className="mt-0.5 text-sm text-slate-500">
                Daily lifestyle and personal habits.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Utensils,
                label: "Diet",
                value: profile.diet,
                fallback: "Not specified",
                iconBg: "bg-orange-50",
                iconColor: "text-orange-600",
              },
              {
                icon: Wine,
                label: "Drinking",
                value: profile.drinking,
                fallback: "No",
                iconBg: "bg-purple-50",
                iconColor: "text-purple-600",
              },
              {
                icon: Cigarette,
                label: "Smoking",
                value: profile.smoking,
                fallback: "No",
                iconBg: "bg-red-50",
                iconColor: "text-red-600",
              },
              {
                icon: Dumbbell,
                label: "Fitness",
                value: profile.fitness,
                fallback: "Regular",
                iconBg: "bg-emerald-50",
                iconColor: "text-emerald-600",
              },
              {
                icon: Moon,
                label: "Sleep Schedule",
                value: profile.sleep,
                fallback: "Normal",
                iconBg: "bg-indigo-50",
                iconColor: "text-indigo-600",
              },
            ].map(
              ({ icon: Icon, label, value, fallback, iconBg, iconColor }) => (
                <div
                  key={label}
                  className="group flex items-start gap-3 rounded-2xl border border-slate-100 bg-white p-4  transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-md"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg} transition-transform duration-200 group-hover:scale-105`}
                  >
                    <Icon className={`h-5 w-5 ${iconColor}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      {label}
                    </p>
                    <p
                      className={`mt-0.5 truncate text-sm font-semibold ${
                        value ? "text-slate-900" : "text-slate-400"
                      }`}
                    >
                      {value || fallback}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-4 flex gap-6 border-b border-stone-200">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`relative pb-3 text-sm font-bold transition ${
                activeTab === tab
                  ? "text-rose-600"
                  : "text-stone-400 hover:text-stone-600"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-rose-600" />
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="pt-6">
          {activeTab === "About Me" && <AboutMeTab />}
          {activeTab === "Family" && <FamilyTab />}
          {activeTab === "Looking For" && <LookingForTab />}
        </div>

        <div className="sticky top-20 mt-15 rounded-3xl bg-rose-100 px-6 py-6">
          <div className="flex items-start justify-around">
            {actions.map(({ icon: Icon, label, href, variant }) => (
              <Link
                key={label}
                href={href}
                className="flex flex-col items-center gap-2 group"
              >
                <span
                  className={`flex h-13 w-13 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-105 ${
                    variant === "active"
                      ? "bg-rose-800 shadow-[0_0_0_3px_rgba(190,50,90,0.2)]"
                      : "border border-neutral-700 bg-neutral-800"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 ${
                      variant === "active"
                        ? "text-white"
                        : variant === "gold"
                          ? "text-amber-400"
                          : "text-neutral-300"
                    }`}
                  />
                </span>

                <span
                  className={`text-xs font-medium transition-colors ${
                    variant === "active"
                      ? "text-rose-800"
                      : "text-neutral-600 group-hover:text-neutral-900"
                  }`}
                >
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyMatchesDetails;

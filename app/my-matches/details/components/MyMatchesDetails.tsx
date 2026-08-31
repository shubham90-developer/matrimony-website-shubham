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
  Loader2,
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
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { PhotoSlider } from "./PhotoSlider";
import {
  useGetProfileByIdQuery,
  type Profile as ApiProfile,
} from "@/Redux/profileApi";
import { useSendInterestMutation } from "@/Redux/interestApi";
import { useAddToShortlistMutation } from "@/Redux/shortlistApi";
import { useAddToIgnoreMutation } from "@/Redux/ignoreApi";

/* ---------------- Map the API profile onto the flat shape this page renders ---------------- */

interface DetailProfile {
  userId: string;
  name: string;
  age: number;
  id: string;
  images: string[];
  height: string;
  city: string;
  religion: string;
  caste: string;
  income: string;
  motherTongue: string;
  marital: string;
  about: string;
  education: string;
  career: string;
  careerNote: string;
  familyHeadline: string;
  siblings: string;
  familyAbout: string;
  livingSituation: string;
  dob: string;
  diet: string;
  drinking: string;
  smoking: string;
  manglik: string;
}

const FALLBACK_IMAGE = "/img/matches/1.jpg";

function toDetailProfile(p: ApiProfile): DetailProfile {
  const siblings = [
    p.family?.brothers && `${p.family.brothers} Brother(s)`,
    p.family?.sisters && `${p.family.sisters} Sister(s)`,
  ]
    .filter(Boolean)
    .join(", ");

  return {
    userId: p._id,
    name: `${p.basicDetails?.firstName ?? ""} ${p.basicDetails?.lastName ?? ""}`.trim(),
    age: p.basicDetails?.age ?? 0,
    id: p.matrimonyId || p._id,
    images: p.photos && p.photos.length > 0 ? p.photos : [FALLBACK_IMAGE],
    height: p.basicDetails?.height ?? "",
    city: [p.locationDetails?.city, p.locationDetails?.state]
      .filter(Boolean)
      .join(", "),
    religion: p.religionDetails?.religion ?? "",
    caste: [p.religionDetails?.caste, p.religionDetails?.subCaste]
      .filter(Boolean)
      .join(" • "),
    income: p.educationDetails?.annualIncome ?? "",
    motherTongue: p.religionDetails?.motherTongue ?? "",
    marital: p.basicDetails?.maritalStatus ?? "",
    about: p.aboutMe?.about ?? "",
    education:
      p.education?.highestDegree ||
      p.educationDetails?.highestQualification ||
      "",
    career: p.careerDetails?.occupation || p.educationDetails?.occupation || "",
    careerNote: p.careerDetails?.organizationName ?? "",
    familyHeadline: p.family?.aboutFamily ?? "",
    siblings,
    familyAbout: p.family?.aboutFamily ?? "",
    livingSituation: p.family?.livingWithParents ? "Living with parents" : "",
    dob: p.basicDetails?.dob ?? "",
    diet: p.lifestyle?.dietaryHabit ?? "",
    drinking: p.lifestyle?.drinkingHabit ?? "",
    smoking: p.lifestyle?.smokingHabit ?? "",
    manglik: p.religionDetails?.hasDosh ? "Manglik" : "Non-Manglik",
  };
}

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

function AboutMeTab({ profile }: { profile: DetailProfile }) {
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
        {profile.careerNote && (
          <p className="pl-5.75 text-xs text-black">{profile.careerNote}</p>
        )}
      </div>
    </div>
  );
}

function FamilyTab({ profile }: { profile: DetailProfile }) {
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

      {profile.livingSituation && (
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600">
          {profile.livingSituation}
        </span>
      )}

      <div className="space-y-3">
        <SectionTitle>Kundli and Astro</SectionTitle>
        <InfoRow icon={Calendar}>{profile.dob}</InfoRow>
        <InfoRow icon={Calendar}>Manglik: {profile.manglik}</InfoRow>
      </div>
    </div>
  );
}

// No partner-preference/match-score API exists yet — kept as a fixed
// display until that endpoint is available, rather than faking a number.
const MATCH_PERCENT = 9;
const MATCH_TOTAL = 9;

function LookingForTab({ profile }: { profile: DetailProfile }) {
  const pct = Math.round((MATCH_PERCENT / MATCH_TOTAL) * 100);

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
              You match {MATCH_PERCENT}/{MATCH_TOTAL} of her preference
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

type ActionVariant = "active" | "gold" | undefined;

const MyMatchesDetails = () => {
  const searchParams = useSearchParams();
  const profileId = searchParams.get("id");

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

  const {
    data: profileData,
    isLoading: profileLoading,
    isError: profileError,
  } = useGetProfileByIdQuery(profileId ?? "", { skip: !profileId });

  const profile = useMemo(
    () => (profileData?.data ? toDetailProfile(profileData.data) : null),
    [profileData],
  );

  const [sendInterest, { isLoading: sendingInterest }] =
    useSendInterestMutation();
  const [addToShortlist, { isLoading: shortlisting }] =
    useAddToShortlistMutation();
  const [addToIgnore, { isLoading: blocking }] = useAddToIgnoreMutation();

  const handleInterest = async () => {
    if (!profile) return;
    try {
      await sendInterest({ receiverId: profile.userId }).unwrap();
      toast.success("Interest sent!");
    } catch (err) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ||
        "Couldn't send interest. Please try again.";
      toast.error(message);
    }
  };

  const handleShortlist = async () => {
    if (!profile) return;
    try {
      await addToShortlist({ shortlistedUserId: profile.userId }).unwrap();
      toast.success("Added to shortlist!");
    } catch (err) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ||
        "Couldn't shortlist. Please try again.";
      toast.error(message);
    }
  };

  const handleBlock = async () => {
    if (!profile) return;
    try {
      await addToIgnore({ ignoredUserId: profile.userId }).unwrap();
      toast.success("Profile blocked.");
      setOpenMenu(false);
    } catch (err) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ||
        "Couldn't block profile. Please try again.";
      toast.error(message);
    }
  };

  const actions: {
    icon: React.ElementType;
    label: string;
    href?: string;
    onClick?: () => void;
    loading?: boolean;
    variant?: ActionVariant;
  }[] = [
    {
      icon: Heart,
      label: "Interest",
      onClick: handleInterest,
      loading: sendingInterest,
      variant: "active",
    },
    {
      icon: Star,
      label: "Shortlist",
      onClick: handleShortlist,
      loading: shortlisting,
    },
    {
      icon: MessageCircle,
      label: "Chat",
      href: "/my-matches/messenger",
    },
    {
      icon: Crown,
      label: "Upgrade",
      href: "/membership",
      variant: "gold",
    },
  ];

  if (!profileId) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-gray-200 py-20 text-sm text-stone-500">
        No profile selected.
      </div>
    );
  }

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-20 text-sm text-stone-500">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading profile...
      </div>
    );
  }

  if (profileError || !profile) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-gray-200 py-20 text-sm text-rose-500">
        Profile not found.
      </div>
    );
  }

  return (
    <section>
      <Toaster position="top-center" reverseOrder={false} />
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
                <button
                  type="button"
                  disabled={blocking}
                  onClick={handleBlock}
                  className="flex border-b border-dashed border-gray-200 cursor-pointer w-full items-center gap-3 px-4 py-3 text-sm hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {blocking ? (
                    <Loader2 size={16} className="animate-spin text-pink-500" />
                  ) : (
                    <Blocks size={16} className="text-pink-500" />
                  )}
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
                value: "",
                fallback: "Not specified",
                iconBg: "bg-emerald-50",
                iconColor: "text-emerald-600",
              },
              {
                icon: Moon,
                label: "Sleep Schedule",
                value: "",
                fallback: "Not specified",
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
          {activeTab === "About Me" && <AboutMeTab profile={profile} />}
          {activeTab === "Family" && <FamilyTab profile={profile} />}
          {activeTab === "Looking For" && <LookingForTab profile={profile} />}
        </div>

        <div className="sticky top-20 mt-15 rounded-3xl bg-rose-100 px-6 py-6">
          <div className="flex items-start justify-around">
            {actions.map(
              ({ icon: Icon, label, href, onClick, loading, variant }) => {
                const content = (
                  <>
                    <span
                      className={`flex h-13 w-13 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-105 ${
                        variant === "active"
                          ? "bg-rose-800 shadow-[0_0_0_3px_rgba(190,50,90,0.2)]"
                          : "border border-neutral-700 bg-neutral-800"
                      } ${loading ? "opacity-60" : ""}`}
                    >
                      {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin text-white" />
                      ) : (
                        <Icon
                          className={`h-5 w-5 ${
                            variant === "active"
                              ? "text-white"
                              : variant === "gold"
                                ? "text-amber-400"
                                : "text-neutral-300"
                          }`}
                        />
                      )}
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
                  </>
                );

                if (href) {
                  return (
                    <Link
                      key={label}
                      href={href}
                      className="flex flex-col items-center gap-2 group"
                    >
                      {content}
                    </Link>
                  );
                }

                return (
                  <button
                    key={label}
                    type="button"
                    disabled={loading}
                    onClick={onClick}
                    className="flex cursor-pointer flex-col items-center gap-2 group disabled:cursor-not-allowed"
                  >
                    {content}
                  </button>
                );
              },
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyMatchesDetails;

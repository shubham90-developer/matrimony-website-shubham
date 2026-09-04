"use client";

import ThemeBtnOne from "@/app/components/ThemeBtnOne";
import {
  BadgeCheck,
  Circle,
  GraduationCap,
  Heart,
  Images,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Ruler,
  Send,
  Sparkles,
  Star,
  User,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  useGetMyProfileQuery,
  useGetProfileFeedQuery,
  type Profile as ApiProfile,
  type ProfileFeedParams,
} from "@/Redux/profileApi";
import { useSendInterestMutation } from "@/Redux/interestApi";
import { useAddToShortlistMutation } from "@/Redux/shortlistApi";
import { useAddToIgnoreMutation } from "@/Redux/ignoreApi";

interface Profile {
  matchPercent: any;
  id: string;
  userId: string;
  name: string;
  age: number;
  status: "Online" | "Active Today" | string;
  tag?: string;
  height: string;
  city: string;
  community: string;
  job: string;
  income: string;
  edu: string;
  marital: string;
  religion: string;
  caste: string;
  subcaste: string;
  images: string[];
}

const FALLBACK_IMAGE = "/img/profile/1.jpg";
const NEW_PROFILE_WINDOW_DAYS = 14;

const FILTER_PARAM_KEYS = [
  "religion",
  "motherTongue",
  "country",
  "annualIncome",
  "education",
  "occupation",
  "height",
  "maritalStatus",
  "manglik",
] as const;

const toCardProfile = (apiProfile: ApiProfile): Profile => {
  const {
    _id,
    userId,
    matrimonyId,
    basicDetails,
    educationDetails,
    religionDetails,
    locationDetails,
    careerDetails,
    photos,
    createdAt,
  } = apiProfile;

  const community = [religionDetails?.caste, religionDetails?.subCaste]
    .filter(Boolean)
    .join("-");

  const isRecentlyJoined = createdAt
    ? (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24) <=
      NEW_PROFILE_WINDOW_DAYS
    : false;

  return {
    id: _id,
    userId: _id,
    name: `${basicDetails?.firstName ?? ""} ${basicDetails?.lastName ?? ""}`.trim(),
    age: basicDetails?.age ?? 0,
    status: "Verified",
    tag: isRecentlyJoined ? "Just Joined" : undefined,
    height: basicDetails?.height ?? "",
    city: locationDetails?.city ?? "",
    community,
    job: careerDetails?.occupation || educationDetails?.occupation || "",
    income: educationDetails?.annualIncome ?? "",
    edu: educationDetails?.highestQualification ?? "",
    marital: basicDetails?.maritalStatus ?? "",
    religion: religionDetails?.religion ?? "",
    caste: religionDetails?.caste ?? "",
    subcaste: religionDetails?.subCaste ?? "",
    images: photos && photos.length > 0 ? photos : [FALLBACK_IMAGE],
  };
};

type ActionKey = "interest" | "shortlist" | "ignore" | "chat";

/* Actions available on each card. `requiresPaid` marks actions that are
   blocked behind the paywall for "Just Joined" matches (Interest / Chat). */
const ACTIONS: {
  key: ActionKey;
  icon: typeof Mail;
  label: string;
  url: string;
  requiresPaid: boolean;
}[] = [
  {
    key: "interest",
    icon: Mail,
    label: "Interest",
    url: "/my-matches/interest",
    requiresPaid: true,
  },
  {
    key: "shortlist",
    icon: Star,
    label: "Shortlist",
    url: "/my-matches/shortlist",
    requiresPaid: false,
  },
  {
    key: "ignore",
    icon: X,
    label: "Ignore",
    url: "/my-matches/ignore",
    requiresPaid: false,
  },
  {
    key: "chat",
    icon: MessageCircle,
    label: "Chat",
    url: "/my-matches/messenger",
    requiresPaid: false,
  },
];

/* ---------------- Upgrade / Paywall modal ---------------- */

interface UpgradeModalProps {
  profile: Profile;
  onClose: () => void;
}

function UpgradeModal({ profile, onClose }: UpgradeModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sparkly header */}
        <div className="relative flex flex-col items-center bg-linear-to-b from-rose-100 via-rose-50 to-white px-6 pb-8 pt-10">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4  transition cursor-pointer bg-rose-500 text-white p-2 rounded-full"
          >
            <X size={22} />
          </button>

          <Sparkles className="absolute left-6 top-6 text-rose-200" size={20} />
          <Sparkles
            className="absolute right-16 top-20 text-rose-200"
            size={16}
          />
          <Sparkles
            className="absolute left-10 bottom-8 text-rose-200"
            size={14}
          />

          <div className="relative">
            <div className="relative h-40 w-36 overflow-hidden rounded-2xl border-4 border-white shadow-lg">
              <Image
                src={profile.images[0]}
                alt={profile.name}
                fill
                sizes="144px"
                className="object-cover"
              />
            </div>
            <span className="absolute -right-3 -top-3 flex h-9 w-9 items-center justify-center rounded-full bg-rose-400 shadow-md">
              <Star size={18} className="fill-white text-white" />
            </span>
          </div>

          {profile.tag && (
            <p className="mt-3 text-sm font-extrabold tracking-wide text-amber-500">
              {profile.tag.toUpperCase()}
            </p>
          )}
        </div>

        {/* Message + CTA */}
        <div className="px-6 pb-8 pt-2 text-center">
          <p className="text-lg font-bold text-slate-900">
            Only paid members can connect with {profile.tag ?? "this"} matches
          </p>

          <ThemeBtnOne
            url="/upgrade"
            text="Upgrade to Connect"
            className="mt-6 w-full rounded-full bg-rose-600 py-3.5 text-base font-bold text-white transition hover:bg-rose-700"
          />
        </div>
      </div>
    </div>
  );
}

/* ---------------- Lightbox / Popup ---------------- */

/* ---------------- Profile Card ---------------- */

// NOTE on data used by this version that wasn't in your original Profile fields:
//   p.verified?: boolean       -> shows the green "Verified" badge when true
//   p.matchPercent?: number    -> shows the pink match-% badge when present (e.g. 73)
// If your Profile type doesn't have these yet, add them (or rename to whatever
// your API already returns) — the badges just won't render until the field exists.
//
// Also make sure `lucide-react` import includes: Send, User, GraduationCap,
// Languages, Loader2, Images, ShieldCheck, Heart

// NOTE on data used by this version that wasn't in your original Profile fields:
//   p.verified?: boolean       -> shows the green "Verified" badge when true
//   p.matchPercent?: number    -> shows the pink match-% badge when present (e.g. 73)
// If your Profile type doesn't have these yet, add them (or rename to whatever
// your API already returns) — the badges just won't render until the field exists.
//
// Also make sure `lucide-react` import includes: Send, User, GraduationCap,
// Languages, Loader2, Images, ShieldCheck, Heart

// NOTE on data used by this version that wasn't in your original Profile fields:
//   p.verified?: boolean       -> shows the green "Verified" badge when true
//   p.matchPercent?: number    -> shows the pink match-% badge when present (e.g. 73)
// If your Profile type doesn't have these yet, add them (or rename to whatever
// your API already returns) — the badges just won't render until the field exists.
//
// Also make sure `lucide-react` import includes: Send, User, GraduationCap,
// Languages, Loader2, Images, ShieldCheck, Heart

function ProfileCard({
  p,
  onHide,
}: {
  p: Profile;
  onHide: (userId: string) => void;
}) {
  const router = useRouter();
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const [sendInterest, { isLoading: interestLoading }] =
    useSendInterestMutation();
  const [addToShortlist, { isLoading: shortlistLoading }] =
    useAddToShortlistMutation();
  const [addToIgnore, { isLoading: ignoreLoading }] = useAddToIgnoreMutation();

  const actionLoading: Record<ActionKey, boolean> = {
    interest: interestLoading,
    shortlist: shortlistLoading,
    ignore: ignoreLoading,
    chat: false,
  };

  const images = p.images?.length ? p.images : [FALLBACK_IMAGE];
  const isJustJoined = p.tag === "Just Joined";

  const handleAction = async (
    e: React.MouseEvent,
    action: (typeof ACTIONS)[number],
  ) => {
    // Prevent the parent <Link> from navigating to the details page
    e.preventDefault();
    e.stopPropagation();

    if (action.requiresPaid && isJustJoined) {
      setUpgradeOpen(true);
      return;
    }

    if (actionLoading[action.key]) return;

    try {
      switch (action.key) {
        case "interest":
          await sendInterest({ receiverId: p.userId }).unwrap();
          toast.success(`Interest sent to ${p.name}`);
          onHide(p.userId);
          return;
        case "shortlist":
          await addToShortlist({ shortlistedUserId: p.userId }).unwrap();
          toast.success(`${p.name} added to shortlist`);
          onHide(p.userId);
          return;
        case "ignore":
          await addToIgnore({ ignoredUserId: p.userId }).unwrap();
          toast.success(`${p.name} ignored`);
          onHide(p.userId);
          return;
        case "chat":
          router.push(action.url);
          return;
      }
    } catch (err) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ||
        `Couldn't complete that action. Please try again.`;
      toast.error(message);
    }
  };

  return (
    <>
      <Link
        href={`/my-matches/details?id=${encodeURIComponent(p.id)}`}
        className="group relative block h-150 w-full overflow-hidden rounded-[28px] border border-stone-200/70 bg-stone-900 shadow-[0_1px_2px_rgba(60,40,30,0.06),0_14px_28px_-18px_rgba(60,40,30,0.4)] transition-shadow duration-300 hover:shadow-[0_1px_2px_rgba(60,40,30,0.08),0_22px_38px_-18px_rgba(60,40,30,0.5)] sm:h-160"
      >
        {/* Photo — fills the entire card as the background. Clicking anywhere
            on the card, including the photo, follows this Link to the details page. */}
        <Image
          src={images[0]}
          alt={p.name}
          fill
          sizes="(max-width:640px) 100vw, 400px"
          className="absolute inset-0 z-0 object-cover transition duration-500 group-hover:scale-105"
        />

        {/* Scrim: light at top so badges stay legible, strong at bottom for text + buttons */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-linear-to-t from-black/92 via-black/50 to-black/10" />

        {/* Top row: verified + status on the left, photo count on the right */}
        <div className="absolute inset-x-0 top-0 z-20 flex items-start justify-between p-3.5">
          <div className="flex flex-col items-start gap-2">
            {p.tag ? (
              <span className="flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold italic text-slate-800 backdrop-blur">
                <Send size={12} />
                {p.tag}
              </span>
            ) : (
              <span
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur ${
                  p.status === "Verified"
                    ? "bg-teal-500/90 text-white"
                    : p.status === "Online"
                      ? "bg-emerald-500/90 text-white"
                      : p.status === "Just Joined"
                        ? "bg-purple-500/90 text-white"
                        : "bg-black/45 text-white"
                }`}
              >
                {p.status === "Verified" && (
                  <BadgeCheck className="h-3.5 w-3.5" />
                )}

                {p.status === "Online" && (
                  <span className="relative flex h-3.5 w-3.5 items-center justify-center">
                    <span className="absolute h-3 w-3 animate-ping rounded-full bg-white/60" />
                    <Circle className="relative h-2.5 w-2.5 fill-white text-white" />
                  </span>
                )}

                {p.status === "Just Joined" && (
                  <Sparkles className="h-3.5 w-3.5" />
                )}

                {p.status}
              </span>
            )}
          </div>

          <div className="flex flex-col items-end gap-2">
            {images.length > 1 && (
              <span className="flex items-center gap-1 rounded-full bg-black/45 px-2.5 py-1.5 text-xs font-semibold text-white backdrop-blur">
                <Images size={12} />
                1/{images.length}
              </span>
            )}
          </div>
        </div>

        {/* Bottom block: name, meta, info pills, and the action bar — all overlaid on the photo */}
        <div className="absolute inset-x-0 bottom-0 z-20 p-4 sm:p-5">
          {/* Floating match-% badge, right side, straddling the name row like the reference */}
          <div className="absolute top-1 right-4 z-30 flex h-12 w-12 flex-col items-center justify-center rounded-xl border-2 border-white/30 bg-rose-500 text-white shadow-lg">
            <Heart size={15} className="fill-white" />

            <span className="text-xs font-bold leading-tight">
              {typeof p.matchPercent === "number" ? p.matchPercent : 0}%
            </span>
          </div>

          <h3 className="flex max-w-[calc(100%-4.5rem)] items-center gap-1.5 font-serif text-2xl font-bold text-white sm:text-[26px]">
            <span>
              {p.name}, {p.age}
            </span>

            {p.status === "Verified" && (
              <BadgeCheck
                size={21}
                className="shrink-0 fill-blue-500 text-white"
              />
            )}
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
              <Ruler size={12} className="text-rose-300" />
              {p.height}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
              <MapPin size={12} className="text-rose-300" />
              {p.city}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
              <Users size={12} className="text-rose-300" />
              {p.community}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
              <User size={13} className="shrink-0 text-rose-300" />
              <span className="wrap-break-word">
                {p.job} · {p.income}
              </span>
            </span>
            <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
              <GraduationCap size={13} className="shrink-0 text-rose-300" />
              <span className="wrap-break-word">
                {p.edu} · {p.marital}
              </span>
            </span>
          </div>

          {/* Actions: icon on top, label below, primary action (Interest) filled */}
          <div className="relative z-30 mt-4 flex gap-2">
            {ACTIONS.map((action) => {
              const isPrimary = action.key === "interest";
              return (
                <button
                  key={action.label}
                  type="button"
                  disabled={actionLoading[action.key]}
                  onClick={(e) => handleAction(e, action)}
                  className={`flex flex-1 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl py-2.5 text-[11px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                    isPrimary
                      ? "bg-rose-600 text-white hover:bg-rose-700"
                      : "bg-white/15 text-white backdrop-blur hover:bg-white/25"
                  }`}
                >
                  {actionLoading[action.key] ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <action.icon size={16} />
                  )}
                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </Link>

      {upgradeOpen && (
        <UpgradeModal profile={p} onClose={() => setUpgradeOpen(false)} />
      )}
    </>
  );
}

const ProfilesCards = () => {
  const searchParams = useSearchParams();
  const [hiddenUserIds, setHiddenUserIds] = useState<Set<string>>(new Set());

  const { data: myProfileData, isLoading: myProfileLoading } =
    useGetMyProfileQuery();

  const myGender = myProfileData?.data?.basicDetails?.gender;
  const oppositeGender =
    myGender === "Male" ? "Female" : myGender === "Female" ? "Male" : undefined;

  const feedParams: ProfileFeedParams = useMemo(() => {
    const params: ProfileFeedParams = {};
    if (oppositeGender) params.gender = oppositeGender;

    FILTER_PARAM_KEYS.forEach((key) => {
      const value = searchParams.get(key);
      if (value) params[key] = value;
    });

    return params;
  }, [searchParams, oppositeGender]);

  const {
    data: feedData,
    isLoading: feedLoading,
    isError: feedError,
  } = useGetProfileFeedQuery(feedParams, { skip: !oppositeGender });

  const profiles = useMemo(
    () =>
      (feedData?.data ?? [])
        .map(toCardProfile)
        .filter((p) => !hiddenUserIds.has(p.userId)),
    [feedData, hiddenUserIds],
  );

  const handleHide = (userId: string) => {
    setHiddenUserIds((prev) => {
      const next = new Set(prev);
      next.add(userId);
      return next;
    });
  };

  const isLoading = myProfileLoading || feedLoading;
  // Skeleton for the redesigned ProfileCard — same shape/height so the grid
  // doesn't jump when real cards swap in.
  function ProfileCardSkeleton() {
    return (
      <div className="relative h-150 w-full animate-pulse overflow-hidden rounded-[28px] border border-stone-200 bg-stone-100 sm:h-160">
        {/* Photo area */}
        <div className="absolute inset-0 bg-stone-200" />

        {/* Top row: verified/status chip placeholders — photo count placeholder */}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3.5">
          <div className="h-7 w-24 rounded-full bg-stone-300/80" />
          <div className="h-7 w-12 rounded-full bg-stone-300/80" />
        </div>

        {/* Bottom block placeholders */}
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
          {/* Floating match-% circle placeholder */}
          <div className="absolute -top-7 right-4 h-16 w-16 rounded-full border-2 border-stone-100 bg-stone-300/80" />

          <div className="h-7 w-40 rounded-md bg-stone-300/80" />

          <div className="mt-2 flex gap-1.5">
            <div className="h-6 w-20 rounded-full bg-stone-300/70" />
            <div className="h-6 w-28 rounded-full bg-stone-300/70" />
            <div className="h-6 w-24 rounded-full bg-stone-300/70" />
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <div className="h-7 w-32 rounded-full bg-stone-300/70" />
            <div className="h-7 w-36 rounded-full bg-stone-300/70" />
            <div className="h-7 w-40 rounded-full bg-stone-300/70" />
          </div>

          <div className="mt-4 flex gap-2">
            <div className="h-14 flex-1 rounded-xl bg-stone-300/70" />
            <div className="h-14 flex-1 rounded-xl bg-stone-300/70" />
            <div className="h-14 flex-1 rounded-xl bg-stone-300/70" />
            <div className="h-14 flex-1 rounded-xl bg-stone-300/70" />
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProfileCardSkeleton key={i} />
        ))}
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProfileCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (feedError) {
    return (
      <div className="mt-5 rounded-2xl border border-stone-200 bg-white py-16 text-center text-sm text-rose-500">
        Unable to load profiles right now. Please try again.
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="mt-5 rounded-2xl border border-stone-200 bg-white py-16 text-center text-sm text-stone-400">
        No profiles found matching your filters.
      </div>
    );
  }

  return (
    <div className="mt-5 space-y-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
      <Toaster position="top-center" reverseOrder={false} />
      {profiles.map((p) => (
        <ProfileCard key={p.id} p={p} onHide={handleHide} />
      ))}
    </div>
  );
};

export default ProfilesCards;

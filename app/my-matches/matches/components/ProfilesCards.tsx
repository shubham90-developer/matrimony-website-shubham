"use client";

import ThemeBtnOne from "@/app/components/ThemeBtnOne";
import {
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Languages,
  Loader2,
  Mail,
  MessageCircle,
  Send,
  Sparkles,
  Star,
  User,
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

// Query params the Header's "Browse Profiles By" mega menu can set on
// /my-matches/matches. Forwarded to the feed API as-is under these keys —
// rename any of these once the real backend field names are confirmed.
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
    status: "Active Today",
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

interface ImageLightboxProps {
  images: string[];
  index: number;
  onClose: () => void;
  onChange: (index: number) => void;
}

function ImageLightbox({
  images,
  index,
  onClose,
  onChange,
}: ImageLightboxProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft")
        onChange((index - 1 + images.length) % images.length);
      if (e.key === "ArrowRight") onChange((index + 1) % images.length);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [index, images.length, onChange, onClose]);

  const goPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange((index - 1 + images.length) % images.length);
  };

  const goNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange((index + 1) % images.length);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex cursor-pointer items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            <X size={16} /> Close
          </button>
        </div>

        <div className="relative h-[70vh] w-full overflow-hidden rounded-2xl bg-slate-900 sm:h-[75vh]">
          <Image
            src={images[index]}
            alt={`photo ${index + 1}`}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 640px"
            priority
          />

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous photo"
                className="absolute left-3 cursor-pointer top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next photo"
                className="absolute right-3 cursor-pointer top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white">
            {index + 1} / {images.length}
          </span>
        </div>

        {images.length > 1 && (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {images.map((src, i) => (
              <button
                type="button"
                key={src + i}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(i);
                }}
                aria-label={`View photo ${i + 1}`}
                className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                  i === index
                    ? "border-rose-500"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={src}
                  alt={`thumb ${i + 1}`}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- Profile Card ---------------- */

function ProfileCard({
  p,
  onHide,
}: {
  p: Profile;
  onHide: (userId: string) => void;
}) {
  const router = useRouter();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
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

  const openLightbox = (e: React.MouseEvent) => {
    // Prevent the parent <Link> from navigating when the photo is clicked
    e.preventDefault();
    e.stopPropagation();
    setActiveIndex(0);
    setLightboxOpen(true);
  };

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
        className="block overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:shadow-lg"
      >
        {/* Card */}
        <div className="flex flex-col sm:flex-row">
          {/* Photo */}
          <button
            type="button"
            onClick={openLightbox}
            aria-label={`View ${p.name}'s photos`}
            className="group cursor-pointer relative h-72 w-full overflow-hidden bg-linear-to-b from-slate-700 to-slate-900 sm:h-56 sm:w-44 sm:shrink-0"
          >
            <Image
              src={images[0]}
              alt={p.name}
              fill
              sizes="(max-width:640px) 100vw, 176px"
              className="object-cover transition duration-300 group-hover:scale-105"
            />

            {images.length > 1 && (
              <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2 py-1 text-xs font-semibold text-white">
                +{images.length - 1}
              </span>
            )}
          </button>

          {/* Info */}
          <div className="relative min-w-0 flex-1 p-4 sm:p-5">
            {p.tag && (
              <span className="absolute right-4 top-4 flex items-center gap-1 rounded-md bg-stone-100 px-2.5 py-1 text-[11px] sm:text-xs font-bold italic text-slate-800">
                <Send size={12} />
                {p.tag}
              </span>
            )}

            <p
              className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium ${
                p.status === "Online"
                  ? "bg-emerald-100 text-emerald-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {p.status === "Online" && (
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              )}
              {p.status}
            </p>

            <h3 className="mt-2 font-serif text-xl font-bold text-slate-900 sm:text-2xl">
              {p.name}, {p.age}
            </h3>

            <p className="mt-2 text-sm text-stone-500 font-semibold">
              {p.height} • {p.city} • {p.community}
            </p>

            <div className="mt-3 space-y-2">
              <p className="flex items-start gap-2 text-sm text-stone-600 font-semibold">
                <User size={15} className="mt-0.5 shrink-0 text-stone-400" />
                <span className="wrap-break-word">
                  {p.job} • {p.income}
                </span>
              </p>

              <p className="flex items-start gap-2 text-sm text-stone-600 font-semibold">
                <GraduationCap
                  size={15}
                  className="mt-0.5 shrink-0 text-stone-400"
                />
                <span className="wrap-break-word">
                  {p.edu} • {p.marital}
                </span>
              </p>

              <p className="flex items-start gap-2 text-sm text-stone-600 font-semibold">
                <Languages
                  size={15}
                  className="mt-0.5 shrink-0 text-stone-400"
                />
                <span className="wrap-break-word">
                  {p.religion} • {p.caste} • {p.subcaste}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-4 divide-x divide-y divide-rose-200/60 bg-rose-50 text-rose-600 sm:grid-cols-4 sm:divide-y-0">
          {ACTIONS.map((action) => (
            <button
              key={action.label}
              type="button"
              disabled={actionLoading[action.key]}
              onClick={(e) => handleAction(e, action)}
              className="flex cursor-pointer items-center justify-center gap-2 py-3 text-xs font-semibold transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
            >
              {actionLoading[action.key] ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <action.icon size={16} />
              )}
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </Link>

      {lightboxOpen && (
        <ImageLightbox
          images={images}
          index={activeIndex}
          onChange={setActiveIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}

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

  if (isLoading) {
    return (
      <div className="mt-5 flex items-center justify-center gap-2 rounded-2xl border border-stone-200 bg-white py-16 text-sm text-stone-500">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading profiles...
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
    <div className="mt-5 space-y-5">
      <Toaster position="top-center" reverseOrder={false} />
      {profiles.map((p) => (
        <ProfileCard key={p.id} p={p} onHide={handleHide} />
      ))}
    </div>
  );
};

export default ProfilesCards;

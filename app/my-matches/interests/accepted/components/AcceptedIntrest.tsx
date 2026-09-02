"use client";

import Slider from "react-slick";
import { ArrowLeft, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  useGetReceivedInterestsQuery,
  useWithdrawInterestMutation,
  type InterestEntry,
} from "@/Redux/interestApi";
import type { Profile as ApiProfile } from "@/Redux/profileApi";

// Only status rendered on this page — this page shows Accepted only.
type Status = "accepted";

interface CardProfile {
  id: string;
  name: string;
  age: number;
  location: string;
  image: string;
  meta?: string; // e.g. "2 days ago"
}

const STATUS_CONFIG: Record<Status, { label: string; badgeClass: string }> = {
  accepted: { label: "Accepted", badgeClass: "bg-emerald-500/90" },
};

const STATUS_ACTIONS: Record<Status, { primary: string; secondary: string }> = {
  accepted: { primary: "Chat", secondary: "Cancel" },
};

// ---------- Helpers: map API data -> CardProfile shape the UI expects ----------
function timeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
}

function toCardProfile(
  entry: InterestEntry,
  other: ApiProfile | undefined,
): CardProfile {
  return {
    id: entry._id,
    name: other
      ? `${other.basicDetails.firstName} ${other.basicDetails.lastName}`
      : "Unknown",
    age: other?.basicDetails.age ?? 0,
    location: other?.locationDetails.city ?? "",
    image: other?.photos?.[0] || "/img/matches/1.jpg",
    meta: timeAgo(entry.createdAt),
  };
}

function NextArrow({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Next"
      className="absolute right-0 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 translate-x-1/2 cursor-pointer items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 shadow-sm hover:text-stone-800"
    >
      <ChevronRight size={16} />
    </button>
  );
}

function PrevArrow({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Previous"
      className="absolute left-0 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 -translate-x-1/2 cursor-pointer items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 shadow-sm hover:text-stone-800"
    >
      <ChevronLeft size={16} />
    </button>
  );
}

const SLIDER_SETTINGS = {
  infinite: false,
  speed: 300,
  slidesToShow: 5,
  slidesToScroll: 1,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  responsive: [
    { breakpoint: 1280, settings: { slidesToShow: 4, slidesToScroll: 1 } },
    { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 1 } },
    { breakpoint: 640, settings: { slidesToShow: 1, arrows: false } },
  ],
};

function ProfileCard({
  profile,
  status,
  onPrimaryAction,
  onSecondaryAction,
}: {
  profile: CardProfile;
  status: Status;
  onPrimaryAction?: (id: string) => void;
  onSecondaryAction?: (id: string) => void;
}) {
  const { label, badgeClass } = STATUS_CONFIG[status];
  const { primary, secondary } = STATUS_ACTIONS[status];

  return (
    <div className="px-1.5">
      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white transition hover:shadow-md">
        <Link href="/my-matches/details">
          <div className="relative aspect-3/4 cursor-pointer">
            <Image
              src={profile.image}
              alt={profile.name}
              fill
              className="h-full w-full object-cover"
            />

            <span
              className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold text-white ${badgeClass}`}
            >
              {label}
            </span>
          </div>

          <div className="p-2.5 pb-3">
            <p className="truncate text-sm font-semibold text-slate-900">
              {profile.name}, {profile.age}
            </p>

            <p className="mt-1 flex items-center gap-1 truncate text-xs text-stone-500">
              <MapPin size={11} />
              {profile.location}
            </p>

            {profile.meta && (
              <p className="mt-1 truncate text-[11px] text-stone-400">
                {profile.meta}
              </p>
            )}
          </div>
        </Link>

        <div className="flex gap-2 border-t border-stone-100 p-2.5">
          <button
            type="button"
            onClick={() => onPrimaryAction?.(profile.id)}
            className="flex-1 rounded-lg bg-rose-600 py-2 text-xs font-semibold text-white transition hover:bg-rose-700"
          >
            {primary}
          </button>

          <button
            type="button"
            onClick={() => onSecondaryAction?.(profile.id)}
            className="flex-1 rounded-lg bg-stone-100 py-2 text-xs font-semibold text-stone-700 transition hover:bg-stone-200"
          >
            {secondary}
          </button>
        </div>
      </div>
    </div>
  );
}

function ActivitySection({
  title,
  profiles,
  status,
  onPrimaryAction,
  onSecondaryAction,
}: {
  title: string;
  profiles: CardProfile[];
  status: Status;
  onPrimaryAction?: (id: string) => void;
  onSecondaryAction?: (id: string) => void;
}) {
  if (profiles.length === 0) {
    return (
      <div className="mb-8">
        <h3 className="mb-3 text-[15px] font-semibold text-slate-900">
          {title}
        </h3>
        <p className="rounded-xl border border-dashed border-stone-200 py-6 text-center text-sm text-stone-400">
          Nothing here yet
        </p>
      </div>
    );
  }

  return (
    <div className="border-b border-dashed border-gray-500 py-5">
      <h3 className="mb-4 font-serif text-xl font-semibold text-slate-900">
        {title}
      </h3>
      <div className="relative">
        <Slider {...SLIDER_SETTINGS}>
          {profiles.map((p) => (
            <ProfileCard
              key={p.id}
              profile={p}
              status={status}
              onPrimaryAction={onPrimaryAction}
              onSecondaryAction={onSecondaryAction}
            />
          ))}
        </Slider>
      </div>
    </div>
  );
}

function PageHeader({
  title,
  subtitle,
  imageSrc,
  imageAlt,
}: {
  title: string;
  subtitle: string;
  imageSrc: string;
  imageAlt: string;
}) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between gap-4 pb-2">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Go back"
          className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-stone-200 bg-white text-stone-600 transition hover:bg-stone-50 hover:text-stone-900"
        >
          <ArrowLeft size={18} />
        </button>

        <div>
          <h1 className="text-xl font-bold text-slate-900">{title}</h1>
          <p className="mt-0.5 text-sm text-stone-500">{subtitle}</p>
        </div>
      </div>

      <div className="relative h-12 w-12 shrink-0 overflow-hidden">
        <Image src={imageSrc} alt={imageAlt} fill className="object-cover" />
      </div>
    </div>
  );
}

export default function ActivityProfiles() {
  const router = useRouter();

  const { data: receivedData } = useGetReceivedInterestsQuery();
  const [withdrawInterest] = useWithdrawInterestMutation();

  const received = receivedData?.data ?? [];

  const acceptedProfiles: CardProfile[] = received
    .filter((i) => i.status === "Accepted")
    .map((e) => toCardProfile(e, e.senderId));

  const handleChat = (interestId: string) => {
    router.push(`/my-matches/details?interestId=${interestId}`);
  };

  const handleCancel = (interestId: string) => {
    withdrawInterest(interestId);
  };

  return (
    <div className="space-y-8 border border-gray-200 p-3">
      <PageHeader
        title="Accepted Profiles"
        subtitle={`${acceptedProfiles.length} profiles you're connected with`}
        imageSrc="/img/logo/2.png"
        imageAlt="App logo"
      />

      <ActivitySection
        title="Accepted Profiles"
        profiles={acceptedProfiles}
        status="accepted"
        onPrimaryAction={handleChat}
        onSecondaryAction={handleCancel}
      />
    </div>
  );
}

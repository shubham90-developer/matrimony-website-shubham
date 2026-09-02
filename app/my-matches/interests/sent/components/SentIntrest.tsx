"use client";

import Slider from "react-slick";
import { ArrowLeft, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  useGetSentInterestsQuery,
  useWithdrawInterestMutation,
  type InterestEntry,
} from "@/Redux/interestApi";
import type { Profile as ApiProfile } from "@/Redux/profileApi";

// Only status rendered on this page — this page shows Sent only.
type Status = "sent";

interface CardProfile {
  id: string;
  name: string;
  age: number;
  location: string;
  image: string;
  meta?: string; // e.g. "Sent 2 days ago"
}

const STATUS_CONFIG: Record<Status, { label: string; badgeClass: string }> = {
  sent: { label: "Pending", badgeClass: "bg-amber-500/90" },
};

// A sent interest can only be withdrawn — there's no secondary action.
const STATUS_ACTIONS: Record<Status, { primary: string }> = {
  sent: { primary: "Cancel" },
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
  metaPrefix?: string,
): CardProfile {
  return {
    id: entry._id,
    name: other
      ? `${other.basicDetails.firstName} ${other.basicDetails.lastName}`
      : "Unknown",
    age: other?.basicDetails.age ?? 0,
    location: other?.locationDetails.city ?? "",
    image: other?.photos?.[0] || "/img/matches/1.jpg",
    meta: metaPrefix
      ? `${metaPrefix} ${timeAgo(entry.createdAt)}`
      : timeAgo(entry.createdAt),
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
}: {
  profile: CardProfile;
  status: Status;
  onPrimaryAction?: (id: string) => void;
}) {
  const { label, badgeClass } = STATUS_CONFIG[status];
  const { primary } = STATUS_ACTIONS[status];

  const handlePrimary = (e: React.MouseEvent) => {
    // keep the button from triggering the parent <Link> navigation
    e.preventDefault();
    e.stopPropagation();
    onPrimaryAction?.(profile.id);
  };

  return (
    <Link
      href="/my-matches/details"
      className="group relative block aspect-3/4 w-full overflow-hidden rounded-2xl border border-stone-200/70 bg-stone-900 shadow-[0_1px_2px_rgba(60,40,30,0.06),0_14px_28px_-18px_rgba(60,40,30,0.4)] transition-shadow duration-300 hover:shadow-[0_1px_2px_rgba(60,40,30,0.08),0_22px_38px_-18px_rgba(60,40,30,0.5)]"
    >
      {/* Photo fills the entire card as the background */}
      <Image
        src={profile.image}
        alt={profile.name}
        fill
        sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
        className="absolute inset-0 z-0 object-cover transition duration-500 group-hover:scale-105"
      />

      {/* Scrim: subtle at top so the badge stays legible, strong at bottom for text */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-linear-to-t from-black/85 via-black/25 to-black/0" />

      {/* Status badge, top-left */}
      <span
        className={`absolute left-1.5 top-1.5 z-20 rounded-full px-2 py-0.5 text-[9px] font-semibold text-white xs:left-2 xs:top-2 xs:px-2.5 xs:py-1 xs:text-[10px] ${badgeClass}`}
      >
        {label}
      </span>

      {/* Bottom overlaid info + action button */}
      <div className="absolute inset-x-0 bottom-0 z-20 p-2 xs:p-2.5 sm:p-3">
        <p className="truncate text-xs font-semibold text-white xs:text-sm">
          {profile.name}, {profile.age}
        </p>

        <p className="mt-0.5 flex items-center gap-1 truncate text-[10px] text-white/80 xs:text-xs">
          <MapPin size={10} className="shrink-0 xs:size-[11px]" />
          <span className="truncate">{profile.location}</span>
        </p>

        {profile.meta && (
          <p className="mt-0.5 truncate text-[9px] text-white/60 xs:text-[11px]">
            {profile.meta}
          </p>
        )}

        <button
          type="button"
          onClick={handlePrimary}
          className="relative z-30 mt-2 w-full cursor-pointer rounded-lg bg-white/15 py-1.5 text-[10px] font-semibold text-white backdrop-blur transition hover:bg-white/25 xs:mt-2.5 xs:py-2 xs:text-xs"
        >
          {primary}
        </button>
      </div>
    </Link>
  );
}

function ActivitySection({
  title,
  profiles,
  status,
  onPrimaryAction,
}: {
  title: string;
  profiles: CardProfile[];
  status: Status;
  onPrimaryAction?: (id: string) => void;
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

export default function SentInterests() {
  const { data: sentData } = useGetSentInterestsQuery();
  const [withdrawInterest] = useWithdrawInterestMutation();

  const sent = sentData?.data ?? [];

  const sentProfiles: CardProfile[] = sent
    .filter((i) => i.status === "Pending")
    .map((e) => toCardProfile(e, e.receiverId, "Sent"));

  const handleCancel = (interestId: string) => {
    withdrawInterest(interestId);
  };

  return (
    <div className="space-y-8 border border-gray-200 p-3">
      <PageHeader
        title="Sent Interests"
        subtitle={`${sentProfiles.length} interests waiting for a response`}
        imageSrc="/img/logo/2.png"
        imageAlt="App logo"
      />

      <ActivitySection
        title=""
        profiles={sentProfiles}
        status="sent"
        onPrimaryAction={handleCancel}
      />
    </div>
  );
}

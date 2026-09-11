"use client";

import { ArrowLeft, MapPin, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  useGetProfileVisitorsQuery,
  type ProfileVisitEntry,
  type VisitProfileSummary,
} from "@/Redux/profileVisitsApi";

type Status = "visitor";

interface CardProfile {
  id: string;
  name: string;
  age: number;
  location: string;
  image: string;
  meta?: string; // e.g. "2 days ago"
}

const STATUS_CONFIG: Record<Status, { label: string; badgeClass: string }> = {
  visitor: { label: "Visited", badgeClass: "bg-blue-500/90" },
};

const FALLBACK_IMAGE = "/img/profile/1.jpg";

// Turns an ISO timestamp into a short relative label like "2 days ago".
const timeAgo = (isoDate: string): string => {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;

  const diffMonths = Math.floor(diffDays / 30);
  return `${diffMonths}mo ago`;
};

// The `viewerProfileId` field on a visit entry may come back as the full
// populated summary (basicDetails/locationDetails/etc.) or, in edge cases,
// as a plain string id. Normalize both so we never hand a raw object to JSX.
const toCardProfile = (entry: ProfileVisitEntry): CardProfile | null => {
  const viewer = entry.viewerProfileId;

  if (typeof viewer === "string") {
    // No populated profile data to show — skip rather than render a blank card.
    return null;
  }

  const summary = viewer as VisitProfileSummary;
  const basic = summary.basicDetails;
  const location = summary.locationDetails;

  return {
    id: summary._id,
    name:
      `${basic?.firstName ?? ""} ${basic?.lastName ?? ""}`.trim() || "Unknown",
    age: 0,
    location: [location?.city, location?.state].filter(Boolean).join(", "),
    image: summary.photos?.[0] || FALLBACK_IMAGE,
    meta: entry.createdAt ? timeAgo(entry.createdAt) : undefined,
  };
};

function ProfileCard({
  profile,
  status,
}: {
  profile: CardProfile;
  status: Status;
}) {
  const { label, badgeClass } = STATUS_CONFIG[status];

  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white transition hover:shadow-md">
      <Link href={`/my-matches/details?id=${encodeURIComponent(profile.id)}`}>
        <div className="relative aspect-3/4 cursor-pointer">
          <Image
            src={profile.image}
            alt={profile.name}
            fill
            sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
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
            {profile.name}
            {profile.age ? `, ${profile.age}` : ""}
          </p>

          {profile.location && (
            <p className="mt-1 flex items-center gap-1 truncate text-xs text-stone-500">
              <MapPin size={11} />
              {profile.location}
            </p>
          )}

          {profile.meta && (
            <p className="mt-1 truncate text-[11px] text-stone-400">
              {profile.meta}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
}

function ActivitySection({
  title,
  profiles,
  status,
  isLoading,
  isError,
}: {
  title: string;
  profiles: CardProfile[];
  status: Status;
  isLoading: boolean;
  isError: boolean;
}) {
  if (isLoading) {
    return (
      <div className="mb-8">
        {title && (
          <h3 className="mb-3 text-[15px] font-semibold text-slate-900">
            {title}
          </h3>
        )}
        <div className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-stone-200 py-10 text-sm text-stone-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading visitors...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mb-8">
        {title && (
          <h3 className="mb-3 text-[15px] font-semibold text-slate-900">
            {title}
          </h3>
        )}
        <p className="rounded-xl border border-dashed border-rose-200 py-6 text-center text-sm text-rose-500">
          Unable to load visitors. Please try again.
        </p>
      </div>
    );
  }

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
      {title && (
        <h3 className="mb-4 font-serif text-xl font-semibold text-slate-900">
          {title}
        </h3>
      )}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {profiles.map((p) => (
          <ProfileCard key={p.id} profile={p} status={status} />
        ))}
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

export default function ProfileVisitors() {
  const { data, isLoading, isError } = useGetProfileVisitorsQuery();

  const visitors = (data?.data ?? [])
    .map(toCardProfile)
    .filter((p): p is CardProfile => p !== null);

  return (
    <div className="space-y-8 border border-gray-200 p-3">
      <PageHeader
        title="Profile Visitors"
        subtitle={
          isLoading
            ? "Loading..."
            : `${visitors.length} people viewed your profile`
        }
        imageSrc="/img/logo/2.png"
        imageAlt="App logo"
      />

      <ActivitySection
        title=""
        profiles={visitors}
        status="visitor"
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
}

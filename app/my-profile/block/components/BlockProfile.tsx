"use client";

import {
  ChevronLeft,
  MapPin,
  Briefcase,
  Ruler,
  HeartOff,
  Unlock,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import {
  useGetMyIgnoredProfilesQuery,
  useRemoveFromIgnoreMutation,
  type IgnoreEntry,
} from "@/Redux/ignoreApi";

const FALLBACK_IMAGE = "/img/matches/1.jpg";

interface CardProfile {
  ignoreId: string;
  id: string;
  name: string;
  age: number;
  height: string;
  location: string;
  profession: string;
  image: string;
}

const toCardProfile = (entry: IgnoreEntry): CardProfile => {
  // `entry.profile` may be missing on some API responses; in that case
  // `entry.ignoredUserId` itself comes back populated with the same
  // shape (basicDetails, photos, matrimonyId, etc.) instead of being a
  // plain string id. Normalize both cases here so we never hand a raw
  // object to JSX.
  const rawUser =
    entry.profile ??
    (typeof entry.ignoredUserId === "object"
      ? (entry.ignoredUserId as unknown as IgnoreEntry["profile"])
      : undefined);

  const basic = rawUser?.basicDetails;
  const career = rawUser?.careerDetails;
  const edu = rawUser?.educationDetails;

  const fallbackId =
    typeof entry.ignoredUserId === "string" ? entry.ignoredUserId : "";

  return {
    ignoreId: entry._id,
    id: rawUser?.matrimonyId || fallbackId || "N/A",
    name:
      `${basic?.firstName ?? ""} ${basic?.lastName ?? ""}`.trim() || "Unknown",
    age: basic?.age ?? 0,
    height: basic?.height ?? "",
    location: rawUser?.locationDetails?.city ?? "",
    profession: career?.occupation || edu?.occupation || "",
    image: rawUser?.photos?.[0] || FALLBACK_IMAGE,
  };
};

const ProfileCard = ({
  profile,
  onUnblocked,
}: {
  profile: CardProfile;
  onUnblocked: (ignoreId: string) => void;
}) => {
  const [removeFromIgnore, { isLoading: unblocking }] =
    useRemoveFromIgnoreMutation();

  const handleUnblock = async (e: React.MouseEvent) => {
    // keep the button from triggering the parent <Link> navigation
    e.preventDefault();
    e.stopPropagation();
    if (unblocking) return;

    try {
      await removeFromIgnore(profile.ignoreId).unwrap();
      toast.success(`${profile.name} unblocked`);
      onUnblocked(profile.ignoreId);
    } catch (err) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ||
        "Couldn't unblock this profile. Please try again.";
      toast.error(message);
    }
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

      {/* Blocked badge, top-left */}
      <span className="absolute left-1.5 top-1.5 z-20 rounded-full bg-rose-500/90 px-2 py-0.5 text-[9px] font-semibold text-white xs:left-2 xs:top-2 xs:px-2.5 xs:py-1 xs:text-[10px]">
        Blocked
      </span>

      {/* Bottom overlaid info + unblock button */}
      <div className="absolute inset-x-0 bottom-0 z-20 p-2 xs:p-2.5 sm:p-3">
        <p className="truncate text-xs font-semibold text-white xs:text-sm">
          {profile.name}, {profile.age}
        </p>

        <p className="mt-0.5 flex items-center gap-1 truncate text-[10px] text-white/80 xs:text-xs">
          <MapPin size={10} className="shrink-0 xs:size-[11px]" />
          <span className="truncate">{profile.location}</span>
        </p>

        {profile.profession && (
          <p className="mt-0.5 flex items-center gap-1 truncate text-[10px] text-white/80 xs:text-xs">
            <Briefcase size={10} className="shrink-0 xs:size-[11px]" />
            <span className="truncate">{profile.profession}</span>
          </p>
        )}

        <p className="mt-0.5 flex items-center gap-2 truncate text-[9px] text-white/60 xs:text-[11px]">
          {profile.height && (
            <span className="flex items-center gap-1">
              <Ruler size={10} className="shrink-0" />
              {profile.height}
            </span>
          )}
          <span className="truncate">ID - {profile.id}</span>
        </p>

        <button
          type="button"
          onClick={handleUnblock}
          disabled={unblocking}
          className="relative z-30 mt-2 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-white/15 py-1.5 text-[10px] font-semibold text-white backdrop-blur transition hover:bg-white/25 disabled:cursor-not-allowed disabled:opacity-50 xs:mt-2.5 xs:py-2 xs:text-xs"
        >
          {unblocking ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <Unlock size={13} />
          )}
          {unblocking ? "Unblocking..." : "Unblock"}
        </button>
      </div>
    </Link>
  );
};

const EmptyState = () => (
  <div className="flex flex-col items-center gap-3 py-10 text-center">
    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-300">
      <HeartOff size={24} />
    </div>
    <p className="font-serif text-base font-semibold text-slate-900">
      No blocked profiles yet
    </p>
    <p className="max-w-xs text-sm text-gray-400">
      Profiles you block will show up here so you can review or unblock them
      later.
    </p>

    <Link href="/matches">Browse matches</Link>
  </div>
);

const BlockProfile = () => {
  const { data, isLoading, isError } = useGetMyIgnoredProfilesQuery();

  const blocked = (data?.data ?? []).map(toCardProfile);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="rounded-xl border border-gray-200 p-4">
        <div className="relative mb-4 flex items-center justify-center border-b border-dashed border-gray-200 py-3">
          <Link
            href="/my-matches/activity"
            className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:bg-slate-100"
            aria-label="Go back"
          >
            <ChevronLeft size={20} />
          </Link>
          <h3 className="font-serif text-xl font-semibold text-slate-900">
            Block Profiles
          </h3>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-stone-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading blocked profiles...
          </div>
        ) : isError ? (
          <div className="py-16 text-center text-sm text-rose-500">
            Unable to load blocked profiles. Please try again.
          </div>
        ) : blocked.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {blocked.map((profile) => (
              <ProfileCard
                key={profile.ignoreId}
                profile={profile}
                onUnblocked={() => {}}
              />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </>
  );
};

export default BlockProfile;

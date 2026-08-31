"use client";

import {
  ChevronLeft,
  MapPin,
  Briefcase,
  Ruler,
  HeartOff,
  Eye,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import {
  useGetMyShortlistQuery,
  useRemoveFromShortlistMutation,
  type ShortlistEntry,
} from "@/Redux/shortlistApi";

const FALLBACK_IMAGE = "/img/matches/1.jpg";

interface RowProfile {
  shortlistId: string;
  id: string;
  name: string;
  age: number;
  height: string;
  location: string;
  profession: string;
  image: string;
}

const toRowProfile = (entry: ShortlistEntry): RowProfile => {
  const p = entry.profile;
  const basic = p?.basicDetails;
  const career = p?.careerDetails;
  const edu = p?.educationDetails;

  return {
    shortlistId: entry._id,
    id: p?.matrimonyId || entry.shortlistedUserId,
    name:
      `${basic?.firstName ?? ""} ${basic?.lastName ?? ""}`.trim() || "Unknown",
    age: basic?.age ?? 0,
    height: basic?.height ?? "",
    location: p?.locationDetails?.city ?? "",
    profession: career?.occupation || edu?.occupation || "",
    image: p?.photos?.[0] || FALLBACK_IMAGE,
  };
};

const ProfileRow = ({
  profile,
  onRemoved,
}: {
  profile: RowProfile;
  onRemoved: (shortlistId: string) => void;
}) => {
  const [removeFromShortlist, { isLoading: removing }] =
    useRemoveFromShortlistMutation();

  const handleRemove = async () => {
    if (removing) return;
    try {
      await removeFromShortlist(profile.shortlistId).unwrap();
      toast.success(`${profile.name} removed from shortlist`);
      onRemoved(profile.shortlistId);
    } catch (err) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ||
        "Couldn't remove from shortlist. Please try again.";
      toast.error(message);
    }
  };

  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-200 p-3">
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border border-stone-200">
        <Image
          src={profile.image}
          alt="Profile"
          width={56}
          height={56}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className="truncate font-serif text-base font-semibold text-slate-900">
            {profile.name}
          </p>
          <span className="shrink-0 text-xs text-gray-400">
            {profile.age} yrs
          </span>
        </div>
        <p className="text-xs text-gray-400">ID - {profile.id}</p>

        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-600">
          <span className="flex items-center gap-1">
            <Ruler size={12} className="text-slate-400" />
            {profile.height}
          </span>
          <span className="flex items-center gap-1">
            <Briefcase size={12} className="text-slate-400" />
            {profile.profession}
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={12} className="text-slate-400" />
            {profile.location}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-center gap-2">
        <Link
          href={`/my-matches/details`}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-100"
          aria-label={`View ${profile.name}'s profile`}
        >
          <Eye size={16} />
        </Link>
        <button
          type="button"
          onClick={handleRemove}
          disabled={removing}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-rose-100 text-rose-400 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={`Remove ${profile.name} from shortlist`}
        >
          {removing ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <HeartOff size={16} />
          )}
        </button>
      </div>
    </div>
  );
};

const EmptyState = () => (
  <div className="flex flex-col items-center gap-3 py-10 text-center">
    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-300">
      <HeartOff size={24} />
    </div>
    <p className="font-serif text-base font-semibold text-slate-900">
      No shortlisted profiles yet
    </p>
    <p className="max-w-xs text-sm text-gray-400">
      Profiles you shortlist will show up here so you can compare and reach out
      to them later.
    </p>

    <Link href="/matches">Browse matches</Link>
  </div>
);

const ShortlistProfile = () => {
  const { data, isLoading, isError } = useGetMyShortlistQuery();

  const shortlisted = (data?.data ?? []).map(toRowProfile);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="rounded-xl border border-gray-200 p-4">
        <div className="relative mb-4 flex items-center justify-center border-b border-dashed border-gray-200 py-3">
          <Link
            href="/my-profile"
            className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:bg-slate-100"
            aria-label="Go back"
          >
            <ChevronLeft size={20} />
          </Link>
          <h3 className="font-serif text-xl font-semibold text-slate-900">
            Shortlisted Profiles
          </h3>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-stone-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading shortlisted profiles...
          </div>
        ) : isError ? (
          <div className="py-16 text-center text-sm text-rose-500">
            Unable to load shortlisted profiles. Please try again.
          </div>
        ) : shortlisted.length > 0 ? (
          <div className="flex flex-col gap-3">
            {shortlisted.map((profile) => (
              <ProfileRow
                key={profile.shortlistId}
                profile={profile}
                onRemoved={() => {}}
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

export default ShortlistProfile;

/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChevronLeft,
  MapPin,
  Briefcase,
  Ruler,
  HeartOff,
  Eye,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Placeholder data - swap for your API/query result.
const shortlisted = [
  {
    id: "UXZ48213",
    name: "Aarav Deshmukh",
    age: 29,
    height: "5'9\"",
    location: "Pune, Maharashtra",
    profession: "UX Professional",
  },
  {
    id: "UXZ39871",
    name: "Rohan Kulkarni",
    age: 31,
    height: "5'11\"",
    location: "Mumbai, Maharashtra",
    profession: "Software Engineer",
  },
  {
    id: "UXZ55120",
    name: "Devendra Patil",
    age: 28,
    height: "5'8\"",
    location: "Nashik, Maharashtra",
    profession: "Chartered Accountant",
  },
];

const ProfileRow = ({ profile }: { profile: any }) => (
  <div className="flex items-center gap-3 rounded-xl border border-gray-200 p-3">
    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border border-stone-200">
      <Image
        src="/img/matches/1.jpg"
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
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-rose-100 text-rose-400 transition hover:bg-rose-50"
        aria-label={`Remove ${profile.name} from shortlist`}
      >
        <HeartOff size={16} />
      </button>
    </div>
  </div>
);

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
  return (
    <>
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

        {shortlisted.length > 0 ? (
          <div className="flex flex-col gap-3">
            {shortlisted.map((profile) => (
              <ProfileRow key={profile.id} profile={profile} />
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

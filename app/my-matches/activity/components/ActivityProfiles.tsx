"use client";

import Slider from "react-slick";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";
import Image from "next/image";

type Status = "accepted" | "received" | "visitor" | "sent";

interface Profile {
  id: string;
  name: string;
  age: number;
  location: string;
  image: string;
  meta?: string; // e.g. "2 days ago"
}

const STATUS_CONFIG: Record<Status, { label: string; badgeClass: string }> = {
  accepted: { label: "Accepted", badgeClass: "bg-emerald-500/90" },
  received: { label: "Interested", badgeClass: "bg-rose-500/90" },
  visitor: { label: "Visited", badgeClass: "bg-blue-500/90" },
  sent: { label: "Pending", badgeClass: "bg-amber-500/90" },
};

const ACCEPTED: Profile[] = [
  {
    id: "a1",
    name: "Kalpita",
    age: 28,
    location: "Pune",
    image: "/img/matches/1.jpg",
  },
  {
    id: "a2",
    name: "Divya",
    age: 25,
    location: "Mumbai",
    image: "/img/matches/1.jpg",
  },
  {
    id: "a3",
    name: "Purva",
    age: 28,
    location: "Nagpur",
    image: "/img/matches/1.jpg",
  },
  {
    id: "a4",
    name: "Aishwarya",
    age: 27,
    location: "Solapur",
    image: "/img/matches/1.jpg",
  },
];

const RECEIVED: Profile[] = [
  {
    id: "r1",
    name: "Rohan",
    age: 30,
    location: "Pune",
    image: "/img/matches/1.jpg",
    meta: "Yesterday",
  },
  {
    id: "r2",
    name: "Amit",
    age: 29,
    location: "Nashik",
    image: "/img/matches/1.jpg",
    meta: "2 days ago",
  },
];

const VISITORS: Profile[] = [
  {
    id: "v1",
    name: "Sneha",
    age: 26,
    location: "Pune",
    image: "/img/matches/1.jpg",
    meta: "Today",
  },
  {
    id: "v2",
    name: "Priya",
    age: 27,
    location: "Thane",
    image: "/img/matches/1.jpg",
    meta: "3 days ago",
  },
  {
    id: "v3",
    name: "Neha",
    age: 25,
    location: "Kolhapur",
    image: "/img/matches/1.jpg",
    meta: "1 week ago",
  },
];

const SENT: Profile[] = [
  {
    id: "s1",
    name: "Varun",
    age: 31,
    location: "Pune",
    image: "/img/matches/1.jpg",
    meta: "Sent 3 days ago",
  },
];

function NextArrow({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute right-0 cursor-pointer top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 shadow-sm hover:text-stone-800"
    >
      <ChevronRight size={16} />
    </button>
  );
}

function PrevArrow({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute left-0 cursor-pointer top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 -translate-x-1/2 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 shadow-sm hover:text-stone-800"
    >
      <ChevronLeft size={16} />
    </button>
  );
}

const SLIDER_SETTINGS = {
  infinite: false,
  speed: 300,
  slidesToShow: 5,
  slidesToScroll: 2,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 3.3 } },
    { breakpoint: 640, settings: { slidesToShow: 1, arrows: false } },
  ],
};

function ProfileCard({
  profile,
  status,
  onPrimaryAction,
  onSecondaryAction,
}: {
  profile: Profile;
  status: Status;
  onPrimaryAction?: (id: string) => void;
  onSecondaryAction?: (id: string) => void;
}) {
  const { label, badgeClass } = STATUS_CONFIG[status];

  const actions: Record<Status, { primary?: string; secondary?: string }> = {
    accepted: { primary: "Chat", secondary: "Cancel" },
    received: { primary: "Accept", secondary: "Decline" },
    visitor: {},
    sent: {},
  };
  const { primary, secondary } = actions[status];

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

        {(primary || secondary) && (
          <div className="flex gap-2 border-t border-stone-100 p-2.5">
            {primary && (
              <button
                type="button"
                onClick={() => onPrimaryAction?.(profile.id)}
                className={`flex-1 rounded-lg py-2 text-xs font-semibold text-white transition ${
                  status === "accepted"
                    ? "bg-rose-600 hover:bg-rose-700"
                    : "bg-emerald-500 hover:bg-emerald-600"
                }`}
              >
                {primary}
              </button>
            )}

            {secondary && (
              <button
                type="button"
                onClick={() => onSecondaryAction?.(profile.id)}
                className="flex-1 rounded-lg bg-stone-100 py-2 text-xs font-semibold text-stone-700 transition hover:bg-stone-200"
              >
                {secondary}
              </button>
            )}
          </div>
        )}
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
  profiles: Profile[];
  status: Status;
  onPrimaryAction?: (id: string) => void;
  onSecondaryAction?: (id: string) => void;
}) {
  if (profiles.length === 0) {
    return (
      <div className="mb-8">
        <h3 className="mb-3 text-[15px] font-semibold text-slate-900 ">
          {title}
        </h3>
        <p className="rounded-xl border border-dashed border-stone-200 py-6 text-center text-sm text-stone-400">
          Nothing here yet
        </p>
      </div>
    );
  }

  return (
    <div className="mb-0 border-b border-dashed border-gray-500 py-5">
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="text-xl font-semibold text-slate-900 font-serif mb-4">
          {title}
        </h3>
      </div>
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

export default function ActivityProfiles() {
  const handleChat = (id: string) => console.log("open chat with", id);
  const handleCancel = (id: string) => console.log("cancel acceptance", id);
  const handleAccept = (id: string) => console.log("accept interest from", id);
  const handleDecline = (id: string) =>
    console.log("decline interest from", id);

  return (
    <div className="space-y-8 border p-3 border-gray-200">
      <ActivitySection
        title="Accepted Profiles"
        profiles={ACCEPTED}
        status="accepted"
        onPrimaryAction={handleChat}
        onSecondaryAction={handleCancel}
      />
      <ActivitySection
        title="Interests Received"
        profiles={RECEIVED}
        status="received"
        onPrimaryAction={handleAccept}
        onSecondaryAction={handleDecline}
      />
      <ActivitySection
        title="Profile Visitors"
        profiles={VISITORS}
        status="visitor"
      />
      <ActivitySection title="Interests Sent" profiles={SENT} status="sent" />
    </div>
  );
}

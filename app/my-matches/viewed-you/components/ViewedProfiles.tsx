"use client";

import Slider from "react-slick";
import { ArrowLeft, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Only status rendered on this page — this page shows Visitors only.
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

// Visitors are view-only — there's no accept/decline/withdraw action to take.
// No /profile/visitors endpoint exists yet in the backend, so this list stays
// empty until that API is available.
const VISITORS: CardProfile[] = [];

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
}: {
  profile: CardProfile;
  status: Status;
}) {
  const { label, badgeClass } = STATUS_CONFIG[status];

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
      </div>
    </div>
  );
}

function ActivitySection({
  title,
  profiles,
  status,
}: {
  title: string;
  profiles: CardProfile[];
  status: Status;
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
            <ProfileCard key={p.id} profile={p} status={status} />
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

export default function ProfileVisitors() {
  return (
    <div className="space-y-8 border border-gray-200 p-3">
      <PageHeader
        title="Profile Visitors"
        subtitle={`${VISITORS.length} people viewed your profile`}
        imageSrc="/img/logo/2.png"
        imageAlt="App logo"
      />

      <ActivitySection title="" profiles={VISITORS} status="visitor" />
    </div>
  );
}

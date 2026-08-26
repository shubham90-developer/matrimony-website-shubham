"use client";

import { useState } from "react";
import { Phone, Video, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Person = {
  name: string;
  meta?: string; // height • community • location
  last?: string;
  time: string;
  unread?: boolean;
  image?: string | null;
};

const ACCEPTANCES: Person[] = [
  {
    name: "Kalpita Velip, 28",
    meta: "5' 5\" • Others • Pune/ Chinchwad",
    time: "Yesterday",
    unread: true,
    image: "/img/matches/1.jpg",
  },
  { name: "TSUX5631", last: "okay", time: "01/07/2026", image: null },
  {
    name: "Divya Manohar Mohite, 25",
    last: "hii",
    time: "28/06/2026",
    image: "/img/matches/2.jpg",
  },
  {
    name: "TURT2081, 25",
    last: "then ill send me details",
    time: "08/06/2026",
    image: "/img/matches/3.jpg",
  },
  {
    name: "Dr Purva Gaikwad, 28",
    last: "Hlo",
    time: "28/05/2026",
    image: null,
  },
];

const INTERESTS: Person[] = [
  {
    name: "A, 26",
    meta: "5' 3\" • Maratha-96 Kuli Maratha • Pune/ Chinchwad",
    time: "Yesterday",
    image: null,
  },
  {
    name: "Aishwarya Patil, 28",
    meta: "5' 5\" • Maratha-96 Kuli Maratha • Solapur",
    time: "Mon",
    image: null,
  },
  {
    name: "TTYW1139, 29",
    meta: "5' 3\" • Maratha-96 Kuli Maratha • Ratnagiri",
    time: "19/07/2026",
    image: null,
  },
  {
    name: "Reshma Chavan, 28",
    meta: "5' 4\" • Maratha-96 Kuli Maratha",
    time: "17/07/2026",
    image: null,
  },
];

const TABS = [
  { key: "acceptances", label: "Acceptances", count: ACCEPTANCES.length },
  { key: "interests", label: "Interests", count: INTERESTS.length },
  { key: "calls", label: "Calls", count: null },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const AVATAR_COLORS = [
  { bg: "bg-violet-50", text: "text-violet-700" },
  { bg: "bg-orange-50", text: "text-orange-700" },
  { bg: "bg-rose-50", text: "text-rose-700" },
  { bg: "bg-emerald-50", text: "text-emerald-700" },
  { bg: "bg-blue-50", text: "text-blue-700" },
];

function initials(name: string) {
  const clean = name.split(",")[0].trim();
  const parts = clean.split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}

function Avatar({
  name,
  index,
  image,
}: {
  name: string;
  index: number;
  image?: string | null;
}) {
  if (image) {
    return (
      <Image
        src={image}
        alt={name}
        width={44}
        height={44}
        className="h-11 w-11 shrink-0 rounded-full object-cover"
      />
    );
  }
  const isHandle = /^[A-Z]{4}\d{4}$/.test(name) || /^[A-Z], \d+$/.test(name);
  const color = AVATAR_COLORS[index % AVATAR_COLORS.length];
  return (
    <span
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
        isHandle ? "bg-slate-100 text-slate-400" : `${color.bg} ${color.text}`
      }`}
    >
      {isHandle ? <User size={18} /> : initials(name)}
    </span>
  );
}

function PersonRow({ person, index }: { person: Person; index: number }) {
  return (
    <Link
      href={"/my-matches/messenger/details"}
      className="flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-stone-50  cursor-pointer"
    >
      <Avatar name={person.name} index={index} image={person.image} />
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="truncate text-sm font-semibold text-slate-900">
            {person.name}
          </span>
          {person.unread && (
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
          )}
        </span>
        <p className="mt-0.5 truncate text-sm text-stone-500">
          {person.meta ?? person.last}
        </p>
      </span>
      <span className="shrink-0 text-xs text-stone-400">{person.time}</span>
    </Link>
  );
}

function CallsEmptyState() {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <div className="relative mb-6 flex h-24 w-20 items-center justify-center rounded-xl border border-rose-200">
        <User className="h-10 w-10 text-teal-200" />
        <span className="absolute -right-3 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-rose-500">
          <Video size={14} className="text-white" />
        </span>
        <span className="absolute -right-6 top-8 flex h-7 w-7 items-center justify-center rounded-full bg-rose-500">
          <Phone size={13} className="text-white" />
        </span>
      </div>
      <p className="max-w-xs text-md text-black font-serif">
        Get to know your interests in the quickest way by calling them
      </p>
    </div>
  );
}

const Messenger = () => {
  const [active, setActive] = useState<TabKey>("acceptances");
  const [onlyWithMessages, setOnlyWithMessages] = useState(false);

  const interestList = onlyWithMessages
    ? INTERESTS.filter((p) => p.last)
    : INTERESTS;

  return (
    <div>
      <h2 className="font-serif text-xl font-bold text-slate-900 mb-5">
        My Conversions
      </h2>
      {/* Tabs */}
      <div className="flex gap-6 border-b border-stone-200 bg-rose-50 px-2 pt-3 rounded-xl">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`relative flex items-center gap-1 pb-3 text-sm transition-colors cursor-pointer  ${
              active === tab.key
                ? "font-semibold text-slate-900"
                : "text-stone-500 hover:text-stone-700"
            }`}
          >
            {tab.label}
            {tab.count !== null && (
              <span className="text-stone-400">({tab.count})</span>
            )}
            {active === tab.key && (
              <span className="absolute -bottom-px left-0 right-0 h-0.5 rounded-full bg-rose-500" />
            )}
          </button>
        ))}
      </div>

      {/* Interests toggle */}
      {active === "interests" && (
        <div className="mt-4 flex items-center justify-between rounded-xl border border-stone-200 px-4 py-3">
          <span className="text-sm text-slate-700">
            Only interests with messages
          </span>
          <button
            onClick={() => setOnlyWithMessages((v) => !v)}
            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
              onlyWithMessages ? "bg-rose-500" : "bg-stone-200"
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                onlyWithMessages ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      )}

      {/* Content */}
      <div className="mt-4 rounded-2xl border border-stone-200 bg-white">
        {active === "acceptances" && (
          <div className="divide-y divide-stone-100">
            {ACCEPTANCES.map((p, i) => (
              <PersonRow key={p.name} person={p} index={i} />
            ))}
          </div>
        )}
        {active === "interests" && (
          <div className="divide-y divide-stone-100">
            {interestList.map((p, i) => (
              <PersonRow key={p.name} person={p} index={i} />
            ))}
          </div>
        )}
        {active === "calls" && <CallsEmptyState />}
      </div>
    </div>
  );
};

export default Messenger;

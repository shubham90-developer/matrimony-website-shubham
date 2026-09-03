"use client";

import { useState } from "react";
import { Heart, Phone, ChevronRight, ArrowRight, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type ChatItem = {
  name: string;
  subtitle: string;
  subtitleIcon?: "phone" | null;
  date: string;
  time?: string;
  accepted?: boolean;
  unread?: number;
  image: string | null;
  ringed?: boolean;
};

const CHATS: ChatItem[] = [
  {
    name: "Zaraa z",
    subtitle: "9898989898",
    date: "28 Aug 2026",
    accepted: true,
    unread: 1,
    image: "/img/matches/1.jpg",
    ringed: true,
  },
  {
    name: "Riya Thakur",
    subtitle: "Voice call",
    subtitleIcon: "phone",
    date: "28 Aug 2026",
    time: "10:32 AM",
    image: "/img/matches/2.jpg",
  },
  {
    name: "Priya Verma",
    subtitle: "Hi",
    date: "27 Aug 2026",
    time: "09:15 PM",
    image: "/img/matches/3.jpg",
  },
];

const CALLS: ChatItem[] = [
  {
    name: "Riya Thakur",
    subtitle: "Voice call",
    subtitleIcon: "phone",
    date: "28 Aug 2026",
    time: "10:32 AM",
    image: "/img/matches/2.jpg",
  },
];

const TABS = [
  {
    key: "accepted",
    label: "Accepted",
    icon: Heart,
    heading: "My Chat History",
  },
  { key: "call", label: "Call", icon: Phone, heading: "My Call History" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

function Avatar({ item }: { item: ChatItem }) {
  return (
    <div
      className={`relative h-14 w-14 shrink-0 rounded-full ${
        item.ringed ? "ring-2 ring-rose-400 ring-offset-2" : ""
      }`}
    >
      {item.image ? (
        <Image
          src={item.image}
          alt={item.name}
          width={56}
          height={56}
          className="h-14 w-14 rounded-full object-cover"
        />
      ) : (
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <User size={22} />
        </span>
      )}
    </div>
  );
}

function ChatRow({ item }: { item: ChatItem }) {
  return (
    <Link
      href="/my-matches/messenger/details"
      className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-md cursor-pointer"
    >
      <Avatar item={item} />

      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold text-slate-900">
          {item.name}
        </p>

        {item.subtitleIcon === "phone" ? (
          <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
            <Phone size={14} className="text-slate-400" />
            {item.subtitle}
          </p>
        ) : (
          <p className="mt-1 text-sm text-slate-500">{item.subtitle}</p>
        )}

        {item.accepted && (
          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-500">
            <Heart size={12} fill="currentColor" />
            Accepted
          </span>
        )}
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2">
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-xs text-slate-400">{item.date}</p>
            {item.time && (
              <p className="mt-0.5 text-xs text-slate-400">{item.time}</p>
            )}
          </div>
          <ChevronRight size={18} className="text-rose-400" />
        </div>
        {item.unread ? (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[11px] font-bold text-white">
            {item.unread}
          </span>
        ) : (
          <span className="h-5" />
        )}
      </div>
    </Link>
  );
}

function PromoBanner() {
  return (
    <div className="relative mt-2 overflow-hidden rounded-2xl bg-rose-50 p-5">
      <div className="flex items-center gap-4">
        <div className="relative flex h-14 w-16 shrink-0 items-center justify-center">
          <div className="absolute left-0 top-2 flex items-center justify-center">
            <Image src="/img/matches/3.png" alt="logo" width={80} height={80} />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-serif text-base font-bold text-rose-600">
            Chat more, connect better
          </p>
          <p className="mt-0.5 text-sm text-slate-500">
            Start meaningful conversations and find your perfect match.
          </p>
        </div>

        <Link
          href={"/my-matches/matches"}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-500 text-white shadow-md shadow-rose-200"
        >
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}

const ChatHistory = () => {
  const [active, setActive] = useState<TabKey>("accepted");

  const activeTab = TABS.find((t) => t.key === active)!;
  const list = active === "accepted" ? CHATS : CALLS;

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-2 md:p-8">
      <h2 className="mb-4 text-xl font-bold text-slate-900 font-serif">
        {activeTab.heading}
      </h2>

      {/* Tabs */}
      <div className="mb-4 flex rounded-full bg-slate-50 p-1.5">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActive(tab.key)}
              className={`flex cursor-pointer flex-1 items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold transition-all ${
                isActive
                  ? "bg-rose-50 text-rose-500 shadow-sm ring-1 ring-rose-100"
                  : "text-slate-500"
              }`}
            >
              <Icon
                size={15}
                fill={
                  isActive && tab.key === "accepted" ? "currentColor" : "none"
                }
              />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* List */}
      <div className="space-y-3">
        {list.map((item) => (
          <ChatRow key={item.name} item={item} />
        ))}

        <PromoBanner />
      </div>
    </div>
  );
};

export default ChatHistory;

"use client";

import { useState } from "react";
import { Heart, Phone, ChevronRight, ArrowRight, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useGetChatsQuery } from "@/Redux/chatApi";
import { useGetCallHistoryQuery } from "@/Redux/callApi";

type ChatItem = {
  // Real Profile _id (Mongo ObjectId) of the other person in this chat.
  // This is what gets sent to the backend when placing a call, so it
  // must be a real profile id once this list is wired to real data —
  // it is NOT used for the (still mock) chat messages themselves.
  profileId: string;
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

// ---------------------------------------------------------------------
// Helpers: Firestore timestamps come back either as an ISO string or as
// { _seconds, _nanoseconds } depending on serialization — handle both,
// and fall back gracefully to "" so the row never breaks/crashes.
// ---------------------------------------------------------------------
type FirestoreLikeTimestamp =
  | string
  | { _seconds: number; _nanoseconds: number }
  | null
  | undefined;

function toDate(value: FirestoreLikeTimestamp): Date | null {
  if (!value) return null;
  if (typeof value === "string") {
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }
  if (typeof value === "object" && "_seconds" in value) {
    return new Date(value._seconds * 1000);
  }
  return null;
}

function formatDate(value: FirestoreLikeTimestamp): string {
  const d = toDate(value);
  if (!d) return "";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(value: FirestoreLikeTimestamp): string {
  const d = toDate(value);
  if (!d) return "";
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function fullNameOf(participant?: {
  fullName?: string;
  firstName?: string;
  lastName?: string;
}) {
  if (!participant) return "Unknown";
  return (
    participant.fullName?.trim() ||
    `${participant.firstName ?? ""} ${participant.lastName ?? ""}`.trim() ||
    "Unknown"
  );
}

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
  // Pass the real receiver profile id (+ display info) through to the
  // details page so the call button there has what it needs to start
  // a real ZegoCloud call. Chat messages on the details page stay
  // frontend-only/mock — only the call wiring uses this id.
  const detailsHref = `/my-matches/messenger/details?${new URLSearchParams({
    receiverId: item.profileId,
    name: item.name,
    ...(item.image ? { avatar: item.image } : {}),
  }).toString()}`;

  return (
    <Link
      href={detailsHref}
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

// Skeleton row shown while a tab's data is loading — mirrors ChatRow's
// exact box size/spacing so the list doesn't jump once real data lands.
function ChatRowSkeleton() {
  return (
    <div className="flex animate-pulse items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
      <div className="h-14 w-14 shrink-0 rounded-full bg-slate-100" />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="h-3.5 w-1/3 rounded bg-slate-100" />
        <div className="h-3 w-1/2 rounded bg-slate-100" />
      </div>
      <div className="h-3 w-14 shrink-0 rounded bg-slate-100" />
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
      <p className="text-sm text-slate-400">{message}</p>
    </div>
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

  // Real chat list — GET /v1/api/chat/get-chats. A room only exists once
  // an interest request has been accepted, so every result is "Accepted".
  const {
    data: chatsResponse,
    isLoading: chatsLoading,
    isError: chatsError,
  } = useGetChatsQuery(undefined, { skip: active !== "accepted" });

  // Real call history — GET /v1/api/call/history.
  const {
    data: callsResponse,
    isLoading: callsLoading,
    isError: callsError,
  } = useGetCallHistoryQuery(undefined, { skip: active !== "call" });

  const chatItems: ChatItem[] =
    chatsResponse?.data.map((room) => ({
      profileId: room.participant.profileId,
      name: fullNameOf(room.participant),
      subtitle:
        room.lastMessageType === "VOICE_CALL"
          ? room.lastMessage || "Voice call"
          : room.lastMessage || "Say hi and start the conversation",
      subtitleIcon: room.lastMessageType === "VOICE_CALL" ? "phone" : null,
      date: formatDate(room.lastMessageAt),
      time: formatTime(room.lastMessageAt) || undefined,
      accepted: true,
      image: room.participant.profilePhoto || null,
    })) ?? [];

  const callItems: ChatItem[] =
    callsResponse?.data.map((call) => {
      const label =
        call.status === "missed"
          ? `Missed ${call.callType} call`
          : call.status === "rejected"
            ? `Rejected ${call.callType} call`
            : `${call.callType.charAt(0).toUpperCase()}${call.callType.slice(1)} call`;

      return {
        profileId: call.participant?.profileId ?? "",
        name: fullNameOf(call.participant ?? undefined),
        subtitle: label,
        subtitleIcon: "phone",
        date: formatDate(call.createdAt),
        time: formatTime(call.createdAt) || undefined,
        image: call.participant?.profilePhoto || null,
      };
    }) ?? [];

  const list = active === "accepted" ? chatItems : callItems;
  const isLoading = active === "accepted" ? chatsLoading : callsLoading;
  const isError = active === "accepted" ? chatsError : callsError;

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
        {isLoading ? (
          <>
            <ChatRowSkeleton />
            <ChatRowSkeleton />
            <ChatRowSkeleton />
          </>
        ) : isError ? (
          <EmptyState message="Couldn't load this right now. Please try again in a moment." />
        ) : list.length === 0 ? (
          <EmptyState
            message={
              active === "accepted"
                ? "No accepted chats yet. Once someone accepts your interest, they'll show up here."
                : "No calls yet."
            }
          />
        ) : (
          list.map((item) => (
            <ChatRow key={`${item.profileId}-${item.name}`} item={item} />
          ))
        )}

        <PromoBanner />
      </div>
    </div>
  );
};

export default ChatHistory;

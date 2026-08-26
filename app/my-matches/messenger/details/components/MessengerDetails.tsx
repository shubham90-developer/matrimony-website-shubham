"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  Phone,
  MoreVertical,
  Send,
  Check,
  CheckCheck,
  Blocks,
  Flag,
} from "lucide-react";
import Link from "next/link";

import Image from "next/image";

type MessageType = "system" | "sent" | "received";

interface Message {
  id: string;
  type: MessageType;
  text: string;
  time: string;
  date: string;
  read?: boolean;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    type: "sent",
    text: "You sent interest",
    time: "11:54 PM",
    date: "07 Jul 2026",
    read: true,
  },
  {
    id: "2",
    type: "received",
    text: "They accepted your interest",
    time: "8:03 AM",
    date: "Yesterday",
  },
];

function groupByDate(messages: Message[]) {
  const groups: { date: string; items: Message[] }[] = [];
  for (const m of messages) {
    const group = groups.find((g) => g.date === m.date);
    if (group) group.items.push(m);
    else groups.push({ date: m.date, items: [m] });
  }
  return groups;
}

function formatTime(d: Date) {
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

const MessengerDetails = ({
  name = "Kalpita Velip",
  avatar,
  lastSeen = "Last seen at 11:06 AM",
  isOnline = false,
}: {
  name?: string;
  avatar?: string;
  lastSeen?: string;
  isOnline?: boolean;
  onBack?: () => void;
}) => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const [openMenu, setOpenMenu] = useState(false);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type: "sent",
        text: trimmed,
        time: formatTime(new Date()),
        date: "Today",
        read: false,
      },
    ]);
    setDraft("");
  };

  const groups = groupByDate(messages);

  return (
    <div className="flex h-full min-h-130 flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-stone-100 px-4 py-3">
        <Link
          href={"/my-matches/messenger"}
          className="shrink-0 text-stone-500 hover:text-stone-700"
        >
          <ChevronLeft size={22} />
        </Link>

        <div className="relative shrink-0">
          <Image
            src={avatar || "/img/matches/1.jpg"}
            alt={name}
            width={44}
            height={44}
            className="h-11 w-11 shrink-0 rounded-full object-cover"
          />
          {isOnline && (
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-400" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-900 font-serif">
            {name}
          </p>
          <p className="truncate text-xs text-stone-400">
            {isOnline ? "Online" : lastSeen}
          </p>
        </div>

        <button className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-rose-100 text-stone-500 transition hover:bg-stone-100 hover:text-stone-700">
          <Phone size={16} />
        </button>
        <div className="relative">
          <button
            onClick={() => setOpenMenu(!openMenu)}
            className="flex h-8 w-8 items-center cursor-pointer justify-center rounded-lg hover:bg-stone-100"
          >
            <MoreVertical size={18} />
          </button>

          {openMenu && (
            <div className="absolute right-0 top-10 z-50 w-48 overflow-hidden rounded-xl border border-stone-200 bg-white shadow-lg">
              <button className="flex w-full items-center gap-2 px-4 py-3 text-sm text-rose-500 font-bold border-b border-dashed border-gray-200 hover:bg-stone-50 cursor-pointer">
                <Blocks size={16} />
                Block User
              </button>
              <button className="flex w-full items-center gap-2 px-4 py-3 text-sm hover:bg-stone-50 cursor-pointer">
                <Flag size={16} />
                Report User
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Message list */}
      <div className="flex-1 space-y-3 overflow-y-auto bg-stone-50/60 px-4 py-4">
        {groups.map((group) => (
          <div key={group.date} className="space-y-3">
            <div className="flex justify-center">
              <span className="rounded-full bg-stone-100 px-3 py-1 text-[11px] text-stone-500">
                {group.date}
              </span>
            </div>
            {group.items.map((m) =>
              m.type === "received" ? (
                <div key={m.id} className="flex max-w-[80%] items-end gap-2">
                  {avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatar}
                      alt={name}
                      className="h-5 w-5 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <span className="h-5 w-5 shrink-0 rounded-full bg-violet-100" />
                  )}
                  <div className="rounded-2xl rounded-bl-md bg-rose-50 px-3.5 py-2.5">
                    <p className="text-sm font-medium text-slate-800">
                      {m.text}
                    </p>
                    <p className="mt-1 text-[10px] text-rose-900/50">
                      {m.time}
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  key={m.id}
                  className="ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-rose-100 px-3.5 py-2.5"
                >
                  <p className="text-sm font-medium text-slate-800">{m.text}</p>
                  <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-rose-900/50">
                    {m.time}
                    {m.read ? (
                      <CheckCheck size={12} className="text-indigo-500" />
                    ) : (
                      <Check size={12} />
                    )}
                  </div>
                </div>
              ),
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Composer */}
      <div className="flex items-center gap-2 border-t border-stone-100 px-3 py-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Send a message for free..."
          className="flex-1 rounded-full bg-stone-100 px-4 py-2.5 text-sm text-slate-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
        />
        <button
          onClick={handleSend}
          disabled={!draft.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-600 text-white transition disabled:opacity-40"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};

export default MessengerDetails;

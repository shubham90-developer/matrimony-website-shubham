"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

interface NotificationItem {
  id: string;
  avatar: string;
  message: string;
  time: string;
  href: string;
  unread?: boolean;
  cta?: { label: string; href: string };
}

const RECENT: NotificationItem[] = [
  {
    id: "n1",
    avatar: "/img/matches/2.jpg",
    message: "Connect with TSST0319 and other Match of the Day profiles",
    time: "22h",
    href: "/my-matches/matches",
    cta: { label: "View Matches", href: "/matches" },
  },
];

const OLDER: NotificationItem[] = [
  {
    id: "n2",
    avatar: "/img/matches/1.jpg",
    message:
      "Time's running out! Get back to your interests that may be expiring soon",
    time: "1w",
    href: "/my-matches/matches",
    unread: true,
  },
];

function NotificationRow({ item }: { item: NotificationItem }) {
  const router = useRouter();

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => router.push(item.href)}
      onKeyDown={(e) => e.key === "Enter" && router.push(item.href)}
      className={`flex cursor-pointer gap-3 rounded-2xl p-3.5 transition ${
        item.unread ? "bg-rose-50 hover:bg-rose-100" : "hover:bg-stone-50"
      }`}
    >
      <Image
        src={item.avatar}
        alt=""
        width={44}
        height={44}
        className="h-11 w-11 shrink-0 rounded-full object-cover"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-semibold leading-snug text-slate-900">
            {item.message}
          </p>
          <span className="shrink-0 text-xs text-stone-400">{item.time}</span>
        </div>
        {item.cta && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(item.cta!.href);
            }}
            className="mt-2 rounded-lg border border-rose-600 px-3.5 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
          >
            {item.cta.label}
          </button>
        )}
      </div>
    </div>
  );
}

export default function Notifications() {
  return (
    <div className="space-y-8 border border-gray-100 p-3">
      <div className="relative mb-6 flex items-center border-b border-dashed border-gray-500 py-5">
        <h2 className="text-lg font-bold text-slate-900 font-serif">
          What&apos;s New?
        </h2>
      </div>

      {RECENT.length > 0 && (
        <div className="mb-2">
          <p className="mb-2 text-sm font-semibold text-stone-500">Recent</p>
          <div className="divide-y divide-stone-100 border-b border-stone-100 pb-2">
            {RECENT.map((item) => (
              <NotificationRow key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      {OLDER.length > 0 && (
        <div className="mt-6">
          <p className="mb-2 text-sm font-semibold text-stone-500">Older</p>
          <div className="space-y-2">
            {OLDER.map((item) => (
              <NotificationRow key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  MessageCircleHeart,
  Lock,
  Flag,
  HeartHandshake,
  BadgeCheck,
  Phone,
  ChevronRight,
  ChevronUp,
} from "lucide-react";

const tiles = [
  {
    label: "Online / Personal tips",
    desc: "Stay sharp while chatting or meeting",
    icon: MessageCircleHeart,
    detail: {
      heading: "Tips to stay safe",
      groups: [
        {
          title: "Online safety",
          points: [
            "Keep your number, address and financial details private until you fully trust someone.",
            "Never share OTPs, passwords or bank details, even with a match.",
            "Report and block any profile that feels suspicious or pushy.",
          ],
        },
        {
          title: "Meeting in person",
          points: [
            "Choose a public place for your first few meetings.",
            "Tell a friend or family member where you're going and with whom.",
            "Arrange your own way to and from the meeting.",
          ],
        },
      ],
    },
  },
  {
    label: "Privacy settings",
    desc: "Control who sees what",
    icon: Lock,
    detail: {
      heading: "What you can control",
      groups: [
        {
          title: "Mobile number",
          points: [
            "Visible to all, only to accepted interests, or hidden from everyone.",
          ],
        },
        {
          title: "Profile visibility",
          points: [
            "Default is visible to all — switch on incognito mode to browse unseen.",
          ],
        },
        {
          title: "Photos and last seen",
          points: [
            "Limit photos to accepted matches only.",
            "Hide your last-seen status from your profile.",
          ],
        },
      ],
    },
  },
  {
    label: "Report / block profile",
    desc: "Flag anything that feels off",
    icon: Flag,
    detail: {
      heading: "Spot it, report it",
      groups: [
        {
          title: "Signs of a violation",
          points: [
            "Requests for money, gifts or financial help.",
            "Refusing a video call or making excuses to avoid it.",
            "Pressuring you to move off the app quickly.",
          ],
        },
        {
          title: "Report or block",
          points: [
            "Open the profile, tap report, choose a reason and submit.",
            "Blocking removes the profile from your matches immediately.",
          ],
        },
      ],
    },
  },
  {
    label: "Mental wellbeing",
    desc: "Support for how you're feeling",
    icon: HeartHandshake,
    detail: {
      heading: "Take care of yourself",
      groups: [
        {
          title: "If it starts to feel like a lot",
          points: [
            "Set limits on how long you spend messaging each day.",
            "Take breaks between conversations that leave you drained.",
          ],
        },
        {
          title: "Good things take time",
          points: [
            "Lean on people you trust outside the app.",
            "It's okay to pause your account whenever you need to.",
          ],
        },
      ],
    },
  },
];

const resources = [
  { label: "National Cyber Helpline", meta: "1930" },
  { label: "Cyber Cell website", meta: "cybercrime.gov.in" },
];

export default function Safety() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="w-full bg-[#FDF8F3] py-0 px-5 sm:px-8 lg:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden bg-white p-8 py-10">
        {/* header */}
        <div className="text-center">
          <span className="rounded-full bg-rose-100 px-4 py-1 text-xs font-bold tracking-widest text-black">
            SAFETY CENTER
          </span>
          <h2 className="mt-3 font-serif text-3xl font-bold text-slate-900 sm:text-4xl">
            Search With <span className="text-rose-600">Confidence</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-slate-500">
            We&apos;re committed to your safety. Reach out for help while you
            stay in your partner search, and keep these tools close by.
          </p>
        </div>

        {/* watermark shield */}
        <ShieldCheck
          size={140}
          strokeWidth={1}
          className="absolute -right-8 top-16 text-[#1F6F5C]/5 pointer-events-none"
        />

        {/* tile grid */}
        <div className="px-6 pt-8 grid grid-cols-2 gap-3">
          {tiles.map(({ label, desc, icon: Icon }, i) => {
            const active = selected === i;
            return (
              <button
                key={label}
                onClick={() => setSelected(active ? null : i)}
                aria-pressed={active}
                className={`group text-left rounded-2xl p-4 ring-1 transition active:scale-[0.98] ${
                  active
                    ? "bg-rose-100 text-black"
                    : "bg-white ring-black/5 hover:ring-[#1F6F5C]/30"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-colors ${
                    active
                      ? "bg-white/60"
                      : "bg-[#EAF2EF] group-hover:bg-[#1F6F5C]"
                  }`}
                >
                  <Icon
                    size={18}
                    className={`transition-colors ${
                      active
                        ? "text-[#1F6F5C]"
                        : "text-[#1F6F5C] group-hover:text-white"
                    }`}
                  />
                </div>
                <p
                  className={`text-[13.5px] font-medium leading-snug ${
                    active ? "text-[#23303D]" : "text-[#23303D]"
                  }`}
                >
                  {label}
                </p>
                <p
                  className={`text-[11.5px] mt-1 leading-snug ${
                    active ? "text-[#5B6472]" : "text-[#8B93A0]"
                  }`}
                >
                  {desc}
                </p>
              </button>
            );
          })}
        </div>

        {/* detail panel for the selected tile */}
        {selected !== null && (
          <div className="px-6 pt-4">
            <div className="rounded-2xl bg-white ring-1 ring-black/5 p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[13.5px] font-medium text-[#23303D]">
                  {tiles[selected].detail.heading}
                </p>
                <button
                  aria-label="Collapse"
                  onClick={() => setSelected(null)}
                  className="w-7 h-7 rounded-full flex items-center justify-center bg-[#F3F0E9] text-[#8B93A0] active:scale-95 transition"
                >
                  <ChevronUp size={14} />
                </button>
              </div>
              <div className="space-y-4">
                {tiles[selected].detail.groups.map((group) => (
                  <div key={group.title}>
                    <p className="text-[11.5px] font-medium text-[#1F6F5C] uppercase tracking-wide mb-2">
                      {group.title}
                    </p>
                    <ul className="space-y-1.5">
                      {group.points.map((point) => (
                        <li
                          key={point}
                          className="text-[12.5px] text-[#5B6472] leading-relaxed pl-3 relative before:content-[''] before:absolute before:left-0 before:top-1.75 before:w-1 before:h-1 before:rounded-full before:bg-[#A83D5D]"
                        >
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* verification banner */}
        <div className="mx-6 mt-6 rounded-2xl bg-rose-500 p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0">
            <BadgeCheck size={18} className="text-[#F7E9EC]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[18px] font-medium text-white leading-snug">
              Help keep this space authentic
            </p>
            <p className="text-[11.5px] text-white leading-snug mt-0.5">
              Verify your profile so others know it&apos;s really you
            </p>
          </div>
        </div>

        {/* we're here for you */}
        <div className="px-6 pt-7 pb-8">
          <p className="text-[13px] font-medium text-[#23303D] mb-3">
            We&apos;re here for you
          </p>
          <div className="rounded-2xl bg-white ring-1 ring-black/5 divide-y divide-black/5">
            {resources.map(({ label, meta }) => (
              <div key={label} className="flex items-center gap-3 px-4 py-3.5">
                <div className="w-8 h-8 rounded-full bg-[#F7E9EC] flex items-center justify-center shrink-0">
                  <Phone size={14} className="text-[#A83D5D]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-[#23303D] leading-snug">
                    {label}
                  </p>
                  <p className="text-[11.5px] text-[#8B93A0] leading-snug">
                    {meta}
                  </p>
                </div>
                <ChevronRight size={16} className="text-[#C7CCD3] shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

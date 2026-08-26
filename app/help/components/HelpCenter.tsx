"use client";

import React, { useMemo, useState } from "react";
import {
  Search,
  UserCircle,
  ShieldCheck,
  CreditCard,
  MessageCircle,
  Settings,
  Flag,
  ChevronDown,
  Mail,
  Phone,
} from "lucide-react";
import ThemeBtnOne from "@/app/components/ThemeBtnOne";

type Category = {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
};

type FaqItem = {
  id: string;
  category: string;
  question: string;
  answer: string;
};

const categories: Category[] = [
  {
    id: "profile",
    title: "Profile & Account",
    description: "Editing details, photos, and preferences",
    icon: UserCircle,
  },
  {
    id: "verification",
    title: "Verification & Trust",
    description: "Blue Tick, ID checks, and profile safety",
    icon: ShieldCheck,
  },
  {
    id: "billing",
    title: "Membership & Billing",
    description: "Plans, payments, and refunds",
    icon: CreditCard,
  },
  {
    id: "messaging",
    title: "Interests & Messaging",
    description: "Sending interests, chats, and contact details",
    icon: MessageCircle,
  },
  {
    id: "settings",
    title: "Privacy & Settings",
    description: "Visibility, blocking, and notifications",
    icon: Settings,
  },
  {
    id: "report",
    title: "Report a Concern",
    description: "Fake profiles, misuse, and safety issues",
    icon: Flag,
  },
];

const faqs: FaqItem[] = [
  {
    id: "faq-1",
    category: "profile",
    question: "How do I edit my profile details?",
    answer:
      "Go to 'My Profile' from the menu, tap 'Edit', update any section, and save. Changes are reflected within a few minutes.",
  },
  {
    id: "faq-2",
    category: "verification",
    question: "What is Blue Tick verification and how do I get it?",
    answer:
      "Blue Tick confirms your profile has been checked against a valid government ID. Upload your ID under 'Verification' in settings, and our team reviews it within 24-48 hours.",
  },
  {
    id: "faq-3",
    category: "billing",
    question: "Can I get a refund on my membership?",
    answer:
      "Yes, eligible plans come with a 30-day money-back guarantee if you haven't received a genuine response. Raise a request from 'My Membership' and our team will process it.",
  },
  {
    id: "faq-4",
    category: "messaging",
    question: "Why can't I see someone's contact details?",
    answer:
      "Contact details unlock once your interest is accepted by the other member, or immediately if you're on a plan that includes direct contact view.",
  },
  {
    id: "faq-5",
    category: "settings",
    question: "How do I hide my profile from specific people?",
    answer:
      "Go to 'Privacy Settings' and use 'Hide Profile From' to block specific members or exclude your profile from certain search results.",
  },
  {
    id: "faq-6",
    category: "report",
    question: "How do I report a fake or suspicious profile?",
    answer:
      "Open the profile, tap the flag icon, and choose a reason. Our Trust & Safety team reviews every report within 24 hours.",
  },
  {
    id: "faq-7",
    category: "billing",
    question: "How do I cancel auto-renewal?",
    answer:
      "Go to 'My Membership' > 'Manage Plan' and turn off auto-renewal. You'll keep access until your current plan expires.",
  },
  {
    id: "faq-8",
    category: "profile",
    question: "Can I have more than one profile?",
    answer:
      "No, we allow only one active profile per person to keep the platform genuine. Duplicate profiles may be suspended.",
  },
];

const HelpCenter = () => {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<string | null>(faqs[0].id);

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesQuery = faq.question
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesCategory = activeCategory
        ? faq.category === activeCategory
        : true;
      return matchesQuery && matchesCategory;
    });
  }, [query, activeCategory]);

  return (
    <div className="w-full bg-[#FDF8F3] py-0 px-5 sm:px-8 lg:px-8">
      <div className="mx-auto max-w-7xl  bg-white p-8 py-15">
        {/* Hero + search */}
        <div className="text-center">
          <span className="rounded-full bg-rose-100 px-4 py-1 text-xs font-bold tracking-widest text-rose-600 uppercase">
            Help Center
          </span>
          <h1 className="mx-auto mt-3 max-w-xl font-serif text-3xl font-bold text-slate-900 sm:text-4xl">
            How Can We <span className="text-rose-600">Help You?</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-slate-500">
            Search our help articles or browse by topic below.
          </p>

          <div className="mx-auto mt-7 flex max-w-xl items-center gap-2 rounded-full border border-slate-200 bg-white p-1.5 pl-5 shadow-sm focus-within:border-rose-300">
            <Search className="h-4 w-4 shrink-0 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for help, e.g. 'refund' or 'verification'"
              className="w-full bg-transparent py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Category cards */}
        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() =>
                  setActiveCategory((prev) => (prev === cat.id ? null : cat.id))
                }
                className={`flex items-start gap-3 rounded-2xl border p-5 text-left transition ${
                  isActive
                    ? "border-rose-300 bg-rose-50/60 shadow-sm"
                    : "border-slate-200 bg-white hover:border-rose-200 hover:shadow-md"
                }`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    isActive
                      ? "bg-rose-600 text-white"
                      : "bg-rose-50 text-rose-600"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {cat.title}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    {cat.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* FAQ accordion */}
        <div className="mt-16">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-slate-900">
              {activeCategory
                ? categories.find((c) => c.id === activeCategory)?.title
                : "Frequently Asked Questions"}
            </h2>
            {activeCategory && (
              <button
                type="button"
                onClick={() => setActiveCategory(null)}
                className="text-xs font-semibold text-rose-600 hover:underline"
              >
                Clear filter
              </button>
            )}
          </div>

          <div className="mt-6 divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {filteredFaqs.length === 0 ? (
              <p className="p-8 text-center text-sm text-slate-400">
                No results for &quot;{query}&quot;. Try a different search term.
              </p>
            ) : (
              filteredFaqs.map((faq) => {
                const isOpen = openFaq === faq.id;
                return (
                  <div key={faq.id}>
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                      className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-rose-50/40 sm:p-6"
                    >
                      <span className="text-sm font-semibold text-slate-900">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-rose-600 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-sm leading-relaxed text-slate-500 sm:px-6 sm:pb-6">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Contact support */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 rounded-2xl bg-rose-600 px-6 py-8 text-center sm:flex-row sm:text-left">
          <div>
            <p className="font-serif text-xl font-bold text-white">
              Still need help?
            </p>
            <p className="mt-1 text-sm text-rose-100">
              Our support team is here for you, every day.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <ThemeBtnOne
              text="Email Support"
              icon={<Mail className="h-4 w-4" />}
              url=""
              className="bg-white py-3 px-3 rounded-full"
            />
            <ThemeBtnOne
              text="Call Us"
              icon={<Phone className="h-4 w-4" />}
              url=""
              className="bg-black text-white py-3 px-3 rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;

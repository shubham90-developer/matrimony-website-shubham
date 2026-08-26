"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

type FaqItem = {
  question: string;
  answer: string;
};

const faqItems: FaqItem[] = [
  {
    question: "How do I create a profile?",
    answer:
      "Sign up with your basic details, verify your phone number, and complete your profile with photos, preferences, and a short bio. It only takes a few minutes to get started.",
  },
  {
    question: "Is my personal information kept private?",
    answer:
      "Yes. Your contact details are only visible to members you've accepted a connection with. You control exactly what's shown on your public profile at all times.",
  },
  {
    question: "What's the difference between Free and Paid membership?",
    answer:
      "Free members can browse profiles, shortlist matches, and send interest. Paid members unlock unlimited messaging, advanced search filters, contact details, and priority visibility to get more responses.",
  },
  {
    question: "How does the Blue Tick verification work?",
    answer:
      "Blue Tick profiles are manually verified by our team using ID and photo checks. Verified profiles are trusted more by other members and typically receive significantly more connection requests.",
  },
  {
    question: "Can I cancel or get a refund on my membership?",
    answer:
      "Yes, eligible plans come with a 30-day money-back guarantee. If you don't find a meaningful match within 30 days, reach out to our support team for a full refund.",
  },
  {
    question: "How do I report or block a profile?",
    answer:
      "Open the profile in question, tap the menu icon, and select Report or Block. Our safety team reviews every report and takes action to keep the community safe.",
  },
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="w-full bg-[#FDF8F3] px-5  sm:px-8 lg:px-8">
      <div className="mx-auto max-w-7xl  bg-rose-100 p-8 py-15">
        <div className="text-center">
          <h2 className="font-serif text-3xl font-bold text-slate-900 sm:text-4xl">
            Frequently Asked <span className="text-rose-600">Questions</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-slate-500">
            Everything you need to know about finding your match. Can&apos;t
            find the answer you&apos;re looking for? Reach out to our support
            team.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-4">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.question}
                className={`overflow-hidden rounded-2xl border bg-white transition-colors ${
                  isOpen ? "border-rose-300" : "border-slate-200"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span
                    className={`text-[15px] font-semibold ${
                      isOpen ? "text-rose-600" : "text-slate-900"
                    }`}
                  >
                    {item.question}
                  </span>
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors ${
                      isOpen
                        ? "border-rose-500 bg-rose-500 text-white"
                        : "border-slate-300 text-slate-500"
                    }`}
                  >
                    {isOpen ? (
                      <Minus className="h-3.5 w-3.5" strokeWidth={3} />
                    ) : (
                      <Plus className="h-3.5 w-3.5" strokeWidth={3} />
                    )}
                  </span>
                </button>

                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-[15px] leading-relaxed text-slate-500">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Faq;

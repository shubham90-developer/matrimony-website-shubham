"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import {
  Mail,
  Target,
  Building2,
  Award,
  BookOpen,
  BadgeDollarSign,
  ShieldCheck,
  CircleHelp,
  Heart,
  UserPlus,
  Search,
  MessageCircle,
  CheckCircle2,
  Lock,
  Fingerprint,
  Eye,
  Phone,
} from "lucide-react";
import ThemeBtnOne from "@/app/components/ThemeBtnOne";

type Section = {
  id: string;
  title: string;
  icon: React.ElementType;
};

const sections: Section[] = [
  {
    id: "ceo-letter",
    title: "Letter From CEO",
    icon: Mail,
  },
  {
    id: "mission-vision",
    title: "Mission & Vision",
    icon: Target,
  },
  {
    id: "about-us",
    title: "About Us",
    icon: Building2,
  },
  {
    id: "awards",
    title: "Award Winners",
    icon: Award,
  },
  {
    id: "how-to-use",
    title: "How To Use",
    icon: BookOpen,
  },
  {
    id: "money-back",
    title: "Money Back Guarantee",
    icon: BadgeDollarSign,
  },
  {
    id: "secure",
    title: "100% Secure",
    icon: ShieldCheck,
  },
  {
    id: "help",
    title: "Need Help?",
    icon: CircleHelp,
  },
];

const howToUseSteps = [
  {
    icon: UserPlus,
    title: "Create your profile",
    description:
      "Sign up and fill in your details, partner preferences, and a few photos. Verified profiles get 3x more responses.",
  },
  {
    icon: Search,
    title: "Discover matches",
    description:
      "Use filters for community, location, education, and profession to find profiles that fit what you're looking for.",
  },
  {
    icon: MessageCircle,
    title: "Connect & chat",
    description:
      "Send an interest, wait for it to be accepted, and start a conversation once both sides are comfortable.",
  },
  {
    icon: CheckCircle2,
    title: "Take the next step",
    description:
      "Exchange contact details, plan a meeting with your families, and take things forward at your own pace.",
  },
];

const awards = [
  {
    year: "2025",
    title: "Best Matrimony Platform",
    org: "India Digital Awards",
    image: "/img/about/2.jpg",
  },
  {
    year: "2024",
    title: "Excellence in Trust & Safety",
    org: "TechCircle Awards",
    image: "/img/about/2.jpg",
  },
  {
    year: "2023",
    title: "Most Loved App",
    org: "Google Play Awards",
    image: "/img/about/2.jpg",
  },
  {
    year: "2022",
    title: "Fastest Growing Matrimony App",
    org: "StartupIndia Summit",
    image: "/img/about/2.jpg",
  },
];

const securityPoints = [
  {
    icon: Fingerprint,
    title: "Blue Tick Verification",
    description:
      "Every verified profile is checked against a government ID before the badge is granted.",
  },
  {
    icon: Lock,
    title: "Encrypted conversations",
    description:
      "Your chats and contact details are encrypted and never visible until you choose to share them.",
  },
  {
    icon: Eye,
    title: "Privacy controls",
    description:
      "Hide your profile from specific people, control who can view your photos, and stay invisible until you're ready.",
  },
];

const AboutUsPage = () => {
  const [activeId, setActiveId] = useState(sections[0].id);
  const refs = useRef<Record<string, HTMLDivElement | null>>({});

  const scrollTo = (id: string) => {
    setActiveId(id);
    refs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="w-full bg-[#FDF8F3] py-0 px-5 sm:px-8 lg:px-8">
      <div className="mx-auto max-w-7xl bg-white p-8 py-15">
        {/* Header */}
        <div className="mb-5 text-center">
          <span className="rounded-full bg-rose-100 px-4 py-1 text-xs font-bold tracking-widest text-rose-600 uppercase">
            About Us
          </span>

          <h2 className="mt-3 font-serif text-3xl font-bold text-slate-900 sm:text-4xl">
            Building Trust Through{" "}
            <span className="text-rose-600">Meaningful Connections</span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-slate-500">
            We are dedicated to helping people find genuine, verified
            connections through a secure, transparent, and user-friendly
            platform. Our mission is to make every journey toward meaningful
            relationships simple, safe, and successful.
          </p>
        </div>

        <div className="relative mb-10 h-56 w-full overflow-hidden rounded-2xl sm:h-72 lg:h-80">
          <Image
            src="/img/about/4.jpg"
            alt="Couples who found each other through our platform"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-center gap-2 sm:bottom-6 sm:left-6">
            <span className="flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-rose-600 backdrop-blur-sm">
              <Heart className="h-3 w-3" fill="currentColor" />
              45,000+ happy marriages and counting
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Sticky section nav */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-gray-200 bg-white p-3 lg:sticky lg:top-6">
              <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:gap-0 lg:divide-y lg:divide-gray-100 lg:overflow-visible">
                {sections.map((section) => {
                  const Icon = section.icon;

                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollTo(section.id)}
                      className={`flex cursor-pointer items-center gap-3 whitespace-nowrap rounded-lg px-3 py-3 text-left text-sm transition-all duration-300 lg:rounded-none lg:whitespace-normal ${
                        activeId === section.id
                          ? "border-l-4 border-rose-600 bg-rose-50 font-semibold text-rose-700 lg:rounded-lg"
                          : "font-medium text-gray-600 hover:bg-gray-50 hover:text-rose-600"
                      }`}
                    >
                      <Icon
                        size={18}
                        className={`shrink-0 ${
                          activeId === section.id
                            ? "text-rose-600"
                            : "text-gray-500"
                        }`}
                      />
                      <span>{section.title}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6 lg:col-span-3">
            {/* 1. Letter from CEO */}
            <div
              ref={(el) => {
                refs.current["ceo-letter"] = el;
              }}
              className="scroll-mt-24 rounded-xl border border-gray-200 bg-white p-5 md:p-8"
            >
              <div className="mb-4 flex items-center gap-2">
                <Mail size={18} className="text-rose-600" />
                <h2 className="font-bold text-gray-900">Letter From Our CEO</h2>
              </div>
              <div className="flex flex-col gap-5 sm:flex-row">
                <div className="relative h-50 w-44 shrink-0 overflow-hidden rounded-2xl shadow-lg sm:h-72 sm:w-56">
                  <Image
                    src="/img/about/1.jpg"
                    alt="Founder & CEO"
                    fill
                    quality={100}
                    priority
                    sizes="(max-width: 640px) 176px, 224px"
                    className="object-cover object-center transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div>
                  <p className="text-sm leading-relaxed text-gray-700">
                    When we started this platform, it came from a simple
                    frustration: finding a life partner shouldn&apos;t feel like
                    scrolling through an endless, impersonal list. Every profile
                    on here represents someone&apos;s hope for a genuine
                    connection, and we&apos;ve built every feature, from
                    verification to our matchmaking, around protecting that
                    trust.
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-gray-700">
                    Thank you for letting us be a part of your search. We
                    don&apos;t take that responsibility lightly.
                  </p>
                  <p className="mt-4 text-sm font-semibold text-gray-900">
                    Founder & CEO
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Mission & Vision */}
            <div
              ref={(el) => {
                refs.current["mission-vision"] = el;
              }}
              className="scroll-mt-24 rounded-xl border border-gray-200 bg-white p-5 md:p-8"
            >
              <div className="mb-4 flex items-center gap-2">
                <Target size={18} className="text-rose-600" />
                <h2 className="font-bold text-gray-900">Mission & Vision</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-rose-50 p-4">
                  <p className="text-sm font-semibold text-rose-700">
                    Our Mission
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-gray-700">
                    To make the search for a life partner safe, respectful, and
                    genuinely effective, by putting verification and privacy at
                    the center of every match.
                  </p>
                </div>
                <div className="rounded-lg bg-rose-50 p-4">
                  <p className="text-sm font-semibold text-rose-700">
                    Our Vision
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-gray-700">
                    To be the most trusted matrimony platform for families,
                    known as much for how we protect people as for how well we
                    match them.
                  </p>
                </div>
              </div>
            </div>

            {/* 3. About Us */}
            <div
              ref={(el) => {
                refs.current["about-us"] = el;
              }}
              className="scroll-mt-24 rounded-xl border border-gray-200 bg-white p-5 md:p-8"
            >
              <div className="mb-4 flex items-center gap-2">
                <Building2 size={18} className="text-rose-600" />
                <h2 className="font-bold text-gray-900">About Us</h2>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 sm:items-center">
                <p className="text-sm leading-relaxed text-gray-700">
                  We&apos;re a matrimony platform built for people who want a
                  serious, respectful path to marriage. Since launch, we&apos;ve
                  helped thousands of members across India connect with
                  verified, genuine profiles &mdash; matched on shared values,
                  community, and life goals rather than a swipe.
                </p>
                <div className="relative h-50 w-full overflow-hidden rounded-xl sm:h-full">
                  <Image
                    src="/img/about/3.jpg"
                    alt="Our team at work"
                    fill
                    className="object-cover"
                    sizes="h-30"
                  />
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { label: "Verified Profiles", value: "2L+" },
                  { label: "Successful Matches", value: "45,000+" },
                  { label: "Cities Covered", value: "500+" },
                  { label: "Years of Trust", value: "8+" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-lg border border-gray-100 p-3 text-center"
                  >
                    <p className="font-serif text-xl font-bold text-rose-600">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Award Winners */}
            <div
              ref={(el) => {
                refs.current["awards"] = el;
              }}
              className="scroll-mt-24 rounded-xl border border-gray-200 bg-white p-5 md:p-8"
            >
              <div className="mb-4 flex items-center gap-2">
                <Award size={18} className="text-rose-600" />
                <h2 className="font-bold text-gray-900">Award Winners</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {awards.map((award) => (
                  <div
                    key={award.title}
                    className="flex items-center gap-3 rounded-lg border border-gray-100 p-3.5"
                  >
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-rose-50">
                      <Image
                        src={award.image}
                        alt={award.title}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {award.title}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {award.org} &middot; {award.year}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. How To Use */}
            <div
              ref={(el) => {
                refs.current["how-to-use"] = el;
              }}
              className="scroll-mt-24 rounded-xl border border-gray-200 bg-white p-5 md:p-8"
            >
              <div className="mb-4 flex items-center gap-2">
                <BookOpen size={18} className="text-rose-600" />
                <h2 className="font-bold text-gray-900">How To Use</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {howToUseSteps.map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <div
                      key={step.title}
                      className="flex gap-3 rounded-xl border border-gray-100 p-4"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-50">
                        <Icon size={16} className="text-rose-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {i + 1}. {step.title}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-gray-500">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 6. Money Back Guarantee */}
            <div
              ref={(el) => {
                refs.current["money-back"] = el;
              }}
              className="scroll-mt-24 rounded-xl border border-gray-200 bg-white p-5 md:p-8"
            >
              <div className="mb-4 flex items-center gap-2">
                <BadgeDollarSign size={18} className="text-rose-600" />
                <h2 className="font-bold text-gray-900">
                  Money Back Guarantee
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-gray-700">
                If you don&apos;t receive a single genuine response within your
                first 30 days on a paid plan, we&apos;ll refund your membership
                in full &mdash; no long forms, no hassle. We&apos;re confident
                in our matches, and we want you to be too.
              </p>
              <div className="mt-4 flex items-center gap-2.5 rounded-lg bg-rose-50 p-3.5">
                <Heart
                  size={16}
                  className="shrink-0 text-rose-600"
                  fill="currentColor"
                />
                <p className="text-sm text-rose-700">
                  Applicable on all Gold, Prime Gold, and Till You Marry plans.
                </p>
              </div>
            </div>

            {/* 7. 100% Secure */}
            <div
              ref={(el) => {
                refs.current["secure"] = el;
              }}
              className="scroll-mt-24 rounded-xl border border-gray-200 bg-white p-5 md:p-8"
            >
              <div className="mb-4 flex items-center gap-2">
                <ShieldCheck size={18} className="text-rose-600" />
                <h2 className="font-bold text-gray-900">100% Secure</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {securityPoints.map((point) => {
                  const Icon = point.icon;
                  return (
                    <div
                      key={point.title}
                      className="rounded-lg border border-gray-100 p-4"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-50">
                        <Icon size={16} className="text-rose-600" />
                      </div>
                      <p className="mt-3 text-sm font-semibold text-gray-900">
                        {point.title}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-gray-500">
                        {point.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 8. Need Help */}
            <div
              ref={(el) => {
                refs.current["help"] = el;
              }}
              className="scroll-mt-24 flex flex-col items-start justify-between gap-4 rounded-xl border border-rose-100 bg-rose-50 px-5 py-5 sm:flex-row sm:items-center"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white">
                  <Phone size={16} className="text-rose-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Need help finding your match?
                  </p>
                  <p className="mt-0.5 text-xs text-gray-600">
                    Our relationship managers are here to guide you, every step
                    of the way.
                  </p>
                </div>
              </div>
              <ThemeBtnOne
                text="Contact Us"
                url="/contact"
                icon={<Phone />}
                className="bg-rose-500 text-white py-2 px-4 rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;

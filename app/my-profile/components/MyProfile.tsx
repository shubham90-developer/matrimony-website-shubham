"use client";
import React, { useState } from "react";
import {
  Pencil,
  Share2,
  MapPin,
  Calendar,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  Home,
  Users,
  Mail,
  Phone,
  Star,
  Clock,
  Images,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const SectionCard = ({
  title,
  subtitle,
  editHref,
  children,
}: {
  title: string;
  subtitle?: string;
  editHref?: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-2xl border border-stone-200 p-5 mb-4">
    <div className="flex items-start justify-between mb-3">
      <div>
        <h3 className="text-xl font-semibold text-stone-900 font-serif">
          {title}
        </h3>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {editHref && (
        <Link
          href={editHref}
          aria-label={`Edit ${title}`}
          className="text-black hover:text-rose-500 transition-colors bg-gray-200 rounded-full p-3 cursor-pointer"
        >
          <Pencil size={16} />
        </Link>
      )}
    </div>
    {children}
  </div>
);

const DetailRow = ({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) => (
  <div className="flex items-center gap-2 text-sm text-stone-600 font-semibold border-b border-dashed border-gray-300 py-4">
    <span className="text-stone-400 shrink-0">{icon}</span>
    <span>{label}</span>
  </div>
);

const EDIT_ROUTES = {
  aboutMe: "/my-profile/about-me",
  basicDetails: "/my-profile/basic-details",
  education: "/my-profile/education",
  career: "/my-profile/career",
  family: "/my-profile/family",
  contact: "/my-profile/contact",
  kundaliAstro: "/my-profile/kundali",
  lifestyleInterests: "/my-profile/interest",
};

const MyProfile = () => {
  const [tab, setTab] = useState("about");

  const profile = {
    name: "Aarav Deshmukh",
    id: "UXZ48213",
    img: "/img/matches/1.jpg",
    height: "5'9\" (1.75 m)",
    community: "Maratha - 96 Kuli Maratha",
    motherTongue: "Marathi",
    location: "Pune, Maharashtra, India",
    income: "Rs. 8 - 12 Lakh p.a.",
    dob: "14 May 1996",
    maritalStatus: "Never Married",
    bio: "I work in software product design. I completed my B.E. and am currently working as a UX Professional at a mid-size tech company. Looking to build a life with someone who values honesty and growth.",
    disability: "No",
    thalassemia: "No, HbA2 - No",
    education: [
      {
        degree: "B.E. / B.Tech - Undergraduate Degree",
        school: "Savitribai Phule Pune University",
      },
      { degree: "High School", school: "Savitribai Phule Pune University" },
    ],
    career: {
      title: "UX Professional",
      company: "at a Technology Group - Private Sector",
      about:
        "I am interested in building my career in product design and eventually leading a design team.",
      settleAbroad: "Not interested in settling abroad",
    },
    family: {
      type: "Upper middle class nuclear family from Pune, Maharashtra, India",
      values: "Moderate",
      father: "Father is retired, mother is a homemaker",
      siblings: "1 sibling (married)",
      about:
        "There are four members in my family. My father is retired, my mother is a homemaker, and I have one married sibling.",
      livingWithParents: false,
    },
    contact: {
      email: "name@example.com",
      phone: "+91 90000 00000",
      altPhone: "+91 90000 00001",
      altEmail: "name.alt@example.com",
    },
    astro: {
      rashi: "Kark - Non Manglik",
      nakshatra: "Pushya / Poonam / Pooyam",
      dob: "3 Aug 1997 - 00 Hrs 15 Mins",
      birthPlace: "Born in Solapur, Maharashtra, India",
      horoscopeMustMatch: true,
    },
  };

  return (
    <div>
      {/* Header photo */}
      <div className="relative h-105 overflow-hidden rounded-t-2xl bg-stone-200">
        <Image
          src={profile.img}
          alt={profile.name}
          fill
          priority
          className="object-contain object-top"
          sizes="100vw"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />

        {/* Actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Link
            href="/my-profile/add-profile"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm"
          >
            <Images size={18} />
          </Link>

          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm">
            <Share2 size={18} />
          </button>
        </div>

        {/* Bottom Content */}
        <div className="absolute bottom-0 left-0 right-0 px-5 py-5">
          <h4 className="font-serif text-2xl font-bold text-white">
            {profile.name}
          </h4>
          <p className="mt-1 text-sm font-medium text-white/80">
            ID - {profile.id}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200 bg-white px-4">
        {["about", "looking"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`py-3 px-3 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
              tab === t
                ? "border-rose-500 text-rose-500"
                : "border-transparent text-stone-400"
            }`}
          >
            {t === "about" ? "About me" : "Looking for"}
          </button>
        ))}
      </div>

      <div className="p-4">
        {tab === "about" ? (
          <>
            <SectionCard
              title="About me"
              subtitle="Describe yourself in a few words"
              editHref={EDIT_ROUTES.aboutMe}
            >
              <p className="text-md text-black leading-relaxed mb-3">
                {profile.bio}
              </p>
              <div className="text-xs text-gray-900 space-y-1 border-t border-stone-100 pt-2">
                <p>Disability - {profile.disability}</p>
                <p>Thalassemia - {profile.thalassemia}</p>
              </div>
            </SectionCard>

            <SectionCard
              title="Basic details"
              subtitle="Brief outline of personal information"
              editHref={EDIT_ROUTES.basicDetails}
            >
              <div className="space-y-0.5">
                <DetailRow icon={<span>↕</span>} label={profile.height} />
                <DetailRow icon={<span>🕉</span>} label={profile.community} />
                <DetailRow
                  icon={<span>🗣</span>}
                  label={`Mother tongue is ${profile.motherTongue}`}
                />
                <DetailRow
                  icon={<MapPin size={14} />}
                  label={profile.location}
                />
                <DetailRow icon={<span>₹</span>} label={profile.income} />
                <DetailRow icon={<Calendar size={14} />} label={profile.dob} />
                <DetailRow
                  icon={<span>♥</span>}
                  label={profile.maritalStatus}
                />
              </div>
            </SectionCard>

            <SectionCard
              title="Education"
              subtitle="Showcase your educational qualification"
              editHref={EDIT_ROUTES.education}
            >
              <div className="space-y-3">
                {profile.education.map((e, i) => (
                  <div key={i} className="flex gap-3">
                    <GraduationCap
                      size={16}
                      className="text-stone-400 mt-0.5 shrink-0"
                    />
                    <div>
                      <p className="text-sm text-stone-800 font-semibold">
                        {e.degree}
                      </p>
                      <p className="text-xs text-gray-700">{e.school}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-400">
                About my education
              </div>
            </SectionCard>

            <SectionCard
              title="Career"
              subtitle="Give a glimpse of your professional life"
              editHref={EDIT_ROUTES.career}
            >
              <div className="flex gap-3 mb-3">
                <Briefcase
                  size={16}
                  className="text-stone-400 mt-0.5 shrink-0"
                />
                <div>
                  <p className="text-sm text-stone-800 font-semibold">
                    {profile.career.title}
                  </p>
                  <p className="text-xs text-gray-900">
                    {profile.career.company}
                  </p>
                </div>
              </div>
              <div className="border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-500 mb-2">
                {profile.career.about}
              </div>
              <p className="text-xs text-amber-600">
                ⚠ {profile.career.settleAbroad}
              </p>
            </SectionCard>

            <SectionCard
              title="Family"
              subtitle="Introduce your family members, values and background"
              editHref={EDIT_ROUTES.family}
            >
              <div className="flex gap-3 mb-3">
                <Home size={16} className="text-stone-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-stone-800 font-semibold">
                    {profile.family.type}
                  </p>
                  <p className="text-xs text-gray-500">
                    {profile.family.values}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 mb-3">
                <Users size={16} className="text-stone-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-stone-800 font-semibold">
                    {profile.family.father}
                  </p>
                  <p className="text-xs text-gray-500">
                    {profile.family.siblings}
                  </p>
                </div>
              </div>
              <div className="border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-500 mb-2">
                <p className="font-semibold text-stone-700 mb-1">
                  About my family
                </p>
                {profile.family.about}
              </div>
              {!profile.family.livingWithParents && (
                <p className="text-xs text-amber-600">
                  ⚠ Not living with parents
                </p>
              )}
            </SectionCard>

            <SectionCard
              title="Contact"
              subtitle="Details that would get profiles in touch with you"
              editHref={EDIT_ROUTES.contact}
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <Mail size={16} className="text-stone-400 shrink-0" />
                  {profile.contact.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-stone-700">
                  <Phone size={16} className="text-stone-400 shrink-0" />
                  {profile.contact.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-stone-700">
                  <Phone size={16} className="text-stone-400 shrink-0" />
                  {profile.contact.altPhone}
                  <span className="text-xs text-gray-400">(Alternate)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <Mail size={16} className="text-stone-400 shrink-0" />
                  {profile.contact.altEmail}
                  <span className="text-xs text-gray-400">(Alternate)</span>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title="Kundali and Astro"
              subtitle="These details help increase chances of compatibility"
              editHref={EDIT_ROUTES.kundaliAstro}
            >
              <div className="flex gap-3 mb-3">
                <Star size={16} className="text-stone-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-stone-800 font-semibold">
                    {profile.astro.rashi}
                  </p>
                  <p className="text-xs text-gray-500">
                    {profile.astro.nakshatra}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 mb-3">
                <Clock size={16} className="text-stone-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-stone-800 font-semibold">
                    {profile.astro.dob}
                  </p>
                  <p className="text-xs text-gray-500">
                    {profile.astro.birthPlace}
                  </p>
                </div>
              </div>
              {profile.astro.horoscopeMustMatch && (
                <p className="text-xs text-amber-600">
                  ⚠ Horoscope match is must
                </p>
              )}
              <div className="mt-4 bg-rose-50 rounded-xl p-4 text-center">
                <p className="text-sm text-rose-500 font-semibold mb-2">
                  Here is your Janampatri!
                </p>
                <p className="text-xs text-stone-500 mb-3">
                  Tap on the file below to have a look at it
                </p>
                <Link
                  href={`${EDIT_ROUTES.kundaliAstro}/janampatri`}
                  className="inline-block border border-stone-200 rounded-lg px-4 py-2 text-xs text-stone-500 bg-white"
                >
                  View Janampatri
                </Link>
              </div>
            </SectionCard>

            <SectionCard
              title="My lifestyle & interests"
              subtitle="Give other profiles a glimpse of your favourite activities"
              editHref={EDIT_ROUTES.lifestyleInterests}
            >
              <div className="border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-400">
                Add your hobbies, interests and lifestyle preferences.
              </div>
            </SectionCard>
          </>
        ) : (
          <>
            <SectionCard
              title="Partner Basic details"
              subtitle="Brief outline of personal information"
              editHref={"/my-profile/partner-preferences"}
            >
              <div className="space-y-0.5">
                <DetailRow icon={<span>↕</span>} label={profile.height} />
                <DetailRow icon={<span>🕉</span>} label={profile.community} />
                <DetailRow
                  icon={<span>🗣</span>}
                  label={`Mother tongue is ${profile.motherTongue}`}
                />
                <DetailRow
                  icon={<MapPin size={14} />}
                  label={profile.location}
                />
                <DetailRow icon={<span>₹</span>} label={profile.income} />
                <DetailRow icon={<Calendar size={14} />} label={profile.dob} />
                <DetailRow
                  icon={<span>♥</span>}
                  label={profile.maritalStatus}
                />
              </div>
            </SectionCard>

            <SectionCard
              title="Partner Education & Occupation"
              subtitle="Showcase your educational qualification"
              editHref={"/my-profile/partner-preferences"}
            >
              <div className="space-y-3">
                {profile.education.map((e, i) => (
                  <div key={i} className="flex gap-3">
                    <GraduationCap
                      size={16}
                      className="text-stone-400 mt-0.5 shrink-0"
                    />
                    <div>
                      <p className="text-sm text-stone-800 font-semibold">
                        {e.degree}
                      </p>
                      <p className="text-xs text-gray-700">{e.school}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-400">
                About my education
              </div>
            </SectionCard>

            <SectionCard
              title="Partner Family"
              subtitle="Introduce your family members, values and background"
              editHref={"/my-profile/partner-preferences"}
            >
              <div className="flex gap-3 mb-3">
                <Home size={16} className="text-stone-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-stone-800 font-semibold">
                    {profile.family.type}
                  </p>
                  <p className="text-xs text-gray-500">
                    {profile.family.values}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 mb-3">
                <Users size={16} className="text-stone-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-stone-800 font-semibold">
                    {profile.family.father}
                  </p>
                  <p className="text-xs text-gray-500">
                    {profile.family.siblings}
                  </p>
                </div>
              </div>
              <div className="border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-500 mb-2">
                <p className="font-semibold text-stone-700 mb-1">
                  About my family
                </p>
                {profile.family.about}
              </div>
              {!profile.family.livingWithParents && (
                <p className="text-xs text-amber-600">
                  ⚠ Not living with parents
                </p>
              )}
            </SectionCard>

            <SectionCard
              title="Partner lifestyle & Apperances"
              subtitle="Give other profiles a glimpse of your favourite activities"
              editHref={EDIT_ROUTES.lifestyleInterests}
            >
              <div className="border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-400">
                Add your hobbies, interests and lifestyle preferences.
              </div>
            </SectionCard>
          </>
        )}

        {/* Verification banner */}
        <div className="bg-rose-50 border border-rose-100 rounded-xl px-4 py-3 mb-4 flex items-center gap-3">
          <ShieldCheck className="text-rose-400 shrink-0" size={22} />
          <p className="text-xs text-stone-600">
            Get a verified gold badge, stand out, and connect with more genuine
            profiles.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;

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
import { useGetMyProfileQuery } from "@/Redux/profileApi";

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
  const { data, isLoading, isError } = useGetMyProfileQuery();
  const apiProfile = data?.data;

  if (isLoading) {
    return (
      <div className="p-8 text-center text-sm text-stone-500">
        Loading profile...
      </div>
    );
  }

  if (isError || !apiProfile) {
    return (
      <div className="p-8 text-center text-sm text-rose-500">
        Could not load profile. Please try again later.
      </div>
    );
  }

  // ---- Map API shape to the same flat shape the UI below expects ----
  const profile = {
    name: `${apiProfile.basicDetails.firstName} ${apiProfile.basicDetails.lastName}`,
    id: apiProfile.matrimonyId,
    img: apiProfile.photos?.[0] || "/img/matches/1.jpg",
    height: apiProfile.basicDetails.height,
    community: `${apiProfile.religionDetails.caste}${
      apiProfile.religionDetails.subCaste
        ? " - " + apiProfile.religionDetails.subCaste
        : ""
    }`,
    motherTongue: apiProfile.religionDetails.motherTongue,
    location: `${apiProfile.locationDetails.city}, ${apiProfile.locationDetails.state}, ${apiProfile.locationDetails.country}`,
    income: apiProfile.educationDetails.annualIncome,
    dob: apiProfile.basicDetails.dob,
    maritalStatus: apiProfile.basicDetails.maritalStatus,
    bio: apiProfile.aboutMe.about,
    disability: apiProfile.aboutMe.disability || "No",
    thalassemia: apiProfile.aboutMe.thalassemia || "No",
    education: [
      {
        degree: apiProfile.education.highestDegree,
        school: apiProfile.education.school,
      },
    ],
    career: {
      title: apiProfile.careerDetails.occupation,
      company: apiProfile.careerDetails.organizationName,
      about: apiProfile.education.aboutEducation,
      settleAbroad: apiProfile.careerDetails.interestedInSettlingAbroad
        ? "Interested in settling abroad"
        : "Not interested in settling abroad",
    },
    family: {
      type: `${apiProfile.family.familyType} family from ${apiProfile.family.familyBasedOutOf}`,
      values: apiProfile.family.familyValue,
      father: `Father's occupation - ${apiProfile.family.fatherOccupation}`,
      siblings: `${apiProfile.family.brothers} brother(s), ${apiProfile.family.sisters} sister(s)`,
      about: apiProfile.family.aboutFamily,
      livingWithParents: apiProfile.family.livingWithParents,
    },
    contact: {
      email: apiProfile.contactDetails.email,
      phone: apiProfile.contactDetails.phoneNumber,
      altPhone: apiProfile.contactDetails.alternatePhoneNumber,
      altEmail: apiProfile.contactDetails.alternateEmail,
    },
    astro: {
      rashi: apiProfile.horoscopeDetails.starDetails.rashi,
      nakshatra: apiProfile.horoscopeDetails.starDetails.nakshatra,
      dob: `${apiProfile.basicDetails.dob} - ${apiProfile.horoscopeDetails.birthTime.hour} Hrs ${apiProfile.horoscopeDetails.birthTime.minute} Mins ${apiProfile.horoscopeDetails.birthTime.meridiem}`,
      birthPlace: `Born in ${apiProfile.horoscopeDetails.birthPlace.city}, ${apiProfile.horoscopeDetails.birthPlace.state}, ${apiProfile.horoscopeDetails.birthPlace.country}`,
      horoscopeMustMatch: apiProfile.religionDetails.hasDosh,
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

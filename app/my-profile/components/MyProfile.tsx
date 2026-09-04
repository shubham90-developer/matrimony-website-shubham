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
  HeartPulse,
  UserRound,
  HandHeartIcon,
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
        // FIX: was previously only shown (hardcoded) under Career; now bound
        // to the actual field here too so the Education card can render it.
        about: apiProfile.education.aboutEducation,
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
    // FIX: this whole block was missing before — "My lifestyle & interests"
    // was rendering a hardcoded placeholder instead of apiProfile.lifestyle.
    lifestyle: {
      dietaryHabit: apiProfile.lifestyle?.dietaryHabit || "",
      drinkingHabit: apiProfile.lifestyle?.drinkingHabit || "",
      smokingHabit: apiProfile.lifestyle?.smokingHabit || "",
      dressStyle: apiProfile.lifestyle?.dressStyle || "",
      hobbies: apiProfile.lifestyle?.hobbies || [],
      sports: apiProfile.lifestyle?.sports || [],
      cuisine: apiProfile.lifestyle?.cuisine || [],
      favouriteMusic: apiProfile.lifestyle?.favouriteMusic || [],
      favouriteBooks: apiProfile.lifestyle?.favouriteBooks || [],
      movies: apiProfile.lifestyle?.movies || [],
      hasData: Boolean(
        apiProfile.lifestyle?.dietaryHabit ||
        apiProfile.lifestyle?.drinkingHabit ||
        apiProfile.lifestyle?.smokingHabit ||
        apiProfile.lifestyle?.dressStyle ||
        apiProfile.lifestyle?.hobbies?.length ||
        apiProfile.lifestyle?.sports?.length ||
        apiProfile.lifestyle?.cuisine?.length ||
        apiProfile.lifestyle?.favouriteMusic?.length ||
        apiProfile.lifestyle?.favouriteBooks?.length ||
        apiProfile.lifestyle?.movies?.length,
      ),
    },
  };

  // Grouped lifestyle tag data, used to render the "My lifestyle & interests" card.
  const lifestyleTagGroups = [
    { label: "Hobbies", items: profile.lifestyle.hobbies },
    { label: "Sports", items: profile.lifestyle.sports },
    { label: "Cuisine", items: profile.lifestyle.cuisine },
    { label: "Music", items: profile.lifestyle.favouriteMusic },
    { label: "Books", items: profile.lifestyle.favouriteBooks },
    { label: "Movies & Shows", items: profile.lifestyle.movies },
  ].filter((group) => group.items.length > 0);

  return (
    <div>
      {/* Header photo */}
      <div className="relative h-105 overflow-hidden rounded-t-2xl bg-stone-200">
        <Image
          src={profile.img}
          alt={profile.name}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent" />

        {/* Actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Link
            href="/my-profile/add-profile"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition hover:bg-black/60"
          >
            <Images size={18} />
          </Link>

          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition hover:bg-black/60">
            <Share2 size={18} />
          </button>
        </div>

        {/* Bottom Content */}
        <div className="absolute inset-x-0 bottom-0 px-5 py-5">
          <h4 className="font-serif text-2xl font-bold text-white">
            {profile.name}
          </h4>

          <p className="mt-2 inline-flex rounded-full border border-white/20 bg-black/40 px-3 py-1 text-sm font-medium text-white backdrop-blur-md">
            Member ID - {profile.id}
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
              {/* Bio */}
              <div className="flex gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-500">
                  <UserRound size={17} />
                </div>

                <p className="text-md leading-relaxed text-black">
                  {profile.bio}
                </p>
              </div>

              {/* Additional Information */}
              <div className="mt-4 space-y-2 border-t border-stone-100 pt-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-100 text-stone-600">
                    <HandHeartIcon size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-stone-400">Disability</p>
                    <p className="text-sm font-medium text-stone-800">
                      {profile.disability}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-100 text-stone-600">
                    <HeartPulse size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-stone-400">Thalassemia</p>
                    <p className="text-sm font-medium text-stone-800">
                      {profile.thalassemia}
                    </p>
                  </div>
                </div>
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
              {/* FIX: was a static "About my education" label with no data.
                  Now renders the real aboutEducation text, and falls back
                  to the original placeholder only when it's empty. */}
              <div className="mt-3 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-500">
                {profile.education[0]?.about || (
                  <span className="text-stone-400">About my education</span>
                )}
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
                {/* Email */}
                <div className="flex items-center gap-3 rounded-xl bg-blue-50 px-3 py-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <Mail size={17} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] font-medium text-blue-500">
                      Email
                    </p>
                    <p className="truncate text-sm font-medium text-stone-800">
                      {profile.contact.email}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-3 rounded-xl bg-emerald-50 px-3 py-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <Phone size={17} />
                  </div>

                  <div>
                    <p className="text-[11px] font-medium text-emerald-500">
                      Phone
                    </p>
                    <p className="text-sm font-medium text-stone-800">
                      {profile.contact.phone}
                    </p>
                  </div>
                </div>

                {/* Alternate Phone */}
                <div className="flex items-center gap-3 rounded-xl bg-orange-50 px-3 py-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                    <Phone size={17} />
                  </div>

                  <div>
                    <p className="text-[11px] font-medium text-orange-500">
                      Alternate Phone
                    </p>
                    <p className="text-sm font-medium text-stone-800">
                      {profile.contact.altPhone}
                    </p>
                  </div>
                </div>

                {/* Alternate Email */}
                <div className="flex items-center gap-3 rounded-xl bg-purple-50 px-3 py-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                    <Mail size={17} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] font-medium text-purple-500">
                      Alternate Email
                    </p>
                    <p className="truncate text-sm font-medium text-stone-800">
                      {profile.contact.altEmail}
                    </p>
                  </div>
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
              {/* FIX: previously a hardcoded placeholder regardless of data.
                  Now renders apiProfile.lifestyle, and only falls back to
                  the placeholder when the user truly hasn't filled it in. */}
              {profile.lifestyle.hasData ? (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2 text-xs text-stone-600">
                    {profile.lifestyle.dietaryHabit && (
                      <span className="border border-stone-200 rounded-full px-3 py-1 bg-stone-50">
                        🍽 {profile.lifestyle.dietaryHabit}
                      </span>
                    )}
                    {profile.lifestyle.drinkingHabit && (
                      <span className="border border-stone-200 rounded-full px-3 py-1 bg-stone-50">
                        🍷 Drinks: {profile.lifestyle.drinkingHabit}
                      </span>
                    )}
                    {profile.lifestyle.smokingHabit && (
                      <span className="border border-stone-200 rounded-full px-3 py-1 bg-stone-50">
                        🚬 Smokes: {profile.lifestyle.smokingHabit}
                      </span>
                    )}
                    {profile.lifestyle.dressStyle && (
                      <span className="border border-stone-200 rounded-full px-3 py-1 bg-stone-50">
                        👕 {profile.lifestyle.dressStyle} style
                      </span>
                    )}
                  </div>

                  {lifestyleTagGroups.map((group) => (
                    <div key={group.label}>
                      <p className="text-[11px] font-medium text-stone-400 mb-1">
                        {group.label}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {group.items.map((item, idx) => (
                          <span
                            key={idx}
                            className="border border-stone-200 rounded-full px-3 py-1 text-xs text-stone-600 bg-white"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-400">
                  Add your hobbies, interests and lifestyle preferences.
                </div>
              )}
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
              {/* NOTE: left as-is intentionally — the API response has no
                  partner-preference lifestyle data to bind this to yet.
                  Once your backend returns something like
                  apiProfile.partnerPreferences.lifestyle, map it here the
                  same way "My lifestyle & interests" is done above. */}
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

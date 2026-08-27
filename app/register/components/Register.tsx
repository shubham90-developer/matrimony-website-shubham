"use client";

import ThemeBtnOne from "@/app/components/ThemeBtnOne";
import {
  ChevronLeft,
  Mars,
  Venus,
  Users,
  Star,
  Camera,
  Plus,
  X,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useGetHeightsQuery } from "@/Redux/heightApi";
import { useGetQualificationsQuery } from "@/Redux/qualificationApi";
import { useGetOccupationsQuery } from "@/Redux/occupationApi";
import { useGetAnnualIncomesQuery } from "@/Redux/annualIncomeApi";
import { useGetReligionsQuery } from "@/Redux/religionApi";
import { useGetCastesByReligionQuery } from "@/Redux/casteApi";
import { useGetSubCastesByCasteQuery } from "@/Redux/subCasteApi";
import { useGetMotherTonguesQuery } from "@/Redux/motherToungeApi";
import { Country, State, City } from "country-state-city";
import {
  useAddProfileMutation,
  useUploadProfilePhotosMutation,
  ProfilePayload,
} from "@/Redux/profileApi";

type Gender = "male" | "female";
type ProfileFor = "self" | "someone-else";
type MaritalStatus = "never-married" | "married" | "divorced" | "widowed";

type ProfileImage = {
  id: string;
  file: File;
  url: string;
};

const STEPS = [
  "profile",
  "name",
  "birthplace",
  "education",
  "religion",
  "location",
  "additional",
  "family",
  "horoscope",
  "birth",
  "habbits",
  "About",
  "profileimages",
] as const;
type StepKey = (typeof STEPS)[number];

// Steps up to (but excluding) "horoscope" require every field on that step
// to be filled before the user can move to Next. Steps from "horoscope"
// onward remain optional, as requested.
const HOROSCOPE_STEP_INDEX = STEPS.indexOf("horoscope");

// Extracts a readable message out of a backend error response.
// Handles the common Zod-style shape:
// { success: false, message: "[{ ...  \"message\": \"Too small...\" }]" }
// where `message` is itself a JSON-stringified array of issues.
function getBackendErrorMessage(err: unknown, fallback: string): string {
  const backendMessage = (err as { data?: { message?: unknown } })?.data
    ?.message;

  if (typeof backendMessage !== "string" || !backendMessage.trim()) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(backendMessage);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Join all issue messages so the user sees everything the backend flagged.
      const messages = parsed
        .map((issue) => issue?.message)
        .filter((m): m is string => typeof m === "string" && m.length > 0);
      if (messages.length) return messages.join(" ");
    }
  } catch {
    // Not JSON — it's already a plain string message.
  }

  return backendMessage;
}

const Register = () => {
  const { data: heightsRes, isLoading: heightsLoading } = useGetHeightsQuery();
  const heightOptions = heightsRes?.data?.map((h) => h.height) ?? [];

  const { data: qualificationsRes } = useGetQualificationsQuery();
  const { data: occupationsRes } = useGetOccupationsQuery();
  const { data: annualIncomesRes } = useGetAnnualIncomesQuery();

  const qualifications = qualificationsRes?.data ?? [];
  const occupations = occupationsRes?.data ?? [];
  const annualIncomes = annualIncomesRes?.data ?? [];

  const educationTypes = Array.from(
    new Set(qualifications.map((q) => q.educationType).filter(Boolean)),
  );

  const [religionId, setReligionId] = useState("");
  const [casteId, setCasteId] = useState("");

  const { data: religionsRes } = useGetReligionsQuery();
  const { data: castesRes } = useGetCastesByReligionQuery(religionId, {
    skip: !religionId,
  });
  const { data: subCastesRes } = useGetSubCastesByCasteQuery(casteId, {
    skip: !casteId,
  });
  const { data: motherTonguesRes } = useGetMotherTonguesQuery();

  const religions = religionsRes?.data ?? [];
  const castes = castesRes?.data ?? [];
  const subCastes = subCastesRes?.data ?? [];
  const motherTongues = motherTonguesRes?.data ?? [];

  // ---------- Profile creation mutation ----------
  const [addProfile, { isLoading: isCreatingProfile }] =
    useAddProfileMutation();
  const [uploadProfilePhotos, { isLoading: isUploadingPhotos }] =
    useUploadProfilePhotosMutation();
  const isSubmitting = isCreatingProfile || isUploadingPhotos;
  const [submitError, setSubmitError] = useState("");

  const [stepIndex, setStepIndex] = useState(0);
  const step = STEPS[stepIndex];

  const [profileFor, setProfileFor] = useState<ProfileFor | null>(null);
  const [gender, setGender] = useState<Gender | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthCountry, setBirthCountry] = useState("");
  const [birthCity, setBirthCity] = useState("");
  const [maritalStatus, setMaritalStatus] = useState<MaritalStatus | null>(
    null,
  );
  const [qualification, setQualification] = useState("");
  const [institution] = useState("");
  const [fieldOfStudy] = useState("");

  const [educationType, setEducationType] = useState("");
  const [occupation, setOccupation] = useState("");
  const [annualIncome, setAnnualIncome] = useState("");

  const [religion, setReligion] = useState("");
  const [caste, setCaste] = useState("");
  const [subCaste, setSubCaste] = useState("");
  const [dosh, setDosh] = useState("");
  const [motherTongue, setMotherTongue] = useState("");

  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  // ISO codes are only needed to look up child dropdown options
  // (country-state-city requires isoCode, not the display name).
  // The plain-name state above (country/state/city) is what still
  // gets saved into the payload, so nothing downstream changes.
  const [countryIso, setCountryIso] = useState("");
  const [stateIso, setStateIso] = useState("");

  const [familyStatus, setFamilyStatus] = useState("");
  const [brothers, setBrothers] = useState("");
  const [marriedBrothers, setMarriedBrothers] = useState("");
  const [sisters, setSisters] = useState("");
  const [marriedSisters, setMarriedSisters] = useState("");

  // NEW: was missing state entirely — the "family" step's Yes/No question
  // was previously (incorrectly) reusing familyStatus, which is also used
  // by the unrelated "additional" step's socio-economic Family Status field.
  // Split out so both fields save correctly.
  const [livingWithFamily, setLivingWithFamily] = useState("");
  // NEW: was missing state — the "Where is your family located?" input had
  // no value/onChange at all before.
  const [familyBasedOutOf, setFamilyBasedOutOf] = useState("");

  const [eatingHabit, setEatingHabit] = useState("");
  const [smokingHabit, setSmokingHabit] = useState("");
  const [drinkingHabit, setDrinkingHabit] = useState("");

  const [birthState, setBirthState] = useState("");
  // Same ISO-lookup pattern as the location step above, scoped to birth place.
  const [birthCountryIso, setBirthCountryIso] = useState("");
  const [birthStateIso, setBirthStateIso] = useState("");
  const [timeCorrection, setTimeCorrection] = useState("");
  const [nakshatra, setNakshatra] = useState("");
  const [rashi, setRashi] = useState("");

  // NEW: was missing state — the horoscope step's Date of Birth input and
  // Hour/Minute/AM-PM selects had no value/onChange at all before.
  const [horoscopeDob, setHoroscopeDob] = useState("");
  // Defaulted to "01" (not "") since the backend requires hour >= 1 and the
  // horoscope step is intentionally optional in the UI — this guarantees a
  // valid value is always submitted even if the user skips this step.
  const [birthHour, setBirthHour] = useState("01");
  const [birthMinute, setBirthMinute] = useState("00");
  const [birthMeridiem, setBirthMeridiem] = useState("AM");

  const [about, setAbout] = useState("");

  const goNext = () => setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  const goBack = () => setStepIndex((i) => Math.max(i - 1, 0));

  const isLastStep = stepIndex === STEPS.length - 1;
  const MAX_PHOTOS = 6;

  // Inside your component, alongside other useState calls:
  const [images, setImages] = useState<ProfileImage[]>([]);
  const [mainImageId, setMainImageId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Clean up object URLs on unmount / when images change
  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.url));
    };
  }, [images]);

  const addFiles = (fileList: FileList | File[]) => {
    const incoming = Array.from(fileList).filter((f) =>
      f.type.startsWith("image/"),
    );
    if (!incoming.length) return;

    setImages((prev) => {
      const room = MAX_PHOTOS - prev.length;
      if (room <= 0) return prev;
      const toAdd = incoming.slice(0, room).map((file) => ({
        id: `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file,
        url: URL.createObjectURL(file),
      }));
      const next = [...prev, ...toAdd];
      if (!mainImageId && next.length) setMainImageId(next[0].id);
      return next;
    });
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const next = prev.filter((img) => img.id !== id);
      const removed = prev.find((img) => img.id === id);
      if (removed) URL.revokeObjectURL(removed.url);
      if (mainImageId === id) {
        setMainImageId(next.length ? next[0].id : null);
      }
      return next;
    });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  const openFilePicker = () => fileInputRef.current?.click();

  const remainingSlots = MAX_PHOTOS - images.length;

  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  const [birthDay, setBirthDay] = useState("1");
  const [birthMonth, setBirthMonth] = useState("January");
  const [birthYear, setBirthYear] = useState("2000");

  const [height, setHeight] = useState("5 ft 7 in (170cm)");
  const [exactHeight, setExactHeight] = useState("");

  // NEW: age was hardcoded as "25 years old" regardless of the selected
  // birth date. Now computed from birthDay/birthMonth/birthYear.
  const computedAge = React.useMemo(() => {
    const monthIndex = months.indexOf(birthMonth);
    if (monthIndex === -1) return 0;
    const dob = new Date(Number(birthYear), monthIndex, Number(birthDay));
    let age = currentYear - dob.getFullYear();
    const hasHadBirthdayThisYear =
      new Date().getMonth() > monthIndex ||
      (new Date().getMonth() === monthIndex &&
        new Date().getDate() >= Number(birthDay));
    if (!hasHadBirthdayThisYear) age -= 1;
    return Math.max(age, 0);
  }, [birthDay, birthMonth, birthYear, currentYear]);

  const maritalOptions = [
    "Never Married",
    "Divorced",
    "Widowed",
    "Awaiting Divorce",
  ];

  // ---------- country-state-city data, derived per current selection ----------
  const countryList = Country.getAllCountries();
  const stateList = countryIso ? State.getStatesOfCountry(countryIso) : [];
  const cityList =
    countryIso && stateIso ? City.getCitiesOfState(countryIso, stateIso) : [];

  const birthStateList = birthCountryIso
    ? State.getStatesOfCountry(birthCountryIso)
    : [];
  const birthCityList =
    birthCountryIso && birthStateIso
      ? City.getCitiesOfState(birthCountryIso, birthStateIso)
      : [];

  const OptionGroup = ({
    title,
    options,
    value,
    onChange,
  }: {
    title: string;
    options: string[];
    value: string;
    onChange: (value: string) => void;
  }) => (
    <div>
      <h2 className="mb-3 text-md font-bold text-slate-900">{title}</h2>

      <div className="flex flex-wrap gap-3">
        {options.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition cursor-pointer ${
              value === item
                ? "border-rose-400 bg-rose-50 text-rose-600"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );

  // Steps before "horoscope" now require every field on that step to be
  // filled in. "horoscope" itself and everything after it stays optional.
  const canContinue: Record<StepKey, boolean> = {
    profile: !!profileFor && !!gender,

    name: firstName.trim().length > 0 && lastName.trim().length > 0,

    birthplace:
      !!birthDay && !!birthMonth && !!birthYear && !!height && !!maritalStatus,

    education:
      qualification.trim().length > 0 &&
      educationType.trim().length > 0 &&
      occupation.trim().length > 0 &&
      annualIncome.trim().length > 0,

    religion:
      !!religionId &&
      !!casteId &&
      subCaste.trim().length > 0 &&
      !!dosh &&
      motherTongue.trim().length > 0,

    location: !!country && !!state && !!city,

    additional:
      !!familyStatus &&
      !!brothers &&
      !!marriedBrothers &&
      !!sisters &&
      !!marriedSisters,

    family: !!livingWithFamily && familyBasedOutOf.trim().length > 0,

    // Optional from here on, as requested.
    horoscope: true,
    birth: true,
    habbits: true,
    About: true,
    profileimages: true,
  };

  // ---------- Build the ProfilePayload from all step state ----------
  const buildProfilePayload = (): ProfilePayload => ({
    basicDetails: {
      profileFor: profileFor ?? "",
      gender: gender === "male" ? "Male" : gender === "female" ? "Female" : "",
      firstName,
      lastName,
      dob: `${birthYear}-${String(months.indexOf(birthMonth) + 1).padStart(2, "0")}-${String(birthDay).padStart(2, "0")}`,
      age: computedAge,
      height,
      maritalStatus: maritalStatus ?? "",
    },
    educationDetails: {
      highestQualification: qualification,
      educationType,
      occupation,
      annualIncome,
    },
    religionDetails: {
      religion,
      caste,
      subCaste,
      hasDosh: dosh === "Yes",
      motherTongue,
    },
    locationDetails: {
      country,
      state,
      city,
    },
    additionalDetails: {
      classType: familyStatus,
      brothers,
      marriedBrothers,
      sisters,
      marriedSisters,
      livingWithFamily: livingWithFamily === "Yes",
      familyLocation: familyBasedOutOf,
    },
    horoscopeDetails: {
      birthTime: {
        // birthHour/birthMinute default to "01"/"00" so this is always a
        // valid, non-zero hour even when the (optional) horoscope step is
        // skipped entirely — avoids the backend's "hour >= 1" validation error.
        hour: Number(birthHour) || 1,
        minute: Number(birthMinute) || 0,
        meridiem: birthMeridiem,
      },
      birthPlace: {
        country: birthCountry,
        state: birthState,
        city: birthCity,
      },
      starDetails: {
        nakshatra,
        rashi,
      },
    },
    lifestyleDetails: {
      eatingHabit,
    },
    aboutMe: {
      about,
      // Not collected by any step in this form yet — defaulted.
      describeYourself: "",
      profileCreatedBy: profileFor === "self" ? "Self" : "Family",
      languagesISpeak: motherTongue ? [motherTongue] : [],
      disability: "",
      thalassemia: "",
      hivStatus: false,
    },
    careerDetails: {
      // Not collected by a dedicated field yet — occupation doubles here.
      employedIn: "",
      occupation,
      organizationName: "",
      interestedInSettlingAbroad: false,
    },
    education: {
      aboutEducation: "",
      highestDegree: qualification,
      postGraduation: "",
      underGraduation: "",
      school: institution,
    },
    family: {
      aboutFamily: "",
      fatherOccupation: "",
      motherOccupation: "",
      brothers,
      sisters,
      familyIncome: "",
      familyStatus,
      familyType: "",
      familyValue: "",
      livingWithParents: livingWithFamily === "Yes",
      familyBasedOutOf,
    },
    contactDetails: {
      // Not collected by this form — typically comes from the OTP-verified
      // mobile/account, not a form field. Defaulted here.
      email: "",
      alternateEmail: "",
      phoneNumber: "",
      alternatePhoneNumber: "",
      landlineNumber: "",
      relationshipWithBrideOrGroom: "",
    },
    lifestyle: {
      dietaryHabit: eatingHabit,
      drinkingHabit,
      smokingHabit,
      openToPets: false,
      ownHouse: false,
      ownCar: false,
      foodICook: "",
      hobbies: [],
      favouriteMusic: [],
      favouriteBooks: [],
      dressStyle: "",
      sports: [],
      cuisine: [],
      movies: [],
      favouriteRead: [],
      tvShow: [],
    },
  });

  const handlePrimaryAction = async () => {
    if (!canContinue[step]) return;

    if (isLastStep) {
      setSubmitError("");
      try {
        // STEP 1 — create the profile (plain JSON, no photos).
        const payload = buildProfilePayload();
        await addProfile(payload).unwrap();

        // STEP 2 — if any photos were added, upload them for the profile
        // just created. A failure here doesn't roll back step 1 — the
        // profile still exists — so it gets its own error message.
        if (images.length > 0) {
          try {
            await uploadProfilePhotos(images.map((img) => img.file)).unwrap();
          } catch (photoErr) {
            const photoMsg = getBackendErrorMessage(
              photoErr,
              "Your profile was created, but photo upload failed. You can add photos later from your profile.",
            );
            setSubmitError(photoMsg);
            toast.error(photoMsg);
            return;
          }
        }

        toast.success("Profile created successfully!");
        // Success — e.g. redirect to the newly created profile / dashboard.
        // router.push("/my-profile") if using next/navigation's useRouter.
      } catch (err) {
        const message = getBackendErrorMessage(
          err,
          "Failed to create your profile. Please try again.",
        );
        setSubmitError(message);
        toast.error(message);
      }
      return;
    }
    goNext();
  };

  return (
    <div className="w-full min-h-screen bg-[#FDF8F3] py-12 px-5 sm:px-8 lg:px-8 flex justify-center items-start">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="mx-auto w-full max-w-3xl rounded-3xl bg-white p-8 py-10 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)]">
        <div className="flex items-center justify-between mb-8">
          {stepIndex > 0 ? (
            <button
              type="button"
              onClick={goBack}
              className="flex h-9 w-9 border border-slate-200 cursor-pointer items-center justify-center rounded-full text-slate-900 hover:bg-slate-100 transition"
            >
              <ChevronLeft size={18} />
            </button>
          ) : (
            <Link
              href="/"
              className="flex h-9 w-9 border border-slate-200 cursor-pointer items-center justify-center rounded-full text-slate-900 hover:bg-slate-100 transition"
            >
              <ChevronLeft size={18} />
            </Link>
          )}

          <div className="flex gap-1.5">
            {STEPS.map((s, i) => (
              <span
                key={s}
                className={`h-1.5 rounded-full transition-all ${
                  i === stepIndex
                    ? "w-6 bg-rose-400"
                    : i < stepIndex
                      ? "w-1.5 bg-rose-200"
                      : "w-1.5 bg-slate-100"
                }`}
              />
            ))}
          </div>

          <span className="text-xs font-medium text-slate-400">
            {stepIndex + 1}/{STEPS.length}
          </span>
        </div>

        {step === "profile" && (
          <div key="profile" className="animate-[fadeIn_0.25s_ease-out]">
            <h1 className="text-3xl font-extrabold text-slate-900 leading-snug mb-3 font-serif capitalize">
              Who is this profile for?
            </h1>
            <p className="text-sm text-slate-500 mb-8">
              Let us know who you&apos;re creating this profile for
            </p>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
              {(
                [
                  { key: "self", label: "Myself" },
                  { key: "myson", label: "My son" },
                  { key: "mydaughter", label: "My Daughter" },
                  { key: "mybrother", label: "My Brother" },
                  { key: "mysister", label: "My Sister" },
                  { key: "myrelatives", label: "My Relatives" },
                  { key: "myfriends", label: "My Friends" },
                  { key: "someone-else", label: "Someone Else" },
                ] as { key: ProfileFor; label: string }[]
              ).map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setProfileFor(opt.key)}
                  className={`rounded-2xl border px-4 py-4 text-sm font-bold cursor-pointer transition ${
                    profileFor === opt.key
                      ? "border-rose-400 bg-rose-50 text-rose-600"
                      : "border-slate-200 text-slate-700 hover:border-slate-300"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <p className="text-sm font-bold text-slate-900 mb-3 font-serif">
              Select Your Gender
            </p>
            <div className="flex gap-3 mb-10">
              {(
                [
                  {
                    key: "male",
                    label: "Male",
                    icon: Mars,
                  },
                  {
                    key: "female",
                    label: "Female",
                    icon: Venus,
                  },
                ] as {
                  key: Gender;
                  label: string;
                  icon: React.ElementType;
                }[]
              ).map((opt) => {
                const Icon = opt.icon;

                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setGender(opt.key)}
                    className={`flex flex-1 flex-col items-center cursor-pointer gap-2 rounded-2xl border px-4 py-4 transition ${
                      gender === opt.key
                        ? "border-rose-400 bg-rose-50 text-rose-600"
                        : "border-slate-200 text-slate-500 hover:border-slate-300"
                    }`}
                  >
                    <Icon size={24} strokeWidth={2.2} />
                    <span className="text-xs font-semibold text-black">
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === "name" && (
          <div key="name" className="animate-[fadeIn_0.25s_ease-out]">
            <h1 className="text-3xl font-extrabold text-slate-900 leading-snug mb-3 font-serif capitalize">
              What&apos;s your name?
            </h1>
            <p className="text-sm text-slate-500 mb-8">
              This is how you&apos;ll appear across your profile
            </p>

            <div className="space-y-4 mb-10">
              <div>
                <label className="block text-md font-bold text-slate-900  mb-1.5">
                  First Name
                </label>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your first name"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-rose-300 transition"
                />
              </div>
              <div>
                <label className="block text-md font-bold text-slate-900  mb-1.5">
                  Last Name
                </label>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter your last name"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-rose-300 transition"
                />
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-rose-500 focus:ring-rose-500"
                  />

                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      Only show your last name to other users.
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      If selected, you will not be able to see the full names of
                      other users.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {step === "birthplace" && (
          <div className="animate-[fadeIn_0.25s_ease-out]">
            <h1 className="text-3xl font-extrabold text-slate-900 font-serif mb-2">
              Where Were You Born?
            </h1>

            <p className="text-sm text-slate-500 mb-8">
              Tell us your birth date.
            </p>

            <div className="grid grid-cols-3 gap-4">
              {/* Day */}
              <div>
                <label className="block text-md font-bold text-slate-900  mb-1.5">
                  Day
                </label>

                <select
                  value={birthDay}
                  onChange={(e) => setBirthDay(e.target.value)}
                  className="w-full h-14 rounded-2xl border border-slate-200 bg-white px-4 text-base outline-none focus:border-rose-400"
                >
                  {days.map((day) => (
                    <option key={day} value={day}>
                      {String(day).padStart(2, "0")}
                    </option>
                  ))}
                </select>
              </div>

              {/* Month */}
              <div>
                <label className="block text-md font-bold text-slate-900  mb-1.5">
                  Month
                </label>

                <select
                  value={birthMonth}
                  onChange={(e) => setBirthMonth(e.target.value)}
                  className="w-full h-14 rounded-2xl border border-slate-200 bg-white px-4 text-base outline-none focus:border-rose-400"
                >
                  {months.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year */}
              <div>
                <label className="block text-md font-bold text-slate-900  mb-1.5">
                  Year
                </label>

                <select
                  value={birthYear}
                  onChange={(e) => setBirthYear(e.target.value)}
                  className="w-full h-14 rounded-2xl border border-slate-200 bg-white px-4 text-base outline-none focus:border-rose-400"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Age */}
            <div className="mt-5 rounded-full bg-linear-to-r from-rose-100 to-slate-100 px-4 py-3">
              <p className="text-sm text-slate-700">
                You are{" "}
                <span className="font-semibold">{computedAge} years old</span>
              </p>
            </div>

            {/* Height */}
            <div className="mt-8">
              <label className="block text-md font-bold text-slate-900  mb-1.5">
                Height
              </label>

              <select
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 text-base outline-none focus:border-rose-400"
              >
                {heightOptions.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>

              {/* <p className="my-3 text-center text-slate-500">Or</p> */}

              {/* <select
                value={exactHeight}
                onChange={(e) => setExactHeight(e.target.value)}
                className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 text-base outline-none focus:border-rose-400"
              >
                <option value="">I know my height exact</option>
                {heights.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select> */}
            </div>

            {/* Marital Status */}
            <div className="mt-8 mb-15">
              <h2 className="block text-md font-bold text-slate-900  mb-1.5">
                Your Marital Status
              </h2>

              <div className="flex flex-wrap gap-3">
                {maritalOptions.map((status) => (
                  <button
                    key={status}
                    type="button"
                    // @ts-ignore
                    onClick={() => setMaritalStatus(status)}
                    className={`rounded-full cursor-pointer border px-5 py-2.5 text-sm font-semibold transition-all ${
                      maritalStatus === status
                        ? "border-rose-400 bg-rose-50 text-rose-600"
                        : "border-slate-200 text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === "education" && (
          <div key="education" className="animate-[fadeIn_0.25s_ease-out]">
            <h1 className="mb-3 font-serif text-3xl font-extrabold leading-snug text-slate-900">
              Tell us about your education
            </h1>

            <p className="mb-8 text-sm text-slate-500">
              This helps us tailor better matches for you.
            </p>

            <div className="space-y-6">
              {/* Highest Qualification */}
              <div>
                <label className="mb-2 block text-md font-bold text-slate-900">
                  Highest Qualification
                </label>

                <select
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 text-base outline-none transition focus:border-rose-400"
                >
                  <option value="">Select Highest Qualification</option>

                  {qualifications.map((q) => (
                    <option key={q._id} value={q.qualification}>
                      {q.qualification}
                    </option>
                  ))}
                </select>
              </div>

              {/* Education Type */}
              <div>
                <label className="mb-2 block text-md font-bold text-slate-900">
                  Education Type
                </label>

                <select
                  value={educationType}
                  onChange={(e) => setEducationType(e.target.value)}
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 text-base outline-none transition focus:border-rose-400"
                >
                  <option value="">Select Education Type</option>

                  {educationTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Occupation */}
              <div>
                <label className="mb-2 block text-md font-bold text-slate-900">
                  Occupation
                </label>

                <select
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 text-base outline-none transition focus:border-rose-400"
                >
                  <option value="">Select Occupation</option>

                  {occupations.map((o) => (
                    <option key={o._id} value={o.occupation}>
                      {o.occupation}
                    </option>
                  ))}
                </select>
              </div>

              {/* Annual Income */}
              <div className="mb-8">
                <label className="mb-2 block text-md font-bold text-slate-900">
                  Annual Income
                </label>

                <select
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(e.target.value)}
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 text-base outline-none transition focus:border-rose-400"
                >
                  <option value="">Select Annual Income</option>

                  {annualIncomes.map((a) => (
                    <option key={a._id} value={a.annualIncome}>
                      {a.annualIncome}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {step === "religion" && (
          <div key="religion" className="animate-[fadeIn_0.25s_ease-out]">
            <h1 className="mb-3 font-serif text-3xl font-extrabold leading-snug text-slate-900">
              Tell us your religion
            </h1>

            <p className="mb-8 text-sm text-slate-500">
              This helps us tailor better matches for you.
            </p>

            <div className="space-y-6">
              {/* Religion */}
              <div>
                <label className="mb-2 block text-md font-bold text-slate-900">
                  Religion
                </label>

                <select
                  value={religionId}
                  onChange={(e) => {
                    const selected = religions.find(
                      (r) => r._id === e.target.value,
                    );
                    setReligionId(e.target.value);
                    setReligion(selected?.religion ?? "");
                    // Reset dependent selections since they belong to the old religion
                    setCasteId("");
                    setCaste("");
                    setSubCaste("");
                  }}
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 text-base outline-none transition focus:border-rose-400"
                >
                  <option value="">Select Religion</option>

                  {religions.map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.religion}
                    </option>
                  ))}
                </select>
              </div>

              {/* Caste */}
              <div>
                <label className="mb-2 block text-md font-bold text-slate-900">
                  Caste
                </label>

                <select
                  value={casteId}
                  onChange={(e) => {
                    const selected = castes.find(
                      (c) => c._id === e.target.value,
                    );
                    setCasteId(e.target.value);
                    setCaste(selected?.caste ?? "");
                    // Reset sub-caste since it belongs to the old caste
                    setSubCaste("");
                  }}
                  disabled={!religionId}
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 text-base outline-none transition focus:border-rose-400 disabled:bg-slate-50 disabled:text-slate-400"
                >
                  <option value="">
                    {religionId ? "Select Caste" : "Select religion first"}
                  </option>

                  {castes.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.caste}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sub Caste */}
              <div>
                <label className="mb-2 block text-md font-bold text-slate-900">
                  Sub Caste
                </label>

                <select
                  value={subCaste}
                  onChange={(e) => setSubCaste(e.target.value)}
                  disabled={!casteId}
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 text-base outline-none transition focus:border-rose-400 disabled:bg-slate-50 disabled:text-slate-400"
                >
                  <option value="">
                    {casteId ? "Select Sub Caste" : "Select caste first"}
                  </option>

                  {subCastes.map((s) => (
                    <option key={s._id} value={s.subCaste}>
                      {s.subCaste}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dosh */}
              <div>
                <h2 className="mb-3 text-md font-bold text-slate-900">
                  Do you have any dosh?
                </h2>

                <div className="flex flex-wrap gap-3">
                  {["Yes", "No", "Don't know"].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setDosh(item)}
                      className={`cursor-pointer rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
                        dosh === item
                          ? "border-rose-400 bg-rose-50 text-rose-600"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mother Tongue */}
              <div className="mb-8">
                <label className="mb-2 block text-md font-bold text-slate-900">
                  What&apos;s your Mother Tongue?
                </label>

                <select
                  value={motherTongue}
                  onChange={(e) => setMotherTongue(e.target.value)}
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 text-base outline-none transition focus:border-rose-400"
                >
                  <option value="">Select Mother Tongue</option>

                  {motherTongues.map((m) => (
                    <option key={m._id} value={m.motherTongue}>
                      {m.motherTongue}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {step === "location" && (
          <div key="location" className="animate-[fadeIn_0.25s_ease-out]">
            <h1 className="mb-3 font-serif text-3xl font-extrabold leading-snug text-slate-900">
              Location Details
            </h1>

            <p className="mb-8 text-sm text-slate-500">
              Tell us where you&apos;re currently living.
            </p>

            <div className="space-y-6">
              {/* Country */}
              <div>
                <label className="mb-2 block text-md font-bold text-slate-900">
                  Your Residing Country
                </label>

                <select
                  value={countryIso}
                  onChange={(e) => {
                    const iso = e.target.value;
                    const selected = countryList.find((c) => c.isoCode === iso);
                    setCountryIso(iso);
                    setCountry(selected?.name ?? "");
                    // Reset dependent selections since they belong to the old country
                    setStateIso("");
                    setState("");
                    setCity("");
                  }}
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 text-base outline-none transition focus:border-rose-400"
                >
                  <option value="">Select Country</option>

                  {countryList.map((c) => (
                    <option key={c.isoCode} value={c.isoCode}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* State */}
              <div>
                <label className="mb-2 block text-md font-bold text-slate-900">
                  Your Residing State
                </label>

                <select
                  value={stateIso}
                  onChange={(e) => {
                    const iso = e.target.value;
                    const selected = stateList.find((s) => s.isoCode === iso);
                    setStateIso(iso);
                    setState(selected?.name ?? "");
                    // Reset city since it belongs to the old state
                    setCity("");
                  }}
                  disabled={!countryIso}
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 text-base outline-none transition focus:border-rose-400 disabled:bg-slate-50 disabled:text-slate-400"
                >
                  <option value="">
                    {countryIso ? "Select State" : "Select country first"}
                  </option>

                  {stateList.map((s) => (
                    <option key={s.isoCode} value={s.isoCode}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* City */}
              <div className="mb-8">
                <label className="mb-2 block text-md font-bold text-slate-900">
                  Your Residing City
                </label>

                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={!stateIso}
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 text-base outline-none transition focus:border-rose-400 disabled:bg-slate-50 disabled:text-slate-400"
                >
                  <option value="">
                    {stateIso ? "Select City" : "Select state first"}
                  </option>

                  {cityList.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {step === "additional" && (
          <div key="additional" className="animate-[fadeIn_0.25s_ease-out]">
            <h1 className="mb-3 font-serif text-3xl font-extrabold text-slate-900">
              Additional Details
            </h1>

            <p className="mb-8 text-sm text-slate-500">
              Tell us a little more about your family.
            </p>

            <div className="space-y-8 mb-8">
              <OptionGroup
                title="Family Status"
                options={[
                  "Middle Class",
                  "Upper Middle Class",
                  "Rich / Affluent (Elite)",
                ]}
                value={familyStatus}
                onChange={setFamilyStatus}
              />

              <OptionGroup
                title="How many brothers do you have?"
                options={["None", "1", "2", "3+"]}
                value={brothers}
                onChange={setBrothers}
              />

              <OptionGroup
                title="How many of them are married?"
                options={["None", "1", "2", "3+"]}
                value={marriedBrothers}
                onChange={setMarriedBrothers}
              />

              <OptionGroup
                title="How many sisters do you have?"
                options={["None", "1", "2", "3+"]}
                value={sisters}
                onChange={setSisters}
              />

              <OptionGroup
                title="How many of them are married?"
                options={["None", "1", "2", "3+"]}
                value={marriedSisters}
                onChange={setMarriedSisters}
              />
            </div>
          </div>
        )}

        {step === "family" && (
          <div key="additional" className="animate-[fadeIn_0.25s_ease-out]">
            <h1 className="mb-3 font-serif text-3xl font-extrabold text-slate-900">
              Family Details
            </h1>

            <p className="mb-8 text-sm text-slate-500">
              Tell us a little more about your family.
            </p>

            <div className="space-y-8 mb-8">
              <OptionGroup
                title="Are you currently living with your family?"
                options={["Yes", "No"]}
                value={livingWithFamily}
                onChange={setLivingWithFamily}
              />
            </div>

            {/* Country */}
            <div className="mb-8">
              <label className="mb-2 block text-md font-bold text-slate-900">
                Where is your family located?
              </label>

              <input
                type="text"
                value={familyBasedOutOf}
                onChange={(e) => setFamilyBasedOutOf(e.target.value)}
                placeholder=" Where is your family located?"
                className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 text-base outline-none transition focus:border-rose-400"
              />
            </div>
          </div>
        )}

        {step === "horoscope" && (
          <div key="horoscope" className="animate-[fadeIn_0.25s_ease-out]">
            <h1 className="mb-3 font-serif text-3xl font-extrabold text-slate-900">
              Horoscope Details
            </h1>

            <p className="mb-8 text-sm text-slate-500">
              Tell us your birth details to complete your horoscope information.
            </p>

            {/* Birth Date */}
            <div className="mb-8">
              <label className="mb-2 block text-md font-bold text-slate-900">
                Date of Birth
              </label>

              <input
                type="date"
                value={horoscopeDob}
                onChange={(e) => setHoroscopeDob(e.target.value)}
                className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 text-base outline-none transition focus:border-rose-400"
              />
            </div>

            {/* Time of Birth */}
            <div className="mb-8">
              <label className="mb-3 block text-md font-bold text-slate-900">
                Time of Birth
              </label>

              <div className="grid grid-cols-3 gap-4">
                {/* Hour */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-600">
                    Hour
                  </label>

                  <select
                    value={birthHour}
                    onChange={(e) => setBirthHour(e.target.value)}
                    className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 outline-none focus:border-rose-400"
                  >
                    {["01", "02", "03", "04", "05", "06", "07", "08"].map(
                      (hour) => (
                        <option key={hour} value={hour}>
                          {hour}
                        </option>
                      ),
                    )}
                  </select>
                </div>

                {/* Minute */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-600">
                    Minute
                  </label>

                  <select
                    value={birthMinute}
                    onChange={(e) => setBirthMinute(e.target.value)}
                    className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 outline-none focus:border-rose-400"
                  >
                    {["00", "01", "02", "03", "04", "05", "06", "07", "08"].map(
                      (minute) => (
                        <option key={minute} value={minute}>
                          {minute}
                        </option>
                      ),
                    )}
                  </select>
                </div>

                {/* AM / PM */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-600">
                    AM / PM
                  </label>

                  <select
                    value={birthMeridiem}
                    onChange={(e) => setBirthMeridiem(e.target.value)}
                    className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 outline-none focus:border-rose-400"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === "birth" && (
          <div key="birth" className="animate-[fadeIn_0.25s_ease-out]">
            <h1 className="mb-3 font-serif text-3xl font-extrabold text-slate-900">
              Place of Birth
            </h1>

            <p className="mb-8 text-sm text-slate-500">
              Provide your birth place details for horoscope matching.
            </p>

            {/* Country */}
            <div className="mb-6">
              <label className="mb-2 block text-md font-bold text-slate-900">
                Country of Birth
              </label>

              <select
                value={birthCountryIso}
                onChange={(e) => {
                  const iso = e.target.value;
                  const selected = countryList.find((c) => c.isoCode === iso);
                  setBirthCountryIso(iso);
                  setBirthCountry(selected?.name ?? "");
                  // Reset dependent selections since they belong to the old country
                  setBirthStateIso("");
                  setBirthState("");
                  setBirthCity("");
                }}
                className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 text-base outline-none transition focus:border-rose-400"
              >
                <option value="">Select Country</option>

                {countryList.map((c) => (
                  <option key={c.isoCode} value={c.isoCode}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* State */}
            <div className="mb-6">
              <label className="mb-2 block text-md font-bold text-slate-900">
                State of Birth
              </label>

              <select
                value={birthStateIso}
                onChange={(e) => {
                  const iso = e.target.value;
                  const selected = birthStateList.find(
                    (s) => s.isoCode === iso,
                  );
                  setBirthStateIso(iso);
                  setBirthState(selected?.name ?? "");
                  // Reset city since it belongs to the old state
                  setBirthCity("");
                }}
                disabled={!birthCountryIso}
                className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 text-base outline-none transition focus:border-rose-400 disabled:bg-slate-50 disabled:text-slate-400"
              >
                <option value="">
                  {birthCountryIso ? "Select State" : "Select country first"}
                </option>

                {birthStateList.map((s) => (
                  <option key={s.isoCode} value={s.isoCode}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* City */}
            <div className="mb-6">
              <label className="mb-2 block text-md font-bold text-slate-900">
                City of Birth
              </label>

              <select
                value={birthCity}
                onChange={(e) => setBirthCity(e.target.value)}
                disabled={!birthStateIso}
                className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 text-base outline-none transition focus:border-rose-400 disabled:bg-slate-50 disabled:text-slate-400"
              >
                <option value="">
                  {birthStateIso ? "Select City" : "Select state first"}
                </option>

                {birthCityList.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Correction */}
            <div className="mb-8">
              <label className="mb-2 block text-md font-bold text-slate-900">
                Time Correction (Optional)
              </label>

              <input
                value={timeCorrection}
                onChange={(e) => setTimeCorrection(e.target.value)}
                type="text"
                placeholder="e.g. +5 min"
                className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 text-base outline-none transition focus:border-rose-400"
              />
            </div>

            <div className="my-8 border-t border-slate-200" />

            <h2 className="mb-3 font-serif text-2xl font-bold text-slate-900">
              Star Details
            </h2>

            <p className="mb-6 text-sm text-slate-500">
              Select your Nakshatra and Rashi.
            </p>

            {/* Nakshatra */}
            <div className="mb-6">
              <label className="mb-2 block text-md font-bold text-slate-900">
                Nakshatra
              </label>

              <select
                value={nakshatra}
                onChange={(e) => setNakshatra(e.target.value)}
                className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 text-base outline-none transition focus:border-rose-400"
              >
                <option value="">Select Nakshatra</option>

                {[
                  "Ashwini",
                  "Bharani",
                  "Krittika",
                  "Rohini",
                  "Mrigashira",
                  "Ardra",
                  "Punarvasu",
                ].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>

            {/* Rashi */}
            <div className="mb-8">
              <label className="mb-2 block text-md font-bold text-slate-900">
                Rashi
              </label>

              <select
                value={rashi}
                onChange={(e) => setRashi(e.target.value)}
                className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 text-base outline-none transition focus:border-rose-400"
              >
                <option value="">Select Rashi</option>

                {[
                  "Aries (Mesh)",
                  "Taurus (Vrishabh)",
                  "Gemini (Mithun)",
                  "Cancer (Karka)",
                  "Leo (Simha)",
                  "Virgo (Kanya)",
                  "Libra (Tula)",
                  "Scorpio (Vrishchik)",
                  "Sagittarius (Dhanu)",
                  "Capricorn (Makar)",
                  "Aquarius (Kumbha)",
                  "Pisces (Meen)",
                ].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {step === "habbits" && (
          <div key="habbits" className="animate-[fadeIn_0.25s_ease-out]">
            <h1 className="mb-3 font-serif text-3xl font-extrabold text-slate-900">
              Habits Details
            </h1>

            <p className="mb-8 text-sm text-slate-500">
              Tell us about your lifestyle preferences.
            </p>

            <div className="space-y-8 mb-8">
              <OptionGroup
                title="Eating Habit"
                options={["Vegetarian", "Non Vegetarian", "Eggitarian"]}
                value={eatingHabit}
                onChange={setEatingHabit}
              />

              <OptionGroup
                title="Smoking Habit"
                options={[
                  "Never",
                  "Occasionally",
                  "Regularly",
                  "Trying to Quit",
                ]}
                value={smokingHabit}
                onChange={setSmokingHabit}
              />

              <OptionGroup
                title="Drinking Habit"
                options={["Never", "Occasionally", "Socially", "Regularly"]}
                value={drinkingHabit}
                onChange={setDrinkingHabit}
              />
            </div>
          </div>
        )}

        {step === "About" && (
          <div key="habbits" className="animate-[fadeIn_0.25s_ease-out]">
            <h1 className="mb-3 font-serif text-3xl font-extrabold text-slate-900">
              About me
            </h1>

            <p className="mb-4 text-sm text-slate-500">
              Lastly, write your bio
            </p>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 mb-8">
              <small>
                Talk about yourself, your interests and goals to help others get
                to know you better{" "}
              </small>
            </div>

            <div className="mb-8">
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="h-40 w-full rounded-2xl border border-slate-200 bg-white px-4 text-base outline-none transition focus:border-rose-400"
              />
            </div>
          </div>
        )}

        {step === "profileimages" && (
          <div key="profileimages" className="animate-[fadeIn_0.25s_ease-out]">
            <h1 className="mb-3 font-serif text-3xl font-extrabold text-slate-900">
              Add your photos
            </h1>

            <p className="mb-6 text-sm text-slate-500">
              Profiles with photos get up to 90% more responses
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files) addFiles(e.target.files);
                e.target.value = "";
              }}
            />

            <div className="grid grid-cols-3 gap-3 mb-4">
              {images.map((img, index) => (
                <div
                  key={img.id}
                  className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 group"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt=""
                    className="h-full w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => removeImage(img.id)}
                    aria-label="Remove photo"
                    className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition"
                  >
                    <X size={13} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setMainImageId(img.id)}
                    className={`absolute bottom-1.5 left-1.5 flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold transition ${
                      mainImageId === img.id
                        ? "bg-rose-500 text-white"
                        : "bg-black/50 text-white opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    <Star
                      size={11}
                      fill={mainImageId === img.id ? "white" : "none"}
                    />
                    {mainImageId === img.id ? "Main" : "Set main"}
                  </button>

                  {index === 0 && mainImageId === img.id && (
                    <span className="absolute top-1.5 left-1.5 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-rose-600">
                      Cover
                    </span>
                  )}
                </div>
              ))}

              {Array.from({ length: Math.max(remainingSlots, 0) }).map(
                (_, i) => (
                  <button
                    key={`empty-${i}`}
                    type="button"
                    onClick={openFilePicker}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    // @ts-ignore
                    onDrop={handleDrop}
                    className={`flex aspect-square flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed transition ${
                      isDragging
                        ? "border-rose-400 bg-rose-50"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {i === 0 && images.length === 0 ? (
                      <>
                        <Camera size={20} className="text-slate-400" />
                        <span className="text-[11px] font-semibold text-slate-500">
                          Add photo
                        </span>
                      </>
                    ) : (
                      <Plus size={18} className="text-slate-300" />
                    )}
                  </button>
                ),
              )}
            </div>

            <p className="text-xs text-slate-400 mb-8">
              {images.length}/{MAX_PHOTOS} photos added · Drag to reorder coming
              soon
            </p>

            <div className="mb-8" />
          </div>
        )}

        {submitError && (
          <p className="mb-4 text-sm font-medium text-rose-600">
            {submitError}
          </p>
        )}

        <ThemeBtnOne
          type="button"
          disabled={!canContinue[step] || (isLastStep && isSubmitting)}
          onClick={handlePrimaryAction}
          className="w-full bg-rose-500 text-white py-4 px-4 rounded-full font-serif cursor-pointer"
          text={
            isLastStep
              ? isCreatingProfile
                ? "Creating profile..."
                : isUploadingPhotos
                  ? "Uploading photos..."
                  : "Submit"
              : "Next"
          }
        ></ThemeBtnOne>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Register;

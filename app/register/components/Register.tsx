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
import Select, { SingleValue, StylesConfig } from "react-select";
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


import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
/* =========================================================
   TYPES
========================================================= */

type Gender = "male" | "female";

type ProfileFor = "self" | "someone-else";

type MaritalStatus = "never-married" | "married" | "divorced" | "widowed";

type ProfileImage = {
  id: string;
  file: File;
  url: string;
};

type SelectOption = {
  value: string;
  label: string;
};

/* =========================================================
   STEPS
========================================================= */

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

const HOROSCOPE_STEP_INDEX = STEPS.indexOf("horoscope");

/* =========================================================
   BACKEND ERROR
========================================================= */

function getBackendErrorMessage(err: unknown, fallback: string): string {
  const backendMessage = (
    err as {
      data?: {
        message?: unknown;
      };
    }
  )?.data?.message;

  if (typeof backendMessage !== "string" || !backendMessage.trim()) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(backendMessage);

    if (Array.isArray(parsed) && parsed.length > 0) {
      const messages = parsed
        .map((issue) => issue?.message)
        .filter((m): m is string => typeof m === "string" && m.length > 0);

      if (messages.length) {
        return messages.join(" ");
      }
    }
  } catch {
    // Plain string
  }

  return backendMessage;
}

/* =========================================================
   REACT SELECT STYLES
========================================================= */

const selectStyles: StylesConfig<SelectOption, false> = {
  control: (base, state) => ({
    ...base,
    minHeight: "56px",
    height: "56px",
    borderRadius: "16px",
    borderColor: state.isFocused ? "#fb7185" : "#e2e8f0",
    boxShadow: state.isFocused ? "0 0 0 3px rgba(244,63,94,0.08)" : "none",
    backgroundColor: "#ffffff",
    cursor: "pointer",
    transition: "all 0.2s ease",

    "&:hover": {
      borderColor: "#fda4af",
    },
  }),

  valueContainer: (base) => ({
    ...base,
    padding: "0 16px",
  }),

  singleValue: (base) => ({
    ...base,
    color: "#0f172a",
    fontSize: "15px",
    fontWeight: 500,
  }),

  placeholder: (base) => ({
    ...base,
    color: "#94a3b8",
    fontSize: "15px",
  }),

  input: (base) => ({
    ...base,
    color: "#0f172a",
    fontSize: "15px",
  }),

  indicatorSeparator: () => ({
    display: "none",
  }),

  dropdownIndicator: (base, state) => ({
    ...base,
    color: state.isFocused ? "#f43f5e" : "#94a3b8",
    paddingRight: "14px",

    "&:hover": {
      color: "#f43f5e",
    },
  }),

  clearIndicator: (base) => ({
    ...base,
    color: "#94a3b8",
    cursor: "pointer",

    "&:hover": {
      color: "#f43f5e",
    },
  }),

  menu: (base) => ({
    ...base,
    marginTop: "6px",
    borderRadius: "16px",
    overflow: "hidden",
    border: "1px solid #e2e8f0",
    boxShadow: "0 15px 35px rgba(15,23,42,0.12)",
    zIndex: 100,
  }),

  menuList: (base) => ({
    ...base,
    padding: "6px",
    maxHeight: "260px",
  }),

  option: (base, state) => ({
    ...base,
    borderRadius: "10px",
    padding: "11px 12px",
    fontSize: "14px",
    cursor: "pointer",

    backgroundColor: state.isSelected
      ? "#f43f5e"
      : state.isFocused
        ? "#fff1f2"
        : "#ffffff",

    color: state.isSelected ? "#ffffff" : "#0f172a",

    "&:active": {
      backgroundColor: "#f43f5e",
      color: "#ffffff",
    },
  }),

  noOptionsMessage: (base) => ({
    ...base,
    color: "#64748b",
    fontSize: "13px",
  }),
};

/* =========================================================
   SEARCHABLE SELECT COMPONENT
========================================================= */

interface SearchSelectProps {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const SearchSelect = ({
  value,
  options,
  onChange,
  placeholder = "Select...",
  disabled = false,
}: SearchSelectProps) => {
  const selectedOption = options.find((item) => item.value === value) ?? null;

  return (
    <Select<SelectOption, false>
      value={selectedOption}
      options={options}
      onChange={(option: SingleValue<SelectOption>) =>
        onChange(option?.value ?? "")
      }
      placeholder={placeholder}
      isSearchable
      isClearable
      isDisabled={disabled}
      styles={selectStyles}
      noOptionsMessage={() => "No options found"}
      menuPlacement="auto"
    />
  );
};

/* =========================================================
   OPTION GROUP
========================================================= */

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

/* =========================================================
   REGISTER
========================================================= */

const Register = () => {
  /* =======================================================
     API DATA
  ======================================================= */

  const { data: heightsRes } = useGetHeightsQuery();

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

  /* =======================================================
     RELIGION APIs
  ======================================================= */

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

  /* =======================================================
     PROFILE MUTATIONS
  ======================================================= */

  const [addProfile, { isLoading: isCreatingProfile }] =
    useAddProfileMutation();

  const [uploadProfilePhotos, { isLoading: isUploadingPhotos }] =
    useUploadProfilePhotosMutation();

  const isSubmitting = isCreatingProfile || isUploadingPhotos;

  const [submitError, setSubmitError] = useState("");

  /* =======================================================
     STEP
  ======================================================= */

  const [stepIndex, setStepIndex] = useState(0);

  const step = STEPS[stepIndex];

  const isLastStep = stepIndex === STEPS.length - 1;

  const MAX_PHOTOS = 6;

  /* =======================================================
     BASIC DETAILS
  ======================================================= */

  const [profileFor, setProfileFor] = useState<ProfileFor | null>(null);

  const [gender, setGender] = useState<Gender | null>(null);

  const [firstName, setFirstName] = useState("");

  const [lastName, setLastName] = useState("");

  const [birthCountry, setBirthCountry] = useState("");

  const [birthCity, setBirthCity] = useState("");

  const [maritalStatus, setMaritalStatus] = useState<MaritalStatus | null>(
    null,
  );

  /* =======================================================
     EDUCATION
  ======================================================= */

  const [qualification, setQualification] = useState("");

  const [institution] = useState("");

  const [fieldOfStudy] = useState("");

  const [educationType, setEducationType] = useState("");

  const [occupation, setOccupation] = useState("");

  const [annualIncome, setAnnualIncome] = useState("");

  /* =======================================================
     RELIGION
  ======================================================= */

  const [religion, setReligion] = useState("");

  const [caste, setCaste] = useState("");

  const [subCaste, setSubCaste] = useState("");

  const [dosh, setDosh] = useState("");

  const [motherTongue, setMotherTongue] = useState("");

  /* =======================================================
     LOCATION
  ======================================================= */

  const [country, setCountry] = useState("");

  const [state, setState] = useState("");

  const [city, setCity] = useState("");

  const [countryIso, setCountryIso] = useState("");

  const [stateIso, setStateIso] = useState("");

  /* =======================================================
     FAMILY
  ======================================================= */

  const [familyStatus, setFamilyStatus] = useState("");

  const [brothers, setBrothers] = useState("");

  const [marriedBrothers, setMarriedBrothers] = useState("");

  const [sisters, setSisters] = useState("");

  const [marriedSisters, setMarriedSisters] = useState("");

  const [livingWithFamily, setLivingWithFamily] = useState("");

  const [familyBasedOutOf, setFamilyBasedOutOf] = useState("");

  /* =======================================================
     HABITS
  ======================================================= */

  const [eatingHabit, setEatingHabit] = useState("");

  const [smokingHabit, setSmokingHabit] = useState("");

  const [drinkingHabit, setDrinkingHabit] = useState("");

  /* =======================================================
     HOROSCOPE
  ======================================================= */

  const [birthState, setBirthState] = useState("");

  const [birthCountryIso, setBirthCountryIso] = useState("");

  const [birthStateIso, setBirthStateIso] = useState("");

  const [timeCorrection, setTimeCorrection] = useState("");

  const [nakshatra, setNakshatra] = useState("");

  const [rashi, setRashi] = useState("");

  const [horoscopeDob, setHoroscopeDob] = useState("");

  const [birthHour, setBirthHour] = useState("01");

  const [birthMinute, setBirthMinute] = useState("00");

  const [birthMeridiem, setBirthMeridiem] = useState("AM");

  const [about, setAbout] = useState("");

  /* =======================================================
     BIRTH DATE
  ======================================================= */

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

  const years = Array.from(
    {
      length: 100,
    },
    (_, i) => currentYear - i,
  );

  const [birthDay, setBirthDay] = useState("1");

  const [birthMonth, setBirthMonth] = useState("January");

  const [birthYear, setBirthYear] = useState("2000");

  /* =======================================================
     HEIGHT
  ======================================================= */

  const [height, setHeight] = useState("5 ft 7 in (170cm)");

  const [exactHeight, setExactHeight] = useState("");

  /* =======================================================
     AGE
  ======================================================= */

  const computedAge = React.useMemo(() => {
    const monthIndex = months.indexOf(birthMonth);

    if (monthIndex === -1) {
      return 0;
    }

    const dob = new Date(Number(birthYear), monthIndex, Number(birthDay));

    let age = currentYear - dob.getFullYear();

    const today = new Date();

    const hasHadBirthday =
      today.getMonth() > monthIndex ||
      (today.getMonth() === monthIndex && today.getDate() >= Number(birthDay));

    if (!hasHadBirthday) {
      age -= 1;
    }

    return Math.max(age, 0);
  }, [birthDay, birthMonth, birthYear, currentYear]);

  /* =======================================================
     COUNTRY / STATE / CITY
  ======================================================= */

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

  /* =======================================================
     PHOTO UPLOAD
  ======================================================= */

  const [images, setImages] = useState<ProfileImage[]>([]);

  const [mainImageId, setMainImageId] = useState<string | null>(null);

  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.url));
    };
  }, [images]);

  const addFiles = (fileList: FileList | File[]) => {
    const incoming = Array.from(fileList).filter((file) =>
      file.type.startsWith("image/"),
    );

    if (!incoming.length) {
      return;
    }

    setImages((prev) => {
      const room = MAX_PHOTOS - prev.length;

      if (room <= 0) {
        return prev;
      }

      const toAdd = incoming.slice(0, room).map((file) => ({
        id: `${file.name}-${file.size}-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}`,
        file,
        url: URL.createObjectURL(file),
      }));

      const next = [...prev, ...toAdd];

      if (!mainImageId && next.length) {
        setMainImageId(next[0].id);
      }

      return next;
    });
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const next = prev.filter((img) => img.id !== id);

      const removed = prev.find((img) => img.id === id);

      if (removed) {
        URL.revokeObjectURL(removed.url);
      }

      if (mainImageId === id) {
        setMainImageId(next.length ? next[0].id : null);
      }

      return next;
    });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    setIsDragging(false);

    if (e.dataTransfer.files?.length) {
      addFiles(e.dataTransfer.files);
    }
  };

  const openFilePicker = () => fileInputRef.current?.click();

  const remainingSlots = MAX_PHOTOS - images.length;

  /* =======================================================
     OPTIONS
  ======================================================= */

  const dayOptions: SelectOption[] = days.map((day) => ({
    value: String(day),
    label: String(day).padStart(2, "0"),
  }));

  const monthOptions: SelectOption[] = months.map((month) => ({
    value: month,
    label: month,
  }));

  const yearOptions: SelectOption[] = years.map((year) => ({
    value: String(year),
    label: String(year),
  }));

  const heightSelectOptions: SelectOption[] = heightOptions.map((item) => ({
    value: item,
    label: item,
  }));

  const qualificationOptions: SelectOption[] = qualifications.map((q) => ({
    value: q.qualification,
    label: q.qualification,
  }));

  const educationTypeOptions: SelectOption[] = educationTypes.map((type) => ({
    value: type,
    label: type,
  }));

  const occupationOptions: SelectOption[] = occupations.map((o) => ({
    value: o.occupation,
    label: o.occupation,
  }));

  const annualIncomeOptions: SelectOption[] = annualIncomes.map((a) => ({
    value: a.annualIncome,
    label: a.annualIncome,
  }));

  const religionOptions: SelectOption[] = religions.map((r) => ({
    value: r._id,
    label: r.religion,
  }));

  const casteOptions: SelectOption[] = castes.map((c) => ({
    value: c._id,
    label: c.caste,
  }));

  const subCasteOptions: SelectOption[] = subCastes.map((s) => ({
    value: s.subCaste,
    label: s.subCaste,
  }));

  const motherTongueOptions: SelectOption[] = motherTongues.map((m) => ({
    value: m.motherTongue,
    label: m.motherTongue,
  }));

  const countryOptions: SelectOption[] = countryList.map((c) => ({
    value: c.isoCode,
    label: c.name,
  }));

  const stateOptions: SelectOption[] = stateList.map((s) => ({
    value: s.isoCode,
    label: s.name,
  }));

  const cityOptions: SelectOption[] = cityList.map((c) => ({
    value: c.name,
    label: c.name,
  }));

  const birthCountryOptions: SelectOption[] = countryList.map((c) => ({
    value: c.isoCode,
    label: c.name,
  }));

  const birthStateOptions: SelectOption[] = birthStateList.map((s) => ({
    value: s.isoCode,
    label: s.name,
  }));

  const birthCityOptions: SelectOption[] = birthCityList.map((c) => ({
    value: c.name,
    label: c.name,
  }));

  const hourOptions: SelectOption[] = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0"),
  ).map((hour) => ({
    value: hour,
    label: hour,
  }));

  const minuteOptions: SelectOption[] = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, "0"),
  ).map((minute) => ({
    value: minute,
    label: minute,
  }));

  const meridiemOptions: SelectOption[] = [
    {
      value: "AM",
      label: "AM",
    },
    {
      value: "PM",
      label: "PM",
    },
  ];

  const nakshatraOptions: SelectOption[] = [
    "Ashwini",
    "Bharani",
    "Krittika",
    "Rohini",
    "Mrigashira",
    "Ardra",
    "Punarvasu",
  ].map((item) => ({
    value: item,
    label: item,
  }));

  const rashiOptions: SelectOption[] = [
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
  ].map((item) => ({
    value: item,
    label: item,
  }));

  /* =======================================================
     MARITAL STATUS
  ======================================================= */

  const maritalOptions = [
    "Never Married",
    "Divorced",
    "Widowed",
    "Awaiting Divorce",
  ];

  const maritalSelectOptions: SelectOption[] = maritalOptions.map((item) => ({
    value: item.toLowerCase().replaceAll(" ", "-"),
    label: item,
  }));

  /* =======================================================
     NAVIGATION
  ======================================================= */

  const goNext = () => setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));

  const goBack = () => setStepIndex((i) => Math.max(i - 1, 0));

  /* =======================================================
     VALIDATION
  ======================================================= */

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

    horoscope: true,
    birth: true,
    habbits: true,
    About: true,
    profileimages: true,
  };

  /* =======================================================
     PAYLOAD
  ======================================================= */

  const buildProfilePayload = (): ProfilePayload => ({
    basicDetails: {
      profileFor: profileFor ?? "",

      gender: gender === "male" ? "Male" : gender === "female" ? "Female" : "",

      firstName,
      lastName,

      dob: `${birthYear}-${String(months.indexOf(birthMonth) + 1).padStart(
        2,
        "0",
      )}-${String(birthDay).padStart(2, "0")}`,

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
      describeYourself: "",
      profileCreatedBy: profileFor === "self" ? "Self" : "Family",

      languagesISpeak: motherTongue ? [motherTongue] : [],

      disability: "",
      thalassemia: "",
      hivStatus: false,
    },

    careerDetails: {
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
      email: "",
      alternateEmail: "",
      phoneNumber: "",
      alternatePhoneNumber: "",
      landlineNumber: "",
      relationshipWithBrideOrGroom: "",
    },

    lifestyle: {
      dietaryHabit: eatingHabit,

      drinkingHabit: drinkingHabit,

      smokingHabit: smokingHabit,

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

  /* =======================================================
     SUBMIT
  ======================================================= */

  const handlePrimaryAction = async () => {
    if (!canContinue[step]) {
      return;
    }

    if (isLastStep) {
      setSubmitError("");

      try {
        const payload = buildProfilePayload();

        await addProfile(payload).unwrap();

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

  /* =======================================================
     JSX
  ======================================================= */

  return (
    <div className="flex min-h-screen w-full items-start justify-center bg-[#FDF8F3] px-5 py-12 sm:px-8 lg:px-8">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="mx-auto w-full max-w-3xl rounded-3xl bg-white p-8 py-10 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)]">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8 flex items-center justify-between">
          {stepIndex > 0 ? (
            <button
              type="button"
              onClick={goBack}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-slate-200 text-slate-900 transition hover:bg-slate-100"
            >
              <ChevronLeft size={18} />
            </button>
          ) : (
            <Link
              href="/"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-slate-200 text-slate-900 transition hover:bg-slate-100"
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

        {/* =================================================
            PROFILE
        ================================================= */}

        {step === "profile" && (
          <div className="animate-[fadeIn_0.25s_ease-out]">
            <h1 className="mb-3 font-serif text-3xl font-extrabold leading-snug text-slate-900">
              Who is this profile for?
            </h1>

            <p className="mb-8 text-sm text-slate-500">
              Let us know who you&apos;re creating this profile for
            </p>

            <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-3">
              {(
                [
                  {
                    key: "self",
                    label: "Myself",
                  },
                  {
                    key: "myson",
                    label: "My son",
                  },
                  {
                    key: "mydaughter",
                    label: "My Daughter",
                  },
                  {
                    key: "mybrother",
                    label: "My Brother",
                  },
                  {
                    key: "mysister",
                    label: "My Sister",
                  },
                  {
                    key: "myrelatives",
                    label: "My Relatives",
                  },
                  {
                    key: "myfriends",
                    label: "My Friends",
                  },
                  {
                    key: "someone-else",
                    label: "Someone Else",
                  },
                ] as {
                  key: ProfileFor;
                  label: string;
                }[]
              ).map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setProfileFor(opt.key)}
                  className={`cursor-pointer rounded-2xl border px-4 py-4 text-sm font-bold transition ${
                    profileFor === opt.key
                      ? "border-rose-400 bg-rose-50 text-rose-600"
                      : "border-slate-200 text-slate-700 hover:border-slate-300"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <p className="mb-3 font-serif text-sm font-bold text-slate-900">
              Select Your Gender
            </p>

            <div className="mb-10 flex gap-3">
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
                    className={`flex flex-1 cursor-pointer flex-col items-center gap-2 rounded-2xl border px-4 py-4 transition ${
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

        {/* =================================================
            NAME
        ================================================= */}

        {step === "name" && (
          <div className="animate-[fadeIn_0.25s_ease-out]">
            <h1 className="mb-3 font-serif text-3xl font-extrabold leading-snug text-slate-900">
              What&apos;s your name?
            </h1>

            <p className="mb-8 text-sm text-slate-500">
              This is how you&apos;ll appear across your profile
            </p>

            <div className="mb-10 space-y-4">
              <div>
                <label className="mb-1.5 block text-md font-bold text-slate-900">
                  First Name
                </label>

                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your first name"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-300"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-md font-bold text-slate-900">
                  Last Name
                </label>

                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter your last name"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-300"
                />
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <label className="flex cursor-pointer items-start gap-3">
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

        {/* =================================================
            BIRTHPLACE / DOB
        ================================================= */}

        {step === "birthplace" && (
          <div className="animate-[fadeIn_0.25s_ease-out]">
            <h1 className="mb-2 font-serif text-3xl font-extrabold text-slate-900">
              Where Were You Born?
            </h1>

            <p className="mb-8 text-sm text-slate-500">
              Tell us your birth date.
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-md font-bold text-slate-900">
                  Day
                </label>

                <SearchSelect
                  value={birthDay}
                  options={dayOptions}
                  onChange={setBirthDay}
                  placeholder="Search day..."
                />
              </div>

              <div>
                <label className="mb-1.5 block text-md font-bold text-slate-900">
                  Month
                </label>

                <SearchSelect
                  value={birthMonth}
                  options={monthOptions}
                  onChange={setBirthMonth}
                  placeholder="Search month..."
                />
              </div>

              <div>
                <label className="mb-1.5 block text-md font-bold text-slate-900">
                  Year
                </label>

                <SearchSelect
                  value={birthYear}
                  options={yearOptions}
                  onChange={setBirthYear}
                  placeholder="Search year..."
                />
              </div>
            </div>

            <div className="mt-5 rounded-full bg-gradient-to-r from-rose-100 to-slate-100 px-4 py-3">
              <p className="text-sm text-slate-700">
                You are{" "}
                <span className="font-semibold">{computedAge} years old</span>
              </p>
            </div>

            {/* HEIGHT */}

            <div className="mt-8">
              <label className="mb-1.5 block text-md font-bold text-slate-900">
                Height
              </label>

              <SearchSelect
                value={height}
                options={heightSelectOptions}
                onChange={setHeight}
                placeholder={"Search height..."}
              />
            </div>

            {/* MARITAL */}

            <div className="mb-15 mt-8">
              <h2 className="mb-1.5 block text-md font-bold text-slate-900">
                Your Marital Status
              </h2>

              <SearchSelect
                value={
                  maritalStatus
                    ? (maritalOptions[
                        maritalOptions.findIndex(
                          (item) =>
                            item.toLowerCase().replaceAll(" ", "-") ===
                            maritalStatus,
                        )
                      ] ?? "")
                    : ""
                }
                options={maritalSelectOptions}
                onChange={(value) => setMaritalStatus(value as MaritalStatus)}
                placeholder="Search marital status..."
              />
            </div>
          </div>
        )}

        {/* =================================================
            EDUCATION
        ================================================= */}

        {step === "education" && (
          <div className="animate-[fadeIn_0.25s_ease-out]">
            <h1 className="mb-3 font-serif text-3xl font-extrabold leading-snug text-slate-900">
              Tell us about your education
            </h1>

            <p className="mb-8 text-sm text-slate-500">
              This helps us tailor better matches for you.
            </p>

            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-md font-bold text-slate-900">
                  Highest Qualification
                </label>

                <SearchSelect
                  value={qualification}
                  options={qualificationOptions}
                  onChange={setQualification}
                  placeholder="Search qualification..."
                />
              </div>

              <div>
                <label className="mb-2 block text-md font-bold text-slate-900">
                  Education Type
                </label>

                <SearchSelect
                  value={educationType}
                  options={educationTypeOptions}
                  onChange={setEducationType}
                  placeholder="Search education type..."
                />
              </div>

              <div>
                <label className="mb-2 block text-md font-bold text-slate-900">
                  Occupation
                </label>

                <SearchSelect
                  value={occupation}
                  options={occupationOptions}
                  onChange={setOccupation}
                  placeholder="Search occupation..."
                />
              </div>

              <div className="mb-8">
                <label className="mb-2 block text-md font-bold text-slate-900">
                  Annual Income
                </label>

                <SearchSelect
                  value={annualIncome}
                  options={annualIncomeOptions}
                  onChange={setAnnualIncome}
                  placeholder="Search annual income..."
                />
              </div>
            </div>
          </div>
        )}

        {/* =================================================
            RELIGION
        ================================================= */}

        {step === "religion" && (
          <div className="animate-[fadeIn_0.25s_ease-out]">
            <h1 className="mb-3 font-serif text-3xl font-extrabold leading-snug text-slate-900">
              Tell us your religion
            </h1>

            <p className="mb-8 text-sm text-slate-500">
              This helps us tailor better matches for you.
            </p>

            <div className="space-y-6">
              {/* RELIGION */}

              <div>
                <label className="mb-2 block text-md font-bold text-slate-900">
                  Religion
                </label>

                <SearchSelect
                  value={religionId}
                  options={religionOptions}
                  onChange={(id) => {
                    const selected = religions.find((r) => r._id === id);

                    setReligionId(id);

                    setReligion(selected?.religion ?? "");

                    setCasteId("");
                    setCaste("");
                    setSubCaste("");
                  }}
                  placeholder="Search religion..."
                />
              </div>

              {/* CASTE */}

              <div>
                <label className="mb-2 block text-md font-bold text-slate-900">
                  Caste
                </label>

                <SearchSelect
                  value={casteId}
                  options={casteOptions}
                  disabled={!religionId}
                  onChange={(id) => {
                    const selected = castes.find((c) => c._id === id);

                    setCasteId(id);

                    setCaste(selected?.caste ?? "");

                    setSubCaste("");
                  }}
                  placeholder={
                    religionId ? "Search caste..." : "Select religion first"
                  }
                />
              </div>

              {/* SUB CASTE */}

              <div>
                <label className="mb-2 block text-md font-bold text-slate-900">
                  Sub Caste
                </label>

                <SearchSelect
                  value={subCaste}
                  options={subCasteOptions}
                  disabled={!casteId}
                  onChange={setSubCaste}
                  placeholder={
                    casteId ? "Search sub caste..." : "Select caste first"
                  }
                />
              </div>

              {/* DOSH */}

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

              {/* MOTHER TONGUE */}

              <div className="mb-8">
                <label className="mb-2 block text-md font-bold text-slate-900">
                  What&apos;s your Mother Tongue?
                </label>

                <SearchSelect
                  value={motherTongue}
                  options={motherTongueOptions}
                  onChange={setMotherTongue}
                  placeholder="Search mother tongue..."
                />
              </div>
            </div>
          </div>
        )}

        {/* =================================================
            LOCATION
        ================================================= */}

        {step === "location" && (
          <div className="animate-[fadeIn_0.25s_ease-out]">
            <h1 className="mb-3 font-serif text-3xl font-extrabold leading-snug text-slate-900">
              Location Details
            </h1>

            <p className="mb-8 text-sm text-slate-500">
              Tell us where you&apos;re currently living.
            </p>

            <div className="space-y-6">
              {/* COUNTRY */}

              <div>
                <label className="mb-2 block text-md font-bold text-slate-900">
                  Your Residing Country
                </label>

                <SearchSelect
                  value={countryIso}
                  options={countryOptions}
                  onChange={(iso) => {
                    const selected = countryList.find((c) => c.isoCode === iso);

                    setCountryIso(iso);

                    setCountry(selected?.name ?? "");

                    setStateIso("");

                    setState("");

                    setCity("");
                  }}
                  placeholder="Search country..."
                />
              </div>

              {/* STATE */}

              <div>
                <label className="mb-2 block text-md font-bold text-slate-900">
                  Your Residing State
                </label>

                <SearchSelect
                  value={stateIso}
                  options={stateOptions}
                  disabled={!countryIso}
                  onChange={(iso) => {
                    const selected = stateList.find((s) => s.isoCode === iso);

                    setStateIso(iso);

                    setState(selected?.name ?? "");

                    setCity("");
                  }}
                  placeholder={
                    countryIso ? "Search state..." : "Select country first"
                  }
                />
              </div>

              {/* CITY */}

              <div className="mb-8">
                <label className="mb-2 block text-md font-bold text-slate-900">
                  Your Residing City
                </label>

                <SearchSelect
                  value={city}
                  options={cityOptions}
                  disabled={!stateIso}
                  onChange={setCity}
                  placeholder={
                    stateIso ? "Search city..." : "Select state first"
                  }
                />
              </div>
            </div>
          </div>
        )}

        {/* =================================================
            ADDITIONAL
        ================================================= */}

        {step === "additional" && (
          <div className="animate-[fadeIn_0.25s_ease-out]">
            <h1 className="mb-3 font-serif text-3xl font-extrabold text-slate-900">
              Additional Details
            </h1>

            <p className="mb-8 text-sm text-slate-500">
              Tell us a little more about your family.
            </p>

            <div className="mb-8 space-y-8">
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

        {/* =================================================
            FAMILY
        ================================================= */}

        {step === "family" && (
          <div className="animate-[fadeIn_0.25s_ease-out]">
            <h1 className="mb-3 font-serif text-3xl font-extrabold text-slate-900">
              Family Details
            </h1>

            <p className="mb-8 text-sm text-slate-500">
              Tell us a little more about your family.
            </p>

            <div className="mb-8 space-y-8">
              <OptionGroup
                title="Are you currently living with your family?"
                options={["Yes", "No"]}
                value={livingWithFamily}
                onChange={setLivingWithFamily}
              />
            </div>

            <div className="mb-8">
              <label className="mb-2 block text-md font-bold text-slate-900">
                Where is your family located?
              </label>

              <input
                type="text"
                value={familyBasedOutOf}
                onChange={(e) => setFamilyBasedOutOf(e.target.value)}
                placeholder="Where is your family located?"
                className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 text-base outline-none transition focus:border-rose-400"
              />
            </div>
          </div>
        )}

        {/* =================================================
            HOROSCOPE
        ================================================= */}

        {step === "horoscope" && (
          <div className="animate-[fadeIn_0.25s_ease-out]">
            <h1 className="mb-3 font-serif text-3xl font-extrabold text-slate-900">
              Horoscope Details
            </h1>

            <p className="mb-8 text-sm text-slate-500">
              Tell us your birth details to complete your horoscope information.
            </p>

           <div className="mb-8">
  <label className="mb-2 block text-md font-bold text-slate-900">
    Date of Birth
  </label>

  <DatePicker
    selected={
      horoscopeDob
        ? new Date(`${horoscopeDob}T00:00:00`)
        : null
    }
    onChange={(date: Date | null) => {
      if (!date) {
        setHoroscopeDob("");
        return;
      }

      const year = date.getFullYear();
      const month = String(
        date.getMonth() + 1,
      ).padStart(2, "0");
      const day = String(
        date.getDate(),
      ).padStart(2, "0");

      setHoroscopeDob(
        `${year}-${month}-${day}`,
      );
    }}
    dateFormat="dd/MM/yyyy"
    placeholderText="Select your date of birth"
    showMonthDropdown
    showYearDropdown
    dropdownMode="select"
    maxDate={new Date()}
    className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 text-base outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
    wrapperClassName="w-full"
    popperClassName="custom-datepicker"
  />
</div>

            <div className="mb-8">
              <label className="mb-3 block text-md font-bold text-slate-900">
                Time of Birth
              </label>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-600">
                    Hour
                  </label>

                  <SearchSelect
                    value={birthHour}
                    options={hourOptions}
                    onChange={setBirthHour}
                    placeholder="Search hour..."
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-600">
                    Minute
                  </label>

                  <SearchSelect
                    value={birthMinute}
                    options={minuteOptions}
                    onChange={setBirthMinute}
                    placeholder="Search minute..."
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-600">
                    AM / PM
                  </label>

                  <SearchSelect
                    value={birthMeridiem}
                    options={meridiemOptions}
                    onChange={setBirthMeridiem}
                    placeholder="Select..."
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================
            BIRTH PLACE
        ================================================= */}

        {step === "birth" && (
          <div className="animate-[fadeIn_0.25s_ease-out]">
            <h1 className="mb-3 font-serif text-3xl font-extrabold text-slate-900">
              Place of Birth
            </h1>

            <p className="mb-8 text-sm text-slate-500">
              Provide your birth place details for horoscope matching.
            </p>

            {/* COUNTRY */}

            <div className="mb-6">
              <label className="mb-2 block text-md font-bold text-slate-900">
                Country of Birth
              </label>

              <SearchSelect
                value={birthCountryIso}
                options={birthCountryOptions}
                onChange={(iso) => {
                  const selected = countryList.find((c) => c.isoCode === iso);

                  setBirthCountryIso(iso);

                  setBirthCountry(selected?.name ?? "");

                  setBirthStateIso("");

                  setBirthState("");

                  setBirthCity("");
                }}
                placeholder="Search country..."
              />
            </div>

            {/* STATE */}

            <div className="mb-6">
              <label className="mb-2 block text-md font-bold text-slate-900">
                State of Birth
              </label>

              <SearchSelect
                value={birthStateIso}
                options={birthStateOptions}
                disabled={!birthCountryIso}
                onChange={(iso) => {
                  const selected = birthStateList.find(
                    (s) => s.isoCode === iso,
                  );

                  setBirthStateIso(iso);

                  setBirthState(selected?.name ?? "");

                  setBirthCity("");
                }}
                placeholder={
                  birthCountryIso ? "Search state..." : "Select country first"
                }
              />
            </div>

            {/* CITY */}

            <div className="mb-6">
              <label className="mb-2 block text-md font-bold text-slate-900">
                City of Birth
              </label>

              <SearchSelect
                value={birthCity}
                options={birthCityOptions}
                disabled={!birthStateIso}
                onChange={setBirthCity}
                placeholder={
                  birthStateIso ? "Search city..." : "Select state first"
                }
              />
            </div>

            {/* TIME CORRECTION */}

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

            {/* NAKSHATRA */}

            <div className="mb-6">
              <label className="mb-2 block text-md font-bold text-slate-900">
                Nakshatra
              </label>

              <SearchSelect
                value={nakshatra}
                options={nakshatraOptions}
                onChange={setNakshatra}
                placeholder="Search nakshatra..."
              />
            </div>

            {/* RASHI */}

            <div className="mb-8">
              <label className="mb-2 block text-md font-bold text-slate-900">
                Rashi
              </label>

              <SearchSelect
                value={rashi}
                options={rashiOptions}
                onChange={setRashi}
                placeholder="Search rashi..."
              />
            </div>
          </div>
        )}

        {/* =================================================
            HABITS
        ================================================= */}

        {step === "habbits" && (
          <div className="animate-[fadeIn_0.25s_ease-out]">
            <h1 className="mb-3 font-serif text-3xl font-extrabold text-slate-900">
              Habits Details
            </h1>

            <p className="mb-8 text-sm text-slate-500">
              Tell us about your lifestyle preferences.
            </p>

            <div className="mb-8 space-y-8">
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

        {/* =================================================
            ABOUT
        ================================================= */}

        {step === "About" && (
          <div className="animate-[fadeIn_0.25s_ease-out]">
            <h1 className="mb-3 font-serif text-3xl font-extrabold text-slate-900">
              About me
            </h1>

            <p className="mb-4 text-sm text-slate-500">
              Lastly, write your bio
            </p>

            <div className="mb-8 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <small>
                Talk about yourself, your interests and goals to help others get
                to know you better
              </small>
            </div>

            <div className="mb-8">
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="h-40 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base outline-none transition focus:border-rose-400"
              />
            </div>
          </div>
        )}

        {/* =================================================
            PROFILE IMAGES
        ================================================= */}

        {step === "profileimages" && (
          <div className="animate-[fadeIn_0.25s_ease-out]">
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
                if (e.target.files) {
                  addFiles(e.target.files);
                }

                e.target.value = "";
              }}
            />

            <div className="mb-4 grid grid-cols-3 gap-3">
              {images.map((img, index) => (
                <div
                  key={img.id}
                  className="group relative aspect-square overflow-hidden rounded-2xl border border-slate-200"
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
                    className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
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
                    <span className="absolute left-1.5 top-1.5 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-rose-600">
                      Cover
                    </span>
                  )}
                </div>
              ))}

              {Array.from({
                length: Math.max(remainingSlots, 0),
              }).map((_, i) => (
                <button
                  key={`empty-${i}`}
                  type="button"
                  onClick={openFilePicker}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
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
              ))}
            </div>

            <p className="mb-8 text-xs text-slate-400">
              {images.length}/{MAX_PHOTOS} photos added · Drag to reorder coming
              soon
            </p>
          </div>
        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {submitError && (
          <p className="mb-4 text-sm font-medium text-rose-600">
            {submitError}
          </p>
        )}

        {/* =================================================
            NEXT / SUBMIT
        ================================================= */}

        <ThemeBtnOne
          type="button"
          disabled={!canContinue[step] || (isLastStep && isSubmitting)}
          onClick={handlePrimaryAction}
          className="w-full cursor-pointer rounded-full bg-rose-500 px-4 py-4 font-serif text-white"
          text={
            isLastStep
              ? isCreatingProfile
                ? "Creating profile..."
                : isUploadingPhotos
                  ? "Uploading photos..."
                  : "Submit"
              : "Next"
          }
        />
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

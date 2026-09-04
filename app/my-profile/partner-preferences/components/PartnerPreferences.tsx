"use client";

import { useEffect, useMemo, useState, ChangeEvent } from "react";
import Select, { SingleValue, StylesConfig } from "react-select";
import ThemeBtnOne from "@/app/components/ThemeBtnOne";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Country, State, City } from "country-state-city";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarDays } from "lucide-react";

import { useGetMyProfileQuery } from "@/Redux/profileApi";
import {
  useGetPartnerPreferenceQuery,
  useSavePartnerPreferenceMutation,
  type PartnerPreferencePayload,
} from "@/Redux/partnerPreffApi";

import { useGetReligionsQuery } from "@/Redux/religionApi";
import { useGetCastesByReligionQuery } from "@/Redux/casteApi";
import { useGetSubCastesByCasteQuery } from "@/Redux/subCasteApi";
import { useGetMotherTonguesQuery } from "@/Redux/motherToungeApi";
import { useGetHeightsQuery } from "@/Redux/heightApi";
import { useGetQualificationsQuery } from "@/Redux/qualificationApi";
import { useGetOccupationsQuery } from "@/Redux/occupationApi";
import { useGetAnnualIncomesQuery } from "@/Redux/annualIncomeApi";

const labelClass = "mb-1.5 block text-sm font-bold text-slate-900";

interface Option {
  value: string;
  label: string;
}

interface PreferencesForm {
  gender: string;
  dob: string;
  height: string;
  religion: string;
  caste: string;
  subCaste: string;
  motherTongue: string;
  country: string;
  state: string;
  city: string;
  maritalStatus: string;
  highestEducation: string;
  ugDegree: string;
  occupation: string;
  annualIncome: string;
  diet: string;
  smoking: string;
  drinking: string;
  physicalStatus: string;
}

const initialState: PreferencesForm = {
  gender: "",
  dob: "",
  height: "",
  religion: "",
  caste: "",
  subCaste: "",
  motherTongue: "",
  country: "",
  state: "",
  city: "",
  maritalStatus: "",
  highestEducation: "",
  ugDegree: "",
  occupation: "",
  annualIncome: "",
  diet: "",
  smoking: "",
  drinking: "",
  physicalStatus: "",
};

type PreferencesSection =
  | "basic details"
  | "education & occupation"
  | "lifestyle";

/* ---------------------------------------------
   React Select Styles
--------------------------------------------- */

const selectStyles: StylesConfig<Option, false> = {
  control: (base, state) => ({
    ...base,
    minHeight: "52px",
    height: "52px",
    borderRadius: "16px",
    borderColor: state.isFocused ? "#fda4af" : "#e2e8f0",
    boxShadow: "none",
    backgroundColor: "#ffffff",
    cursor: "pointer",
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
    fontSize: "14px",
  }),

  placeholder: (base) => ({
    ...base,
    color: "#94a3b8",
    fontSize: "14px",
  }),

  input: (base) => ({
    ...base,
    color: "#0f172a",
    fontSize: "14px",
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
    borderRadius: "16px",
    overflow: "hidden",
    marginTop: "6px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
    zIndex: 50,
  }),

  menuList: (base) => ({
    ...base,
    padding: "6px",
    maxHeight: "240px",
  }),

  option: (base, state) => ({
    ...base,
    borderRadius: "10px",
    padding: "10px 12px",
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
};

/* ---------------------------------------------
   Reusable Searchable Select
--------------------------------------------- */

interface FieldSelectProps {
  id: keyof PreferencesForm;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
}

const FieldSelect = ({
  id,
  label,
  value,
  onChange,
  options,
  placeholder = "Select",
  isDisabled = false,
  isLoading = false,
}: FieldSelectProps) => {
  const selectedOption =
    options.find((option) => option.value === value) ?? null;

  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>

      <Select<Option, false>
        inputId={id}
        name={id}
        options={options}
        value={selectedOption}
        onChange={(option: SingleValue<Option>) => {
          onChange(option?.value ?? "");
        }}
        placeholder={placeholder}
        isSearchable
        isClearable
        isDisabled={isDisabled}
        isLoading={isLoading}
        styles={selectStyles}
        noOptionsMessage={() => "No options found"}
        loadingMessage={() => "Loading..."}
      />
    </div>
  );
};

/* ---------------------------------------------
   Component
--------------------------------------------- */

const PartnerPreferences = () => {
  const [form, setForm] = useState<PreferencesForm>(initialState);

  const handleSelectChange = (field: keyof PreferencesForm, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ===================================================
     PARTNER PREFERENCE API (get logged-in user's saved
     preferences + save/update them)
  =================================================== */

  const { data: prefData } = useGetPartnerPreferenceQuery();
  const [savePartnerPreference, { isLoading: isSaving }] =
    useSavePartnerPreferenceMutation();

  // Needed as a fallback for `createdBy` when no preference doc exists yet.
  const { data: myProfileData } = useGetMyProfileQuery();

  /* ===================================================
     DROPDOWN APIS
     (religion / caste / sub-caste are cascading, same as
     the Basic Details screen)
  =================================================== */

  const { data: religionRes } = useGetReligionsQuery();

  const { data: casteRes, isLoading: casteLoading } =
    useGetCastesByReligionQuery(form.religion, {
      skip: !form.religion,
    });

  const { data: subCasteRes, isLoading: subCasteLoading } =
    useGetSubCastesByCasteQuery(form.caste, {
      skip: !form.caste,
    });

  const { data: motherTongueRes } = useGetMotherTonguesQuery();
  const { data: heightRes } = useGetHeightsQuery();
  const { data: qualificationRes } = useGetQualificationsQuery();
  const { data: occupationRes } = useGetOccupationsQuery();
  const { data: annualIncomeRes } = useGetAnnualIncomesQuery();

  /* ===================================================
     COUNTRY / STATE / CITY (cascading, same package used
     on the Basic Details screen)
  =================================================== */

  const countryList = useMemo(() => Country.getAllCountries(), []);

  const stateList = useMemo(
    () => (form.country ? State.getStatesOfCountry(form.country) : []),
    [form.country],
  );

  const cityList = useMemo(
    () =>
      form.country && form.state
        ? City.getCitiesOfState(form.country, form.state)
        : [],
    [form.country, form.state],
  );

  /* ===================================================
     OPTION LISTS
  =================================================== */

  const religionOptions = useMemo<Option[]>(
    () =>
      (religionRes?.data ?? []).map((item) => ({
        value: item._id,
        label: item.religion,
      })),
    [religionRes],
  );

  const casteOptions = useMemo<Option[]>(
    () =>
      (casteRes?.data ?? []).map((item) => ({
        value: item._id,
        label: item.caste,
      })),
    [casteRes],
  );

  const subCasteOptions = useMemo<Option[]>(
    () =>
      (subCasteRes?.data ?? []).map((item) => ({
        value: item._id,
        label: item.subCaste,
      })),
    [subCasteRes],
  );

  const motherTongueOptions = useMemo<Option[]>(
    () =>
      (motherTongueRes?.data ?? []).map((item) => ({
        value: item._id,
        label: item.motherTongue,
      })),
    [motherTongueRes],
  );

  const heightOptions = useMemo<Option[]>(
    () =>
      (heightRes?.data ?? []).map((item) => ({
        value: item._id,
        label: item.height,
      })),
    [heightRes],
  );

  const highestEducationOptions = useMemo<Option[]>(
    () =>
      (qualificationRes?.data ?? []).map((item) => ({
        value: item._id,
        label: item.qualification,
      })),
    [qualificationRes],
  );

  const occupationOptions = useMemo<Option[]>(
    () =>
      (occupationRes?.data ?? []).map((item) => ({
        value: item._id,
        label: item.occupation,
      })),
    [occupationRes],
  );

  const annualIncomeOptions = useMemo<Option[]>(
    () =>
      (annualIncomeRes?.data ?? []).map((item) => ({
        value: item._id,
        label: item.annualIncome,
      })),
    [annualIncomeRes],
  );

  const countryOptions = useMemo<Option[]>(
    () =>
      countryList.map((item) => ({
        value: item.isoCode,
        label: item.name,
      })),
    [countryList],
  );

  const stateOptions = useMemo<Option[]>(
    () =>
      stateList.map((item) => ({
        value: item.isoCode,
        label: item.name,
      })),
    [stateList],
  );

  const cityOptions = useMemo<Option[]>(
    () =>
      cityList.map((item) => ({
        value: item.name,
        label: item.name,
      })),
    [cityList],
  );

  // Real backend name for the currently selected country/state — the
  // partner-preference API stores plain names (e.g. "India"), not iso codes.
  const selectedCountryName = useMemo(
    () => countryList.find((item) => item.isoCode === form.country)?.name ?? "",
    [countryList, form.country],
  );

  const selectedStateName = useMemo(
    () => stateList.find((item) => item.isoCode === form.state)?.name ?? "",
    [stateList, form.state],
  );

  /* ===================================================
     PREFILL FROM SAVED PARTNER PREFERENCE
  =================================================== */

  useEffect(() => {
    const pref = prefData?.data;
    if (!pref) return;

    setForm((prev) => ({
      ...prev,

      // Age range is stored as minAge/maxAge on the backend; this form only
      // exposes a single date, so there is no reliable way to reconstruct a
      // date of birth from a saved age range — left blank on reload.
      height:
        pref.basicDetails?.height?.minHeight ||
        pref.basicDetails?.height?.maxHeight ||
        "",
      maritalStatus: pref.basicDetails?.maritalStatus?.preferences?.[0] || "",

      religion: pref.religionAndEthnicity?.religion?.preference || "",
      caste: pref.religionAndEthnicity?.caste?.preferences?.[0] || "",
      subCaste: pref.religionAndEthnicity?.subCaste?.preferences?.[0] || "",
      motherTongue: pref.religionAndEthnicity?.motherTongue?.preference || "",

      highestEducation: pref.educationDetails?.highestDegrees?.[0] || "",
      occupation: pref.educationDetails?.occupation?.preferences?.[0] || "",
      annualIncome: pref.educationDetails?.annualIncome || "",

      diet: pref.lifestyleAndAppearance?.dietaryHabits?.preferences?.[0] || "",
      smoking:
        pref.lifestyleAndAppearance?.smokingHabits?.preferences?.[0] || "",
      drinking:
        pref.lifestyleAndAppearance?.drinkingHabits?.preferences?.[0] || "",
      physicalStatus:
        pref.lifestyleAndAppearance?.disability?.preferences?.[0] || "",

      city: pref.basicDetails?.partnerCity?.[0] || prev.city,
    }));

    // Country / state need a reverse lookup from saved name -> iso code so
    // the cascading selects (and the city list) resolve correctly.
    const savedCountryName = pref.basicDetails?.partnerCountry?.[0];
    if (savedCountryName) {
      const matchedCountry = Country.getAllCountries().find(
        (c) => c.name === savedCountryName,
      );

      if (matchedCountry) {
        setForm((prev) => ({ ...prev, country: matchedCountry.isoCode }));

        const savedStateName = pref.basicDetails?.partnerState?.[0];
        if (savedStateName) {
          const matchedState = State.getStatesOfCountry(
            matchedCountry.isoCode,
          ).find((s) => s.name === savedStateName);

          if (matchedState) {
            setForm((prev) => ({ ...prev, state: matchedState.isoCode }));
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefData]);

  /* ===================================================
     SAVE
     There is a single partner-preference document, so every
     section's Save button persists the full merged payload —
     it just reports back which section triggered it.
  =================================================== */

  const handleSave = async (section: PreferencesSection) => {
    const existing = prefData?.data;

    // The UI only collects one date of birth, but the backend expects an
    // age range — the picked date is used as both the min and max age.
    const age = form.dob
      ? Math.max(
          0,
          new Date().getFullYear() -
            new Date(form.dob).getFullYear() -
            (new Date().setFullYear(2000) < new Date(form.dob).setFullYear(2000)
              ? 1
              : 0),
        )
      : undefined;

    const minAge = age ?? existing?.basicDetails?.age?.minAge ?? 0;
    const maxAge = age ?? existing?.basicDetails?.age?.maxAge ?? 0;

    // The UI only lets a person pick one height, so it's sent as both ends
    // of the accepted height range.
    const heightId = form.height || undefined;
    const minHeight =
      heightId || existing?.basicDetails?.height?.minHeight || "";
    const maxHeight =
      heightId || existing?.basicDetails?.height?.maxHeight || "";

    const payload: PartnerPreferencePayload = {
      basicDetails: {
        age: { minAge, maxAge },
        height: { minHeight, maxHeight },
        partnerCountry: selectedCountryName
          ? [selectedCountryName]
          : (existing?.basicDetails?.partnerCountry as string[]) || [],
        partnerState: selectedStateName
          ? [selectedStateName]
          : (existing?.basicDetails?.partnerState as string[]) || [],
        partnerCity: form.city
          ? [form.city]
          : (existing?.basicDetails?.partnerCity as string[]) || [],
        maritalStatus: {
          preferences: form.maritalStatus
            ? [form.maritalStatus]
            : (existing?.basicDetails?.maritalStatus
                ?.preferences as string[]) || [],
        },
      },

      educationDetails: {
        doesntMatter: existing?.educationDetails?.doesntMatter ?? false,
        highestDegrees: form.highestEducation
          ? [form.highestEducation]
          : (existing?.educationDetails?.highestDegrees as string[]) || [],
        wellKnownColleges: existing?.educationDetails?.wellKnownColleges || "",
        occupation: {
          doesntMatter:
            existing?.educationDetails?.occupation?.doesntMatter ?? false,
          preferences: form.occupation
            ? [form.occupation]
            : (existing?.educationDetails?.occupation
                ?.preferences as string[]) || [],
        },
        annualIncome:
          form.annualIncome || existing?.educationDetails?.annualIncome || "",
      },

      familyDetails: {
        familyBasedOutOfCountry: {
          country:
            existing?.familyDetails?.familyBasedOutOfCountry?.country || "",
        },
      },

      religionAndEthnicity: {
        religion: {
          preference:
            form.religion ||
            existing?.religionAndEthnicity?.religion?.preference ||
            "",
        },
        caste: {
          preferences: form.caste
            ? [form.caste]
            : (existing?.religionAndEthnicity?.caste
                ?.preferences as string[]) || [],
        },
        subCaste: {
          preferences: form.subCaste
            ? [form.subCaste]
            : (existing?.religionAndEthnicity?.subCaste
                ?.preferences as string[]) || [],
        },
        motherTongue: {
          preference:
            form.motherTongue ||
            existing?.religionAndEthnicity?.motherTongue?.preference ||
            "",
        },
        manglikStatus: {
          preferences:
            (existing?.religionAndEthnicity?.manglikStatus
              ?.preferences as string[]) || [],
        },
      },

      // Options for these four fields stay hardcoded (no admin API exists
      // for them yet) — their currently selected values are still included
      // here since Save always persists the one shared preference document.
      lifestyleAndAppearance: {
        dietaryHabits: {
          preferences: form.diet
            ? [form.diet]
            : (existing?.lifestyleAndAppearance?.dietaryHabits
                ?.preferences as string[]) || [],
        },
        smokingHabits: {
          preferences: form.smoking
            ? [form.smoking]
            : (existing?.lifestyleAndAppearance?.smokingHabits
                ?.preferences as string[]) || [],
        },
        drinkingHabits: {
          preferences: form.drinking
            ? [form.drinking]
            : (existing?.lifestyleAndAppearance?.drinkingHabits
                ?.preferences as string[]) || [],
        },
        disability: {
          preferences: form.physicalStatus
            ? [form.physicalStatus]
            : (existing?.lifestyleAndAppearance?.disability
                ?.preferences as string[]) || [],
        },
      },

      aboutMyPartner: {
        description: existing?.aboutMyPartner?.description || "",
      },

      createdBy: existing?.createdBy || myProfileData?.data?.userId || "",
    };

    try {
      await savePartnerPreference(payload).unwrap();
      toast.success(`Partner ${section} preferences saved`);
    } catch (error) {
      console.error("Save partner preference error:", error);
      toast.error(`Failed to save partner ${section} preferences`);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      {/* ---------------------------------------------
          Header
      --------------------------------------------- */}

      <div className="relative mb-4 flex items-center justify-center border-b border-dashed border-gray-200 py-3">
        <Link
          href="/my-profile"
          className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:bg-slate-100"
          aria-label="Go back"
        >
          <ChevronLeft size={20} />
        </Link>

        <h3 className="font-serif text-xl font-semibold text-slate-900">
          Partner Preferences
        </h3>
      </div>

      {/* ---------------------------------------------
          Main Sections
      --------------------------------------------- */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* =================================================
            PARTNER BASIC DETAILS
        ================================================= */}

        <div className="rounded-md bg-rose-50 p-4">
          <h2 className="mb-6 border-b border-dashed border-gray-400 pb-2 font-serif text-lg font-semibold">
            Partner basic details
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {/* Gender */}

            <FieldSelect
              id="gender"
              label="Gender"
              value={form.gender}
              onChange={(value) => handleSelectChange("gender", value)}
              options={[
                {
                  value: "Male",
                  label: "Male",
                },
                {
                  value: "Female",
                  label: "Female",
                },
                {
                  value: "Other",
                  label: "Other",
                },
              ]}
            />

            {/* ===================================================
    DATE OF BIRTH
=================================================== */}

            <div>
              <label className={labelClass}>Date of birth</label>

              <div className="relative">
                <CalendarDays
                  size={18}
                  strokeWidth={1.8}
                  className="pointer-events-none absolute left-4 top-1/2 z-20 -translate-y-1/2 text-rose-400"
                />

                <DatePicker
                  id="dob"
                  name="dob"
                  selected={form.dob ? new Date(`${form.dob}T00:00:00`) : null}
                  onChange={(date: Date | null) => {
                    if (!date) {
                      handleInputChange({
                        target: {
                          name: "dob",
                          value: "",
                        },
                      } as React.ChangeEvent<HTMLInputElement>);

                      return;
                    }

                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, "0");
                    const day = String(date.getDate()).padStart(2, "0");

                    handleInputChange({
                      target: {
                        name: "dob",
                        value: `${year}-${month}-${day}`,
                      },
                    } as React.ChangeEvent<HTMLInputElement>);
                  }}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Select your date of birth"
                  maxDate={new Date()}
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  isClearable
                  wrapperClassName="w-full"
                  calendarClassName="modern-datepicker"
                  className="
        h-14
        w-full
        rounded-2xl
        border
        border-slate-200
        bg-white
        pl-12
        pr-4
        text-sm
        text-slate-900
        outline-none
        transition-all
        duration-200
        hover:border-rose-200
        focus:border-rose-400
        focus:ring-4
        focus:ring-rose-50
      "
                />
              </div>
            </div>

            {/* Height */}

            <FieldSelect
              id="height"
              label="Height"
              value={form.height}
              onChange={(value) => handleSelectChange("height", value)}
              placeholder="Search height..."
              options={heightOptions}
            />

            {/* Religion */}

            <FieldSelect
              id="religion"
              label="Religion"
              value={form.religion}
              onChange={(value) => {
                handleSelectChange("religion", value);
                // Cascading fields no longer apply once religion changes.
                handleSelectChange("caste", "");
                handleSelectChange("subCaste", "");
              }}
              placeholder="Search religion..."
              options={religionOptions}
            />

            {/* Caste */}

            <FieldSelect
              id="caste"
              label="Caste"
              value={form.caste}
              onChange={(value) => {
                handleSelectChange("caste", value);
                handleSelectChange("subCaste", "");
              }}
              placeholder={
                form.religion ? "Search caste..." : "Select religion first"
              }
              options={casteOptions}
              isDisabled={!form.religion}
              isLoading={casteLoading}
            />

            {/* Sub Caste */}

            <FieldSelect
              id="subCaste"
              label="Sub caste"
              value={form.subCaste}
              onChange={(value) => handleSelectChange("subCaste", value)}
              placeholder={
                form.caste ? "Search sub caste..." : "Select caste first"
              }
              options={subCasteOptions}
              isDisabled={!form.caste}
              isLoading={subCasteLoading}
            />

            {/* Mother Tongue */}

            <FieldSelect
              id="motherTongue"
              label="Mother tongue"
              value={form.motherTongue}
              onChange={(value) => handleSelectChange("motherTongue", value)}
              placeholder="Search mother tongue..."
              options={motherTongueOptions}
            />

            {/* Country */}

            <FieldSelect
              id="country"
              label="Residing country"
              value={form.country}
              onChange={(value) => {
                handleSelectChange("country", value);
                handleSelectChange("state", "");
                handleSelectChange("city", "");
              }}
              placeholder="Search country..."
              options={countryOptions}
            />

            {/* State */}

            <FieldSelect
              id="state"
              label="Residing state"
              value={form.state}
              onChange={(value) => {
                handleSelectChange("state", value);
                handleSelectChange("city", "");
              }}
              placeholder={
                form.country ? "Search state..." : "Select country first"
              }
              options={stateOptions}
              isDisabled={!form.country}
            />

            {/* City */}

            <FieldSelect
              id="city"
              label="Residing city"
              value={form.city}
              onChange={(value) => handleSelectChange("city", value)}
              placeholder={form.state ? "Search city..." : "Select state first"}
              options={cityOptions}
              isDisabled={!form.state}
            />

            {/* Marital Status */}

            <FieldSelect
              id="maritalStatus"
              label="Marital status"
              value={form.maritalStatus}
              onChange={(value) => handleSelectChange("maritalStatus", value)}
              placeholder="Search marital status..."
              options={[
                {
                  value: "Never Married",
                  label: "Never married",
                },
                {
                  value: "Married",
                  label: "Married",
                },
                {
                  value: "Divorced",
                  label: "Divorced",
                },
                {
                  value: "Widowed",
                  label: "Widowed",
                },
              ]}
            />
          </div>

          <div className="mt-6 flex justify-end">
            <ThemeBtnOne
              text={isSaving ? "Saving..." : "Save"}
              disabled={isSaving}
              onClick={() => handleSave("basic details")}
              className="mt-4 cursor-pointer rounded-full bg-rose-500 px-3 py-2 font-serif text-white"
            />
          </div>
        </div>

        {/* =================================================
            EDUCATION & OCCUPATION
        ================================================= */}

        <div className="rounded-md bg-rose-50 p-4">
          <h2 className="mb-6 border-b border-dashed border-gray-400 pb-2 font-serif text-lg font-semibold">
            Partner education & occupation
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {/* Highest Education */}

            <FieldSelect
              id="highestEducation"
              label="Highest education"
              value={form.highestEducation}
              onChange={(value) =>
                handleSelectChange("highestEducation", value)
              }
              placeholder="Search education..."
              options={highestEducationOptions}
            />

            {/* UG Degree — no dedicated lookup API exists for this yet, and
                the partner-preference schema has no separate slot for it,
                so it stays local-only (kept exactly as before). */}

            <FieldSelect
              id="ugDegree"
              label="UG degree"
              value={form.ugDegree}
              onChange={(value) => handleSelectChange("ugDegree", value)}
              placeholder="Search degree..."
              options={[
                {
                  value: "bcom",
                  label: "B.Com",
                },
                {
                  value: "btech",
                  label: "B.Tech / B.E.",
                },
                {
                  value: "ba",
                  label: "B.A.",
                },
              ]}
            />

            {/* Occupation */}

            <FieldSelect
              id="occupation"
              label="Occupation"
              value={form.occupation}
              onChange={(value) => handleSelectChange("occupation", value)}
              placeholder="Search occupation..."
              options={occupationOptions}
            />

            {/* Annual Income */}

            <FieldSelect
              id="annualIncome"
              label="Annual income"
              value={form.annualIncome}
              onChange={(value) => handleSelectChange("annualIncome", value)}
              placeholder="Search income..."
              options={annualIncomeOptions}
            />
          </div>

          <div className="mt-6 flex justify-end">
            <ThemeBtnOne
              text={isSaving ? "Saving..." : "Save"}
              disabled={isSaving}
              onClick={() => handleSave("education & occupation")}
              className="mt-4 cursor-pointer rounded-full bg-rose-500 px-3 py-2 font-serif text-white"
            />
          </div>
        </div>

        {/* =================================================
            LIFESTYLE
            NOTE: kept fully static per instructions — there is
            no admin API yet to source these option lists from.
        ================================================= */}

        <div className="rounded-md bg-rose-50 p-4">
          <h2 className="mb-6 border-b border-dashed border-gray-400 pb-2 font-serif text-lg font-semibold">
            Partner lifestyle
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {/* Diet */}

            <FieldSelect
              id="diet"
              label="Diet"
              value={form.diet}
              onChange={(value) => handleSelectChange("diet", value)}
              placeholder="Search diet..."
              options={[
                {
                  value: "Vegetarian",
                  label: "Vegetarian",
                },
                {
                  value: "Non Vegetarian",
                  label: "Non Vegetarian",
                },
                {
                  value: "Jain",
                  label: "Jain",
                },
                {
                  value: "Eggetarian",
                  label: "Eggetarian",
                },
                {
                  value: "Doesn't Matter",
                  label: "Doesn't Matter",
                },
              ]}
            />

            {/* Smoking */}

            <FieldSelect
              id="smoking"
              label="Smoking habits"
              value={form.smoking}
              onChange={(value) => handleSelectChange("smoking", value)}
              placeholder="Search smoking habit..."
              options={[
                {
                  value: "No",
                  label: "No",
                },
                {
                  value: "Occasionally",
                  label: "Occasionally",
                },
                {
                  value: "Yes",
                  label: "Yes",
                },
              ]}
            />

            {/* Drinking */}

            <FieldSelect
              id="drinking"
              label="Drinking habits"
              value={form.drinking}
              onChange={(value) => handleSelectChange("drinking", value)}
              placeholder="Search drinking habit..."
              options={[
                {
                  value: "No",
                  label: "No",
                },
                {
                  value: "Occasionally",
                  label: "Occasionally",
                },
                {
                  value: "Yes",
                  label: "Yes",
                },
              ]}
            />

            {/* Physical Status */}

            <FieldSelect
              id="physicalStatus"
              label="Disability"
              value={form.physicalStatus}
              onChange={(value) => handleSelectChange("physicalStatus", value)}
              placeholder="Search disability..."
              options={[
                {
                  value: "None",
                  label: "None",
                },
                {
                  value: "Physically disabled from birth",
                  label: "Physically disabled from birth",
                },
                {
                  value: "Physically disabled due to accident",
                  label: "Physically disabled due to accident",
                },
                {
                  value: "Mentally disabled from birth",
                  label: "Mentally disabled from birth",
                },
                {
                  value: "Mentally disabled due to accident",
                  label: "Mentally disabled due to accident",
                },
                {
                  value: "Doesn't Matter",
                  label: "Doesn't Matter",
                },
              ]}
            />
          </div>

          <div className="mt-6 flex justify-end">
            <ThemeBtnOne
              text={isSaving ? "Saving..." : "Save"}
              disabled={isSaving}
              onClick={() => handleSave("lifestyle")}
              className="mt-4 cursor-pointer rounded-full bg-rose-500 px-3 py-2 font-serif text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerPreferences;

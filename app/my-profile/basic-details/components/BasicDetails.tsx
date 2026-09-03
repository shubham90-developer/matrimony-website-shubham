/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import ThemeBtnOne from "@/app/components/ThemeBtnOne";
import { CalendarDays, ChevronLeft } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Select, { SingleValue, StylesConfig } from "react-select";
import { Country, State, City } from "country-state-city";

import {
  useGetMyProfileQuery,
  useUpdateProfileMutation,
} from "@/Redux/profileApi";

import { useGetReligionsQuery } from "@/Redux/religionApi";
import { useGetCastesByReligionQuery } from "@/Redux/casteApi";
import { useGetSubCastesByCasteQuery } from "@/Redux/subCasteApi";
import { useGetMotherTonguesQuery } from "@/Redux/motherToungeApi";
import { useGetHeightsQuery } from "@/Redux/heightApi";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

/* =====================================================
   TYPES
===================================================== */

type SelectOption = {
  value: string;
  label: string;
};

/* =====================================================
   SELECT STYLES
===================================================== */

const selectStyles: StylesConfig<SelectOption, false> = {
  control: (base, state) => ({
    ...base,
    minHeight: "54px",
    borderRadius: "16px",
    borderColor: state.isFocused ? "#fda4af" : "#e2e8f0",
    backgroundColor: "#ffffff",
    boxShadow: state.isFocused ? "0 0 0 3px rgba(244, 63, 94, 0.10)" : "none",
    padding: "0 6px",
    cursor: "pointer",
    transition: "all 0.2s ease",

    "&:hover": {
      borderColor: "#fda4af",
    },
  }),

  valueContainer: (base) => ({
    ...base,
    padding: "2px 10px",
  }),

  input: (base) => ({
    ...base,
    color: "#0f172a",
    fontSize: "14px",
  }),

  placeholder: (base) => ({
    ...base,
    color: "#94a3b8",
    fontSize: "14px",
  }),

  singleValue: (base) => ({
    ...base,
    color: "#0f172a",
    fontSize: "14px",
    fontWeight: 500,
  }),

  menu: (base) => ({
    ...base,
    marginTop: "6px",
    borderRadius: "14px",
    overflow: "hidden",
    zIndex: 9999,
    boxShadow: "0 12px 35px rgba(15, 23, 42, 0.15)",
  }),

  menuList: (base) => ({
    ...base,
    padding: "6px",
    maxHeight: "240px",
  }),

  option: (base, state) => ({
    ...base,
    borderRadius: "10px",
    padding: "11px 14px",
    fontSize: "14px",
    cursor: "pointer",

    backgroundColor: state.isSelected
      ? "#f43f5e"
      : state.isFocused
        ? "#fff1f2"
        : "#ffffff",

    color: state.isSelected ? "#ffffff" : "#0f172a",

    "&:active": {
      backgroundColor: "#ffe4e6",
    },
  }),

  dropdownIndicator: (base, state) => ({
    ...base,
    color: state.isFocused ? "#f43f5e" : "#94a3b8",

    "&:hover": {
      color: "#f43f5e",
    },
  }),

  clearIndicator: (base) => ({
    ...base,
    color: "#94a3b8",

    "&:hover": {
      color: "#f43f5e",
    },
  }),

  indicatorSeparator: () => ({
    display: "none",
  }),

  noOptionsMessage: (base) => ({
    ...base,
    color: "#94a3b8",
    fontSize: "13px",
    padding: "12px",
  }),

  loadingMessage: (base) => ({
    ...base,
    color: "#94a3b8",
    fontSize: "13px",
  }),
};

/* =====================================================
   STATIC OPTIONS
===================================================== */

const genderOptions: SelectOption[] = [
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
];

const maritalStatusOptions: SelectOption[] = [
  {
    value: "Never Married",
    label: "Never Married",
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
];

/* =====================================================
   COMPONENT
===================================================== */

const BasicDetails = () => {
  const router = useRouter();

  /* ===================================================
     PROFILE API
  =================================================== */

  const { data, isLoading, isError } = useGetMyProfileQuery();

  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();

  /* ===================================================
     FORM STATE
  =================================================== */

  const [firstName, setFirstName] = useState<string>("");

  const [lastName, setLastName] = useState<string>("");

  const [gender, setGender] = useState<string>("");

  const [dob, setDob] = useState<string>("");

  const [height, setHeight] = useState<string>("");

  const [maritalStatus, setMaritalStatus] = useState<string>("");

  const [religionId, setReligionId] = useState<string>("");

  const [casteId, setCasteId] = useState<string>("");

  const [subCasteId, setSubCasteId] = useState<string>("");

  const [motherTongue, setMotherTongue] = useState<string>("");

  const [countryIso, setCountryIso] = useState<string>("");

  const [stateIso, setStateIso] = useState<string>("");

  const [city, setCity] = useState<string>("");

  /* ===================================================
     API DROPDOWNS
  =================================================== */

  const { data: religionRes } = useGetReligionsQuery();

  const { data: casteRes, isLoading: casteLoading } =
    useGetCastesByReligionQuery(religionId, {
      skip: !religionId,
    });

  const { data: subCasteRes, isLoading: subCasteLoading } =
    useGetSubCastesByCasteQuery(casteId, {
      skip: !casteId,
    });

  const { data: motherTongueRes } = useGetMotherTonguesQuery();

  const { data: heightRes } = useGetHeightsQuery();

  /* ===================================================
     COUNTRY / STATE / CITY
  =================================================== */

  const countryList = useMemo(() => Country.getAllCountries(), []);

  const stateList = useMemo(
    () => (countryIso ? State.getStatesOfCountry(countryIso) : []),
    [countryIso],
  );

  const cityList = useMemo(
    () =>
      countryIso && stateIso ? City.getCitiesOfState(countryIso, stateIso) : [],
    [countryIso, stateIso],
  );

  /* ===================================================
     OPTION LISTS
  =================================================== */

  const religionOptions = useMemo<SelectOption[]>(
    () =>
      (religionRes?.data ?? []).map((item) => ({
        value: item._id,
        label: item.religion,
      })),
    [religionRes],
  );

  const casteOptions = useMemo<SelectOption[]>(
    () =>
      (casteRes?.data ?? []).map((item) => ({
        value: item._id,
        label: item.caste,
      })),
    [casteRes],
  );

  const subCasteOptions = useMemo<SelectOption[]>(
    () =>
      (subCasteRes?.data ?? []).map((item) => ({
        value: item._id,
        label: item.subCaste,
      })),
    [subCasteRes],
  );

  const motherTongueOptions = useMemo<SelectOption[]>(
    () =>
      (motherTongueRes?.data ?? []).map((item) => ({
        value: item.motherTongue,
        label: item.motherTongue,
      })),
    [motherTongueRes],
  );

  const heightOptions = useMemo<SelectOption[]>(
    () =>
      (heightRes?.data ?? []).map((item) => ({
        value: item.height,
        label: item.height,
      })),
    [heightRes],
  );

  const countryOptions = useMemo<SelectOption[]>(
    () =>
      countryList.map((item) => ({
        value: item.isoCode,
        label: item.name,
      })),
    [countryList],
  );

  const stateOptions = useMemo<SelectOption[]>(
    () =>
      stateList.map((item) => ({
        value: item.isoCode,
        label: item.name,
      })),
    [stateList],
  );

  const cityOptions = useMemo<SelectOption[]>(
    () =>
      cityList.map((item) => ({
        value: item.name,
        label: item.name,
      })),
    [cityList],
  );

  /* ===================================================
     PREFILL PROFILE
  =================================================== */

  useEffect(() => {
    if (!data?.data) return;

    const p = data.data;

    setFirstName(p.basicDetails?.firstName || "");

    setLastName(p.basicDetails?.lastName || "");

    setGender(p.basicDetails?.gender || "");

    setDob(p.basicDetails?.dob ? p.basicDetails.dob.slice(0, 10) : "");

    setHeight(p.basicDetails?.height || "");

    setMaritalStatus(p.basicDetails?.maritalStatus || "");

    setMotherTongue(p.religionDetails?.motherTongue || "");

    setCity(p.locationDetails?.city || "");

    /* Country */

    const matchedCountry = countryList.find(
      (country) => country.name === p.locationDetails?.country,
    );

    if (matchedCountry) {
      setCountryIso(matchedCountry.isoCode);

      const matchedState = State.getStatesOfCountry(
        matchedCountry.isoCode,
      ).find((state) => state.name === p.locationDetails?.state);

      if (matchedState) {
        setStateIso(matchedState.isoCode);
      }
    }

    /* Religion */

    if (religionRes?.data) {
      const matchedReligion = religionRes.data.find(
        (religion) => religion.religion === p.religionDetails?.religion,
      );

      if (matchedReligion) {
        setReligionId(matchedReligion._id);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  /* ===================================================
     RESOLVE CASTE
  =================================================== */

  useEffect(() => {
    if (!casteRes?.data || !data?.data) {
      return;
    }

    const matchedCaste = casteRes.data.find(
      (caste) => caste.caste === data.data.religionDetails?.caste,
    );

    if (matchedCaste) {
      setCasteId(matchedCaste._id);
    }
  }, [casteRes, data]);

  /* ===================================================
     RESOLVE SUB CASTE
  =================================================== */

  useEffect(() => {
    if (!subCasteRes?.data || !data?.data) {
      return;
    }

    const matchedSubCaste = subCasteRes.data.find(
      (subCaste) => subCaste.subCaste === data.data.religionDetails?.subCaste,
    );

    if (matchedSubCaste) {
      setSubCasteId(matchedSubCaste._id);
    }
  }, [subCasteRes, data]);

  /* ===================================================
     SELECTED NAMES
  =================================================== */

  const selectedReligionName = useMemo(
    () =>
      religionRes?.data.find((item) => item._id === religionId)?.religion || "",
    [religionRes, religionId],
  );

  const selectedCasteName = useMemo(
    () => casteRes?.data.find((item) => item._id === casteId)?.caste || "",
    [casteRes, casteId],
  );

  const selectedSubCasteName = useMemo(
    () =>
      subCasteRes?.data.find((item) => item._id === subCasteId)?.subCaste || "",
    [subCasteRes, subCasteId],
  );

  const selectedCountryName = useMemo(
    () => countryList.find((item) => item.isoCode === countryIso)?.name || "",
    [countryList, countryIso],
  );

  const selectedStateName = useMemo(
    () => stateList.find((item) => item.isoCode === stateIso)?.name || "",
    [stateList, stateIso],
  );

  /* ===================================================
     HELPER
  =================================================== */

  const getSelectedOption = (
    options: SelectOption[],
    value: string,
  ): SelectOption | null => {
    return options.find((option) => option.value === value) ?? null;
  };

  /* ===================================================
     UPDATE
  =================================================== */

  const handleUpdate = async () => {
    if (!data?.data) return;

    const existing = data.data;

    /* Calculate age */

    const age = dob
      ? Math.max(
          0,
          new Date().getFullYear() -
            new Date(dob).getFullYear() -
            (new Date().setFullYear(2000) < new Date(dob).setFullYear(2000)
              ? 1
              : 0),
        )
      : existing.basicDetails?.age;

    try {
      await updateProfile({
        basicDetails: {
          ...existing.basicDetails,

          firstName,
          lastName,
          gender,
          dob,
          age,
          height,
          maritalStatus,
        },

        religionDetails: {
          ...existing.religionDetails,

          religion:
            selectedReligionName || existing.religionDetails?.religion || "",

          caste: selectedCasteName || existing.religionDetails?.caste || "",

          subCaste: selectedSubCasteName,

          motherTongue,
        },

        locationDetails: {
          ...existing.locationDetails,

          country:
            selectedCountryName || existing.locationDetails?.country || "",

          state: selectedStateName || existing.locationDetails?.state || "",

          city,
        },
      }).unwrap();

      toast.success("Profile updated successfully");

      router.push("/my-profile");
    } catch (error) {
      console.error("Update profile error:", error);

      toast.error("Failed to update profile");
    }
  };

  /* ===================================================
     LOADING
  =================================================== */

  if (isLoading) {
    return (
      <div className="p-8 text-center text-sm text-slate-500">Loading...</div>
    );
  }

  /* ===================================================
     ERROR
  =================================================== */

  if (isError) {
    return (
      <div className="p-8 text-center text-sm text-rose-500">
        Could not load profile.
      </div>
    );
  }

  /* ===================================================
     UI
  =================================================== */

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      {/* Header */}

      <div className="relative mb-6 flex items-center justify-center border-b border-dashed border-gray-200 py-3">
        <Link
          href="/my-profile"
          className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500"
          aria-label="Go back"
        >
          <ChevronLeft size={20} />
        </Link>

        <h3 className="font-serif text-xl font-semibold text-slate-900">
          Basic Details
        </h3>
      </div>

      {/* Form */}

      <div>
        <div className="mb-10 grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* =================================================
              FIRST NAME
          ================================================== */}

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-900">
              First Name
            </label>

            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
            />
          </div>

          {/* =================================================
              LAST NAME
          ================================================== */}

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-900">
              Last Name
            </label>

            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your last name"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
            />
          </div>

          {/* =================================================
              GENDER
          ================================================== */}

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-900">
              Gender
            </label>

            <Select<SelectOption, false>
              isSearchable
              options={genderOptions}
              value={getSelectedOption(genderOptions, gender)}
              onChange={(option: SingleValue<SelectOption>) =>
                setGender(option?.value ?? "")
              }
              placeholder="Search gender..."
              noOptionsMessage={() => "No gender found"}
              styles={selectStyles}
            />
          </div>

          {/* =================================================
    DATE OF BIRTH
================================================== */}

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-900">
              Date Of Birth
            </label>

            <div className="relative">
              <CalendarDays
                size={18}
                strokeWidth={1.8}
                className="pointer-events-none absolute left-4 top-1/2 z-20 -translate-y-1/2 text-rose-400"
              />

              <DatePicker
                selected={dob ? new Date(`${dob}T00:00:00`) : null}
                onChange={(date: Date | null) => {
                  if (!date) {
                    setDob("");
                    return;
                  }

                  const year = date.getFullYear();
                  const month = String(date.getMonth() + 1).padStart(2, "0");
                  const day = String(date.getDate()).padStart(2, "0");

                  setDob(`${year}-${month}-${day}`);
                }}
                dateFormat="dd/MM/yyyy"
                placeholderText="Select date of birth"
                maxDate={new Date()}
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                isClearable
                wrapperClassName="w-full"
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
        font-medium
        text-slate-900
        outline-none
        transition-all
        duration-200
        hover:border-rose-200
        focus:border-rose-400
        focus:ring-4
        focus:ring-rose-50
      "
                calendarClassName="modern-datepicker"
              />
            </div>
          </div>

          {/* =================================================
              HEIGHT
          ================================================== */}

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-900">
              Height
            </label>

            <Select<SelectOption, false>
              isSearchable
              options={heightOptions}
              value={getSelectedOption(heightOptions, height)}
              onChange={(option: SingleValue<SelectOption>) =>
                setHeight(option?.value ?? "")
              }
              placeholder="Search height..."
              noOptionsMessage={() => "No height found"}
              styles={selectStyles}
            />
          </div>

          {/* =================================================
              RELIGION
          ================================================== */}

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-900">
              Religion
            </label>

            <Select<SelectOption, false>
              isSearchable
              options={religionOptions}
              value={getSelectedOption(religionOptions, religionId)}
              onChange={(option: SingleValue<SelectOption>) => {
                const newReligionId = option?.value ?? "";

                setReligionId(newReligionId);

                setCasteId("");
                setSubCasteId("");
              }}
              placeholder="Search religion..."
              noOptionsMessage={() => "No religion found"}
              styles={selectStyles}
            />
          </div>

          {/* =================================================
              CASTE
          ================================================== */}

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-900">
              Caste
            </label>

            <Select<SelectOption, false>
              isSearchable
              isDisabled={!religionId}
              isLoading={casteLoading}
              options={casteOptions}
              value={getSelectedOption(casteOptions, casteId)}
              onChange={(option: SingleValue<SelectOption>) => {
                const newCasteId = option?.value ?? "";

                setCasteId(newCasteId);

                setSubCasteId("");
              }}
              placeholder={
                religionId ? "Search caste..." : "Select religion first"
              }
              noOptionsMessage={() => "No caste found"}
              styles={selectStyles}
            />
          </div>

          {/* =================================================
              SUB CASTE
          ================================================== */}

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-900">
              Sub Caste
            </label>

            <Select<SelectOption, false>
              isSearchable
              isDisabled={!casteId}
              isLoading={subCasteLoading}
              options={subCasteOptions}
              value={getSelectedOption(subCasteOptions, subCasteId)}
              onChange={(option: SingleValue<SelectOption>) =>
                setSubCasteId(option?.value ?? "")
              }
              placeholder={
                casteId ? "Search sub caste..." : "Select caste first"
              }
              noOptionsMessage={() => "No sub caste found"}
              styles={selectStyles}
            />
          </div>

          {/* =================================================
              MOTHER TONGUE
          ================================================== */}

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-900">
              Mother Tongue
            </label>

            <Select<SelectOption, false>
              isSearchable
              options={motherTongueOptions}
              value={getSelectedOption(motherTongueOptions, motherTongue)}
              onChange={(option: SingleValue<SelectOption>) =>
                setMotherTongue(option?.value ?? "")
              }
              placeholder="Search mother tongue..."
              noOptionsMessage={() => "No mother tongue found"}
              styles={selectStyles}
            />
          </div>

          {/* =================================================
              COUNTRY
          ================================================== */}

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-900">
              Your Residing Country
            </label>

            <Select<SelectOption, false>
              isSearchable
              options={countryOptions}
              value={getSelectedOption(countryOptions, countryIso)}
              onChange={(option: SingleValue<SelectOption>) => {
                const newCountry = option?.value ?? "";

                setCountryIso(newCountry);

                setStateIso("");
                setCity("");
              }}
              placeholder="Search country..."
              noOptionsMessage={() => "No country found"}
              styles={selectStyles}
            />
          </div>

          {/* =================================================
              STATE
          ================================================== */}

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-900">
              Your Residing State
            </label>

            <Select<SelectOption, false>
              isSearchable
              isDisabled={!countryIso}
              options={stateOptions}
              value={getSelectedOption(stateOptions, stateIso)}
              onChange={(option: SingleValue<SelectOption>) => {
                const newState = option?.value ?? "";

                setStateIso(newState);

                setCity("");
              }}
              placeholder={
                countryIso ? "Search state..." : "Select country first"
              }
              noOptionsMessage={() => "No state found"}
              styles={selectStyles}
            />
          </div>

          {/* =================================================
              CITY
          ================================================== */}

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-900">
              Your Residing City
            </label>

            <Select<SelectOption, false>
              isSearchable
              isDisabled={!stateIso}
              options={cityOptions}
              value={getSelectedOption(cityOptions, city)}
              onChange={(option: SingleValue<SelectOption>) =>
                setCity(option?.value ?? "")
              }
              placeholder={stateIso ? "Search city..." : "Select state first"}
              noOptionsMessage={() => "No city found"}
              styles={selectStyles}
            />
          </div>

          {/* =================================================
              MARITAL STATUS
          ================================================== */}

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-900">
              Marital Status
            </label>

            <Select<SelectOption, false>
              isSearchable
              options={maritalStatusOptions}
              value={getSelectedOption(maritalStatusOptions, maritalStatus)}
              onChange={(option: SingleValue<SelectOption>) =>
                setMaritalStatus(option?.value ?? "")
              }
              placeholder="Search marital status..."
              noOptionsMessage={() => "No marital status found"}
              styles={selectStyles}
            />
          </div>
        </div>

        {/* =================================================
            UPDATE BUTTON
        ================================================== */}

        <div className="flex justify-end">
          <ThemeBtnOne
            text={isSaving ? "Updating..." : "Update"}
            onClick={handleUpdate}
            className="mt-2 cursor-pointer rounded-full bg-rose-500 px-6 py-2.5 font-serif text-white transition hover:bg-rose-600"
          />
        </div>
      </div>
    </div>
  );
};

export default BasicDetails;

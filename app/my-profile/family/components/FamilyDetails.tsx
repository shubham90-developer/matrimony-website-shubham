/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import ThemeBtnOne from "@/app/components/ThemeBtnOne";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Select, { SingleValue, StylesConfig } from "react-select";

import {
  useGetMyProfileQuery,
  useUpdateProfileMutation,
} from "@/Redux/profileApi";

/* =========================================================
   TYPES
========================================================= */

type SelectOption = {
  value: string;
  label: string;
};

/* =========================================================
   REACT SELECT STYLES
========================================================= */

const selectStyles: StylesConfig<SelectOption, false> = {
  control: (base, state) => ({
    ...base,
    minHeight: "52px",
    height: "52px",
    borderRadius: "16px",
    borderColor: state.isFocused ? "#fda4af" : "#e2e8f0",
    boxShadow: "none",
    backgroundColor: "#ffffff",
    cursor: "pointer",
    paddingLeft: "8px",
    paddingRight: "8px",
    transition: "all 0.2s ease",

    "&:hover": {
      borderColor: "#fda4af",
    },
  }),

  valueContainer: (base) => ({
    ...base,
    padding: "0 8px",
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

  input: (base) => ({
    ...base,
    color: "#0f172a",
    fontSize: "14px",
  }),

  menu: (base) => ({
    ...base,
    zIndex: 50,
    borderRadius: "14px",
    overflow: "hidden",
    marginTop: "6px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.10)",
  }),

  menuList: (base) => ({
    ...base,
    padding: "6px",
    maxHeight: "220px",
  }),

  option: (base, state) => ({
    ...base,
    borderRadius: "10px",
    padding: "10px 12px",
    fontSize: "14px",
    cursor: "pointer",

    color: state.isSelected ? "#ffffff" : "#334155",

    backgroundColor: state.isSelected
      ? "#f43f5e"
      : state.isFocused
        ? "#fff1f2"
        : "#ffffff",
  }),

  indicatorSeparator: () => ({
    display: "none",
  }),

  dropdownIndicator: (base) => ({
    ...base,
    color: "#94a3b8",

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
};

/* =========================================================
   COMPONENT
========================================================= */

const FamilyDetails = () => {
  const router = useRouter();

  const { data, isLoading, isError } = useGetMyProfileQuery();

  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();

  /* =========================================================
     FORM STATE
  ========================================================= */

  const [familyStatus, setFamilyStatus] = useState<string>("");

  const [brothers, setBrothers] = useState<string>("");

  const [sisters, setSisters] = useState<string>("");

  const [livingWithParents, setLivingWithParents] = useState<string>("");

  const [familyBasedOutOf, setFamilyBasedOutOf] = useState<string>("");

  const [marriedBrothers, setMarriedBrothers] = useState<string>("");

  const [marriedSisters, setMarriedSisters] = useState<string>("");

  /* =========================================================
     FAMILY CLASS OPTIONS
  ========================================================= */

  const familyStatusOptions: SelectOption[] = [
    {
      value: "Middle Class",
      label: "Middle Class",
    },
    {
      value: "Upper Middle Class",
      label: "Upper Middle Class",
    },
    {
      value: "Rich",
      label: "Rich",
    },
  ];

  /* =========================================================
     YES / NO OPTIONS
  ========================================================= */

  const yesNoOptions: SelectOption[] = [
    {
      value: "yes",
      label: "Yes",
    },
    {
      value: "no",
      label: "No",
    },
  ];

  /* =========================================================
     NUMBER OPTIONS
  ========================================================= */

  const numberOptions = useMemo<SelectOption[]>(() => {
    return Array.from({ length: 11 }, (_, index) => ({
      value: String(index),
      label: String(index),
    }));
  }, []);

  /* =========================================================
     SELECTED OPTIONS
  ========================================================= */

  const selectedFamilyStatus = useMemo<SelectOption | null>(() => {
    return (
      familyStatusOptions.find((item) => item.value === familyStatus) ?? null
    );
  }, [familyStatus]);

  const selectedBrothers = useMemo<SelectOption | null>(() => {
    return numberOptions.find((item) => item.value === brothers) ?? null;
  }, [numberOptions, brothers]);

  const selectedMarriedBrothers = useMemo<SelectOption | null>(() => {
    return numberOptions.find((item) => item.value === marriedBrothers) ?? null;
  }, [numberOptions, marriedBrothers]);

  const selectedSisters = useMemo<SelectOption | null>(() => {
    return numberOptions.find((item) => item.value === sisters) ?? null;
  }, [numberOptions, sisters]);

  const selectedMarriedSisters = useMemo<SelectOption | null>(() => {
    return numberOptions.find((item) => item.value === marriedSisters) ?? null;
  }, [numberOptions, marriedSisters]);

  const selectedLivingWithParents = useMemo<SelectOption | null>(() => {
    return (
      yesNoOptions.find((item) => item.value === livingWithParents) ?? null
    );
  }, [livingWithParents]);

  /* =========================================================
     PREFILL PROFILE
  ========================================================= */

  useEffect(() => {
    if (!data?.data) return;

    const p = data.data;

    setFamilyStatus(p.family?.familyStatus || "");

    setBrothers(p.family?.brothers || "");

    setSisters(p.family?.sisters || "");

    setLivingWithParents(p.family?.livingWithParents ? "yes" : "no");

    setFamilyBasedOutOf(p.family?.familyBasedOutOf || "");
  }, [data]);

  /* =========================================================
     UPDATE PROFILE
  ========================================================= */

  const handleUpdate = async () => {
    if (!data?.data) return;

    const existing = data.data;

    try {
      await updateProfile({
        family: {
          ...(existing.family || {}),

          familyStatus,

          brothers,

          sisters,

          livingWithParents: livingWithParents === "yes",

          familyBasedOutOf,
        },
      }).unwrap();

      toast.success("Profile updated successfully");

      router.push("/my-profile");
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (isLoading) {
    return (
      <div className="p-8 text-center text-sm text-slate-500">Loading...</div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (isError) {
    return (
      <div className="p-8 text-center text-sm text-rose-500">
        Could not load profile.
      </div>
    );
  }

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="relative mb-5 flex items-center justify-center border-b border-dashed border-gray-200 py-3">
        <Link
          href="/my-profile"
          className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:bg-slate-100"
          aria-label="Go back"
        >
          <ChevronLeft size={20} />
        </Link>

        <h3 className="font-serif text-xl font-semibold text-slate-900">
          Family Details
        </h3>
      </div>

      {/* =====================================================
          FORM
      ===================================================== */}

      <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* ===================================================
            FAMILY CLASS
        =================================================== */}

        <div>
          <label className="mb-1.5 block text-md font-bold text-slate-900">
            Family Class
          </label>

          <Select<SelectOption, false>
            isSearchable
            isClearable
            options={familyStatusOptions}
            value={selectedFamilyStatus}
            onChange={(option: SingleValue<SelectOption>) => {
              setFamilyStatus(option?.value ?? "");
            }}
            placeholder="Search family class..."
            noOptionsMessage={() => "No family class found"}
            styles={selectStyles}
          />
        </div>

        {/* ===================================================
            BROTHERS
        =================================================== */}

        <div>
          <label className="mb-1.5 block text-md font-bold text-slate-900">
            How Many Brothers Do You Have
          </label>

          <Select<SelectOption, false>
            isSearchable
            isClearable
            options={numberOptions}
            value={selectedBrothers}
            onChange={(option: SingleValue<SelectOption>) => {
              setBrothers(option?.value ?? "");
            }}
            placeholder="Search number..."
            noOptionsMessage={() => "No number found"}
            styles={selectStyles}
          />
        </div>

        {/* ===================================================
            MARRIED BROTHERS
        =================================================== */}

        <div>
          <label className="mb-1.5 block text-md font-bold text-slate-900">
            How Many of Them Are Married
          </label>

          <Select<SelectOption, false>
            isSearchable
            isClearable
            options={numberOptions}
            value={selectedMarriedBrothers}
            onChange={(option: SingleValue<SelectOption>) => {
              setMarriedBrothers(option?.value ?? "");
            }}
            placeholder="Search number..."
            noOptionsMessage={() => "No number found"}
            styles={selectStyles}
          />
        </div>

        {/* ===================================================
            SISTERS
        =================================================== */}

        <div>
          <label className="mb-1.5 block text-md font-bold text-slate-900">
            How Many Sisters Do You Have
          </label>

          <Select<SelectOption, false>
            isSearchable
            isClearable
            options={numberOptions}
            value={selectedSisters}
            onChange={(option: SingleValue<SelectOption>) => {
              setSisters(option?.value ?? "");
            }}
            placeholder="Search number..."
            noOptionsMessage={() => "No number found"}
            styles={selectStyles}
          />
        </div>

        {/* ===================================================
            MARRIED SISTERS
        =================================================== */}

        <div>
          <label className="mb-1.5 block text-md font-bold text-slate-900">
            How Many of Them Are Married
          </label>

          <Select<SelectOption, false>
            isSearchable
            isClearable
            options={numberOptions}
            value={selectedMarriedSisters}
            onChange={(option: SingleValue<SelectOption>) => {
              setMarriedSisters(option?.value ?? "");
            }}
            placeholder="Search number..."
            noOptionsMessage={() => "No number found"}
            styles={selectStyles}
          />
        </div>

        {/* ===================================================
            LIVING WITH FAMILY
        =================================================== */}

        <div>
          <label className="mb-1.5 block text-md font-bold text-slate-900">
            Are You Currently Living With Family?
          </label>

          <Select<SelectOption, false>
            isSearchable
            isClearable
            options={yesNoOptions}
            value={selectedLivingWithParents}
            onChange={(option: SingleValue<SelectOption>) => {
              setLivingWithParents(option?.value ?? "");
            }}
            placeholder="Search..."
            noOptionsMessage={() => "No option found"}
            styles={selectStyles}
          />
        </div>

        {/* ===================================================
            FAMILY LOCATION
        =================================================== */}

        <div>
          <label className="mb-1.5 block text-md font-bold text-slate-900">
            Where Is Your Family Located?
          </label>

          <input
            type="text"
            value={familyBasedOutOf}
            onChange={(e) => setFamilyBasedOutOf(e.target.value)}
            placeholder="Enter family location"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-300"
          />
        </div>
      </div>

      {/* =====================================================
          UPDATE BUTTON
      ===================================================== */}

      <div className="flex justify-end">
        <ThemeBtnOne
          text={isSaving ? "Updating..." : "Update"}
          disabled={isSaving}
          onClick={handleUpdate}
          className="mt-4 cursor-pointer rounded-full bg-rose-500 px-5 py-2 font-serif text-white"
        />
      </div>
    </div>
  );
};

export default FamilyDetails;

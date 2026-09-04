/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { useGetOccupationsQuery } from "@/Redux/occupationApi";

/* =========================================================
   TYPES
========================================================= */

type SelectOption = {
  value: string;
  label: string;
};

/* =========================================================
   SELECT STYLES
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

const CareerDetails = () => {
  const router = useRouter();

  const { data, isLoading, isError } = useGetMyProfileQuery();

  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();

  /* =========================================================
     MASTER DATA
  ========================================================= */

  const { data: occupationRes } = useGetOccupationsQuery();

  /* =========================================================
     FORM STATE
  ========================================================= */

  const [employedIn, setEmployedIn] = useState<string>("");

  const [occupationId, setOccupationId] = useState<string>("");

  const [organizationName, setOrganizationName] = useState<string>("");

  const [settledAbroad, setSettledAbroad] = useState<string>("");

  /* =========================================================
     SETTLED ABROAD OPTIONS
  ========================================================= */

  const settledAbroadOptions: SelectOption[] = [
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
     OCCUPATION OPTIONS
  ========================================================= */

  const occupationOptions = useMemo<SelectOption[]>(() => {
    return (
      occupationRes?.data?.map((item) => ({
        value: item._id,
        label: item.occupation,
      })) ?? []
    );
  }, [occupationRes]);

  /* =========================================================
     SELECTED OCCUPATION
  ========================================================= */

  const selectedOccupation = useMemo<SelectOption | null>(() => {
    return (
      occupationOptions.find((item) => item.value === occupationId) ?? null
    );
  }, [occupationOptions, occupationId]);

  /* =========================================================
     SELECTED SETTLED ABROAD
  ========================================================= */

  const selectedSettledAbroad = useMemo<SelectOption | null>(() => {
    return (
      settledAbroadOptions.find((item) => item.value === settledAbroad) ?? null
    );
  }, [settledAbroad]);

  /* =========================================================
     PREFILL PROFILE DATA
  ========================================================= */

  useEffect(() => {
    if (!data?.data) return;

    const p = data.data;

    /* ---------- Employed In ---------- */

    setEmployedIn(p.careerDetails?.employedIn || "");

    /* ---------- Organization ---------- */

    setOrganizationName(p.careerDetails?.organizationName || "");

    /* ---------- Settled Abroad ---------- */

    setSettledAbroad(
      p.careerDetails?.interestedInSettlingAbroad ? "yes" : "no",
    );

    /* ---------- Occupation ---------- */

    if (occupationRes?.data) {
      const match = occupationRes.data.find(
        (o) => o.occupation === p.careerDetails?.occupation,
      );

      if (match) {
        setOccupationId(match._id);
      }
    }
  }, [data, occupationRes]);

  /* =========================================================
     SELECTED OCCUPATION NAME
  ========================================================= */

  const selectedOccupationName = selectedOccupation?.label || "";

  /* =========================================================
     UPDATE PROFILE
  ========================================================= */

  const handleUpdate = async () => {
    if (!data?.data) return;

    const existing = data.data;

    try {
      await updateProfile({
        careerDetails: {
          ...existing.careerDetails,

          employedIn,

          occupation:
            selectedOccupationName || existing.careerDetails?.occupation || "",

          organizationName,

          interestedInSettlingAbroad: settledAbroad === "yes",
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
          Career Details
        </h3>
      </div>

      {/* =====================================================
          FORM
      ===================================================== */}

      <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* ===================================================
            EMPLOYED IN
        =================================================== */}

        <div>
          <label className="mb-1.5 block text-md font-bold text-slate-900">
            Employed In
          </label>

          <input
            type="text"
            value={employedIn}
            onChange={(e) => setEmployedIn(e.target.value)}
            placeholder="Enter employed in"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-300"
          />
        </div>

        {/* ===================================================
            OCCUPATION
        =================================================== */}

        <div>
          <label className="mb-1.5 block text-md font-bold text-slate-900">
            Occupation
          </label>

          <Select<SelectOption, false>
            isSearchable
            isClearable
            options={occupationOptions}
            value={selectedOccupation}
            onChange={(option: SingleValue<SelectOption>) => {
              setOccupationId(option?.value ?? "");
            }}
            placeholder="Search occupation..."
            noOptionsMessage={() => "No occupation found"}
            styles={selectStyles}
          />
        </div>

        {/* ===================================================
            ORGANIZATION
        =================================================== */}

        <div>
          <label className="mb-1.5 block text-md font-bold text-slate-900">
            Organization Name
          </label>

          <input
            type="text"
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
            placeholder="Enter organization name"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-300"
          />
        </div>

        {/* ===================================================
            SETTLED ABROAD
        =================================================== */}

        <div>
          <label className="mb-1.5 block text-md font-bold text-slate-900">
            Interested In Settling Abroad
          </label>

          <Select<SelectOption, false>
            isSearchable
            isClearable
            options={settledAbroadOptions}
            value={selectedSettledAbroad}
            onChange={(option: SingleValue<SelectOption>) => {
              setSettledAbroad(option?.value ?? "");
            }}
            placeholder="Search..."
            noOptionsMessage={() => "No option found"}
            styles={selectStyles}
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

export default CareerDetails;

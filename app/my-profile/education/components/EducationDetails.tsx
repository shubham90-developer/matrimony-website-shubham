/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
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
import { useGetQualificationsQuery } from "@/Redux/qualificationApi";
import { useGetOccupationsQuery } from "@/Redux/occupationApi";
import { useGetAnnualIncomesQuery } from "@/Redux/annualIncomeApi";

/* =========================================================
   TYPES
========================================================= */

type SelectOption = {
  value: string;
  label: string;
};

/* =========================================================
   CUSTOM SELECT STYLES
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
    paddingRight: "6px",
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

const EducationDetails = () => {
  const router = useRouter();

  const { data, isLoading, isError } = useGetMyProfileQuery();

  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();

  /* =========================================================
     MASTER DATA
  ========================================================= */

  const { data: qualificationRes } = useGetQualificationsQuery();

  const { data: occupationRes } = useGetOccupationsQuery();

  const { data: annualIncomeRes } = useGetAnnualIncomesQuery();

  /* =========================================================
     FORM STATE
  ========================================================= */

  const [qualificationId, setQualificationId] = useState<string>("");

  const [ugDegreeId, setUgDegreeId] = useState<string>("");

  const [occupationId, setOccupationId] = useState<string>("");

  const [annualIncomeId, setAnnualIncomeId] = useState<string>("");

  /* =========================================================
     PREFILL PROFILE DATA
  ========================================================= */

  useEffect(() => {
    if (!data?.data) return;

    const p = data.data;

    /* ---------- Qualification ---------- */

    if (qualificationRes?.data) {
      const qualificationMatch = qualificationRes.data.find(
        (q) => q.qualification === p.educationDetails?.highestQualification,
      );

      if (qualificationMatch) {
        setQualificationId(qualificationMatch._id);
      }

      /* ---------- UG Degree ---------- */

      const ugMatch = qualificationRes.data.find(
        (q) => q.qualification === p.educationDetails?.educationType,
      );

      if (ugMatch) {
        setUgDegreeId(ugMatch._id);
      }
    }

    /* ---------- Occupation ---------- */

    if (occupationRes?.data) {
      const occupationMatch = occupationRes.data.find(
        (o) => o.occupation === p.educationDetails?.occupation,
      );

      if (occupationMatch) {
        setOccupationId(occupationMatch._id);
      }
    }

    /* ---------- Annual Income ---------- */

    if (annualIncomeRes?.data) {
      const incomeMatch = annualIncomeRes.data.find(
        (a) => a.annualIncome === p.educationDetails?.annualIncome,
      );

      if (incomeMatch) {
        setAnnualIncomeId(incomeMatch._id);
      }
    }
  }, [data, qualificationRes, occupationRes, annualIncomeRes]);

  /* =========================================================
     SEARCHABLE OPTIONS
  ========================================================= */

  const qualificationOptions = useMemo<SelectOption[]>(() => {
    return (
      qualificationRes?.data?.map((item) => ({
        value: item._id,
        label: item.qualification,
      })) ?? []
    );
  }, [qualificationRes]);

  const ugDegreeOptions = useMemo<SelectOption[]>(() => {
    return (
      qualificationRes?.data?.map((item) => ({
        value: item._id,
        label: item.qualification,
      })) ?? []
    );
  }, [qualificationRes]);

  const occupationOptions = useMemo<SelectOption[]>(() => {
    return (
      occupationRes?.data?.map((item) => ({
        value: item._id,
        label: item.occupation,
      })) ?? []
    );
  }, [occupationRes]);

  const annualIncomeOptions = useMemo<SelectOption[]>(() => {
    return (
      annualIncomeRes?.data?.map((item) => ({
        value: item._id,
        label: item.annualIncome,
      })) ?? []
    );
  }, [annualIncomeRes]);

  /* =========================================================
     SELECTED OPTIONS
  ========================================================= */

  const selectedQualification = useMemo<SelectOption | null>(() => {
    return (
      qualificationOptions.find((item) => item.value === qualificationId) ??
      null
    );
  }, [qualificationOptions, qualificationId]);

  const selectedUgDegree = useMemo<SelectOption | null>(() => {
    return ugDegreeOptions.find((item) => item.value === ugDegreeId) ?? null;
  }, [ugDegreeOptions, ugDegreeId]);

  const selectedOccupation = useMemo<SelectOption | null>(() => {
    return (
      occupationOptions.find((item) => item.value === occupationId) ?? null
    );
  }, [occupationOptions, occupationId]);

  const selectedAnnualIncome = useMemo<SelectOption | null>(() => {
    return (
      annualIncomeOptions.find((item) => item.value === annualIncomeId) ?? null
    );
  }, [annualIncomeOptions, annualIncomeId]);

  /* =========================================================
     RESOLVE ID -> NAME
  ========================================================= */

  const selectedQualificationName = selectedQualification?.label || "";

  const selectedUgDegreeName = selectedUgDegree?.label || "";

  const selectedOccupationName = selectedOccupation?.label || "";

  const selectedAnnualIncomeName = selectedAnnualIncome?.label || "";

  /* =========================================================
     UPDATE PROFILE
  ========================================================= */

  const handleUpdate = async () => {
    if (!data?.data) return;

    const existing = data.data;

    try {
      await updateProfile({
        educationDetails: {
          ...existing.educationDetails,

          highestQualification:
            selectedQualificationName ||
            existing.educationDetails?.highestQualification ||
            "",

          educationType:
            selectedUgDegreeName ||
            existing.educationDetails?.educationType ||
            "",

          occupation:
            selectedOccupationName ||
            existing.educationDetails?.occupation ||
            "",

          annualIncome:
            selectedAnnualIncomeName ||
            existing.educationDetails?.annualIncome ||
            "",
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
      {/* ---------- HEADER ---------- */}

      <div className="relative mb-5 flex items-center justify-center border-b border-dashed border-gray-200 py-3">
        <Link
          href="/my-profile"
          className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:bg-slate-100"
          aria-label="Go back"
        >
          <ChevronLeft size={20} />
        </Link>

        <h3 className="font-serif text-xl font-semibold text-slate-900">
          Education Details
        </h3>
      </div>

      {/* ---------- FORM ---------- */}

      <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* =================================================
            HIGHEST EDUCATION
        ================================================= */}

        <div>
          <label className="mb-1.5 block text-md font-bold text-slate-900">
            Highest Education
          </label>

          <Select<SelectOption, false>
            isSearchable
            isClearable
            options={qualificationOptions}
            value={selectedQualification}
            onChange={(option: SingleValue<SelectOption>) => {
              setQualificationId(option?.value ?? "");
            }}
            placeholder="Search education..."
            noOptionsMessage={() => "No education found"}
            styles={selectStyles}
          />
        </div>

        {/* =================================================
            UG DEGREE
        ================================================= */}

        <div>
          <label className="mb-1.5 block text-md font-bold text-slate-900">
            UG Degree
          </label>

          <Select<SelectOption, false>
            isSearchable
            isClearable
            options={ugDegreeOptions}
            value={selectedUgDegree}
            onChange={(option: SingleValue<SelectOption>) => {
              setUgDegreeId(option?.value ?? "");
            }}
            placeholder="Search UG degree..."
            noOptionsMessage={() => "No degree found"}
            styles={selectStyles}
          />
        </div>

        {/* =================================================
            OCCUPATION
        ================================================= */}

        <div>
          <label className="mb-1.5 block text-md font-bold text-slate-900">
            Select Occupation
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

        {/* =================================================
            ANNUAL INCOME
        ================================================= */}

        <div>
          <label className="mb-1.5 block text-md font-bold text-slate-900">
            Select Your Annual Income
          </label>

          <Select<SelectOption, false>
            isSearchable
            isClearable
            options={annualIncomeOptions}
            value={selectedAnnualIncome}
            onChange={(option: SingleValue<SelectOption>) => {
              setAnnualIncomeId(option?.value ?? "");
            }}
            placeholder="Search annual income..."
            noOptionsMessage={() => "No income found"}
            styles={selectStyles}
          />
        </div>
      </div>

      {/* ---------- UPDATE ---------- */}

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

export default EducationDetails;

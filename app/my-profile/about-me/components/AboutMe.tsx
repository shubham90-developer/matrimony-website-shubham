/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import ThemeBtnOne from "@/app/components/ThemeBtnOne";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Select, { SingleValue, StylesConfig } from "react-select";
import toast from "react-hot-toast";

import {
  useGetMyProfileQuery,
  useUpdateProfileMutation,
} from "@/Redux/profileApi";

/* =====================================================
   Types
===================================================== */

type Option = {
  value: string;
  label: string;
};

type BooleanOption = {
  value: boolean;
  label: string;
};

/* =====================================================
   React Select Styles
===================================================== */

const selectStyles: StylesConfig<Option, false> = {
  control: (base, state) => ({
    ...base,
    minHeight: "52px",
    borderRadius: "16px",
    borderColor: state.isFocused ? "#fda4af" : "#e2e8f0",
    boxShadow: state.isFocused ? "0 0 0 3px rgba(244, 63, 94, 0.10)" : "none",
    backgroundColor: "#ffffff",
    cursor: "pointer",
    padding: "0 6px",
    transition: "all 0.2s ease",

    "&:hover": {
      borderColor: "#fda4af",
    },
  }),

  valueContainer: (base) => ({
    ...base,
    padding: "2px 10px",
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
    borderRadius: "14px",
    overflow: "hidden",
    marginTop: "6px",
    zIndex: 9999,
    boxShadow: "0 12px 35px rgba(15, 23, 42, 0.15)",
  }),

  menuList: (base) => ({
    ...base,
    padding: "6px",
    maxHeight: "220px",
  }),

  option: (base, state) => ({
    ...base,
    borderRadius: "10px",
    padding: "11px 14px",
    marginBottom: "2px",
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

  indicatorSeparator: () => ({
    display: "none",
  }),

  dropdownIndicator: (base, state) => ({
    ...base,
    color: state.isFocused ? "#f43f5e" : "#94a3b8",
    transition: "all 0.2s ease",

    "&:hover": {
      color: "#f43f5e",
    },
  }),

  noOptionsMessage: (base) => ({
    ...base,
    color: "#94a3b8",
    fontSize: "13px",
    padding: "12px",
  }),
};

/* =====================================================
   Boolean Select Styles
===================================================== */
// @ts-ignore
const booleanSelectStyles: StylesConfig<BooleanOption, false> = {
  ...selectStyles,
};

/* =====================================================
   Dropdown Options
===================================================== */

const profileManagedOptions: Option[] = [
  {
    value: "self",
    label: "Self",
  },
  {
    value: "parent",
    label: "Parent",
  },
  {
    value: "guardian",
    label: "Guardian",
  },
  {
    value: "other",
    label: "Other",
  },
];

const disabilityOptions: Option[] = [
  {
    value: "None",
    label: "None",
  },
  {
    value: "Physical",
    label: "Physical",
  },
  {
    value: "Visual",
    label: "Visual",
  },
  {
    value: "Hearing",
    label: "Hearing",
  },
  {
    value: "Other",
    label: "Other",
  },
];

const thalassemiaOptions: Option[] = [
  {
    value: "No",
    label: "No",
  },
  {
    value: "Yes",
    label: "Yes",
  },
  {
    value: "Trait / Minor",
    label: "Trait / Minor",
  },
];

const hivOptions: BooleanOption[] = [
  {
    value: false,
    label: "No",
  },
  {
    value: true,
    label: "Yes",
  },
];

/* =====================================================
   Component
===================================================== */

const AboutMe = () => {
  const router = useRouter();

  const { data, isLoading, isError } = useGetMyProfileQuery();

  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();

  /* ===================================================
     State
  =================================================== */

  const [about, setAbout] = useState<string>("");

  const [profileCreatedBy, setProfileCreatedBy] = useState<string>("self");

  const [disability, setDisability] = useState<string>("None");

  const [thalassemia, setThalassemia] = useState<string>("No");

  const [hivStatus, setHivStatus] = useState<boolean>(false);

  /* ===================================================
     Load Existing Profile
  =================================================== */

  useEffect(() => {
    if (!data?.data) return;

    const p = data.data;

    setAbout(p.aboutMe?.about ?? "");

    setProfileCreatedBy(p.aboutMe?.profileCreatedBy ?? "self");

    setDisability(p.aboutMe?.disability ?? "None");

    setThalassemia(p.aboutMe?.thalassemia ?? "No");

    setHivStatus(Boolean(p.aboutMe?.hivStatus));
  }, [data]);

  /* ===================================================
     Get Selected Option
  =================================================== */

  const getOption = (options: Option[], value: string): Option | null => {
    return options.find((item) => item.value === value) ?? null;
  };

  const getBooleanOption = (
    options: BooleanOption[],
    value: boolean,
  ): BooleanOption | null => {
    return options.find((item) => item.value === value) ?? null;
  };

  /* ===================================================
     Update
  =================================================== */

  const handleUpdate = async () => {
    try {
      await updateProfile({
        aboutMe: {
          about,

          describeYourself: data?.data?.aboutMe?.describeYourself ?? "",

          languagesISpeak: data?.data?.aboutMe?.languagesISpeak ?? [],

          profileCreatedBy,

          disability,

          thalassemia,

          hivStatus,
        },
      }).unwrap();

      toast.success("Profile updated successfully");

      router.push("/my-profile");
    } catch (error) {
      console.error("Profile update error:", error);

      toast.error("Failed to update profile");
    }
  };

  /* ===================================================
     Loading
  =================================================== */

  if (isLoading) {
    return (
      <div className="p-8 text-center text-sm text-slate-500">Loading...</div>
    );
  }

  /* ===================================================
     Error
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
      {/* =============================================
          Header
      ============================================== */}

      <div className="relative mb-6 flex items-center justify-center border-b border-dashed border-gray-200 py-3">
        <Link
          href="/my-profile"
          className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500"
          aria-label="Go back"
        >
          <ChevronLeft size={20} />
        </Link>

        <h3 className="font-serif text-xl font-semibold text-slate-900">
          About Me
        </h3>
      </div>

      {/* =============================================
          About Text
      ============================================== */}

      <div>
        <label className="mb-2 block text-sm font-bold text-slate-900">
          About Me
        </label>

        <textarea
          rows={8}
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          placeholder="Write something about yourself..."
          className="w-full resize-none rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
        />
      </div>

      {/* =============================================
          Dropdowns
      ============================================== */}

      <div className="mt-8 mb-10 grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Profile Managed By */}

        <div>
          <label className="mb-2 block text-sm font-bold text-slate-900">
            Profile Managed By
          </label>

          <Select<Option, false>
            isSearchable
            options={profileManagedOptions}
            value={getOption(profileManagedOptions, profileCreatedBy)}
            onChange={(option: SingleValue<Option>) => {
              setProfileCreatedBy(option?.value ?? "self");
            }}
            placeholder="Search or select..."
            noOptionsMessage={() => "No profile manager found"}
            styles={selectStyles}
          />
        </div>

        {/* Disability */}

        <div>
          <label className="mb-2 block text-sm font-bold text-slate-900">
            Disability
          </label>

          <Select<Option, false>
            isSearchable
            options={disabilityOptions}
            value={getOption(disabilityOptions, disability)}
            onChange={(option: SingleValue<Option>) => {
              setDisability(option?.value ?? "None");
            }}
            placeholder="Search or select..."
            noOptionsMessage={() => "No disability found"}
            styles={selectStyles}
          />
        </div>

        {/* Thalassemia */}

        <div>
          <label className="mb-2 block text-sm font-bold text-slate-900">
            Thalassemia
          </label>

          <Select<Option, false>
            isSearchable
            options={thalassemiaOptions}
            value={getOption(thalassemiaOptions, thalassemia)}
            onChange={(option: SingleValue<Option>) => {
              setThalassemia(option?.value ?? "No");
            }}
            placeholder="Search or select..."
            noOptionsMessage={() => "No thalassemia option found"}
            styles={selectStyles}
          />
        </div>

        {/* HIV Status */}

        <div>
          <label className="mb-2 block text-sm font-bold text-slate-900">
            HIV Status
          </label>

          <Select<BooleanOption, false>
            isSearchable
            options={hivOptions}
            value={getBooleanOption(hivOptions, hivStatus)}
            onChange={(option: SingleValue<BooleanOption>) => {
              setHivStatus(option?.value ?? false);
            }}
            placeholder="Search or select..."
            noOptionsMessage={() => "No HIV status option found"}
            styles={booleanSelectStyles}
          />
        </div>
      </div>

      {/* =============================================
          Update Button
      ============================================== */}

      <div className="flex justify-end">
        <ThemeBtnOne
          text={isSaving ? "Updating..." : "Update"}
          onClick={handleUpdate}
          className="mt-2 cursor-pointer rounded-full bg-rose-500 px-6 py-2.5 font-serif text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>
    </div>
  );
};

export default AboutMe;

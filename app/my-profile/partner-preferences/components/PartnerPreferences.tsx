"use client";

import { useState, ChangeEvent } from "react";
import Select, { SingleValue, StylesConfig } from "react-select";
import ThemeBtnOne from "@/app/components/ThemeBtnOne";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarDays } from "lucide-react";

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
}

const FieldSelect = ({
  id,
  label,
  value,
  onChange,
  options,
  placeholder = "Select",
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

  const handleSave = (section: PreferencesSection) => {
    console.log(`Saving ${section}`, form);
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
                  value: "male",
                  label: "Male",
                },
                {
                  value: "female",
                  label: "Female",
                },
                {
                  value: "other",
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
              options={[
                {
                  value: "4ft6in",
                  label: '4′ 6" (137 cm)',
                },
                {
                  value: "5ft0in",
                  label: '5′ 0" (152 cm)',
                },
                {
                  value: "5ft6in",
                  label: '5′ 6" (168 cm)',
                },
                {
                  value: "6ft0in",
                  label: '6′ 0" (183 cm)',
                },
              ]}
            />

            {/* Religion */}

            <FieldSelect
              id="religion"
              label="Religion"
              value={form.religion}
              onChange={(value) => handleSelectChange("religion", value)}
              placeholder="Search religion..."
              options={[
                {
                  value: "hindu",
                  label: "Hindu",
                },
                {
                  value: "muslim",
                  label: "Muslim",
                },
                {
                  value: "christian",
                  label: "Christian",
                },
                {
                  value: "sikh",
                  label: "Sikh",
                },
                {
                  value: "jain",
                  label: "Jain",
                },
              ]}
            />

            {/* Caste */}

            <FieldSelect
              id="caste"
              label="Caste"
              value={form.caste}
              onChange={(value) => handleSelectChange("caste", value)}
              placeholder="Search caste..."
              options={[
                {
                  value: "maratha",
                  label: "Maratha",
                },
              ]}
            />

            {/* Sub Caste */}

            <FieldSelect
              id="subCaste"
              label="Sub caste"
              value={form.subCaste}
              onChange={(value) => handleSelectChange("subCaste", value)}
              placeholder="Search sub caste..."
              options={[
                {
                  value: "96kuli",
                  label: "96 Kuli Maratha",
                },
              ]}
            />

            {/* Mother Tongue */}

            <FieldSelect
              id="motherTongue"
              label="Mother tongue"
              value={form.motherTongue}
              onChange={(value) => handleSelectChange("motherTongue", value)}
              placeholder="Search mother tongue..."
              options={[
                {
                  value: "marathi",
                  label: "Marathi",
                },
                {
                  value: "hindi",
                  label: "Hindi",
                },
                {
                  value: "english",
                  label: "English",
                },
              ]}
            />

            {/* Country */}

            <FieldSelect
              id="country"
              label="Residing country"
              value={form.country}
              onChange={(value) => handleSelectChange("country", value)}
              placeholder="Search country..."
              options={[
                {
                  value: "india",
                  label: "India",
                },
              ]}
            />

            {/* State */}

            <FieldSelect
              id="state"
              label="Residing state"
              value={form.state}
              onChange={(value) => handleSelectChange("state", value)}
              placeholder="Search state..."
              options={[
                {
                  value: "maharashtra",
                  label: "Maharashtra",
                },
              ]}
            />

            {/* City */}

            <FieldSelect
              id="city"
              label="Residing city"
              value={form.city}
              onChange={(value) => handleSelectChange("city", value)}
              placeholder="Search city..."
              options={[
                {
                  value: "pune",
                  label: "Pune",
                },
              ]}
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
                  value: "neverMarried",
                  label: "Never married",
                },
                {
                  value: "married",
                  label: "Married",
                },
                {
                  value: "divorced",
                  label: "Divorced",
                },
                {
                  value: "widowed",
                  label: "Widowed",
                },
              ]}
            />
          </div>

          <div className="mt-6 flex justify-end">
            <ThemeBtnOne
              text="Save"
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
              options={[
                {
                  value: "graduate",
                  label: "Graduate",
                },
                {
                  value: "postGraduate",
                  label: "Post graduate",
                },
                {
                  value: "doctorate",
                  label: "Doctorate",
                },
              ]}
            />

            {/* UG Degree */}

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
              options={[
                {
                  value: "government",
                  label: "Government",
                },
                {
                  value: "private",
                  label: "Private sector",
                },
                {
                  value: "business",
                  label: "Business",
                },
                {
                  value: "notWorking",
                  label: "Not working",
                },
              ]}
            />

            {/* Annual Income */}

            <FieldSelect
              id="annualIncome"
              label="Annual income"
              value={form.annualIncome}
              onChange={(value) => handleSelectChange("annualIncome", value)}
              placeholder="Search income..."
              options={[
                {
                  value: "1-2lakh",
                  label: "1-2 lakh",
                },
                {
                  value: "2-5lakh",
                  label: "2-5 lakh",
                },
                {
                  value: "5-10lakh",
                  label: "5-10 lakh",
                },
                {
                  value: "10lakh+",
                  label: "10 lakh+",
                },
              ]}
            />
          </div>

          <div className="mt-6 flex justify-end">
            <ThemeBtnOne
              text="Save"
              onClick={() => handleSave("education & occupation")}
              className="mt-4 cursor-pointer rounded-full bg-rose-500 px-3 py-2 font-serif text-white"
            />
          </div>
        </div>

        {/* =================================================
            LIFESTYLE
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
                  value: "vegetarian",
                  label: "Vegetarian",
                },
                {
                  value: "nonVegetarian",
                  label: "Non-vegetarian",
                },
                {
                  value: "eggetarian",
                  label: "Eggetarian",
                },
                {
                  value: "vegan",
                  label: "Vegan",
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
                  value: "no",
                  label: "No",
                },
                {
                  value: "occasionally",
                  label: "Occasionally",
                },
                {
                  value: "yes",
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
                  value: "no",
                  label: "No",
                },
                {
                  value: "occasionally",
                  label: "Occasionally",
                },
                {
                  value: "yes",
                  label: "Yes",
                },
              ]}
            />

            {/* Physical Status */}

            <FieldSelect
              id="physicalStatus"
              label="Physical status"
              value={form.physicalStatus}
              onChange={(value) => handleSelectChange("physicalStatus", value)}
              placeholder="Search physical status..."
              options={[
                {
                  value: "normal",
                  label: "Normal",
                },
                {
                  value: "physicallyChallenged",
                  label: "Physically challenged",
                },
              ]}
            />
          </div>

          <div className="mt-6 flex justify-end">
            <ThemeBtnOne
              text="Save"
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

"use client";

import { useState, FormEvent } from "react";
import Select, { SingleValue, StylesConfig } from "react-select";
import { Search } from "lucide-react";
import ThemeBtnOne from "@/app/components/ThemeBtnOne";

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-50";

const labelClass = "mb-1.5 block text-sm font-bold text-slate-900";

interface Option {
  value: string;
  label: string;
}

interface FieldSelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  isDisabled?: boolean;
}

/* =====================================================
   REACT SELECT STYLES
===================================================== */

const selectStyles: StylesConfig<Option, false> = {
  control: (base, state) => ({
    ...base,
    minHeight: "54px",
    height: "54px",
    borderRadius: "16px",
    borderColor: state.isFocused ? "#fb7185" : "#e2e8f0",
    backgroundColor: "#ffffff",
    boxShadow: state.isFocused ? "0 0 0 3px rgba(244, 63, 94, 0.08)" : "none",
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
    fontSize: "14px",
    fontWeight: 500,
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
    marginTop: "6px",
    borderRadius: "16px",
    overflow: "hidden",
    border: "1px solid #f1f5f9",
    backgroundColor: "#ffffff",
    boxShadow: "0 18px 45px rgba(15, 23, 42, 0.12)",
    zIndex: 100,
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
    marginBottom: "2px",
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 0.15s ease",

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
    color: "#94a3b8",
    fontSize: "13px",
  }),
};

/* =====================================================
   SEARCHABLE SELECT COMPONENT
===================================================== */

const FieldSelect = ({
  id,
  label,
  value,
  onChange,
  options,
  placeholder = "Select",
  isDisabled = false,
}: FieldSelectProps) => {
  const selectedOption =
    options.find((option) => option.value === value) ?? null;

  return (
    <div>
      {label && (
        <label htmlFor={id} className={labelClass}>
          {label}
        </label>
      )}

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
        styles={selectStyles}
        noOptionsMessage={() => "No options found"}
        loadingMessage={() => "Loading..."}
      />
    </div>
  );
};

/* =====================================================
   FORM TYPE
===================================================== */

interface AdvancedSearchForm {
  lookingFor: "bride" | "groom" | "";
  ageFrom: string;
  ageTo: string;
  heightFrom: string;
  heightTo: string;
  maritalStatus: string;
  religion: string;
  caste: string;
  subCaste: string;
  motherTongue: string;
  country: string;
  state: string;
  city: string;
  highestEducation: string;
  college: string;
  occupation: string;
  annualIncome: string;
  diet: string;
  smoking: string;
  drinking: string;
  physicalStatus: string;
  familyType: string;
  willingToRelocate: string;
  keyword: string;
  photoOnly: boolean;
}

/* =====================================================
   INITIAL STATE
===================================================== */

const initialState: AdvancedSearchForm = {
  lookingFor: "",
  ageFrom: "",
  ageTo: "",
  heightFrom: "",
  heightTo: "",
  maritalStatus: "",
  religion: "",
  caste: "",
  subCaste: "",
  motherTongue: "",
  country: "",
  state: "",
  city: "",
  highestEducation: "",
  college: "",
  occupation: "",
  annualIncome: "",
  diet: "",
  smoking: "",
  drinking: "",
  physicalStatus: "",
  familyType: "",
  willingToRelocate: "",
  keyword: "",
  photoOnly: false,
};

/* =====================================================
   AGE OPTIONS
===================================================== */

const AGE_OPTIONS: Option[] = Array.from({ length: 43 }, (_, i) => {
  const age = i + 18;

  return {
    value: String(age),
    label: String(age),
  };
});

/* =====================================================
   HEIGHT OPTIONS
===================================================== */

const HEIGHT_OPTIONS: Option[] = [
  {
    value: "4ft6in",
    label: `4' 6" (137 cm)`,
  },
  {
    value: "5ft0in",
    label: `5' 0" (152 cm)`,
  },
  {
    value: "5ft6in",
    label: `5' 6" (168 cm)`,
  },
  {
    value: "6ft0in",
    label: `6' 0" (183 cm)`,
  },
  {
    value: "6ft6in",
    label: `6' 6" (198 cm)`,
  },
];

/* =====================================================
   COMPONENT
===================================================== */

const AdvancedSearch = () => {
  const [form, setForm] = useState<AdvancedSearchForm>(initialState);

  /* ===================================================
     SELECT CHANGE
  =================================================== */

  const handleSelectChange = (
    field: keyof AdvancedSearchForm,
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* ===================================================
     KEYWORD CHANGE
  =================================================== */

  const handleKeywordChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      keyword: value,
    }));
  };

  /* ===================================================
     PHOTO FILTER
  =================================================== */

  const handlePhotoOnlyChange = (checked: boolean) => {
    setForm((prev) => ({
      ...prev,
      photoOnly: checked,
    }));
  };

  /* ===================================================
     LOOKING FOR
  =================================================== */

  const handleLookingFor = (value: "bride" | "groom") => {
    setForm((prev) => ({
      ...prev,
      lookingFor: value,
    }));
  };

  /* ===================================================
     SEARCH
  =================================================== */

  const runSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Searching", form);
  };

  return (
    <div className="w-full bg-[#FDF8F3] px-5 py-12 sm:px-8 lg:px-8">
      <form
        onSubmit={runSearch}
        className="mx-auto max-w-3xl bg-white p-8 py-10"
      >
        {/* =================================================
            HEADER
        ================================================== */}

        <div className="mb-8 text-center">
          <h1 className="font-serif text-2xl font-semibold text-slate-900">
            Advanced Search
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Refine with education, income & lifestyle
          </p>
        </div>

        {/* =================================================
            LOOKING FOR
        ================================================== */}

        <div className="mb-6">
          <label className={labelClass}>Looking for</label>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleLookingFor("bride")}
              className={`cursor-pointer rounded-2xl border px-4 py-3.5 text-sm font-semibold transition ${
                form.lookingFor === "bride"
                  ? "border-rose-400 bg-rose-50 text-rose-600"
                  : "border-slate-200 text-slate-600 hover:border-rose-200"
              }`}
            >
              Bride
            </button>

            <button
              type="button"
              onClick={() => handleLookingFor("groom")}
              className={`cursor-pointer rounded-2xl border px-4 py-3.5 text-sm font-semibold transition ${
                form.lookingFor === "groom"
                  ? "border-rose-400 bg-rose-50 text-rose-600"
                  : "border-slate-200 text-slate-600 hover:border-rose-200"
              }`}
            >
              Groom
            </button>
          </div>
        </div>

        {/* =================================================
            AGE RANGE
        ================================================== */}

        <div className="mb-6">
          <label className={labelClass}>Age</label>

          <div className="grid grid-cols-2 gap-3">
            <FieldSelect
              id="ageFrom"
              label=""
              value={form.ageFrom}
              onChange={(value) => handleSelectChange("ageFrom", value)}
              options={AGE_OPTIONS}
              placeholder="From"
            />

            <FieldSelect
              id="ageTo"
              label=""
              value={form.ageTo}
              onChange={(value) => handleSelectChange("ageTo", value)}
              options={AGE_OPTIONS}
              placeholder="To"
            />
          </div>
        </div>

        {/* =================================================
            HEIGHT RANGE
        ================================================== */}

        <div className="mb-6">
          <label className={labelClass}>Height</label>

          <div className="grid grid-cols-2 gap-3">
            <FieldSelect
              id="heightFrom"
              label=""
              value={form.heightFrom}
              onChange={(value) => handleSelectChange("heightFrom", value)}
              options={HEIGHT_OPTIONS}
              placeholder="From"
            />

            <FieldSelect
              id="heightTo"
              label=""
              value={form.heightTo}
              onChange={(value) => handleSelectChange("heightTo", value)}
              options={HEIGHT_OPTIONS}
              placeholder="To"
            />
          </div>
        </div>

        {/* =================================================
            BASIC DETAILS
        ================================================== */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FieldSelect
            id="maritalStatus"
            label="Marital status"
            value={form.maritalStatus}
            onChange={(value) => handleSelectChange("maritalStatus", value)}
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

          <FieldSelect
            id="religion"
            label="Religion"
            value={form.religion}
            onChange={(value) => handleSelectChange("religion", value)}
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
              {
                value: "buddhist",
                label: "Buddhist",
              },
            ]}
          />

          <FieldSelect
            id="caste"
            label="Caste"
            value={form.caste}
            onChange={(value) => handleSelectChange("caste", value)}
            options={[
              {
                value: "brahmin",
                label: "Brahmin",
              },
              {
                value: "rajput",
                label: "Rajput",
              },
              {
                value: "maratha",
                label: "Maratha",
              },
              {
                value: "yadav",
                label: "Yadav",
              },
              {
                value: "kayastha",
                label: "Kayastha",
              },
              {
                value: "agarwal",
                label: "Agarwal",
              },
            ]}
          />

          <FieldSelect
            id="subCaste"
            label="Sub caste"
            value={form.subCaste}
            onChange={(value) => handleSelectChange("subCaste", value)}
            options={[
              {
                value: "96kuli",
                label: "96 Kuli Maratha",
              },
            ]}
          />

          <FieldSelect
            id="motherTongue"
            label="Mother tongue"
            value={form.motherTongue}
            onChange={(value) => handleSelectChange("motherTongue", value)}
            options={[
              {
                value: "hindi",
                label: "Hindi",
              },
              {
                value: "marathi",
                label: "Marathi",
              },
              {
                value: "bengali",
                label: "Bengali",
              },
              {
                value: "tamil",
                label: "Tamil",
              },
              {
                value: "telugu",
                label: "Telugu",
              },
              {
                value: "gujarati",
                label: "Gujarati",
              },
            ]}
          />

          <FieldSelect
            id="country"
            label="Country"
            value={form.country}
            onChange={(value) => handleSelectChange("country", value)}
            options={[
              {
                value: "india",
                label: "India",
              },
              {
                value: "usa",
                label: "USA",
              },
              {
                value: "uk",
                label: "UK",
              },
              {
                value: "canada",
                label: "Canada",
              },
              {
                value: "australia",
                label: "Australia",
              },
            ]}
          />

          <FieldSelect
            id="state"
            label="State"
            value={form.state}
            onChange={(value) => handleSelectChange("state", value)}
            options={[
              {
                value: "maharashtra",
                label: "Maharashtra",
              },
              {
                value: "delhi",
                label: "Delhi",
              },
              {
                value: "karnataka",
                label: "Karnataka",
              },
              {
                value: "gujarat",
                label: "Gujarat",
              },
              {
                value: "tamilNadu",
                label: "Tamil Nadu",
              },
            ]}
          />

          <FieldSelect
            id="city"
            label="City"
            value={form.city}
            onChange={(value) => handleSelectChange("city", value)}
            options={[
              {
                value: "pune",
                label: "Pune",
              },
              {
                value: "mumbai",
                label: "Mumbai",
              },
              {
                value: "bangalore",
                label: "Bangalore",
              },
              {
                value: "hyderabad",
                label: "Hyderabad",
              },
              {
                value: "chennai",
                label: "Chennai",
              },
            ]}
          />
        </div>

        {/* =================================================
            EDUCATION & OCCUPATION
        ================================================== */}

        <div className="mb-6">
          <h2 className="mb-3 border-b border-dashed border-slate-200 pb-2 font-serif text-base font-semibold text-slate-900">
            Education & occupation
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FieldSelect
              id="highestEducation"
              label="Highest education"
              value={form.highestEducation}
              onChange={(value) =>
                handleSelectChange("highestEducation", value)
              }
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

            <FieldSelect
              id="college"
              label="College"
              value={form.college}
              onChange={(value) => handleSelectChange("college", value)}
              options={[
                {
                  value: "iit",
                  label: "IIT",
                },
                {
                  value: "iim",
                  label: "IIM",
                },
                {
                  value: "nit",
                  label: "NIT",
                },
                {
                  value: "aiims",
                  label: "AIIMS",
                },
                {
                  value: "delhiUniversity",
                  label: "Delhi University",
                },
                {
                  value: "other",
                  label: "Other",
                },
              ]}
            />

            <FieldSelect
              id="occupation"
              label="Occupation"
              value={form.occupation}
              onChange={(value) => handleSelectChange("occupation", value)}
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

            <FieldSelect
              id="annualIncome"
              label="Annual income"
              value={form.annualIncome}
              onChange={(value) => handleSelectChange("annualIncome", value)}
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
        </div>

        {/* =================================================
            LIFESTYLE
        ================================================== */}

        <div className="mb-2">
          <h2 className="mb-3 border-b border-dashed border-slate-200 pb-2 font-serif text-base font-semibold text-slate-900">
            Lifestyle
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FieldSelect
              id="diet"
              label="Diet"
              value={form.diet}
              onChange={(value) => handleSelectChange("diet", value)}
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

            <FieldSelect
              id="smoking"
              label="Smoking habits"
              value={form.smoking}
              onChange={(value) => handleSelectChange("smoking", value)}
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

            <FieldSelect
              id="drinking"
              label="Drinking habits"
              value={form.drinking}
              onChange={(value) => handleSelectChange("drinking", value)}
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
          </div>
        </div>

        {/* =================================================
            FAMILY & OTHER PREFERENCES
        ================================================== */}

        <div className="mb-6">
          <h2 className="mb-3 border-b border-dashed border-slate-200 pb-2 font-serif text-base font-semibold text-slate-900">
            Family & other preferences
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FieldSelect
              id="physicalStatus"
              label="Physical status"
              value={form.physicalStatus}
              onChange={(value) => handleSelectChange("physicalStatus", value)}
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

            <FieldSelect
              id="familyType"
              label="Family type"
              value={form.familyType}
              onChange={(value) => handleSelectChange("familyType", value)}
              options={[
                {
                  value: "nuclear",
                  label: "Nuclear family",
                },
                {
                  value: "joint",
                  label: "Joint family",
                },
              ]}
            />

            <FieldSelect
              id="willingToRelocate"
              label="Willing to relocate"
              value={form.willingToRelocate}
              onChange={(value) =>
                handleSelectChange("willingToRelocate", value)
              }
              options={[
                {
                  value: "yes",
                  label: "Yes",
                },
                {
                  value: "no",
                  label: "No",
                },
                {
                  value: "maybe",
                  label: "Maybe",
                },
              ]}
            />
          </div>
        </div>

        {/* =================================================
            KEYWORD & PHOTO
        ================================================== */}

        <div className="mb-8">
          <label htmlFor="keyword" className={labelClass}>
            Keyword
          </label>

          <input
            id="keyword"
            name="keyword"
            type="text"
            value={form.keyword}
            onChange={(e) => handleKeywordChange(e.target.value)}
            placeholder="e.g. loves travelling, joint family"
            className={inputClass}
          />

          <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={form.photoOnly}
              onChange={(e) => handlePhotoOnlyChange(e.target.checked)}
              className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-rose-500 focus:ring-rose-300"
            />
            Show only profiles with photo
          </label>
        </div>

        {/* =================================================
            SEARCH BUTTON
        ================================================== */}

        <div className="mt-8 flex justify-center">
          <ThemeBtnOne
            text="Search profiles"
            icon={<Search className="h-4 w-4" />}
            className="cursor-pointer rounded-full bg-rose-500 px-8 py-3.5 font-serif text-white"
          />
        </div>
      </form>
    </div>
  );
};

export default AdvancedSearch;

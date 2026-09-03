"use client";

import { useState, FormEvent } from "react";
import Select, { SingleValue, StylesConfig } from "react-select";
import { Search } from "lucide-react";
import ThemeBtnOne from "@/app/components/ThemeBtnOne";

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
}

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
    boxShadow: "0 15px 40px rgba(15, 23, 42, 0.12)",
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
        styles={selectStyles}
        noOptionsMessage={() => "No options found"}
      />
    </div>
  );
};

interface BasicSearchForm {
  lookingFor: "bride" | "groom" | "";
  ageFrom: string;
  ageTo: string;
  maritalStatus: string;
  religion: string;
  motherTongue: string;
  country: string;
  state: string;
  city: string;
}

const initialState: BasicSearchForm = {
  lookingFor: "",
  ageFrom: "",
  ageTo: "",
  maritalStatus: "",
  religion: "",
  motherTongue: "",
  country: "",
  state: "",
  city: "",
};

const AGE_OPTIONS: Option[] = Array.from({ length: 43 }, (_, i) => {
  const age = i + 18;

  return {
    value: String(age),
    label: String(age),
  };
});

const BasicSearch = () => {
  const [form, setForm] = useState<BasicSearchForm>(initialState);

  const handleSelectChange = (field: keyof BasicSearchForm, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLookingFor = (value: "bride" | "groom") => {
    setForm((prev) => ({
      ...prev,
      lookingFor: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Searching", form);
  };

  return (
    <div className="w-full bg-[#FDF8F3] px-5 py-12 sm:px-8 lg:px-8">
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-3xl bg-white p-8 py-10"
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="font-serif text-2xl font-semibold text-slate-900">
            Basic Search
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Search by age, religion, city & more
          </p>
        </div>

        {/* Looking For */}
        <div className="mb-6">
          <label className={labelClass}>Looking for</label>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleLookingFor("bride")}
              className={`rounded-2xl cursor-pointer border px-4 py-3.5 text-sm font-semibold transition ${
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
              className={`rounded-2xl cursor-pointer border px-4 py-3.5 text-sm font-semibold transition ${
                form.lookingFor === "groom"
                  ? "border-rose-400 bg-rose-50 text-rose-600"
                  : "border-slate-200 text-slate-600 hover:border-rose-200"
              }`}
            >
              Groom
            </button>
          </div>
        </div>

        {/* Age Range */}
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

        {/* Other Filters */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

        {/* Search Button */}
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

export default BasicSearch;

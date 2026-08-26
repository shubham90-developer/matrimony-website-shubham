"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { Search } from "lucide-react";
import ThemeBtnOne from "@/app/components/ThemeBtnOne";

const selectClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-rose-300";

const labelClass = "mb-1.5 block text-sm font-bold text-slate-900";

interface Option {
  value: string;
  label: string;
}

interface FieldSelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
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
}: FieldSelectProps) => (
  <div>
    <label htmlFor={id} className={labelClass}>
      {label}
    </label>
    <select
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      className={selectClass}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

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
  return { value: String(age), label: String(age) };
});

const BasicSearch = () => {
  const [form, setForm] = useState<BasicSearchForm>(initialState);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLookingFor = (value: "bride" | "groom") => {
    setForm((prev) => ({ ...prev, lookingFor: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Replace with your actual search navigation/query call.
    console.log("Searching", form);
  };

  return (
    <div className="w-full bg-[#FDF8F3] px-5 py-12 sm:px-8 lg:px-8">
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-3xl bg-white p-8 py-10"
      >
        <div className="mb-8 text-center">
          <h1 className="font-serif text-2xl font-semibold text-slate-900">
            Basic Search
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Search by age, religion, city & more
          </p>
        </div>

        {/* Looking for */}
        <div className="mb-6">
          <label className={labelClass}>Looking for</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleLookingFor("bride")}
              className={`rounded-2xl border px-4 py-3.5 text-sm font-semibold transition ${
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
              className={`rounded-2xl border px-4 py-3.5 text-sm font-semibold transition ${
                form.lookingFor === "groom"
                  ? "border-rose-400 bg-rose-50 text-rose-600"
                  : "border-slate-200 text-slate-600 hover:border-rose-200"
              }`}
            >
              Groom
            </button>
          </div>
        </div>

        {/* Age range */}
        <div className="mb-6">
          <label className={labelClass}>Age</label>
          <div className="grid grid-cols-2 gap-3">
            <FieldSelect
              id="ageFrom"
              label=""
              value={form.ageFrom}
              onChange={handleChange}
              options={AGE_OPTIONS}
              placeholder="From"
            />
            <FieldSelect
              id="ageTo"
              label=""
              value={form.ageTo}
              onChange={handleChange}
              options={AGE_OPTIONS}
              placeholder="To"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FieldSelect
            id="maritalStatus"
            label="Marital status"
            value={form.maritalStatus}
            onChange={handleChange}
            options={[
              { value: "neverMarried", label: "Never married" },
              { value: "married", label: "Married" },
              { value: "divorced", label: "Divorced" },
              { value: "widowed", label: "Widowed" },
            ]}
          />

          <FieldSelect
            id="religion"
            label="Religion"
            value={form.religion}
            onChange={handleChange}
            options={[
              { value: "hindu", label: "Hindu" },
              { value: "muslim", label: "Muslim" },
              { value: "christian", label: "Christian" },
              { value: "sikh", label: "Sikh" },
              { value: "jain", label: "Jain" },
              { value: "buddhist", label: "Buddhist" },
            ]}
          />

          <FieldSelect
            id="motherTongue"
            label="Mother tongue"
            value={form.motherTongue}
            onChange={handleChange}
            options={[
              { value: "hindi", label: "Hindi" },
              { value: "marathi", label: "Marathi" },
              { value: "bengali", label: "Bengali" },
              { value: "tamil", label: "Tamil" },
              { value: "telugu", label: "Telugu" },
              { value: "gujarati", label: "Gujarati" },
            ]}
          />

          <FieldSelect
            id="country"
            label="Country"
            value={form.country}
            onChange={handleChange}
            options={[
              { value: "india", label: "India" },
              { value: "usa", label: "USA" },
              { value: "uk", label: "UK" },
              { value: "canada", label: "Canada" },
              { value: "australia", label: "Australia" },
            ]}
          />

          <FieldSelect
            id="state"
            label="State"
            value={form.state}
            onChange={handleChange}
            options={[
              { value: "maharashtra", label: "Maharashtra" },
              { value: "delhi", label: "Delhi" },
              { value: "karnataka", label: "Karnataka" },
              { value: "gujarat", label: "Gujarat" },
              { value: "tamilNadu", label: "Tamil Nadu" },
            ]}
          />

          <FieldSelect
            id="city"
            label="City"
            value={form.city}
            onChange={handleChange}
            options={[
              { value: "pune", label: "Pune" },
              { value: "mumbai", label: "Mumbai" },
              { value: "bangalore", label: "Bangalore" },
              { value: "hyderabad", label: "Hyderabad" },
              { value: "chennai", label: "Chennai" },
            ]}
          />
        </div>

        <div className="mt-8 flex justify-center">
          <ThemeBtnOne
            text="Search profiles"
            icon={<Search className="h-4 w-4" />}
            className="rounded-full bg-rose-500 px-8 py-3.5 font-serif text-white cursor-pointer"
          />
        </div>
      </form>
    </div>
  );
};

export default BasicSearch;

"use client";
import { useState, ChangeEvent } from "react";
import ThemeBtnOne from "@/app/components/ThemeBtnOne";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

const selectClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-rose-300";

const labelClass = "mb-1.5 block text-sm font-bold text-slate-900";

interface Option {
  value: string;
  label: string;
}

interface FieldSelectProps {
  id: keyof PreferencesForm;
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

const PartnerPreferences = () => {
  const [form, setForm] = useState<PreferencesForm>(initialState);

  const handleChange = (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (section: PreferencesSection) => {
    // Replace with your actual save/mutation call.
    console.log(`Saving ${section}`, form);
  };

  return (
    <div className="rounded-xl border border-gray-200 p-4">
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Basic details */}
        <div className="rounded-md bg-rose-50 p-4">
          <h2 className="mb-6 border-b border-dashed border-gray-400 pb-2 font-serif text-lg font-semibold">
            Partner basic details
          </h2>

          <div className="grid grid-cols-1 gap-4">
            <FieldSelect
              id="gender"
              label="Gender"
              value={form.gender}
              onChange={handleChange}
              options={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
                { value: "other", label: "Other" },
              ]}
            />

            <div>
              <label htmlFor="dob" className={labelClass}>
                Date of birth
              </label>
              <input
                id="dob"
                name="dob"
                type="date"
                value={form.dob}
                onChange={handleChange}
                className={selectClass}
              />
            </div>

            <FieldSelect
              id="height"
              label="Height"
              value={form.height}
              onChange={handleChange}
              placeholder="Select height"
              options={[
                { value: "4ft6in", label: '4\u2019 6" (137 cm)' },
                { value: "5ft0in", label: '5\u2019 0" (152 cm)' },
                { value: "5ft6in", label: '5\u2019 6" (168 cm)' },
                { value: "6ft0in", label: '6\u2019 0" (183 cm)' },
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
              ]}
            />

            <FieldSelect
              id="caste"
              label="Caste"
              value={form.caste}
              onChange={handleChange}
              options={[{ value: "maratha", label: "Maratha" }]}
            />

            <FieldSelect
              id="subCaste"
              label="Sub caste"
              value={form.subCaste}
              onChange={handleChange}
              options={[{ value: "96kuli", label: "96 Kuli Maratha" }]}
            />

            <FieldSelect
              id="motherTongue"
              label="Mother tongue"
              value={form.motherTongue}
              onChange={handleChange}
              options={[
                { value: "marathi", label: "Marathi" },
                { value: "hindi", label: "Hindi" },
                { value: "english", label: "English" },
              ]}
            />

            <FieldSelect
              id="country"
              label="Residing country"
              value={form.country}
              onChange={handleChange}
              options={[{ value: "india", label: "India" }]}
            />

            <FieldSelect
              id="state"
              label="Residing state"
              value={form.state}
              onChange={handleChange}
              options={[{ value: "maharashtra", label: "Maharashtra" }]}
            />

            <FieldSelect
              id="city"
              label="Residing city"
              value={form.city}
              onChange={handleChange}
              options={[{ value: "pune", label: "Pune" }]}
            />

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
          </div>

          <div className="mt-6 flex justify-end">
            <ThemeBtnOne
              text="Save"
              onClick={() => handleSave("basic details")}
              className="mt-4 cursor-pointer rounded-full bg-rose-500 px-3 py-2 font-serif text-white"
            />
          </div>
        </div>

        {/* Education & occupation */}
        <div className="rounded-md bg-rose-50 p-4">
          <h2 className="mb-6 border-b border-dashed border-gray-400 pb-2 font-serif text-lg font-semibold">
            Partner education & occupation
          </h2>

          <div className="grid grid-cols-1 gap-4">
            <FieldSelect
              id="highestEducation"
              label="Highest education"
              value={form.highestEducation}
              onChange={handleChange}
              options={[
                { value: "graduate", label: "Graduate" },
                { value: "postGraduate", label: "Post graduate" },
                { value: "doctorate", label: "Doctorate" },
              ]}
            />

            <FieldSelect
              id="ugDegree"
              label="UG degree"
              value={form.ugDegree}
              onChange={handleChange}
              options={[
                { value: "bcom", label: "B.Com" },
                { value: "btech", label: "B.Tech / B.E." },
                { value: "ba", label: "B.A." },
              ]}
            />

            <FieldSelect
              id="occupation"
              label="Occupation"
              value={form.occupation}
              onChange={handleChange}
              options={[
                { value: "government", label: "Government" },
                { value: "private", label: "Private sector" },
                { value: "business", label: "Business" },
                { value: "notWorking", label: "Not working" },
              ]}
            />

            <FieldSelect
              id="annualIncome"
              label="Annual income"
              value={form.annualIncome}
              onChange={handleChange}
              options={[
                { value: "1-2lakh", label: "1-2 lakh" },
                { value: "2-5lakh", label: "2-5 lakh" },
                { value: "5-10lakh", label: "5-10 lakh" },
                { value: "10lakh+", label: "10 lakh+" },
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

        {/* Lifestyle */}
        <div className="rounded-md bg-rose-50 p-4">
          <h2 className="mb-6 border-b border-dashed border-gray-400 pb-2 font-serif text-lg font-semibold">
            Partner lifestyle
          </h2>

          <div className="grid grid-cols-1 gap-4">
            <FieldSelect
              id="diet"
              label="Diet"
              value={form.diet}
              onChange={handleChange}
              options={[
                { value: "vegetarian", label: "Vegetarian" },
                { value: "nonVegetarian", label: "Non-vegetarian" },
                { value: "eggetarian", label: "Eggetarian" },
                { value: "vegan", label: "Vegan" },
              ]}
            />

            <FieldSelect
              id="smoking"
              label="Smoking habits"
              value={form.smoking}
              onChange={handleChange}
              options={[
                { value: "no", label: "No" },
                { value: "occasionally", label: "Occasionally" },
                { value: "yes", label: "Yes" },
              ]}
            />

            <FieldSelect
              id="drinking"
              label="Drinking habits"
              value={form.drinking}
              onChange={handleChange}
              options={[
                { value: "no", label: "No" },
                { value: "occasionally", label: "Occasionally" },
                { value: "yes", label: "Yes" },
              ]}
            />

            <FieldSelect
              id="physicalStatus"
              label="Physical status"
              value={form.physicalStatus}
              onChange={handleChange}
              options={[
                { value: "normal", label: "Normal" },
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

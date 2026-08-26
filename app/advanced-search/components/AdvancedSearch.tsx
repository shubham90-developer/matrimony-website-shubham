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
  onChange: (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => void;
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
    {label && (
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
    )}
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

const AGE_OPTIONS: Option[] = Array.from({ length: 43 }, (_, i) => {
  const age = i + 18;
  return { value: String(age), label: String(age) };
});

const HEIGHT_OPTIONS: Option[] = [
  { value: "4ft6in", label: "4' 6\" (137 cm)" },
  { value: "5ft0in", label: "5' 0\" (152 cm)" },
  { value: "5ft6in", label: "5' 6\" (168 cm)" },
  { value: "6ft0in", label: "6' 0\" (183 cm)" },
  { value: "6ft6in", label: "6' 6\" (198 cm)" },
];

const AdvancedSearch = () => {
  const [form, setForm] = useState<AdvancedSearchForm>(initialState);

  const handleChange = (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoOnlyChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, photoOnly: e.target.checked }));
  };

  const handleLookingFor = (value: "bride" | "groom") => {
    setForm((prev) => ({ ...prev, lookingFor: value }));
  };

  const runSearch = (e?: FormEvent) => {
    e?.preventDefault();
    // Replace with your actual search navigation/query call.
    console.log("Searching", form);
  };

  return (
    <div className="w-full bg-[#FDF8F3] px-5 py-12 sm:px-8 lg:px-8">
      <form
        onSubmit={runSearch}
        className="mx-auto max-w-3xl bg-white p-8 py-10"
      >
        <div className="mb-8 text-center">
          <h1 className="font-serif text-2xl font-semibold text-slate-900">
            Advanced Search
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Refine with education, income & lifestyle
          </p>
        </div>

        {/* Looking for */}
        <div className="mb-6">
          <label className={labelClass}>Looking for</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleLookingFor("bride")}
              className={`rounded-2xl border cursor-pointer px-4 py-3.5 text-sm font-semibold transition ${
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
              className={`rounded-2xl border cursor-pointer px-4 py-3.5 text-sm font-semibold transition ${
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

        {/* Height range */}
        <div className="mb-6">
          <label className={labelClass}>Height</label>
          <div className="grid grid-cols-2 gap-3">
            <FieldSelect
              id="heightFrom"
              label=""
              value={form.heightFrom}
              onChange={handleChange}
              options={HEIGHT_OPTIONS}
              placeholder="From"
            />
            <FieldSelect
              id="heightTo"
              label=""
              value={form.heightTo}
              onChange={handleChange}
              options={HEIGHT_OPTIONS}
              placeholder="To"
            />
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            id="caste"
            label="Caste"
            value={form.caste}
            onChange={handleChange}
            options={[
              { value: "brahmin", label: "Brahmin" },
              { value: "rajput", label: "Rajput" },
              { value: "maratha", label: "Maratha" },
              { value: "yadav", label: "Yadav" },
              { value: "kayastha", label: "Kayastha" },
              { value: "agarwal", label: "Agarwal" },
            ]}
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

        {/* Education & occupation */}
        <div className="mb-6">
          <h2 className="mb-3 border-b border-dashed border-slate-200 pb-2 font-serif text-base font-semibold text-slate-900">
            Education & occupation
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
              id="college"
              label="College"
              value={form.college}
              onChange={handleChange}
              options={[
                { value: "iit", label: "IIT" },
                { value: "iim", label: "IIM" },
                { value: "nit", label: "NIT" },
                { value: "aiims", label: "AIIMS" },
                { value: "delhiUniversity", label: "Delhi University" },
                { value: "other", label: "Other" },
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
        </div>

        {/* Lifestyle */}
        <div className="mb-2">
          <h2 className="mb-3 border-b border-dashed border-slate-200 pb-2 font-serif text-base font-semibold text-slate-900">
            Lifestyle
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
          </div>
        </div>

        {/* Family & other preferences */}
        <div className="mb-6">
          <h2 className="mb-3 border-b border-dashed border-slate-200 pb-2 font-serif text-base font-semibold text-slate-900">
            Family & other preferences
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

            <FieldSelect
              id="familyType"
              label="Family type"
              value={form.familyType}
              onChange={handleChange}
              options={[
                { value: "nuclear", label: "Nuclear family" },
                { value: "joint", label: "Joint family" },
              ]}
            />

            <FieldSelect
              id="willingToRelocate"
              label="Willing to relocate"
              value={form.willingToRelocate}
              onChange={handleChange}
              options={[
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
                { value: "maybe", label: "Maybe" },
              ]}
            />
          </div>
        </div>

        {/* Keyword & photo filter */}
        <div className="mb-8">
          <label htmlFor="keyword" className={labelClass}>
            Keyword
          </label>
          <input
            id="keyword"
            name="keyword"
            type="text"
            value={form.keyword}
            onChange={handleChange}
            placeholder="e.g. loves travelling, joint family"
            className={selectClass}
          />
          <label className="mt-3 flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={form.photoOnly}
              onChange={handlePhotoOnlyChange}
              className="h-4 w-4 rounded border-slate-300 text-rose-500 focus:ring-rose-300"
            />
            Show only profiles with photo
          </label>
        </div>

        <div className="mt-8 flex justify-center">
          <ThemeBtnOne
            text="Search profiles"
            icon={<Search className="h-4 w-4" />}
            onClick={() => runSearch()}
            className="cursor-pointer rounded-full bg-rose-500 px-8 py-3.5 font-serif text-white"
          />
        </div>
      </form>
    </div>
  );
};

export default AdvancedSearch;

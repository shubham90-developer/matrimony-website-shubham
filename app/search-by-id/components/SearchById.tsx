"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { Search, IdCard } from "lucide-react";
import ThemeBtnOne from "@/app/components/ThemeBtnOne";

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-rose-300";

const labelClass = "mb-1.5 block text-sm font-bold text-slate-900";

const SearchById = () => {
  const [profileId, setProfileId] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProfileId(e.target.value);
    if (error) setError("");
  };

  const runSearch = (e?: FormEvent) => {
    e?.preventDefault();
    const trimmed = profileId.trim();
    if (!trimmed) {
      setError("Enter a profile ID to search.");
      return;
    }
    // Replace with your actual search navigation/query call.
    console.log("Searching for profile ID", trimmed);
  };

  return (
    <div className="w-full bg-[#FDF8F3] px-5 py-12 sm:px-8 lg:px-8">
      <form
        onSubmit={runSearch}
        className="mx-auto max-w-md bg-white p-8 py-10"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
            <IdCard className="h-6 w-6" />
          </div>
          <h1 className="font-serif text-2xl font-semibold text-slate-900">
            Search by ID
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Find a profile using their Tuz Maz Jamla ID
          </p>
        </div>

        <div className="mb-2">
          <label htmlFor="profileId" className={labelClass}>
            Profile ID
          </label>
          <input
            id="profileId"
            name="profileId"
            type="text"
            value={profileId}
            onChange={handleChange}
            placeholder="e.g. UXZ48213"
            className={inputClass}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "profileId-error" : undefined}
          />
          {error && (
            <p id="profileId-error" className="mt-1.5 text-xs text-rose-600">
              {error}
            </p>
          )}
        </div>

        <div className="mt-8 flex justify-center">
          <ThemeBtnOne
            text="Search profile"
            icon={<Search className="h-4 w-4" />}
            onClick={() => runSearch()}
            className="cursor-pointer rounded-full bg-rose-500 px-8 py-3.5 font-serif text-white"
          />
        </div>
      </form>
    </div>
  );
};

export default SearchById;

/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import ThemeBtnOne from "@/app/components/ThemeBtnOne";
import { ChevronLeft, Clock } from "lucide-react";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import Select, { SingleValue, StylesConfig } from "react-select";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarDays } from "lucide-react";
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

const KundaliDetails = () => {
  /* =========================================================
     FORM STATE
  ========================================================= */

  const [rashi, setRashi] = useState<string>("");

  const [nakshatra, setNakshatra] = useState<string>("");

  const [manglik, setManglik] = useState<string>("");

  const [horoscope, setHoroscope] = useState<string>("");

  const [dateOfBirth, setDateOfBirth] = useState<string>("");

  const [birthTiming, setBirthTiming] = useState<string>("");

  const [birthCountry, setBirthCountry] = useState<string>("");

  const [birthState, setBirthState] = useState<string>("");

  const [birthCity, setBirthCity] = useState<string>("");

  /* =========================================================
     RASHI OPTIONS
  ========================================================= */

  const rashiOptions: SelectOption[] = [
    {
      value: "Aries",
      label: "Aries",
    },
    {
      value: "Taurus",
      label: "Taurus",
    },
    {
      value: "Gemini",
      label: "Gemini",
    },
    {
      value: "Cancer",
      label: "Cancer",
    },
    {
      value: "Leo",
      label: "Leo",
    },
    {
      value: "Virgo",
      label: "Virgo",
    },
    {
      value: "Libra",
      label: "Libra",
    },
    {
      value: "Scorpio",
      label: "Scorpio",
    },
    {
      value: "Sagittarius",
      label: "Sagittarius",
    },
    {
      value: "Capricorn",
      label: "Capricorn",
    },
    {
      value: "Aquarius",
      label: "Aquarius",
    },
    {
      value: "Pisces",
      label: "Pisces",
    },
  ];

  /* =========================================================
     MANGALIK OPTIONS
  ========================================================= */

  const manglikOptions: SelectOption[] = [
    {
      value: "Manglik",
      label: "Manglik",
    },
    {
      value: "Non-Manglik",
      label: "Non-Manglik",
    },
    {
      value: "Partial-Manglik",
      label: "Partial-Manglik",
    },
  ];

  /* =========================================================
     HOROSCOPE OPTIONS
  ========================================================= */

  const horoscopeOptions: SelectOption[] = [
    {
      value: "Must Match",
      label: "Must Match",
    },
    {
      value: "Not Required",
      label: "Not Required",
    },
  ];

  /* =========================================================
     COUNTRY OPTIONS
  ========================================================= */

  const countryOptions: SelectOption[] = [
    {
      value: "India",
      label: "India",
    },
  ];

  /* =========================================================
     STATE OPTIONS
  ========================================================= */

  const stateOptions: SelectOption[] = [
    {
      value: "Maharashtra",
      label: "Maharashtra",
    },
  ];

  /* =========================================================
     CITY OPTIONS
  ========================================================= */

  const cityOptions: SelectOption[] = [
    {
      value: "Pune",
      label: "Pune",
    },
  ];

  /* =========================================================
     SELECTED OPTIONS
  ========================================================= */

  const selectedRashi = useMemo<SelectOption | null>(() => {
    return rashiOptions.find((item) => item.value === rashi) ?? null;
  }, [rashi]);

  const selectedManglik = useMemo<SelectOption | null>(() => {
    return manglikOptions.find((item) => item.value === manglik) ?? null;
  }, [manglik]);

  const selectedHoroscope = useMemo<SelectOption | null>(() => {
    return horoscopeOptions.find((item) => item.value === horoscope) ?? null;
  }, [horoscope]);

  const selectedCountry = useMemo<SelectOption | null>(() => {
    return countryOptions.find((item) => item.value === birthCountry) ?? null;
  }, [birthCountry]);

  const selectedState = useMemo<SelectOption | null>(() => {
    return stateOptions.find((item) => item.value === birthState) ?? null;
  }, [birthState]);

  const selectedCity = useMemo<SelectOption | null>(() => {
    return cityOptions.find((item) => item.value === birthCity) ?? null;
  }, [birthCity]);

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
          Kundali & Astro Details
        </h3>
      </div>

      {/* =====================================================
          FORM
      ===================================================== */}

      <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* ===================================================
            RASHI
        =================================================== */}

        <div>
          <label className="mb-1.5 block text-md font-bold text-slate-900">
            Rashi
          </label>

          <Select<SelectOption, false>
            isSearchable
            isClearable
            options={rashiOptions}
            value={selectedRashi}
            onChange={(option: SingleValue<SelectOption>) => {
              setRashi(option?.value ?? "");
            }}
            placeholder="Search rashi..."
            noOptionsMessage={() => "No rashi found"}
            styles={selectStyles}
          />
        </div>

        {/* ===================================================
            NAKSHATRA
        =================================================== */}

        <div>
          <label className="mb-1.5 block text-md font-bold text-slate-900">
            Nakshatra
          </label>

          <input
            type="text"
            value={nakshatra}
            onChange={(e) => setNakshatra(e.target.value)}
            placeholder="Enter nakshatra"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-300"
          />
        </div>

        {/* ===================================================
            MANGLIK
        =================================================== */}

        <div>
          <label className="mb-1.5 block text-md font-bold text-slate-900">
            Manglik
          </label>

          <Select<SelectOption, false>
            isSearchable
            isClearable
            options={manglikOptions}
            value={selectedManglik}
            onChange={(option: SingleValue<SelectOption>) => {
              setManglik(option?.value ?? "");
            }}
            placeholder="Search..."
            noOptionsMessage={() => "No option found"}
            styles={selectStyles}
          />
        </div>

        {/* ===================================================
            HOROSCOPE
        =================================================== */}

        <div>
          <label className="mb-1.5 block text-md font-bold text-slate-900">
            What are your thoughts on horoscope?
          </label>

          <Select<SelectOption, false>
            isSearchable
            isClearable
            options={horoscopeOptions}
            value={selectedHoroscope}
            onChange={(option: SingleValue<SelectOption>) => {
              setHoroscope(option?.value ?? "");
            }}
            placeholder="Search..."
            noOptionsMessage={() => "No option found"}
            styles={selectStyles}
          />
        </div>

        {/* ===================================================
            SECTION TITLE
        =================================================== */}

        <div className="md:col-span-2 mt-2 border-b border-dashed border-gray-200 pb-2">
          <h3 className="font-serif text-xl font-semibold text-slate-900">
            Horoscope Details
          </h3>
        </div>

        {/* ===================================================
    DATE OF BIRTH
=================================================== */}

        <div>
          <label className="mb-1.5 block text-md font-bold text-slate-900">
            Date Of Birth
          </label>

          <div className="relative">
            {/* Calendar Icon */}
            <CalendarDays
              size={18}
              strokeWidth={1.8}
              className="pointer-events-none absolute left-4 top-1/2 z-20 -translate-y-1/2 text-rose-400"
            />

            <DatePicker
              selected={
                dateOfBirth ? new Date(`${dateOfBirth}T00:00:00`) : null
              }
              onChange={(date: Date | null) => {
                if (!date) {
                  setDateOfBirth("");
                  return;
                }

                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const day = String(date.getDate()).padStart(2, "0");

                setDateOfBirth(`${year}-${month}-${day}`);
              }}
              dateFormat="dd/MM/yyyy"
              placeholderText="Select date of birth"
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

        {/* ===================================================
    BIRTH TIME
=================================================== */}

        <div>
          <label className="mb-1.5 block text-md font-bold text-slate-900">
            Birth Timing
          </label>

          <div className="relative">
            {/* Clock Icon */}
            <Clock
              size={18}
              strokeWidth={1.8}
              className="pointer-events-none absolute left-4 top-1/2 z-20 -translate-y-1/2 text-rose-400"
            />

            <DatePicker
              selected={
                birthTiming ? new Date(`1970-01-01T${birthTiming}`) : null
              }
              onChange={(time: Date | null) => {
                if (!time) {
                  setBirthTiming("");
                  return;
                }

                const hours = String(time.getHours()).padStart(2, "0");

                const minutes = String(time.getMinutes()).padStart(2, "0");

                setBirthTiming(`${hours}:${minutes}`);
              }}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Birth Time"
              dateFormat="h:mm aa"
              placeholderText="Select birth time"
              isClearable
              wrapperClassName="w-full"
              calendarClassName="modern-timepicker"
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
        font-medium
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

        {/* ===================================================
            COUNTRY
        =================================================== */}

        <div>
          <label className="mb-1.5 block text-md font-bold text-slate-900">
            Select Your Country Of Birth
          </label>

          <Select<SelectOption, false>
            isSearchable
            isClearable
            options={countryOptions}
            value={selectedCountry}
            onChange={(option: SingleValue<SelectOption>) => {
              setBirthCountry(option?.value ?? "");

              setBirthState("");
              setBirthCity("");
            }}
            placeholder="Search country..."
            noOptionsMessage={() => "No country found"}
            styles={selectStyles}
          />
        </div>

        {/* ===================================================
            STATE
        =================================================== */}

        <div>
          <label className="mb-1.5 block text-md font-bold text-slate-900">
            Select Your State Of Birth
          </label>

          <Select<SelectOption, false>
            isSearchable
            isClearable
            isDisabled={!birthCountry}
            options={stateOptions}
            value={selectedState}
            onChange={(option: SingleValue<SelectOption>) => {
              setBirthState(option?.value ?? "");

              setBirthCity("");
            }}
            placeholder={
              birthCountry ? "Search state..." : "Select country first"
            }
            noOptionsMessage={() => "No state found"}
            styles={selectStyles}
          />
        </div>

        {/* ===================================================
            CITY
        =================================================== */}

        <div>
          <label className="mb-1.5 block text-md font-bold text-slate-900">
            Select Your City Of Birth
          </label>

          <Select<SelectOption, false>
            isSearchable
            isClearable
            isDisabled={!birthState}
            options={cityOptions}
            value={selectedCity}
            onChange={(option: SingleValue<SelectOption>) => {
              setBirthCity(option?.value ?? "");
            }}
            placeholder={birthState ? "Search city..." : "Select state first"}
            noOptionsMessage={() => "No city found"}
            styles={selectStyles}
          />
        </div>
      </div>

      {/* =====================================================
          UPDATE BUTTON
      ===================================================== */}

      <div className="flex justify-end">
        <ThemeBtnOne
          text="Update"
          className="mt-4 cursor-pointer rounded-full bg-rose-500 px-5 py-2 font-serif text-white"
        />
      </div>
    </div>
  );
};

export default KundaliDetails;

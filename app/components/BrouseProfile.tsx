"use client";

import React, { useState } from "react";

type TabKey =
  | "motherTongue"
  | "caste"
  | "religion"
  | "city"
  | "occupation"
  | "state"
  | "nri"
  | "college";

const tabs: { key: TabKey; label: string }[] = [
  { key: "motherTongue", label: "Mother Tongue" },
  { key: "caste", label: "Caste" },
  { key: "religion", label: "Religion" },
  { key: "city", label: "City" },
  { key: "occupation", label: "Occupation" },
  { key: "state", label: "State" },
  { key: "nri", label: "NRI" },
  { key: "college", label: "College" },
];

const tabData: Record<TabKey, string[]> = {
  motherTongue: [
    "Bihari",
    "Bengali",
    "Hindi Delhi",
    "Hindi",
    "Gujarati",
    "Kannada",
    "Malayalam",
    "Marathi",
    "Oriya",
    "Punjabi",
    "Rajasthani",
    "Tamil",
    "Telugu",
    "Hindi UP",
    "Hindi MP",
    "Konkani",
    "Himachali",
    "Haryanvi",
    "Assamese",
    "Kashmiri",
    "Sikkim Nepali",
    "Tulu",
  ],
  caste: [
    "Agarwal",
    "Brahmin",
    "Rajput",
    "Kayastha",
    "Yadav",
    "Jat",
    "Kshatriya",
    "Kurmi",
    "Maratha",
    "Nair",
    "Reddy",
    "Naidu",
    "Iyer",
    "Iyengar",
    "Vaishya",
    "Khatri",
    "Gupta",
    "Patel",
    "Chettiar",
    "Sindhi",
  ],
  religion: [
    "Hindu",
    "Muslim",
    "Christian",
    "Sikh",
    "Jain",
    "Buddhist",
    "Parsi",
    "Jewish",
    "Inter-Religion",
    "No Religion",
  ],
  city: [
    "Mumbai",
    "Delhi",
    "Bangalore",
    "Hyderabad",
    "Chennai",
    "Pune",
    "Kolkata",
    "Ahmedabad",
    "Jaipur",
    "Surat",
    "Lucknow",
    "Chandigarh",
    "Kochi",
    "Indore",
    "Nagpur",
  ],
  occupation: [
    "Doctor",
    "Engineer",
    "Business Owner",
    "Government Employee",
    "Teacher / Professor",
    "Lawyer",
    "Chartered Accountant",
    "Banker",
    "IT Professional",
    "Civil Services",
    "Defence Personnel",
    "Self Employed",
    "Artist",
    "Consultant",
  ],
  state: [
    "Maharashtra",
    "Delhi NCR",
    "Karnataka",
    "Tamil Nadu",
    "Telangana",
    "West Bengal",
    "Gujarat",
    "Rajasthan",
    "Uttar Pradesh",
    "Punjab",
    "Kerala",
    "Madhya Pradesh",
    "Haryana",
    "Bihar",
    "Odisha",
  ],
  nri: [
    "USA",
    "UK",
    "Canada",
    "Australia",
    "UAE",
    "Singapore",
    "Germany",
    "New Zealand",
    "Kuwait",
    "Saudi Arabia",
    "Qatar",
    "Malaysia",
  ],
  college: [
    "IIT",
    "IIM",
    "NIT",
    "Delhi University",
    "BITS Pilani",
    "AIIMS",
    "Anna University",
    "Manipal University",
    "Symbiosis",
    "Christ University",
    "VIT",
    "Amity University",
  ],
};

const BrouseProfile = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("motherTongue");

  return (
    <section className="w-full bg-[#FDF8F3] py-0 px-5 sm:px-8 lg:px-8">
      <div className="mx-auto max-w-7xl  bg-white p-8 py-15">
        {/* Heading */}
        <div className="text-center">
          <span className="text-xs font-bold tracking-widest text-slate-400 bg-rose-100 px-4 py-1 rounded-full">
            BROWSE
          </span>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl font-serif">
            <span className="text-rose-600">Matrimonial</span>{" "}
            <span className="text-slate-900">Profiles by</span>
          </h2>
        </div>

        {/* Tabs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                aria-pressed={isActive}
                className={`rounded px-4 py-2 text-[15px] font-medium transition-colors ${
                  isActive
                    ? "bg-slate-200 text-slate-900"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content list */}
        <div className="mt-6 flex flex-wrap justify-center gap-x-2 gap-y-3 text-center">
          {tabData[activeTab].map((item, index) => (
            <span key={item} className="flex items-center gap-2">
              <a
                href="#"
                className="text-[15px] text-slate-600 transition-colors hover:text-rose-600 hover:underline"
              >
                {item}
              </a>
              {index < tabData[activeTab].length - 1 && (
                <span className="text-slate-300">|</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrouseProfile;

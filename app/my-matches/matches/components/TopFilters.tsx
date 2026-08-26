"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import ThemeBtnOne from "@/app/components/ThemeBtnOne";

const FILTERS = [
  { label: "Filters", icon: SlidersHorizontal },
  { label: "Metro Cities" },
  { label: "From Pune/ Chinchwad" },
  { label: "Self Profiles" },
  { label: "Verified" },
  { label: "Paid Profiles" },
];

const CATEGORIES = [
  {
    key: "smart",
    label: "Smart Filters",
    options: [
      { key: "online", label: "Online", count: 11 },
      { key: "viewed", label: "Viewed", count: 986 },
      { key: "active_today", label: "Active Today", count: 13 },
      { key: "nearby", label: "Nearby", count: 572 },
      { key: "verified", label: "Verified", count: 33 },
      { key: "paid", label: "Paid Profiles", count: 220 },
      { key: "just_joined", label: "Just Joined", count: 119 },
      { key: "self", label: "Self Profiles", count: 1478 },
      { key: "with_photos", label: "With Photos", count: 1575 },
    ],
  },
  { key: "family_based_out_of", label: "Family based out of", options: [] },
  { key: "profile_posted_by", label: "Profile posted by", options: [] },
  { key: "activity_on_site", label: "Activity on site", options: [] },
  { key: "religion", label: "Religion", options: [] },
  { key: "mother_tongue", label: "Mother Tongue", options: [] },
  { key: "caste_group", label: "Caste Group", options: [] },
  { key: "caste_subcaste", label: "Caste Subcaste", options: [] },
  { key: "country", label: "Country", options: [] },
  { key: "city", label: "City", options: [] },
  { key: "income", label: "Income", options: [] },
];

function RefineMatchesSheet({
  open,
  onClose,
  onShowMatches,
}: {
  open: boolean;
  onClose: () => void;
  onShowMatches: (selected: Record<string, string[]>) => void;
}) {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].key);
  const [selected, setSelected] = useState<Record<string, string[]>>({});

  const activeOptions =
    CATEGORIES.find((c) => c.key === activeCategory)?.options ?? [];
  const activeSelected = selected[activeCategory] ?? [];
  const isAllSelected = activeSelected.length === 0;

  const toggleOption = (optionKey: string) => {
    setSelected((prev) => {
      const current = prev[activeCategory] ?? [];
      const next = current.includes(optionKey)
        ? current.filter((k) => k !== optionKey)
        : [...current, optionKey];
      return { ...prev, [activeCategory]: next };
    });
  };

  const selectAll = () => {
    setSelected((prev) => ({ ...prev, [activeCategory]: [] }));
  };

  const handleReset = () => setSelected({});

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex w-full max-w-xl animate-[slideUp_0.25s_ease-out] flex-col rounded-t-3xl bg-white"
        style={{ maxHeight: "85vh" }}
      >
        <style>{`@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4">
          <h2 className="text-lg font-bold text-slate-900">Refine Matches</h2>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="rounded-full cursor-pointer border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-600 transition-all duration-200 hover:bg-rose-100 hover:border-rose-300"
            >
              Reset
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex h-10 cursor-pointer w-10 items-center justify-center rounded-full bg-rose-500 text-white shadow-sm transition-all duration-200 hover:bg-rose-600 hover:shadow-md"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Category list */}
          <div className="w-50 shrink-0 overflow-y-auto border-r border-stone-200 bg-stone-50">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`w-full border-b cursor-pointer border-stone-200 border-r-[3px] px-3.5 py-3 text-left text-[13px] font-semibold transition ${
                  activeCategory === cat.key
                    ? "border-r-rose-600 bg-white text-slate-900"
                    : "border-r-transparent text-stone-500 hover:bg-white hover:text-stone-700"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Options */}
          <div className="flex-1 overflow-y-auto px-4 py-3">
            {activeOptions.length === 0 ? (
              <p className="pt-8 text-center text-sm text-stone-400">
                No filters in this category yet
              </p>
            ) : (
              <div className="space-y-1">
                <label
                  onClick={selectAll}
                  className="flex cursor-pointer items-center gap-2.5 py-2"
                >
                  <span
                    className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded ${
                      isAllSelected
                        ? "bg-rose-600"
                        : "border-[1.5px] border-stone-300"
                    }`}
                  >
                    {isAllSelected && <CheckIcon />}
                  </span>

                  <span className="text-sm font-medium text-slate-900">
                    All
                  </span>
                </label>

                {activeOptions.map((opt) => {
                  const checked = activeSelected.includes(opt.key);

                  return (
                    <label
                      key={opt.key}
                      onClick={() => toggleOption(opt.key)}
                      className="flex cursor-pointer items-center justify-between rounded-lg px-1 py-2 transition hover:bg-stone-50"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded ${
                            checked
                              ? "bg-rose-600"
                              : "border-[1.5px] border-stone-300"
                          }`}
                        >
                          {checked && <CheckIcon />}
                        </span>

                        <span className="text-sm text-stone-600">
                          {opt.label}
                        </span>
                      </div>

                      <span className="text-xs text-stone-400">
                        ({opt.count})
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-stone-100 px-5 py-4">
          <ThemeBtnOne
            onClick={() => onShowMatches(selected)}
            text=" Show Matches"
            className="w-full cursor-pointer rounded-xl bg-rose-600 py-3.5 text-sm font-semibold text-white transition hover:bg-rose-700"
          />
        </div>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth={3}
    >
      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const TopFilters = () => {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
        {FILTERS.map(({ label, icon: Icon }) => (
          <button
            key={label}
            onClick={() => label === "Filters" && setSheetOpen(true)}
            className="flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-rose-300"
          >
            {Icon && <Icon size={15} />} {label}
          </button>
        ))}
      </div>

      <RefineMatchesSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onShowMatches={(selected) => {
          console.log("apply filters", selected);
          setSheetOpen(false);
        }}
      />
    </>
  );
};

export default TopFilters;

"use client";

import { useMemo, useState } from "react";
import {
  SlidersHorizontal,
  X,
  Loader2,
  Landmark,
  Languages,
  Globe2,
  Wallet2,
  GraduationCap,
  Briefcase,
  Ruler,
  Heart,
  Moon,
  type LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Country } from "country-state-city";
import ThemeBtnOne from "@/app/components/ThemeBtnOne";

import { useGetReligionsQuery } from "@/Redux/religionApi";
import { useGetMotherTonguesQuery } from "@/Redux/motherToungeApi";
import { useGetAnnualIncomesQuery } from "@/Redux/annualIncomeApi";
import { useGetQualificationsQuery } from "@/Redux/qualificationApi";
import { useGetOccupationsQuery } from "@/Redux/occupationApi";
import { useGetHeightsQuery } from "@/Redux/heightApi";

type BrowseCategoryKey =
  | "religion"
  | "motherTongue"
  | "country"
  | "annualIncome"
  | "education"
  | "occupation"
  | "height"
  | "maritalStatus"
  | "manglik";

type BrowseCategoryMeta = {
  key: BrowseCategoryKey;
  label: string;
  icon: LucideIcon;
};

const BROWSE_CATEGORY_META: BrowseCategoryMeta[] = [
  { key: "religion", label: "Religion", icon: Landmark },
  { key: "motherTongue", label: "Mother Tongue", icon: Languages },
  { key: "country", label: "Country", icon: Globe2 },
  { key: "annualIncome", label: "Annual Income", icon: Wallet2 },
  { key: "education", label: "Education", icon: GraduationCap },
  { key: "occupation", label: "Occupation", icon: Briefcase },
  { key: "height", label: "Height", icon: Ruler },
  { key: "maritalStatus", label: "Marital Status", icon: Heart },
  { key: "manglik", label: "Manglik", icon: Moon },
];

type BrowseItem = { id: string; label: string };

type CategoryData = {
  items: BrowseItem[];
  isLoading: boolean;
  isError: boolean;
};

// Same source used in BasicDetails.tsx / Register.tsx / Header.tsx.
const COUNTRY_OPTIONS: BrowseItem[] = Country.getAllCountries().map((c) => ({
  id: c.isoCode,
  label: c.name,
}));

// Same wording as Register.tsx's maritalOptions.
const MARITAL_STATUS_OPTIONS: BrowseItem[] = [
  { id: "Never Married", label: "Never Married" },
  { id: "Divorced", label: "Divorced" },
  { id: "Widowed", label: "Widowed" },
  { id: "Awaiting Divorce", label: "Awaiting Divorce" },
];

// Same wording as KundaliDetails.tsx's Manglik select.
const MANGLIK_OPTIONS: BrowseItem[] = [
  { id: "Manglik", label: "Manglik" },
  { id: "Non-Manglik", label: "Non-Manglik" },
  { id: "partial-Manglik", label: "Partial-Manglik" },
];

const createEmptyFilters = (): Record<BrowseCategoryKey, string[]> => ({
  religion: [],
  motherTongue: [],
  country: [],
  annualIncome: [],
  education: [],
  occupation: [],
  height: [],
  maritalStatus: [],
  manglik: [],
});

function RefineMatchesSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();

  const [activeCategory, setActiveCategory] = useState<BrowseCategoryKey>(
    BROWSE_CATEGORY_META[0].key,
  );
  const [selected, setSelected] =
    useState<Record<BrowseCategoryKey, string[]>>(createEmptyFilters);

  // Only hit the network while the sheet is actually open.
  const {
    data: religionData,
    isLoading: religionLoading,
    isError: religionErr,
  } = useGetReligionsQuery(undefined, { skip: !open });
  const {
    data: motherTongueData,
    isLoading: motherTongueLoading,
    isError: motherTongueErr,
  } = useGetMotherTonguesQuery(undefined, { skip: !open });
  const {
    data: annualIncomeData,
    isLoading: annualIncomeLoading,
    isError: annualIncomeErr,
  } = useGetAnnualIncomesQuery(undefined, { skip: !open });
  const {
    data: qualificationData,
    isLoading: qualificationLoading,
    isError: qualificationErr,
  } = useGetQualificationsQuery(undefined, { skip: !open });
  const {
    data: occupationData,
    isLoading: occupationLoading,
    isError: occupationErr,
  } = useGetOccupationsQuery(undefined, { skip: !open });
  const {
    data: heightData,
    isLoading: heightLoading,
    isError: heightErr,
  } = useGetHeightsQuery(undefined, { skip: !open });

  const categoryData: Record<BrowseCategoryKey, CategoryData> = useMemo(
    () => ({
      religion: {
        items: (religionData?.data ?? [])
          .filter((d) => !d.isDeleted)
          .map((d) => ({ id: d._id, label: d.religion })),
        isLoading: religionLoading,
        isError: religionErr,
      },
      motherTongue: {
        items: (motherTongueData?.data ?? [])
          .filter((d) => !d.isDeleted)
          .map((d) => ({ id: d._id, label: d.motherTongue })),
        isLoading: motherTongueLoading,
        isError: motherTongueErr,
      },
      country: {
        items: COUNTRY_OPTIONS,
        isLoading: false,
        isError: false,
      },
      annualIncome: {
        items: (annualIncomeData?.data ?? [])
          .filter((d) => !d.isDeleted)
          .map((d) => ({ id: d._id, label: d.annualIncome })),
        isLoading: annualIncomeLoading,
        isError: annualIncomeErr,
      },
      education: {
        items: (qualificationData?.data ?? [])
          .filter((d) => !d.isDeleted)
          .map((d) => ({ id: d._id, label: d.qualification })),
        isLoading: qualificationLoading,
        isError: qualificationErr,
      },
      occupation: {
        items: (occupationData?.data ?? [])
          .filter((d) => !d.isDeleted)
          .map((d) => ({ id: d._id, label: d.occupation })),
        isLoading: occupationLoading,
        isError: occupationErr,
      },
      height: {
        items: (heightData?.data ?? [])
          .filter((d) => !d.isDeleted)
          .map((d) => ({ id: d._id, label: d.height })),
        isLoading: heightLoading,
        isError: heightErr,
      },
      maritalStatus: {
        items: MARITAL_STATUS_OPTIONS,
        isLoading: false,
        isError: false,
      },
      manglik: {
        items: MANGLIK_OPTIONS,
        isLoading: false,
        isError: false,
      },
    }),
    [
      religionData,
      religionLoading,
      religionErr,
      motherTongueData,
      motherTongueLoading,
      motherTongueErr,
      annualIncomeData,
      annualIncomeLoading,
      annualIncomeErr,
      qualificationData,
      qualificationLoading,
      qualificationErr,
      occupationData,
      occupationLoading,
      occupationErr,
      heightData,
      heightLoading,
      heightErr,
    ],
  );

  const activeMeta =
    BROWSE_CATEGORY_META.find((c) => c.key === activeCategory) ??
    BROWSE_CATEGORY_META[0];
  const activeData = categoryData[activeMeta.key];

  const totalSelected = (Object.values(selected) as string[][]).reduce(
    (sum, arr) => sum + arr.length,
    0,
  );

  const toggleOption = (optionId: string) => {
    setSelected((prev) => {
      const current = prev[activeCategory] ?? [];
      const next = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId];
      return { ...prev, [activeCategory]: next };
    });
  };

  const handleReset = () => setSelected(createEmptyFilters());

  // Same query-param keys FILTER_PARAM_KEYS in ProfilesCards.tsx reads,
  // and the same target page Header's mega menu applies to — so this
  // sheet drives the exact same feed filtering as the home page filter.
  const handleShowMatches = () => {
    const params = new URLSearchParams();
    (Object.keys(selected) as BrowseCategoryKey[]).forEach((key) => {
      const values = selected[key];
      if (values.length > 0) params.set(key, values.join(","));
    });
    const query = params.toString();
    router.push(query ? `/my-matches/matches?${query}` : "/my-matches/matches");
    onClose();
  };

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
              disabled={totalSelected === 0}
              className="rounded-full cursor-pointer border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-600 transition-all duration-200 hover:bg-rose-100 hover:border-rose-300 disabled:cursor-not-allowed disabled:opacity-40"
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
            {BROWSE_CATEGORY_META.map((cat) => {
              const Icon = cat.icon;
              const count = selected[cat.key].length;
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setActiveCategory(cat.key)}
                  className={`flex w-full items-center gap-2.5 border-b cursor-pointer border-stone-200 border-r-[3px] px-3.5 py-3 text-left text-[13px] font-semibold transition ${
                    isActive
                      ? "border-r-rose-600 bg-white text-slate-900"
                      : "border-r-transparent text-stone-500 hover:bg-white hover:text-stone-700"
                  }`}
                >
                  <Icon size={15} className="shrink-0" />
                  <span className="flex-1">{cat.label}</span>
                  {count > 0 && (
                    <span className="rounded-full bg-rose-100 px-1.5 py-0.5 text-[10px] text-rose-600">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Options */}
          <div className="flex-1 overflow-y-auto px-4 py-3">
            {activeData.isLoading ? (
              <div className="flex items-center justify-center gap-2 py-10 text-sm text-stone-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading options...
              </div>
            ) : activeData.isError ? (
              <p className="pt-8 text-center text-sm text-rose-500">
                Unable to load options right now.
              </p>
            ) : activeData.items.length === 0 ? (
              <p className="pt-8 text-center text-sm text-stone-400">
                No options available.
              </p>
            ) : (
              <div className="space-y-1">
                {activeData.items.map((opt) => {
                  const checked = selected[activeCategory].includes(opt.id);
                  return (
                    <label
                      key={opt.id}
                      className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1 py-2 transition hover:bg-stone-50"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleOption(opt.id)}
                        className="h-4 w-4 shrink-0 rounded border-stone-300 text-rose-500 focus:ring-rose-300"
                      />
                      <span className="text-sm text-stone-600">
                        {opt.label}
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
            onClick={handleShowMatches}
            text={
              totalSelected > 0
                ? `Show Matches (${totalSelected})`
                : "Show Matches"
            }
            className="w-full cursor-pointer rounded-xl bg-rose-600 py-3.5 text-sm font-semibold text-white transition hover:bg-rose-700"
          />
        </div>
      </div>
    </div>
  );
}

const TopFilters = () => {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-rose-300"
        >
          <SlidersHorizontal size={15} /> Filters
        </button>
      </div>

      <RefineMatchesSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />
    </>
  );
};

export default TopFilters;

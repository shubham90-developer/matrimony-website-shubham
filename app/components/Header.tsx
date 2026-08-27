"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  Menu,
  X,
  ChevronRight,
  Search as SearchIcon,
  Languages,
  Landmark,
  Briefcase,
  Globe2,
  UserCircle,
  GraduationCap,
  Wallet2,
  Ruler,
  Heart,
  Moon,
  Loader2,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Country } from "country-state-city";
import ThemeBtnOne from "./ThemeBtnOne";
import Logo from "./Logo";

import { useGetReligionsQuery } from "@/Redux/religionApi";
import { useGetMotherTonguesQuery } from "@/Redux/motherToungeApi";
import { useGetAnnualIncomesQuery } from "@/Redux/annualIncomeApi";
import { useGetQualificationsQuery } from "@/Redux/qualificationApi";
import { useGetOccupationsQuery } from "@/Redux/occupationApi";
import { useGetHeightsQuery } from "@/Redux/heightApi";

// ---------- Browse categories ----------
// Labels/icons are UI-only. Options for religion, mother tongue, annual
// income, education, occupation and height come live from the existing
// Redux APIs. Country comes from the "country-state-city" package (same
// source used in BasicDetails/Register). Marital status and manglik are
// fixed enums — there's no admin lookup table for either anywhere in this
// project (see Register.tsx's maritalOptions and KundaliDetails.tsx's
// Manglik select), so the same fixed values are reused here for consistency.
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

// Same source used in BasicDetails.tsx / Register.tsx — computed once.
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

type SearchLink = {
  label: string;
  desc: string;
  url: string;
};

const SEARCH_LINKS: SearchLink[] = [
  {
    label: "Basic Search",
    desc: "Search by age, religion, city & more",
    url: "/basic-search",
  },
  {
    label: "Advanced Search",
    desc: "Refine with education, income & lifestyle",
    url: "/advanced-search",
  },
  {
    label: "Search by ID",
    desc: "Find a profile using their Jeevansathi ID",
    url: "/search-by-id",
  },
];

type DesktopMenu = "browse" | "search" | null;

const Header = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openMenu, setOpenMenu] = useState<DesktopMenu>(null);
  const [activeCategory, setActiveCategory] = useState<BrowseCategoryKey>(
    BROWSE_CATEGORY_META[0].key,
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileBrowseOpen, setMobileBrowseOpen] = useState(false);
  const [mobileActiveCategory, setMobileActiveCategory] =
    useState<BrowseCategoryKey | null>(null);

  const [selectedFilters, setSelectedFilters] =
    useState<Record<BrowseCategoryKey, string[]>>(createEmptyFilters);

  const navRef = useRef<HTMLDivElement>(null);

  const shouldFetchOptions = openMenu === "browse" || mobileBrowseOpen;

  const {
    data: religionData,
    isLoading: religionLoading,
    isError: religionErr,
  } = useGetReligionsQuery(undefined, { skip: !shouldFetchOptions });
  const {
    data: motherTongueData,
    isLoading: motherTongueLoading,
    isError: motherTongueErr,
  } = useGetMotherTonguesQuery(undefined, { skip: !shouldFetchOptions });
  const {
    data: annualIncomeData,
    isLoading: annualIncomeLoading,
    isError: annualIncomeErr,
  } = useGetAnnualIncomesQuery(undefined, { skip: !shouldFetchOptions });
  const {
    data: qualificationData,
    isLoading: qualificationLoading,
    isError: qualificationErr,
  } = useGetQualificationsQuery(undefined, { skip: !shouldFetchOptions });
  const {
    data: occupationData,
    isLoading: occupationLoading,
    isError: occupationErr,
  } = useGetOccupationsQuery(undefined, { skip: !shouldFetchOptions });
  const {
    data: heightData,
    isLoading: heightLoading,
    isError: heightErr,
  } = useGetHeightsQuery(undefined, { skip: !shouldFetchOptions });

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

  // Check login state on mount + keep in sync across tabs
  useEffect(() => {
    const checkToken = () => {
      setIsLoggedIn(!!localStorage.getItem("accessToken"));
    };
    checkToken();
    window.addEventListener("storage", checkToken);
    return () => window.removeEventListener("storage", checkToken);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close dropdown on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const toggleMenu = (menu: DesktopMenu) => {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  };

  const toggleItem = (categoryKey: BrowseCategoryKey, itemId: string) => {
    setSelectedFilters((prev) => {
      const current = prev[categoryKey];
      const next = current.includes(itemId)
        ? current.filter((id) => id !== itemId)
        : [...current, itemId];
      return { ...prev, [categoryKey]: next };
    });
  };

  const totalSelectedCount = useMemo(
    () =>
      (Object.values(selectedFilters) as string[][]).reduce(
        (sum, arr) => sum + arr.length,
        0,
      ),
    [selectedFilters],
  );

  const handleClearAll = () => {
    setSelectedFilters(createEmptyFilters());
  };

  const handleApply = () => {
    const params = new URLSearchParams();
    (Object.keys(selectedFilters) as BrowseCategoryKey[]).forEach((key) => {
      const values = selectedFilters[key];
      if (values.length > 0) {
        params.set(key, values.join(","));
      }
    });
    const query = params.toString();
    router.push(query ? `/my-matches/matches?${query}` : "/my-matches/matches");
    setOpenMenu(null);
    setMobileOpen(false);
    setMobileBrowseOpen(false);
  };

  const activeCategoryMeta =
    BROWSE_CATEGORY_META.find((c) => c.key === activeCategory) ??
    BROWSE_CATEGORY_META[0];
  const activeCategoryData = categoryData[activeCategoryMeta.key];

  const renderPanelState = (data: CategoryData) => {
    if (data.isLoading) {
      return (
        <div className="col-span-3 flex items-center justify-center gap-2 py-10 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading options...
        </div>
      );
    }
    if (data.isError) {
      return (
        <div className="col-span-3 py-10 text-center text-sm text-rose-500">
          Unable to load options right now.
        </div>
      );
    }
    if (data.items.length === 0) {
      return (
        <div className="col-span-3 py-10 text-center text-sm text-slate-400">
          No options available.
        </div>
      );
    }
    return null;
  };

  const FilterFooter = ({ className = "" }: { className?: string }) => (
    <div
      className={`flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-3 ${className}`}
    >
      <button
        type="button"
        onClick={handleClearAll}
        disabled={totalSelectedCount === 0}
        className="cursor-pointer text-[12px] font-semibold text-slate-500 transition-colors hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-slate-500"
      >
        Clear all
      </button>
      <div className="flex items-center gap-3">
        {totalSelectedCount > 0 && (
          <span className="text-[12px] text-slate-500">
            {totalSelectedCount} selected
          </span>
        )}
        <button
          type="button"
          onClick={handleApply}
          className="cursor-pointer rounded-full bg-rose-600 px-6 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-rose-700"
        >
          Apply
        </button>
      </div>
    </div>
  );

  return (
    <header className="relative z-50 w-full border-b border-rose-100 bg-white shadow-xs">
      <div className="mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:h-18 lg:px-8">
        {/* Logo */}
        <Logo />

        {/* Desktop nav */}
        <div ref={navRef} className="hidden items-center gap-1 lg:flex">
          {/* Browse Profiles By */}
          <div className="relative">
            <button
              onClick={() => toggleMenu("browse")}
              className={`flex items-center gap-1 rounded-md px-3 py-2 text-[15px] font-semibold transition-colors cursor-pointer font-serif tracking-wider ${
                openMenu === "browse"
                  ? "text-rose-600"
                  : "text-slate-800 hover:text-rose-600"
              }`}
              aria-expanded={openMenu === "browse"}
            >
              Browse Profiles By
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  openMenu === "browse" ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Mega menu */}
            {openMenu === "browse" && (
              <div className="absolute left-1/2 top-full mt-4 w-225 -translate-x-1/3 overflow-hidden  border border-slate-100 bg-white shadow-xs ring-1 ring-black/5">
                <div className="flex">
                  {/* Category tabs */}
                  <div className="w-55 shrink-0 border-r-2 border-dashed border-rose-200 bg-slate-50/60 py-3">
                    {BROWSE_CATEGORY_META.map((cat) => {
                      const Icon = cat.icon;
                      const isActive = activeCategory === cat.key;
                      const count = selectedFilters[cat.key].length;
                      return (
                        <button
                          key={cat.key}
                          onMouseEnter={() => setActiveCategory(cat.key)}
                          onFocus={() => setActiveCategory(cat.key)}
                          onClick={() => setActiveCategory(cat.key)}
                          className={`flex border-b border-dashed border-gray-200 w-full items-center gap-3 px-5 py-3 text-left text-[12px] font-bold cursor-pointer transition-colors ${
                            isActive
                              ? "hover:bg-rose-50 text-rose-600"
                              : "text-slate-800 hover:bg-white hover:text-rose-600"
                          }`}
                        >
                          <span
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                              isActive
                                ? "bg-rose-100 text-rose-600"
                                : "bg-white text-slate-500"
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className="flex-1">
                            {cat.label}
                            {count > 0 && (
                              <span className="ml-1.5 rounded-full bg-rose-100 px-1.5 py-0.5 text-[10px] text-rose-600">
                                {count}
                              </span>
                            )}
                          </span>
                          <ChevronRight className="h-4 w-4 shrink-0 opacity-60" />
                        </button>
                      );
                    })}
                  </div>

                  {/* Items panel */}
                  <div className="flex max-h-130 flex-1 flex-col overflow-y-auto">
                    <div className="flex flex-1">
                      {/* Item columns with dashed dividers */}
                      <div className="grid flex-1 grid-cols-3 divide-x divide-dashed divide-slate-200 p-6">
                        {renderPanelState(activeCategoryData) ??
                          [0, 1, 2].map((col) => (
                            <div
                              key={col}
                              className={`flex px-2 flex-col gap-4 ${col === 0 ? "pr-0" : "px-0"}`}
                            >
                              {activeCategoryData.items
                                .filter((_, i) => i % 3 === col)
                                .map((item) => (
                                  <label
                                    key={item.id}
                                    className="flex cursor-pointer items-center gap-2 border-b border-dashed border-slate-200 py-2"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={selectedFilters[
                                        activeCategoryMeta.key
                                      ].includes(item.id)}
                                      onChange={() =>
                                        toggleItem(
                                          activeCategoryMeta.key,
                                          item.id,
                                        )
                                      }
                                      className="h-3.5 w-3.5 shrink-0 rounded border-slate-300 text-rose-500 focus:ring-rose-300"
                                    />
                                    <span className="text-[12px] font-medium text-black transition-colors hover:text-rose-600">
                                      {item.label}
                                    </span>
                                  </label>
                                ))}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Clear / Apply */}
                <FilterFooter />
              </div>
            )}
          </div>

          {/* Search */}
          <div className="relative">
            <button
              onClick={() => toggleMenu("search")}
              className={`flex items-center gap-1 rounded-md px-3 py-2 text-[15px] font-semibold transition-colors cursor-pointer font-serif tracking-wider  ${
                openMenu === "search"
                  ? "text-rose-600"
                  : "text-black hover:text-rose-600"
              }`}
              aria-expanded={openMenu === "search"}
            >
              Search
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  openMenu === "search" ? "rotate-180" : ""
                }`}
              />
            </button>

            {openMenu === "search" && (
              <div className="absolute left-1/2 top-full mt-4 w-85 -translate-x-1/2 overflow-hidden  border border-slate-100 bg-white p-2  ring-1 ring-black/5">
                {SEARCH_LINKS.map((s) => (
                  <Link
                    key={s.label}
                    href={s.url}
                    className="flex items-start gap-3  px-3 py-3 transition-colors hover:bg-rose-50 border-b border-gray-300 border-dashed"
                  >
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                      <SearchIcon className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block text-[12px] font-bold text-black">
                        {s.label}
                      </span>
                      <span className="block text-[10px] text-slate-500">
                        {s.desc}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Help */}
          <Link
            href="/help"
            className="rounded-md px-3 py-2 text-[15px] font-semibold text-slate-800 transition-colors hover:text-rose-600 cursor-pointer font-serif  tracking-wider "
          >
            Help
          </Link>
        </div>

        {/* Right side actions (desktop) */}
        <div className="hidden items-center gap-5 lg:flex">
          {isLoggedIn ? (
            <Link
              href="/my-profile"
              aria-label="My Profile"
              className="flex items-center justify-center text-rose-600 hover:text-rose-700 transition-colors cursor-pointer"
            >
              <UserCircle className="h-8 w-8" />
            </Link>
          ) : (
            <Link
              href="/login"
              className="text-[15px] font-semibold text-rose-600 transition-colors hover:text-rose-700 cursor-pointer  font-serif tracking-wider"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile: Login/Profile + hamburger */}
        <div className="flex items-center gap-3 lg:hidden">
          {isLoggedIn ? (
            <Link
              href="/my-profile"
              aria-label="My Profile"
              className="flex items-center justify-center text-rose-600"
            >
              <UserCircle className="h-6 w-6" />
            </Link>
          ) : (
            <Link
              href="/login"
              className="text-sm font-semibold text-rose-600  font-serif tracking-wider cursor-pointer"
            >
              Login
            </Link>
          )}
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="rounded-md p-2 text-slate-800 hover:bg-slate-100"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-60 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          {/* Panel */}
          <div className="absolute right-0 top-0 flex h-full w-[85%] max-w-sm flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              {/* Logo */}
              <Logo />
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="p-2 text-white hover:bg-slate-100 bg-rose-500 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-2 py-3">
              {/* Browse Profiles By (accordion) */}
              <div className="border-b border-slate-100">
                <button
                  onClick={() => setMobileBrowseOpen((v) => !v)}
                  className="flex w-full items-center justify-between px-3 py-3.5 text-[15px] font-semibold text-slate-800  font-serif tracking-wider cursor-pointer"
                >
                  Browse Profiles By
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      mobileBrowseOpen ? "rotate-180 text-rose-600" : ""
                    }`}
                  />
                </button>

                {mobileBrowseOpen && (
                  <div className="pb-2">
                    {BROWSE_CATEGORY_META.map((cat) => {
                      const isOpen = mobileActiveCategory === cat.key;
                      const Icon = cat.icon;
                      const data = categoryData[cat.key];
                      const count = selectedFilters[cat.key].length;
                      return (
                        <div key={cat.key} className="px-3">
                          <button
                            onClick={() =>
                              setMobileActiveCategory(isOpen ? null : cat.key)
                            }
                            className="flex w-full  items-center gap-3 rounded-lg px-2 py-2.5 text-[12px] font-bold text-slate-700 border-b border-dashed border-gray-200"
                          >
                            <span
                              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                                isOpen
                                  ? "bg-rose-100 text-rose-600"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              <Icon className="h-3.5 w-3.5" />
                            </span>
                            <span className="flex-1 text-left">
                              {cat.label}
                              {count > 0 && (
                                <span className="ml-1.5 rounded-full bg-rose-100 px-1.5 py-0.5 text-[10px] text-rose-600">
                                  {count}
                                </span>
                              )}
                            </span>
                            <ChevronRight
                              className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                                isOpen
                                  ? "rotate-90 text-rose-600"
                                  : "opacity-50"
                              }`}
                            />
                          </button>
                          {isOpen && (
                            <div className="mb-2 ml-2 rounded-lg bg-slate-50 p-3">
                              {data.isLoading ? (
                                <div className="flex items-center gap-2 py-3 text-[12px] text-slate-500">
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  Loading options...
                                </div>
                              ) : data.isError ? (
                                <div className="py-3 text-[12px] text-rose-500">
                                  Unable to load options.
                                </div>
                              ) : data.items.length === 0 ? (
                                <div className="py-3 text-[12px] text-slate-400">
                                  No options available.
                                </div>
                              ) : (
                                <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                                  {data.items.map((item) => (
                                    <label
                                      key={item.id}
                                      className="flex cursor-pointer items-center gap-2 py-1 text-[12px] text-slate-600"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={selectedFilters[
                                          cat.key
                                        ].includes(item.id)}
                                        onChange={() =>
                                          toggleItem(cat.key, item.id)
                                        }
                                        className="h-3.5 w-3.5 shrink-0 rounded border-slate-300 text-rose-500 focus:ring-rose-300"
                                      />
                                      <span className="hover:text-rose-600">
                                        {item.label}
                                      </span>
                                    </label>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Clear / Apply */}
                    <FilterFooter className="mt-1 rounded-lg" />
                  </div>
                )}
              </div>

              {/* Search (flat list) */}
              <div className="border-b border-slate-100 px-3 py-3.5">
                <p className="mb-2 text-[15px] font-semibold text-slate-800  font-serif tracking-wider cursor-pointer">
                  Search
                </p>
                <div className="flex flex-col gap-2">
                  {SEARCH_LINKS.map((s) => (
                    <Link
                      key={s.label}
                      href={s.url}
                      className="text-[12px] text-slate-600 hover:text-rose-600 border-b border-dashed border-gray-200 py-2"
                    >
                      {s.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Help */}
              <Link
                href="/help"
                className="block px-3 py-3.5 text-[14px] font-semibold text-slate-800 font-serif tracking-wider cursor-pointer"
              >
                Help
              </Link>
            </div>

            {/* Sticky CTA */}
            <div className="border-t border-slate-100 p-4">
              {isLoggedIn ? (
                <Link
                  href="/my-profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 w-full rounded-full bg-rose-600 px-6 py-3 text-center text-[15px] font-semibold text-white shadow-sm transition-colors hover:bg-rose-700"
                >
                  <UserCircle className="h-5 w-5" />
                  My Profile
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full rounded-full bg-rose-600 px-6 py-3 text-center text-[15px] font-semibold text-white shadow-sm transition-colors hover:bg-rose-700"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

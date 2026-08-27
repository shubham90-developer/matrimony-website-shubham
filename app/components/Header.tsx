"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  Menu,
  X,
  ChevronRight,
  Search as SearchIcon,
  Languages,
  Users,
  Landmark,
  Building2,
  Briefcase,
  Map,
  Plane,
  UserCircle,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import ThemeBtnOne from "./ThemeBtnOne";
import Logo from "./Logo";

type BrowseCategory = {
  key: string;
  label: string;
  icon: LucideIcon;
  items: string[];
  url?: string;
};

const BROWSE_CATEGORIES: BrowseCategory[] = [
  {
    key: "mother-tongue",
    label: "Mother Tongue",
    icon: Languages,
    items: [
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
  },
  {
    key: "caste",
    label: "Caste",
    icon: Users,
    items: [
      "Brahmin",
      "Rajput",
      "Yadav",
      "Kayastha",
      "Kurmi",
      "Jat",
      "Maratha",
      "Reddy",
      "Nair",
      "Naidu",
      "Vishwakarma",
      "Kamma",
      "Agarwal",
      "Jaiswal",
      "Kshatriya",
      "Iyer",
    ],
  },
  {
    key: "religion",
    label: "Religion",
    icon: Landmark,
    items: [
      "Hindu",
      "Muslim",
      "Sikh",
      "Christian",
      "Jain",
      "Buddhist",
      "Parsi",
      "Inter-Religion",
    ],
  },
  {
    key: "city",
    label: "City",
    icon: Building2,
    items: [
      "Delhi",
      "Mumbai",
      "Bangalore",
      "Pune",
      "Hyderabad",
      "Chennai",
      "Kolkata",
      "Ahmedabad",
      "Jaipur",
      "Lucknow",
      "Chandigarh",
      "Surat",
    ],
  },
  {
    key: "occupation",
    label: "Occupation",
    icon: Briefcase,
    items: [
      "Doctor",
      "Engineer",
      "CA / CS",
      "Govt. Employee",
      "Lawyer",
      "Business",
      "Teacher / Professor",
      "Banking / Finance",
      "IT Professional",
      "Defence",
      "Architect",
      "Scientist",
    ],
  },
  {
    key: "state",
    label: "State",
    icon: Map,
    items: [
      "Uttar Pradesh",
      "Maharashtra",
      "Bihar",
      "West Bengal",
      "Rajasthan",
      "Gujarat",
      "Punjab",
      "Karnataka",
      "Tamil Nadu",
      "Kerala",
      "Haryana",
      "Madhya Pradesh",
    ],
  },
  {
    key: "nri",
    label: "NRI",
    icon: Plane,
    items: [
      "USA",
      "UK",
      "Canada",
      "Australia",
      "UAE",
      "Singapore",
      "New Zealand",
      "Germany",
    ],
  },
  {
    key: "college",
    label: "College",
    icon: GraduationCap,
    items: [
      "IIT",
      "IIM",
      "NIT",
      "AIIMS",
      "Delhi University",
      "BITS Pilani",
      "Anna University",
      "Other",
    ],
  },
];

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openMenu, setOpenMenu] = useState<DesktopMenu>(null);
  const [activeCategory, setActiveCategory] = useState<string>(
    BROWSE_CATEGORIES[0].key,
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileBrowseOpen, setMobileBrowseOpen] = useState(false);
  const [mobileActiveCategory, setMobileActiveCategory] = useState<
    string | null
  >(null);

  const navRef = useRef<HTMLDivElement>(null);

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

  const activeCategoryData =
    BROWSE_CATEGORIES.find((c) => c.key === activeCategory) ??
    BROWSE_CATEGORIES[0];

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
                    {BROWSE_CATEGORIES.map((cat) => {
                      const Icon = cat.icon;
                      const isActive = activeCategory === cat.key;
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
                          <span className="flex-1">{cat.label}</span>
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
                        {[0, 1, 2].map((col) => (
                          <div
                            key={col}
                            className={`flex px-2 flex-col gap-4 ${col === 0 ? "pr-0" : "px-0"}`}
                          >
                            {activeCategoryData.items
                              .filter((_, i) => i % 3 === col)
                              .map((item) => (
                                <Link
                                  key={item}
                                  href="/my-matches/matches"
                                  className="text-[12px] font-medium text-black transition-colors hover:text-rose-600  border-b border-dashed border-slate-200 py-2"
                                >
                                  {item}
                                </Link>
                              ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
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
                    {BROWSE_CATEGORIES.map((cat) => {
                      const isOpen = mobileActiveCategory === cat.key;
                      const Icon = cat.icon;
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
                            <div className="mb-2 ml-2 grid grid-cols-2 gap-x-3 gap-y-2 rounded-lg bg-slate-50 p-3">
                              {cat.items.map((item) => (
                                <Link
                                  key={item}
                                  href="/my-matches/matches"
                                  className="text-[12px] text-slate-600 hover:text-rose-600 py-2"
                                >
                                  {item}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
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

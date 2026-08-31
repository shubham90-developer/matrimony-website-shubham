"use client";

import { useMemo, useState } from "react";
import { Loader2, SearchIcon, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  useGetMyProfileQuery,
  useGetProfileFeedQuery,
  type Profile as ApiProfile,
} from "@/Redux/profileApi";

const FALLBACK_IMAGE = "/img/profile/1.jpg";

interface SearchResult {
  id: string; // matrimonyId (falls back to _id) — used for the details link
  userId: string;
  name: string;
  age: number;
  city: string;
  community: string;
  image: string;
}

const toSearchResult = (p: ApiProfile): SearchResult => {
  const community = [p.religionDetails?.caste, p.religionDetails?.subCaste]
    .filter(Boolean)
    .join("-");

  return {
    id: p.matrimonyId || p._id,
    userId: p._id,
    name: `${p.basicDetails?.firstName ?? ""} ${p.basicDetails?.lastName ?? ""}`.trim(),
    age: p.basicDetails?.age ?? 0,
    city: p.locationDetails?.city ?? "",
    community,
    image: p.photos?.[0] || FALLBACK_IMAGE,
  };
};

const SearchComponents = () => {
  const [query, setQuery] = useState("");

  // Same feed used on My Matches — RTK Query caches by args, so this
  // reuses the network response if it's already been fetched elsewhere.
  const { data: myProfileData, isLoading: myProfileLoading } =
    useGetMyProfileQuery();

  const myGender = myProfileData?.data?.basicDetails?.gender;
  const oppositeGender =
    myGender === "Male" ? "Female" : myGender === "Female" ? "Male" : undefined;

  const {
    data: feedData,
    isLoading: feedLoading,
    isError: feedError,
  } = useGetProfileFeedQuery(
    oppositeGender ? { gender: oppositeGender } : undefined,
    { skip: !oppositeGender },
  );

  const allResults = useMemo(
    () => (feedData?.data ?? []).map(toSearchResult),
    [feedData],
  );

  const trimmedQuery = query.trim().toLowerCase();

  const matches = useMemo(() => {
    if (!trimmedQuery) return [];
    return allResults.filter((p) =>
      [p.name, p.id, p.city, p.community].some((field) =>
        field.toLowerCase().includes(trimmedQuery),
      ),
    );
  }, [allResults, trimmedQuery]);

  const isLoading = myProfileLoading || feedLoading;
  const hasQuery = trimmedQuery.length > 0;

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-8">
      <div className="text-center">
        <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
          <SearchIcon size={20} />
        </span>
        <h3 className="text-base font-bold text-slate-900 font-serif">
          Find your match
        </h3>
        <p className="mt-1 text-sm text-stone-500">
          Search profiles by name, community, city, or profile ID.
        </p>

        <div className="mx-auto mt-5 flex max-w-md items-center gap-2 rounded-full border border-stone-300 px-4 py-2.5 focus-within:border-rose-300">
          <SearchIcon size={16} className="shrink-0 text-stone-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or ID..."
            className="w-full text-sm outline-none placeholder:text-stone-400"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-600"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {hasQuery && (
        <div className="mx-auto mt-6 max-w-md text-left">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-8 text-sm text-stone-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Searching...
            </div>
          ) : feedError ? (
            <p className="py-8 text-center text-sm text-rose-500">
              Unable to load profiles right now. Please try again.
            </p>
          ) : matches.length === 0 ? (
            <p className="py-8 text-center text-sm text-stone-400">
              No profiles found for &quot;{query.trim()}&quot;.
            </p>
          ) : (
            <ul className="divide-y divide-stone-100 rounded-xl border border-stone-100">
              {matches.map((p) => (
                <li key={p.userId}>
                  <Link
                    href={`/my-matches/details?id=${encodeURIComponent(p.userId)}`}
                    className="flex items-center gap-3 px-3 py-2.5 transition hover:bg-stone-50"
                  >
                    <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-stone-100">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        sizes="44px"
                        className="object-cover"
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-slate-900">
                        {p.name}
                        {p.age > 0 ? `, ${p.age}` : ""}
                      </span>
                      <span className="block truncate text-xs text-stone-500">
                        {[p.city, p.community].filter(Boolean).join(" • ") ||
                          p.id}
                      </span>
                    </span>
                    <span className="shrink-0 text-[11px] font-medium text-stone-400">
                      {p.id}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchComponents;

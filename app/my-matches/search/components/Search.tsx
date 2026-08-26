import { SearchIcon } from "lucide-react";
import React from "react";

const SearchComponents = () => {
  return (
    <>
      <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center">
        <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
          <SearchIcon size={20} />
        </span>
        <h3 className="text-base font-bold text-slate-900 font-serif">
          Find your match
        </h3>
        <p className="mt-1 text-sm text-stone-500">
          Search profiles by name, community, city, or profile ID.
        </p>
        <div className="mx-auto mt-5 flex max-w-md items-center gap-2 rounded-full border border-stone-300 px-4 py-2.5">
          <SearchIcon size={16} className="text-stone-400" />
          <input
            type="text"
            placeholder="Search by name or ID..."
            className="w-full text-sm outline-none placeholder:text-stone-400"
          />
        </div>
      </div>
    </>
  );
};

export default SearchComponents;

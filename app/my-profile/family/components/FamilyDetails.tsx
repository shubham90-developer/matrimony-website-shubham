import ThemeBtnOne from "@/app/components/ThemeBtnOne";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

const FamilyDetails = () => {
  return (
    <>
      <div className="rounded-xl border border-gray-200 p-4">
        <div className="relative mb-4 flex items-center justify-center border-b border-dashed border-gray-200 py-3">
          <Link
            href="/my-profile"
            className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:bg-slate-100"
            aria-label="Go back"
          >
            <ChevronLeft size={20} />
          </Link>
          <h3 className="font-serif text-xl font-semibold text-slate-900">
            Family Details
          </h3>
        </div>
        <div>
          <div className="space-y-4 mb-10 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-md font-bold text-slate-900  mb-1.5">
                Family Class
              </label>
              <select
                name=""
                id=""
                className="form-select w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-rose-300 transition"
              >
                <option>Select</option>
                <option>Middle Class</option>
                <option>Upper Middle Class</option>
                <option>Rich </option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-md font-bold text-slate-900">
                How Many Brothers Do You Have
              </label>

              <select
                name="height"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-rose-300"
                defaultValue=""
              >
                <option value="" disabled>
                  Select
                </option>

                <option value="1">1</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-md font-bold text-slate-900">
                How Many of them Are married
              </label>

              <select
                name="height"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-rose-300"
                defaultValue=""
              >
                <option value="" disabled>
                  Select
                </option>

                <option value="1">1</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-md font-bold text-slate-900">
                How Many Sister Do You Have
              </label>

              <select
                name="height"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-rose-300"
                defaultValue=""
              >
                <option value="" disabled>
                  Select
                </option>

                <option value="1">1</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-md font-bold text-slate-900">
                How Many of them Are married
              </label>

              <select
                name="height"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-rose-300"
                defaultValue=""
              >
                <option value="" disabled>
                  Select
                </option>

                <option value="1">1</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-md font-bold text-slate-900">
                Are you currently living with family ?
              </label>

              <select
                name="height"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-rose-300"
                defaultValue=""
              >
                <option value="" disabled>
                  Select
                </option>

                <option value="yes">Yes</option>
                <option value="no">no</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-md font-bold text-slate-900">
                where is your Family Located ?
              </label>

              <input
                type="text"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-rose-300"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <ThemeBtnOne
              text="Update"
              className="mt-4 bg-rose-500 text-white px-3 py-2 font-serif rounded-full cursor-pointer"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default FamilyDetails;

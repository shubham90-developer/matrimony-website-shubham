import ThemeBtnOne from "@/app/components/ThemeBtnOne";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

const BasicDetails = () => {
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
            Basic Details
          </h3>
        </div>
        <div>
          <div className="space-y-4 mb-10 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-md font-bold text-slate-900  mb-1.5">
                First Name
              </label>
              <input
                placeholder="Enter your first name"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-rose-300 transition"
              />
            </div>
            <div>
              <label className="block text-md font-bold text-slate-900  mb-1.5">
                Last Name
              </label>
              <input
                placeholder="Enter your last name"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-rose-300 transition"
              />
            </div>

            <div>
              <label className="block text-md font-bold text-slate-900  mb-1.5">
                Gender
              </label>
              <select
                name=""
                id=""
                className="form-select w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-rose-300 transition"
              >
                <option>Select</option>
                <option value="male">Male</option>
                <option value="female">FeMale</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-md font-bold text-slate-900  mb-1.5">
                Date Of Birth
              </label>
              <input
                type="date"
                placeholder="Enter your last name"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-rose-300 transition"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-md font-bold text-slate-900">
                Height
              </label>

              <select
                name="height"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-rose-300"
                defaultValue=""
              >
                <option value="" disabled>
                  Select Height
                </option>

                <option value="4ft 6in">4.6&quot; (137 cm)</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-md font-bold text-slate-900">
                Religion
              </label>

              <select
                name="height"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-rose-300"
                defaultValue=""
              >
                <option value="" disabled>
                  Select
                </option>

                <option value="hindu">Hindu</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-md font-bold text-slate-900">
                Caste
              </label>

              <select
                name="height"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-rose-300"
                defaultValue=""
              >
                <option value="" disabled>
                  Select
                </option>

                <option value="hindu">Hindu</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-md font-bold text-slate-900">
                Sub Caste
              </label>

              <select
                name="height"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-rose-300"
                defaultValue=""
              >
                <option value="" disabled>
                  Select
                </option>

                <option value="hindu">Hindu</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-md font-bold text-slate-900">
                Mother Tongue
              </label>

              <select
                name="height"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-rose-300"
                defaultValue=""
              >
                <option value="" disabled>
                  Select
                </option>

                <option value="Marathi">Marathi</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-md font-bold text-slate-900">
                Your Residing Country
              </label>

              <select
                name="height"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-rose-300"
                defaultValue=""
              >
                <option value="" disabled>
                  Select
                </option>

                <option value="India">India</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-md font-bold text-slate-900">
                Your Residing State
              </label>

              <select
                name="height"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-rose-300"
                defaultValue=""
              >
                <option value="" disabled>
                  Select
                </option>

                <option value="Maharastra">Maharastra</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-md font-bold text-slate-900">
                Your Residing City
              </label>

              <select
                name="height"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-rose-300"
                defaultValue=""
              >
                <option value="" disabled>
                  Select
                </option>

                <option value="Pune">Pune</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-md font-bold text-slate-900">
                Marital Status
              </label>

              <select
                name="height"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-rose-300"
                defaultValue=""
              >
                <option value="" disabled>
                  Select
                </option>

                <option value="Never Married">Never Married</option>
                <option value=" Married"> Married</option>
                <option value=" Divorced"> Divorced</option>
                <option value=" Widowed"> Widowed</option>
              </select>
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

export default BasicDetails;

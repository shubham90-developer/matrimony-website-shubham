"use client";

import ThemeBtnOne from "@/app/components/ThemeBtnOne";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  useGetMyProfileQuery,
  useUpdateProfileMutation,
} from "@/Redux/profileApi";

const FamilyDetails = () => {
  const router = useRouter();
  const { data, isLoading, isError } = useGetMyProfileQuery();
  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();

  // ---------- form state (mapped to the `family` section) ----------
  const [familyStatus, setFamilyStatus] = useState(""); // "Family Class"
  const [brothers, setBrothers] = useState("");
  const [sisters, setSisters] = useState("");
  const [livingWithParents, setLivingWithParents] = useState(""); // "yes" | "no"
  const [familyBasedOutOf, setFamilyBasedOutOf] = useState(""); // "Family Location"

  // NOTE: `family` has no marriedBrothers/marriedSisters fields on the
  // backend today, so these two stay local-only until those fields are
  // added there — same treatment as the "About my career" field earlier.
  const [marriedBrothers, setMarriedBrothers] = useState("");
  const [marriedSisters, setMarriedSisters] = useState("");

  // ---------- pre-fill once profile loads ----------
  useEffect(() => {
    if (!data?.data) return;
    const p = data.data;

    setFamilyStatus(p.family?.familyStatus || "");
    setBrothers(p.family?.brothers || "");
    setSisters(p.family?.sisters || "");
    setLivingWithParents(p.family?.livingWithParents ? "yes" : "no");
    setFamilyBasedOutOf(p.family?.familyBasedOutOf || "");
  }, [data]);

  const handleUpdate = async () => {
    if (!data?.data) return;
    const existing = data.data;

    try {
      await updateProfile({
        family: {
          ...(existing.family || {}),
          familyStatus,
          brothers,
          sisters,
          livingWithParents: livingWithParents === "yes",
          familyBasedOutOf,
        },
      }).unwrap();
      toast.success("Profile updated successfully");
      router.push("/my-profile");
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-sm text-slate-500">Loading...</div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-sm text-rose-500">
        Could not load profile.
      </div>
    );
  }

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
                name="familyStatus"
                value={familyStatus}
                onChange={(e) => setFamilyStatus(e.target.value)}
                className="form-select w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-rose-300 transition"
              >
                <option value="">Select</option>
                <option value="Middle Class">Middle Class</option>
                <option value="Upper Middle Class">Upper Middle Class</option>
                <option value="Rich">Rich</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-md font-bold text-slate-900">
                How Many Brothers Do You Have
              </label>

              <select
                name="brothers"
                value={brothers}
                onChange={(e) => setBrothers(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-rose-300"
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
                name="marriedBrothers"
                value={marriedBrothers}
                onChange={(e) => setMarriedBrothers(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-rose-300"
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
                name="sisters"
                value={sisters}
                onChange={(e) => setSisters(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-rose-300"
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
                name="marriedSisters"
                value={marriedSisters}
                onChange={(e) => setMarriedSisters(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-rose-300"
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
                name="livingWithParents"
                value={livingWithParents}
                onChange={(e) => setLivingWithParents(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-rose-300"
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
                value={familyBasedOutOf}
                onChange={(e) => setFamilyBasedOutOf(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-rose-300"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <ThemeBtnOne
              text={isSaving ? "Updating..." : "Update"}
              disabled={isSaving}
              onClick={handleUpdate}
              className="mt-4 bg-rose-500 text-white px-3 py-2 font-serif rounded-full cursor-pointer"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default FamilyDetails;

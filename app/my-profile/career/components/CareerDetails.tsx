"use client";

import ThemeBtnOne from "@/app/components/ThemeBtnOne";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  useGetMyProfileQuery,
  useUpdateProfileMutation,
} from "@/Redux/profileApi";
import { useGetOccupationsQuery } from "@/Redux/occupationApi";

const CareerDetails = () => {
  const router = useRouter();
  const { data, isLoading, isError } = useGetMyProfileQuery();
  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();

  // ---------- master data ----------
  // NOTE: there's no dedicated "employed in" master API in Redux/, so that
  // dropdown keeps its static options below (same as before), just wired
  // to state instead of being uncontrolled.
  const { data: occupationRes } = useGetOccupationsQuery();

  // ---------- form state ----------
  const [employedIn, setEmployedIn] = useState("");
  const [occupationId, setOccupationId] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [settledAbroad, setSettledAbroad] = useState(""); // "yes" | "no"

  // CareerDetails in profileApi.ts has no "aboutCareer" field, so this
  // textarea is kept as local-only state — nothing to save it to yet.
  // Add a field to the CareerDetails interface/backend if you want this
  // persisted, and it can be wired the same way as the rest.
  const [aboutCareer, setAboutCareer] = useState("");

  // ---------- pre-fill once profile + occupation list are loaded ----------
  useEffect(() => {
    if (!data?.data) return;
    const p = data.data;

    setEmployedIn(p.careerDetails.employedIn || "");
    setOrganizationName(p.careerDetails.organizationName || "");
    setSettledAbroad(p.careerDetails.interestedInSettlingAbroad ? "yes" : "no");

    if (occupationRes?.data) {
      const match = occupationRes.data.find(
        (o) => o.occupation === p.careerDetails.occupation,
      );
      if (match) setOccupationId(match._id);
    }
  }, [data, occupationRes]);

  const selectedOccupationName = useMemo(
    () =>
      occupationRes?.data.find((o) => o._id === occupationId)?.occupation || "",
    [occupationRes, occupationId],
  );

  const handleUpdate = async () => {
    if (!data?.data) return;
    const existing = data.data;

    try {
      await updateProfile({
        careerDetails: {
          ...existing.careerDetails,
          employedIn,
          occupation:
            selectedOccupationName || existing.careerDetails.occupation,
          organizationName,
          interestedInSettlingAbroad: settledAbroad === "yes",
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
            Careers Details
          </h3>
        </div>
        <div>
          <div className="space-y-4 mb-10 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-md font-bold text-slate-900  mb-1.5">
                Employeed In
              </label>
              <input
                type="text"
                value={employedIn}
                onChange={(e) => setEmployedIn(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-rose-300 transition"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-md font-bold text-slate-900">
                Occupation
              </label>

              <select
                name="occupation"
                value={occupationId}
                onChange={(e) => setOccupationId(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-rose-300"
              >
                <option value="" disabled>
                  Select
                </option>
                {occupationRes?.data.map((o) => (
                  <option key={o._id} value={o._id}>
                    {o.occupation}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-md font-bold text-slate-900">
                Organization Name
              </label>

              <input
                type="text"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-rose-300 transition"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-md font-bold text-slate-900">
                Intrested In Settled Abroad
              </label>

              <select
                name="interestedInSettlingAbroad"
                value={settledAbroad}
                onChange={(e) => setSettledAbroad(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-rose-300"
              >
                <option value="" disabled>
                  Select
                </option>

                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            {/* <div>
              <label className="mb-1.5 block text-md font-bold text-slate-900">
                About my career
              </label>

              <textarea
                rows={2}
                value={aboutCareer}
                onChange={(e) => setAboutCareer(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-rose-300 transition"
              ></textarea>
            </div> */}
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

export default CareerDetails;

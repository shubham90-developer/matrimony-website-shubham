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
import { useGetQualificationsQuery } from "@/Redux/qualificationApi";
import { useGetOccupationsQuery } from "@/Redux/occupationApi";
import { useGetAnnualIncomesQuery } from "@/Redux/annualIncomeApi";

const EducationDetails = () => {
  const router = useRouter();
  const { data, isLoading, isError } = useGetMyProfileQuery();
  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();

  // ---------- master data ----------
  const { data: qualificationRes } = useGetQualificationsQuery();
  const { data: occupationRes } = useGetOccupationsQuery();
  const { data: annualIncomeRes } = useGetAnnualIncomesQuery();

  // ---------- form state (store selected _id, resolve name on save) ----------
  const [qualificationId, setQualificationId] = useState("");
  const [ugDegreeId, setUgDegreeId] = useState("");
  const [occupationId, setOccupationId] = useState("");
  const [annualIncomeId, setAnnualIncomeId] = useState("");

  // ---------- pre-fill once profile + master lists are loaded ----------
  useEffect(() => {
    if (!data?.data) return;
    const p = data.data;

    if (qualificationRes?.data) {
      const match = qualificationRes.data.find(
        (q) => q.qualification === p.educationDetails.highestQualification,
      );
      if (match) setQualificationId(match._id);

      const ugMatch = qualificationRes.data.find(
        (q) => q.qualification === p.educationDetails.educationType,
      );
      if (ugMatch) setUgDegreeId(ugMatch._id);
    }

    if (occupationRes?.data) {
      const match = occupationRes.data.find(
        (o) => o.occupation === p.educationDetails.occupation,
      );
      if (match) setOccupationId(match._id);
    }

    if (annualIncomeRes?.data) {
      const match = annualIncomeRes.data.find(
        (a) => a.annualIncome === p.educationDetails.annualIncome,
      );
      if (match) setAnnualIncomeId(match._id);
    }
  }, [data, qualificationRes, occupationRes, annualIncomeRes]);

  // ---------- resolve selected _id back to display name for saving ----------
  const selectedQualificationName = useMemo(
    () =>
      qualificationRes?.data.find((q) => q._id === qualificationId)
        ?.qualification || "",
    [qualificationRes, qualificationId],
  );
  const selectedUgDegreeName = useMemo(
    () =>
      qualificationRes?.data.find((q) => q._id === ugDegreeId)?.qualification ||
      "",
    [qualificationRes, ugDegreeId],
  );
  const selectedOccupationName = useMemo(
    () =>
      occupationRes?.data.find((o) => o._id === occupationId)?.occupation || "",
    [occupationRes, occupationId],
  );
  const selectedAnnualIncomeName = useMemo(
    () =>
      annualIncomeRes?.data.find((a) => a._id === annualIncomeId)
        ?.annualIncome || "",
    [annualIncomeRes, annualIncomeId],
  );

  const handleUpdate = async () => {
    if (!data?.data) return;
    const existing = data.data;

    try {
      await updateProfile({
        educationDetails: {
          ...existing.educationDetails,
          highestQualification:
            selectedQualificationName ||
            existing.educationDetails.highestQualification,
          educationType:
            selectedUgDegreeName || existing.educationDetails.educationType,
          occupation:
            selectedOccupationName || existing.educationDetails.occupation,
          annualIncome:
            selectedAnnualIncomeName || existing.educationDetails.annualIncome,
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
            Education Details
          </h3>
        </div>
        <div>
          <div className="space-y-4 mb-10 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-md font-bold text-slate-900  mb-1.5">
                Highest Education
              </label>
              <select
                name="highestQualification"
                value={qualificationId}
                onChange={(e) => setQualificationId(e.target.value)}
                className="form-select w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-rose-300 transition"
              >
                <option value="">Select</option>
                {qualificationRes?.data.map((q) => (
                  <option key={q._id} value={q._id}>
                    {q.qualification}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-md font-bold text-slate-900">
                UG Degree
              </label>

              <select
                name="educationType"
                value={ugDegreeId}
                onChange={(e) => setUgDegreeId(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-rose-300"
              >
                <option value="" disabled>
                  Select
                </option>
                {qualificationRes?.data.map((q) => (
                  <option key={q._id} value={q._id}>
                    {q.qualification}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-md font-bold text-slate-900">
                Select Occupation
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
                Select Your Annual Income
              </label>

              <select
                name="annualIncome"
                value={annualIncomeId}
                onChange={(e) => setAnnualIncomeId(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-rose-300"
              >
                <option value="" disabled>
                  Select
                </option>
                {annualIncomeRes?.data.map((a) => (
                  <option key={a._id} value={a._id}>
                    {a.annualIncome}
                  </option>
                ))}
              </select>
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

export default EducationDetails;

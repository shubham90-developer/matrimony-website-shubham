"use client";

import ThemeBtnOne from "@/app/components/ThemeBtnOne";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Country, State, City } from "country-state-city";
import {
  useGetMyProfileQuery,
  useUpdateProfileMutation,
} from "@/Redux/profileApi";
import { useGetReligionsQuery } from "@/Redux/religionApi";
import { useGetCastesByReligionQuery } from "@/Redux/casteApi";
import { useGetSubCastesByCasteQuery } from "@/Redux/subCasteApi";
import { useGetMotherTonguesQuery } from "@/Redux/motherToungeApi";
import { useGetHeightsQuery } from "@/Redux/heightApi";

const BasicDetails = () => {
  const router = useRouter();
  const { data, isLoading, isError } = useGetMyProfileQuery();
  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();

  // ---------- form state ----------
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [height, setHeight] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");

  const [religionId, setReligionId] = useState("");
  const [casteId, setCasteId] = useState("");
  const [subCasteId, setSubCasteId] = useState("");
  const [motherTongue, setMotherTongue] = useState("");

  const [countryIso, setCountryIso] = useState("");
  const [stateIso, setStateIso] = useState("");
  const [city, setCity] = useState("");

  // ---------- dropdown data ----------
  const { data: religionRes } = useGetReligionsQuery();
  const { data: casteRes } = useGetCastesByReligionQuery(religionId, {
    skip: !religionId,
  });
  const { data: subCasteRes } = useGetSubCastesByCasteQuery(casteId, {
    skip: !casteId,
  });
  const { data: motherTongueRes } = useGetMotherTonguesQuery();
  const { data: heightRes } = useGetHeightsQuery();

  const countryList = Country.getAllCountries();
  const stateList = countryIso ? State.getStatesOfCountry(countryIso) : [];
  const cityList =
    countryIso && stateIso ? City.getCitiesOfState(countryIso, stateIso) : [];

  // ---------- pre-fill once profile loads ----------
  useEffect(() => {
    if (!data?.data) return;
    const p = data.data;

    setFirstName(p.basicDetails.firstName || "");
    setLastName(p.basicDetails.lastName || "");
    setGender(p.basicDetails.gender || "");
    setDob(p.basicDetails.dob ? p.basicDetails.dob.slice(0, 10) : "");
    setHeight(p.basicDetails.height || "");
    setMaritalStatus(p.basicDetails.maritalStatus || "");
    setMotherTongue(p.religionDetails.motherTongue || "");

    // Resolve saved country/state names back to ISO codes for the cascading
    // dropdowns (country-state-city needs isoCode, not the display name).
    const matchedCountry = countryList.find(
      (c) => c.name === p.locationDetails.country,
    );
    if (matchedCountry) {
      setCountryIso(matchedCountry.isoCode);
      const matchedState = State.getStatesOfCountry(
        matchedCountry.isoCode,
      ).find((s) => s.name === p.locationDetails.state);
      if (matchedState) setStateIso(matchedState.isoCode);
    }
    setCity(p.locationDetails.city || "");

    // Religion/caste/sub-caste are stored as plain text on the profile but
    // the dropdowns need the matching _id — resolve once the lists load.
    if (religionRes?.data) {
      const match = religionRes.data.find(
        (r) => r.religion === p.religionDetails.religion,
      );
      if (match) setReligionId(match._id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // Resolve caste _id once castes-by-religion load
  useEffect(() => {
    if (casteRes?.data && data?.data) {
      const match = casteRes.data.find(
        (c) => c.caste === data.data.religionDetails.caste,
      );
      if (match) setCasteId(match._id);
    }
  }, [casteRes, data]);

  // Resolve sub-caste _id once sub-castes-by-caste load
  useEffect(() => {
    if (subCasteRes?.data && data?.data) {
      const match = subCasteRes.data.find(
        (s) => s.subCaste === data.data.religionDetails.subCaste,
      );
      if (match) setSubCasteId(match._id);
    }
  }, [subCasteRes, data]);

  const selectedReligionName = useMemo(
    () => religionRes?.data.find((r) => r._id === religionId)?.religion || "",
    [religionRes, religionId],
  );
  const selectedCasteName = useMemo(
    () => casteRes?.data.find((c) => c._id === casteId)?.caste || "",
    [casteRes, casteId],
  );
  const selectedSubCasteName = useMemo(
    () => subCasteRes?.data.find((s) => s._id === subCasteId)?.subCaste || "",
    [subCasteRes, subCasteId],
  );
  const selectedCountryName = useMemo(
    () => countryList.find((c) => c.isoCode === countryIso)?.name || "",
    [countryList, countryIso],
  );
  const selectedStateName = useMemo(
    () => stateList.find((s) => s.isoCode === stateIso)?.name || "",
    [stateList, stateIso],
  );

  const handleUpdate = async () => {
    if (!data?.data) return;
    const existing = data.data;

    // Compute age from DOB so it stays accurate even though there's no
    // separate age field on this form.
    const age = dob
      ? Math.max(
          0,
          new Date().getFullYear() -
            new Date(dob).getFullYear() -
            (new Date().setFullYear(2000) < new Date(dob).setFullYear(2000)
              ? 1
              : 0),
        )
      : existing.basicDetails.age;

    try {
      await updateProfile({
        basicDetails: {
          ...existing.basicDetails,
          firstName,
          lastName,
          gender,
          dob,
          age,
          height,
          maritalStatus,
        },
        religionDetails: {
          ...existing.religionDetails,
          religion: selectedReligionName || existing.religionDetails.religion,
          caste: selectedCasteName || existing.religionDetails.caste,
          subCaste: selectedSubCasteName,
          motherTongue,
        },
        locationDetails: {
          country: selectedCountryName || existing.locationDetails.country,
          state: selectedStateName || existing.locationDetails.state,
          city,
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
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-rose-300 transition"
              />
            </div>
            <div>
              <label className="block text-md font-bold text-slate-900  mb-1.5">
                Last Name
              </label>
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-rose-300 transition"
              />
            </div>

            <div>
              <label className="block text-md font-bold text-slate-900  mb-1.5">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="form-select w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-rose-300 transition"
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-md font-bold text-slate-900  mb-1.5">
                Date Of Birth
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-rose-300 transition"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-md font-bold text-slate-900">
                Height
              </label>

              <select
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-rose-300"
              >
                <option value="" disabled>
                  Select Height
                </option>
                {heightRes?.data.map((h) => (
                  <option key={h._id} value={h.height}>
                    {h.height}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-md font-bold text-slate-900">
                Religion
              </label>

              <select
                value={religionId}
                onChange={(e) => {
                  setReligionId(e.target.value);
                  setCasteId("");
                  setSubCasteId("");
                }}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-rose-300"
              >
                <option value="" disabled>
                  Select
                </option>
                {religionRes?.data.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.religion}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-md font-bold text-slate-900">
                Caste
              </label>

              <select
                value={casteId}
                onChange={(e) => {
                  setCasteId(e.target.value);
                  setSubCasteId("");
                }}
                disabled={!religionId}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-rose-300"
              >
                <option value="" disabled>
                  Select
                </option>
                {casteRes?.data.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.caste}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-md font-bold text-slate-900">
                Sub Caste
              </label>

              <select
                value={subCasteId}
                onChange={(e) => setSubCasteId(e.target.value)}
                disabled={!casteId}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-rose-300"
              >
                <option value="" disabled>
                  Select
                </option>
                {subCasteRes?.data.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.subCaste}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-md font-bold text-slate-900">
                Mother Tongue
              </label>

              <select
                value={motherTongue}
                onChange={(e) => setMotherTongue(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-rose-300"
              >
                <option value="" disabled>
                  Select
                </option>
                {motherTongueRes?.data.map((m) => (
                  <option key={m._id} value={m.motherTongue}>
                    {m.motherTongue}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-md font-bold text-slate-900">
                Your Residing Country
              </label>

              <select
                value={countryIso}
                onChange={(e) => {
                  setCountryIso(e.target.value);
                  setStateIso("");
                  setCity("");
                }}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-rose-300"
              >
                <option value="" disabled>
                  Select
                </option>
                {countryList.map((c) => (
                  <option key={c.isoCode} value={c.isoCode}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-md font-bold text-slate-900">
                Your Residing State
              </label>

              <select
                value={stateIso}
                onChange={(e) => {
                  setStateIso(e.target.value);
                  setCity("");
                }}
                disabled={!countryIso}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-rose-300"
              >
                <option value="" disabled>
                  Select
                </option>
                {stateList.map((s) => (
                  <option key={s.isoCode} value={s.isoCode}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-md font-bold text-slate-900">
                Your Residing City
              </label>

              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={!stateIso}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-rose-300"
              >
                <option value="" disabled>
                  Select
                </option>
                {cityList.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-md font-bold text-slate-900">
                Marital Status
              </label>

              <select
                value={maritalStatus}
                onChange={(e) => setMaritalStatus(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-rose-300"
              >
                <option value="" disabled>
                  Select
                </option>
                <option value="Never Married">Never Married</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end">
            <ThemeBtnOne
              text={isSaving ? "Updating..." : "Update"}
              onClick={handleUpdate}
              className="mt-4 bg-rose-500 text-white px-3 py-2 font-serif rounded-full cursor-pointer"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default BasicDetails;

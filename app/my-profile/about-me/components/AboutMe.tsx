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

const AboutMe = () => {
  const router = useRouter();
  const { data, isLoading, isError } = useGetMyProfileQuery();
  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();

  const [about, setAbout] = useState("");
  const [profileCreatedBy, setProfileCreatedBy] = useState("self");
  const [disability, setDisability] = useState("None");
  const [thalassemia, setThalassemia] = useState("No");
  const [hivStatus, setHivStatus] = useState(false);

  // Pre-fill form once the existing profile loads
  useEffect(() => {
    if (data?.data) {
      const p = data.data;
      setAbout(p.aboutMe?.about || "");
      setProfileCreatedBy(p.aboutMe?.profileCreatedBy || "self");
      setDisability(p.aboutMe?.disability || "None");
      setThalassemia(p.aboutMe?.thalassemia || "No");
      setHivStatus(!!p.aboutMe?.hivStatus);
    }
  }, [data]);

  const handleUpdate = async () => {
    try {
      await updateProfile({
        aboutMe: {
          about,
          describeYourself: data?.data?.aboutMe?.describeYourself || "",
          languagesISpeak: data?.data?.aboutMe?.languagesISpeak || [],
          profileCreatedBy,
          disability,
          thalassemia,
          hivStatus,
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
            About Me
          </h3>
        </div>
        <div>
          <textarea
            rows={10}
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Write something about yourself..."
            className="w-full rounded-lg border border-gray-200 p-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
          ></textarea>
          <div className="space-y-4 mb-10 mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-md font-bold text-slate-900  mb-1.5">
                Profile Managed By
              </label>
              <select
                value={profileCreatedBy}
                onChange={(e) => setProfileCreatedBy(e.target.value)}
                className="form-select w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-rose-300 transition"
              >
                <option value="self">Self</option>
                <option value="parent">Parent</option>
                <option value="guardian">Guardian</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-md font-bold text-slate-900  mb-1.5">
                Disability ?
              </label>
              <select
                value={disability}
                onChange={(e) => setDisability(e.target.value)}
                className="form-select w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-rose-300 transition"
              >
                <option value="None">None</option>
                <option value="Physical">Physical</option>
                <option value="Visual">Visual</option>
                <option value="Hearing">Hearing</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-md font-bold text-slate-900  mb-1.5">
                Thalassemia ?
              </label>
              <select
                value={thalassemia}
                onChange={(e) => setThalassemia(e.target.value)}
                className="form-select w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-rose-300 transition"
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
                <option value="Trait / Minor">Trait / Minor</option>
              </select>
            </div>
            <div>
              <label className="block text-md font-bold text-slate-900  mb-1.5">
                HIV + ?
              </label>
              <select
                value={hivStatus ? "yes" : "no"}
                onChange={(e) => setHivStatus(e.target.value === "yes")}
                className="form-select w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-rose-300 transition"
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
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

export default AboutMe;

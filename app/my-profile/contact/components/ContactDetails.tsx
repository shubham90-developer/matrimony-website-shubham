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

const ContactDetails = () => {
  const router = useRouter();
  const { data, isLoading, isError } = useGetMyProfileQuery();
  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();

  // ---------- form state ----------
  const [email, setEmail] = useState("");
  const [alternateEmail, setAlternateEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [alternatePhoneNumber, setAlternatePhoneNumber] = useState("");

  // ---------- pre-fill once profile loads ----------
  useEffect(() => {
    if (!data?.data) return;
    const p = data.data;

    setEmail(p.contactDetails?.email || "");
    setAlternateEmail(p.contactDetails?.alternateEmail || "");
    setPhoneNumber(p.contactDetails?.phoneNumber || "");
    setAlternatePhoneNumber(p.contactDetails?.alternatePhoneNumber || "");
  }, [data]);

  const handleUpdate = async () => {
    if (!data?.data) return;
    const existing = data.data;

    try {
      await updateProfile({
        contactDetails: {
          ...(existing.contactDetails || {}),
          email,
          alternateEmail,
          phoneNumber,
          alternatePhoneNumber,
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
            Contact Details
          </h3>
        </div>
        <div>
          <div className="space-y-4 mb-10 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-md font-bold text-slate-900  mb-1.5">
                Mail Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-rose-300"
              />
            </div>
            <div>
              <label className="block text-md font-bold text-slate-900  mb-1.5">
                Alternate Mail Address
              </label>
              <input
                type="email"
                value={alternateEmail}
                onChange={(e) => setAlternateEmail(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-rose-300"
              />
            </div>
            <div>
              <label className="block text-md font-bold text-slate-900  mb-1.5">
                Mobile No.
              </label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-rose-300"
              />
            </div>
            <div>
              <label className="block text-md font-bold text-slate-900  mb-1.5">
                Alternate Mobile No.
              </label>
              <input
                type="text"
                value={alternatePhoneNumber}
                onChange={(e) => setAlternatePhoneNumber(e.target.value)}
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

export default ContactDetails;

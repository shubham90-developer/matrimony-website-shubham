"use client";

import React from "react";
import { ShieldCheck } from "lucide-react";
import { useGetTermsConditionsQuery } from "@/Redux/terms";
import { Loader2 } from "lucide-react";
const Terms = () => {
  const { data, isLoading, isError } = useGetTermsConditionsQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-20 text-slate-500">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm font-semibold">
          Loading Terms & Conditions...
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <p className="py-20 text-center text-sm font-semibold text-rose-600">
        Failed to load Terms & Conditions. Please try again later.
      </p>
    );
  }
  const terms = data?.data;
  if (!terms) {
    return null;
  }
  return (
    <section className="w-full bg-[#FDF8F3] py-0 px-5 sm:px-8 lg:px-8">
      <div className="mx-auto max-w-7xl  bg-white p-8 py-15">
        {/* Heading */}
        <div className="text-center mb-10">
          <span className="rounded-full bg-rose-100 px-4 py-1 text-xs font-bold tracking-widest text-black">
            Terms & Conditions
          </span>
          <h2 className="mt-3 font-serif text-3xl font-bold text-slate-900 sm:text-4xl">
            Your Terms &<span className="text-rose-600"> Conditions</span>
          </h2>
          <p
            className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-slate-500"
            dangerouslySetInnerHTML={{
              __html: terms?.title || "Terms And Conditions",
            }}
          />
        </div>

        {/* Policy Cards */}
        <div
          dangerouslySetInnerHTML={{
            __html: terms?.content || "Terms And Conditions",
          }}
        />

        {/* Footer */}
        <div className="mt-14 rounded-3xl bg-linear-to-r from-rose-600 to-cyan-500 p-10 text-center text-white">
          <ShieldCheck className="mx-auto mb-4 h-14 w-14" />

          <h2 className="text-3xl font-bold">Your Trust Is Our Priority</h2>

          <p className="mx-auto mt-4 max-w-3xl text-blue-100">
            By using our platform, you agree to the terms outlined in this
            Privacy Policy. We may update this policy periodically to reflect
            changes in our services or legal requirements.
          </p>

          <p className="mt-6 text-sm text-blue-100">Last Updated: July 2026</p>
        </div>
      </div>
    </section>
  );
};

export default Terms;

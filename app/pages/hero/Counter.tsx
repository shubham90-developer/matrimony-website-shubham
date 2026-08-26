"use client";

import React from "react";
import { User, CheckCircle2, Handshake, ShieldCheck } from "lucide-react";

type Stat = {
  icon: "verified" | "customers" | "years";
  value: string;
  label: string;
};

const stats: Stat[] = [
  {
    icon: "verified",
    value: "100%",
    label: "Mobile-verified profiles",
  },
  {
    icon: "customers",
    value: "4 Crore+",
    label: "Customers served",
  },
  {
    icon: "years",
    value: "26 Years",
    label: "of successful matchmaking",
  },
];

const StatIcon = ({ type }: { type: Stat["icon"] }) => {
  if (type === "verified") {
    return (
      <div className="relative h-14 w-14 shrink-0">
        <div className="flex h-14 w-11 items-center justify-center rounded-xl border-2 border-slate-800">
          <User className="h-6 w-6 text-slate-800" strokeWidth={2} />
        </div>
        <CheckCircle2
          className="absolute -bottom-1 -right-1 h-5 w-5 text-white"
          strokeWidth={2.5}
          fill="#5eead4"
        />
      </div>
    );
  }

  if (type === "customers") {
    return (
      <div className="flex h-14 w-14 shrink-0 items-center justify-center">
        <Handshake
          className="h-11 w-11 text-slate-800"
          strokeWidth={1.75}
          fill="none"
        />
      </div>
    );
  }

  return (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center">
      <ShieldCheck className="h-11 w-11 text-slate-800" strokeWidth={1.75} />
    </div>
  );
};

const Counter = () => {
  return (
    <section className="w-full bg-[#FDF8F3] py-0 px-5 sm:px-8 lg:px-8">
      <div className="mx-auto max-w-7xl  bg-rose-100 p-8 py-15">
        <div className="grid grid-cols-1 sm:grid-cols-3">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`flex items-center gap-4 px-4 py-6 sm:py-0 ${
                index !== 0 ? "sm:border-l sm:border-slate-900 sm:pl-10" : ""
              } ${index !== stats.length - 1 ? "sm:pr-10" : ""}`}
            >
              <StatIcon type={stat.icon} />
              <div>
                <p className="text-2xl font-extrabold text-slate-900 font-serif">
                  {stat.value}
                </p>
                <p className="mt-0.5 text-[15px] text-slate-600">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Counter;

"use client";

import React, { useEffect, useMemo, useState } from "react";

import {
  MapPin,
  Clock,
  ArrowUpRight,
  X,
  UploadCloud,
  CheckCircle2,
} from "lucide-react";
import LifePhotos from "./LifePhotos";
import WhyJoinUs from "./WhyJoinUs";
import ThemeBtnOne from "@/app/components/ThemeBtnOne";
import Link from "next/link";

type JobType = "Full-time" | "Internship";

type Job = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: JobType;
};

const departments = [
  "All",
  "Engineering",
  "Product & Design",
  "Trust & Safety",
  "Marketing",
  "Customer Success",
] as const;

const jobs: Job[] = [
  {
    id: "sde-2-backend",
    title: "SDE II — Backend",
    department: "Engineering",
    location: "Pune (Hybrid)",
    type: "Full-time",
  },
  {
    id: "frontend-engineer",
    title: "Frontend Engineer, React",
    department: "Engineering",
    location: "Remote (India)",
    type: "Full-time",
  },
  {
    id: "product-designer",
    title: "Product Designer",
    department: "Product & Design",
    location: "Pune (Hybrid)",
    type: "Full-time",
  },
  {
    id: "trust-safety-analyst",
    title: "Trust & Safety Analyst",
    department: "Trust & Safety",
    location: "Bengaluru",
    type: "Full-time",
  },
  {
    id: "growth-marketer",
    title: "Growth Marketing Manager",
    department: "Marketing",
    location: "Mumbai",
    type: "Full-time",
  },
  {
    id: "cs-associate",
    title: "Customer Success Associate",
    department: "Customer Success",
    location: "Pune",
    type: "Full-time",
  },
  {
    id: "design-intern",
    title: "Product Design Intern",
    department: "Product & Design",
    location: "Pune (On-site)",
    type: "Internship",
  },
];

const ApplyModal = ({ job, onClose }: { job: Job; onClose: () => void }) => {
  const [submitted, setSubmitted] = useState(false);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm overflow-hidden"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="apply-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 cursor-pointer top-5 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="h-4 w-4" />
        </button>

        {submitted ? (
          <div className="flex flex-col items-center py-10 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-50">
              <CheckCircle2 className="h-7 w-7 text-rose-600" />
            </div>
            <h3 className="mt-4 font-serif text-xl font-bold text-slate-900">
              Application sent
            </h3>
            <p className="mt-2 max-w-sm text-sm text-slate-500">
              Thanks for applying to <strong>{job.title}</strong>. Our team will
              review your profile and reach out if it&apos;s a fit.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 rounded-full bg-rose-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold tracking-widest text-rose-600 uppercase">
              {job.department}
            </span>
            <h3
              id="apply-modal-title"
              className="mt-3 font-serif text-2xl font-bold text-slate-900"
            >
              Apply for {job.title}
            </h3>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {job.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {job.type}
              </span>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="fullName"
                    className="text-xs font-medium text-slate-600"
                  >
                    Full name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    placeholder="Your name"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-100"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="text-xs font-medium text-slate-600"
                  >
                    Phone number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    placeholder="+91 00000 00000"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-100"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="text-xs font-medium text-slate-600"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="you@email.com"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-100"
                />
              </div>

              <div>
                <label
                  htmlFor="linkedin"
                  className="text-xs font-medium text-slate-600"
                >
                  LinkedIn / portfolio (optional)
                </label>
                <input
                  id="linkedin"
                  type="url"
                  placeholder="https://"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-100"
                />
              </div>

              <div>
                <span className="text-xs font-medium text-slate-600">
                  Resume
                </span>
                <label
                  htmlFor="resume"
                  className="mt-1.5 flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-300 px-3.5 py-6 text-center transition hover:border-rose-300 hover:bg-rose-50/40"
                >
                  <UploadCloud className="h-5 w-5 text-rose-500" />
                  <span className="text-xs font-medium text-slate-600">
                    {fileName || "Click to upload PDF or DOCX"}
                  </span>
                  <input
                    id="resume"
                    type="file"
                    required
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) =>
                      setFileName(e.target.files?.[0]?.name ?? "")
                    }
                  />
                </label>
              </div>

              <div>
                <label
                  htmlFor="note"
                  className="text-xs font-medium text-slate-600"
                >
                  Anything you&apos;d like to add (optional)
                </label>
                <textarea
                  id="note"
                  rows={3}
                  placeholder="A short note about why you're a good fit..."
                  className="mt-1.5 w-full resize-none rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-100"
                />
              </div>

              <ThemeBtnOne
                text=" Submit Application"
                type="submit"
                url="#"
                className="bg-rose-500 px-4 py-3 rounded-full w-full text-white font-serif"
              />
            </form>
          </>
        )}
      </div>
    </div>
  );
};

const Careers = () => {
  const [activeDept, setActiveDept] =
    useState<(typeof departments)[number]>("All");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const filteredJobs = useMemo(
    () =>
      activeDept === "All"
        ? jobs
        : jobs.filter((job) => job.department === activeDept),
    [activeDept],
  );

  return (
    <div className="w-full bg-[#FDF8F3] py-0 px-5 sm:px-8 lg:px-8">
      <div className="mx-auto max-w-7xl  bg-white p-8 py-15">
        {/* Hero */}
        <div className="text-center">
          <span className="rounded-full bg-rose-100 px-4 py-1 text-xs font-bold tracking-widest text-rose-600 uppercase">
            Careers
          </span>
          <h1 className="mx-auto mt-3 max-w-2xl font-serif text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
            Help Us Build{" "}
            <span className="text-rose-600">Something People Trust</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-slate-500">
            We&apos;re a small team working on a product that plays a real part
            in people&apos;s lives. If that sounds meaningful to you, we&apos;d
            love to hear from you.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="#open-positions"
              className="rounded-full bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
            >
              View Open Positions
            </Link>
            <Link
              href="mailto:careers@example.com"
              className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:border-rose-200 hover:text-rose-600"
            >
              Send a Resume Anyway
            </Link>
          </div>
        </div>

        {/* Life at company photo strip */}
        <LifePhotos />

        {/* Culture / perks */}
        <WhyJoinUs />

        {/* Open positions */}
        <div id="open-positions" className="mt-20 scroll-mt-24">
          <div className="text-center">
            <h2 className="font-serif text-2xl font-bold text-slate-900 sm:text-3xl">
              Open Positions
            </h2>
            <p className="mt-3 text-sm text-slate-500">
              {filteredJobs.length} open role
              {filteredJobs.length !== 1 ? "s" : ""}
              {activeDept !== "All" ? ` in ${activeDept}` : ""}
            </p>
          </div>

          {/* Department filter */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {departments.map((dept) => {
              const isActive = dept === activeDept;
              return (
                <button
                  key={dept}
                  type="button"
                  onClick={() => setActiveDept(dept)}
                  className={`rounded-full cursor-pointer px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-rose-600 text-white shadow-sm shadow-rose-200"
                      : "bg-white text-slate-500 ring-1 ring-slate-200 hover:text-rose-600"
                  }`}
                >
                  {dept}
                </button>
              );
            })}
          </div>

          {/* Job list */}
          <div className="mx-auto mt-8 max-w-3xl divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {filteredJobs.length === 0 ? (
              <p className="p-8 text-center text-sm text-slate-400">
                No open roles in this team right now — check back soon.
              </p>
            ) : (
              filteredJobs.map((job) => (
                <button
                  key={job.id}
                  type="button"
                  onClick={() => setSelectedJob(job)}
                  className="group flex w-full flex-col gap-2 p-5 text-left transition hover:bg-rose-50/40 sm:flex-row sm:items-center sm:justify-between sm:p-6"
                >
                  <div>
                    <p className="font-serif text-base font-semibold text-slate-900 group-hover:text-rose-600">
                      {job.title}
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-600">
                        {job.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {job.type}
                      </span>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 self-start text-sm font-semibold text-rose-600 sm:self-auto">
                    Apply
                    <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 rounded-2xl bg-rose-600 px-6 py-8 text-center sm:flex-row sm:text-left">
          <div>
            <p className="font-serif text-xl font-bold text-white">
              Don&apos;t see the right role?
            </p>
            <p className="mt-1 text-sm text-rose-100">
              We&apos;re always open to meeting people who care about this work.
            </p>
          </div>
          <ThemeBtnOne
            text=" Get in Touch"
            url="/contact"
            className="py-3 px-4 bg-white rounded-full font-serif"
          />
        </div>
      </div>

      {selectedJob && (
        <ApplyModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </div>
  );
};

export default Careers;

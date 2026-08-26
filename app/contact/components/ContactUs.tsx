import React from "react";
import { MapPin, Mail } from "lucide-react";

const ContactUs = () => {
  return (
    <div className="w-full bg-[#FDF8F3] py-0 px-5 sm:px-8 lg:px-8">
      <div className="mx-auto max-w-7xl  bg-white p-8 py-15">
        {/* Heading */}
        <div className="text-center">
          <span className="rounded-full bg-rose-100 px-4 py-1 text-xs font-bold tracking-widest text-rose-600 uppercase">
            Contact Us
          </span>
          <h1 className="mx-auto mt-3 max-w-xl font-serif text-3xl font-bold text-slate-900 sm:text-4xl">
            We&apos;d Love to{" "}
            <span className="text-rose-600">Hear From You</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-slate-500">
            Reach us at the address or email below and our team will get back to
            you.
          </p>
        </div>

        {/* Details */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex flex-col items-center rounded-2xl border hover:bg-rose-100 border-slate-200 bg-white p-8 text-center transition hover:border-rose-200 hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
              <MapPin className="h-5 w-5" />
            </div>
            <h2 className="mt-4 font-serif text-lg font-semibold text-slate-900">
              Office Address
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              4th Floor, Amar Business Park,
              <br />
              Baner Road, Pune,
              <br />
              Maharashtra 411045, India
            </p>
          </div>

          <div className="flex flex-col items-center rounded-2xl border hover:bg-rose-100 border-slate-200 bg-white p-8 text-center transition hover:border-rose-200 hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
              <Mail className="h-5 w-5" />
            </div>
            <h2 className="mt-4 font-serif text-lg font-semibold text-slate-900">
              Email Us
            </h2>
            <a
              href="mailto:support@example.com"
              className="mt-2 text-md font-medium text-rose-600 hover:underline font-serif"
            >
              support@example.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

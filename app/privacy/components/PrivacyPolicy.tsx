"use client";

import React from "react";
import { ShieldCheck } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <section className="w-full bg-[#FDF8F3] py-0 px-5 sm:px-8 lg:px-8">
      <div className="mx-auto max-w-7xl  bg-white p-8 py-15">
        {/* Heading */}
        <div className="text-center mb-10">
          <span className="rounded-full bg-rose-100 px-4 py-1 text-xs font-bold tracking-widest text-black">
            Privacy Policy
          </span>
          <h2 className="mt-3 font-serif text-3xl font-bold text-slate-900 sm:text-4xl">
            Your Privacy
            <span className="text-rose-600"> Matters</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-slate-500">
            We value your trust and are committed to protecting your personal
            information. This Privacy Policy explains how we collect, use,
            store, and protect your data when you use our website and services.
          </p>
        </div>

        {/* Policy Cards */}
        <div>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry&apos;s standard dummy
            text ever since 1966, when designers at Letraset and James Mosley,
            the librarian at St Bride Printing Library in London, took a 1914
            Cicero translation and scrambled it to make dummy text for
            Letraset&apos;s Body Type sheets. It has survived not only many
            decades, but also the leap into electronic typesetting, remaining
            essentially unchanged. It was popularised thanks to these sheets and
            more recently with desktop publishing software like Aldus PageMaker
            and Microsoft Word including versions of Lorem Ipsum.
          </p>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry&apos;s standard dummy
            text ever since 1966, when designers at Letraset and James Mosley,
            the librarian at St Bride Printing Library in London, took a 1914
            Cicero translation and scrambled it to make dummy text for
            Letraset&apos;s Body Type sheets. It has survived not only many
            decades, but also the leap into electronic typesetting, remaining
            essentially unchanged. It was popularised thanks to these sheets and
            more recently with desktop publishing software like Aldus PageMaker
            and Microsoft Word including versions of Lorem Ipsum.
          </p>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry&apos;s standard dummy
            text ever since 1966, when designers at Letraset and James Mosley,
            the librarian at St Bride Printing Library in London, took a 1914
            Cicero translation and scrambled it to make dummy text for
            Letraset&apos;s Body Type sheets. It has survived not only many
            decades, but also the leap into electronic typesetting, remaining
            essentially unchanged. It was popularised thanks to these sheets and
            more recently with desktop publishing software like Aldus PageMaker
            and Microsoft Word including versions of Lorem Ipsum.
          </p>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry&apos;s standard dummy
            text ever since 1966, when designers at Letraset and James Mosley,
            the librarian at St Bride Printing Library in London, took a 1914
            Cicero translation and scrambled it to make dummy text for
            Letraset&apos;s Body Type sheets. It has survived not only many
            decades, but also the leap into electronic typesetting, remaining
            essentially unchanged. It was popularised thanks to these sheets and
            more recently with desktop publishing software like Aldus PageMaker
            and Microsoft Word including versions of Lorem Ipsum.
          </p>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry&apos;s standard dummy
            text ever since 1966, when designers at Letraset and James Mosley,
            the librarian at St Bride Printing Library in London, took a 1914
            Cicero translation and scrambled it to make dummy text for
            Letraset&apos;s Body Type sheets. It has survived not only many
            decades, but also the leap into electronic typesetting, remaining
            essentially unchanged. It was popularised thanks to these sheets and
            more recently with desktop publishing software like Aldus PageMaker
            and Microsoft Word including versions of Lorem Ipsum.
          </p>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry&apos;s standard dummy
            text ever since 1966, when designers at Letraset and James Mosley,
            the librarian at St Bride Printing Library in London, took a 1914
            Cicero translation and scrambled it to make dummy text for
            Letraset&apos;s Body Type sheets. It has survived not only many
            decades, but also the leap into electronic typesetting, remaining
            essentially unchanged. It was popularised thanks to these sheets and
            more recently with desktop publishing software like Aldus PageMaker
            and Microsoft Word including versions of Lorem Ipsum.
          </p>
        </div>

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

export default PrivacyPolicy;

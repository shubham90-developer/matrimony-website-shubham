"use client";

import Link from "next/link";
import Logo from "./Logo";
import Image from "next/image";
import { BsInstagram, BsYoutube } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";

const exploreLinks = [
  { label: "Home", href: "/" },
  { label: "Success Stories", href: "/success-stories" },
  { label: "Membership Plans", href: "/membership" },
  { label: "Blue Tick Verification", href: "/my-profile/verify" },
];

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Careers", href: "/careers" },
  { label: "Press", href: "/press" },
  { label: "Contact Us", href: "/contact" },
];

const supportLinks = [
  { label: "Help Centre", href: "/help" },
  { label: "Safe Matrimony Guide", href: "/safety" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Fraud Alert", href: "/fraud-alert" },
];

const communities = [
  "Bengali",
  "Marathi",
  "Punjabi",
  "Tamil",
  "Telugu",
  "Gujarati",
  "Malayalam",
  "Kannada",
];

const socials = [
  { label: "Instagram", icon: BsInstagram, href: "https://instagram.com" },
  { label: "Facebook", icon: FaFacebook, href: "https://facebook.com" },
  { label: "YouTube", icon: BsYoutube, href: "https://youtube.com" },
];

const Footer = () => {
  return (
    <footer className="w-full bg-[#FDF8F3] px-5 pt-20 sm:px-8 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Top: brand + newsletter */}
        <div className="flex flex-col gap-10 border-b border-rose-100 pb-14 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-md">
            <div className="flex items-center gap-2">
              <Logo />
            </div>
            <p className="mt-4 text-[15px] leading-relaxed text-slate-500">
              Two lakh families trusted us with the search for &quot;the
              one.&quot; Verified profiles, thoughtful matches, and a team that
              treats your story like it matters &mdash; because it does.
            </p>
          </div>

          <div className="w-full max-w-sm">
            <p className="font-serif text-lg font-semibold text-slate-900">
              Download the Tuz Maz Jamla app
            </p>

            <div className="mt-4 flex items-center gap-4">
              <Link href={"#"}>
                <Image
                  src="/img/download apk/1.png"
                  alt="App Store"
                  width={200}
                  height={10}
                  className="h-10 w-35 shrink-0 "
                />
              </Link>
              <Link href={"#"}>
                <Image
                  src="/img/download apk/2.png"
                  alt="App Store"
                  width={200}
                  height={10}
                  className="h-10 w-35 shrink-0 "
                />
              </Link>
            </div>
          </div>
        </div>

        {/* Middle: link columns */}
        <div className="grid grid-cols-2 gap-10 py-14 sm:grid-cols-4">
          <div>
            <h3 className="text-xs font-bold tracking-widest text-black font-serif">
              EXPLORE
            </h3>
            <ul className="mt-5 space-y-3">
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 transition hover:text-rose-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold tracking-widest text-black font-serif">
              COMPANY
            </h3>
            <ul className="mt-5 space-y-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 transition hover:text-rose-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold tracking-widest text-black font-serif">
              SUPPORT
            </h3>
            <ul className="mt-5 space-y-3">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 transition hover:text-rose-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold tracking-widest text-black font-serif">
              BROWSE BY COMMUNITY
            </h3>
            <ul className="mt-5 flex flex-wrap gap-2">
              {communities.map((c) => (
                <li key={c}>
                  <Link
                    href={`/community/${c.toLowerCase()}`}
                    className="inline-block rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 transition hover:border-rose-300 hover:text-rose-600"
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center gap-4 border-t border-rose-100 py-8 sm:flex-row sm:justify-between ">
          <p className="order-2 text-xs text-black sm:order-1 font-serif">
            &copy; {new Date().getFullYear()} Tuz Maz Jamla. All rights
            reserved.
          </p>

          <div className="order-1 flex items-center gap-3 sm:order-2">
            {socials.map(({ label, icon: Icon, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-rose-300 hover:text-rose-600"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

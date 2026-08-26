"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronDown, Search, Check } from "lucide-react";
import Link from "next/link";
import ThemeBtnOne from "@/app/components/ThemeBtnOne";
import { useRouter } from "next/navigation";
import {
  useSendOtpMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
} from "@/Redux/authApi";

type Step = "phone" | "otp" | "success";

type Country = {
  code: string;
  dialCode: string;
  flag: string;
  name: string;
};

const FALLBACK_COUNTRIES: Country[] = [
  { code: "IN", dialCode: "+91", flag: "🇮🇳", name: "India" },
  { code: "US", dialCode: "+1", flag: "🇺🇸", name: "United States" },
  { code: "GB", dialCode: "+44", flag: "🇬🇧", name: "United Kingdom" },
  { code: "AE", dialCode: "+971", flag: "🇦🇪", name: "United Arab Emirates" },
  { code: "AU", dialCode: "+61", flag: "🇦🇺", name: "Australia" },
];

const OTP_LENGTH = 4;
const RESEND_SECONDS = 29;

function flagFromCode(cca2: string) {
  return cca2
    .toUpperCase()
    .replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
}

const Login = () => {
  const [sendOtp, { isLoading: sendingOtp }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: verifyingOtp }] = useVerifyOtpMutation();
  const [resendOtpApi, { isLoading: resendingOtp }] = useResendOtpMutation();
  const [otpError, setOtpError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const router = useRouter();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  const [countries, setCountries] = useState<Country[]>(FALLBACK_COUNTRIES);
  const [country, setCountry] = useState<Country>(FALLBACK_COUNTRIES[0]);
  const [countryOpen, setCountryOpen] = useState(false);
  const [countryQuery, setCountryQuery] = useState("");
  const [loadingCountries, setLoadingCountries] = useState(true);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("https://restcountries.com/v3.1/all?fields=name,idd,cca2,flag")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled || !Array.isArray(data)) return;
        const parsed: Country[] = data
          .filter((c) => c?.idd?.root)
          .map((c) => ({
            code: c.cca2,
            dialCode: `${c.idd.root}${c.idd.suffixes?.[0] ?? ""}`,
            flag: c.flag || flagFromCode(c.cca2),
            name: c.name?.common ?? c.cca2,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        if (parsed.length) {
          setCountries(parsed);
          const india = parsed.find((c) => c.code === "IN");
          if (india) setCountry(india);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoadingCountries(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!countryOpen) return;
    const onClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setCountryOpen(false);
        setCountryQuery("");
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [countryOpen]);

  useEffect(() => {
    if (step === "otp") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSeconds(RESEND_SECONDS);
      const id = setTimeout(() => otpRefs.current[0]?.focus(), 50);
      return () => clearTimeout(id);
    }
  }, [step]);

  useEffect(() => {
    if (step !== "otp" || seconds === 0) return;
    const id = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [step, seconds]);

  const filteredCountries = countries.filter(
    (c) =>
      c.name.toLowerCase().includes(countryQuery.toLowerCase()) ||
      c.dialCode.includes(countryQuery),
  );

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < OTP_LENGTH - 1) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((d, i) => (next[i] = d));
    setOtp(next);
    otpRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleGetOtp = async () => {
    if (phone.length !== 10) return;
    setPhoneError("");
    try {
      await sendOtp({ countryCode: country.dialCode, mobile: phone }).unwrap();
      setOtp(Array(OTP_LENGTH).fill(""));
      setStep("otp");
    } catch {
      setPhoneError("Failed to send OTP. Please try again.");
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.some((d) => !d)) return;
    setOtpError("");
    try {
      const res = await verifyOtp({
        mobile: phone,
        otp: otp.join(""),
      }).unwrap();
      localStorage.setItem("accessToken", res.accessToken);
      localStorage.setItem("refreshToken", res.refreshToken);
      if (res.isNewUser) {
        router.push("/register");
      } else {
        setStep("success");
      }
      setStep("success");
    } catch {
      setOtpError("Invalid OTP. Please try again.");
    }
  };

  const resendOtp = async () => {
    if (seconds > 0) return;
    setOtpError("");
    try {
      await resendOtpApi({
        countryCode: country.dialCode,
        mobile: phone,
      }).unwrap();
      setSeconds(RESEND_SECONDS);
      setOtp(Array(OTP_LENGTH).fill(""));
      otpRefs.current[0]?.focus();
    } catch {
      setOtpError("Failed to resend OTP. Please try again.");
    }
  };

  return (
    <div className="w-full bg-[#FDF8F3] py-12 px-5 sm:px-8 lg:px-8">
      <div className="mx-auto max-w-3xl  bg-white p-8 py-15">
        {step !== "success" && (
          <Link
            href="/"
            className="mb-8 -ml-1 flex h-9 w-9 border border-slate-200 cursor-pointer items-center justify-center rounded-full text-slate-900 hover:bg-slate-100 transition"
          >
            <ChevronLeft size={18} />
          </Link>
        )}

        {step === "phone" && (
          <div key="phone" className="animate-[fadeIn_0.25s_ease-out]">
            <h1 className="text-3xl font-extrabold text-slate-900 leading-snug mb-3 font-serif capitalize">
              What&apos;s your mobile{" "}
              <span className="text-rose-600">number?</span>
            </h1>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed">
              We verify phone numbers to keep our platform secure and ensure
              genuine connections
            </p>

            <div className="flex items-stretch gap-3 mb-3">
              <div ref={dropdownRef} className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setCountryOpen((v) => !v)}
                  className="flex py-4 font-bold h-full items-center gap-1.5 rounded-2xl border border-slate-200 px-4 text-sm text-slate-900 hover:border-slate-300 transition"
                >
                  <span className="text-xs tracking-wide">{country.code}</span>
                  <span>{country.dialCode}</span>
                  <ChevronDown
                    size={14}
                    className={`text-slate-400 transition-transform ${
                      countryOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {countryOpen && (
                  <div className="absolute left-0 top-full mt-2 w-64 rounded-2xl bg-white ring-1 ring-black/5 shadow-lg z-40 overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-100">
                      <Search size={14} className="text-slate-400 shrink-0" />
                      <input
                        autoFocus
                        value={countryQuery}
                        onChange={(e) => setCountryQuery(e.target.value)}
                        placeholder="Search country"
                        className="w-full text-sm outline-none font-bold placeholder:text-slate-400"
                      />
                    </div>
                    <div className="max-h-52 overflow-y-auto">
                      {loadingCountries && (
                        <p className="px-4 py-3 text-xs text-slate-400">
                          Loading countries…
                        </p>
                      )}
                      {filteredCountries.length === 0 && !loadingCountries && (
                        <p className="px-4 py-3 text-xs text-slate-400">
                          No matches
                        </p>
                      )}
                      {filteredCountries.map((c) => (
                        <button
                          key={`${c.code}-${c.dialCode}`}
                          type="button"
                          onClick={() => {
                            setCountry(c);
                            setCountryOpen(false);
                            setCountryQuery("");
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-rose-50 transition"
                        >
                          <span>{c.flag}</span>
                          <span className="flex-1 truncate">{c.name}</span>
                          <span className="text-slate-400">{c.dialCode}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <input
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                inputMode="numeric"
                placeholder="Phone number"
                className="flex-1 min-w-0 rounded-2xl border font-bold border-slate-200 px-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-300 transition"
              />
            </div>

            {phoneError && (
              <p className="text-sm text-red-500 mb-3">{phoneError}</p>
            )}

            <p className="text-sm text-slate-500 mb-10">
              We&apos;ll send you a {OTP_LENGTH} digit OTP
            </p>

            <div className="flex items-center justify-center">
              <ThemeBtnOne
                type="button"
                disabled={phone.length !== 10 || sendingOtp}
                onClick={handleGetOtp}
                text={sendingOtp ? "Sending..." : " Get OTP"}
                className="w-50 bg-rose-500 text-white py-4 cursor-pointer px-4 rounded-full font-serif"
              />
            </div>
          </div>
        )}

        {step === "otp" && (
          <div key="otp" className="animate-[fadeIn_0.25s_ease-out]">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-3 font-serif">
              Enter <span className="text-rose-600">OTP</span>
            </h1>
            <p className="text-sm text-slate-500 mb-6">
              SMS sent to {country.dialCode} {phone}{" "}
              <button
                type="button"
                onClick={() => setStep("phone")}
                className="font-bold text-rose-500 hover:text-rose-600 transition cursor-pointer"
              >
                • Edit
              </button>
            </p>

            <div className="flex gap-3 mb-3">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    otpRefs.current[i] = el;
                  }}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  onPaste={handleOtpPaste}
                  inputMode="numeric"
                  maxLength={1}
                  aria-label={`Digit ${i + 1} of verification code`}
                  className="w-13 h-13 font-bold rounded-2xl border border-slate-200 text-center text-lg  text-slate-900 outline-none focus:border-rose-300 transition"
                />
              ))}
            </div>

            {otpError && (
              <p className="text-sm text-red-500 mb-3">{otpError}</p>
            )}

            <p className="text-sm text-slate-500 mb-10">
              {seconds > 0 ? (
                <>Your OTP should arrive within {seconds} seconds</>
              ) : (
                <button
                  type="button"
                  onClick={resendOtp}
                  disabled={resendingOtp}
                  className="font-bold text-rose-500 hover:text-rose-600 transition disabled:opacity-50"
                >
                  {resendingOtp ? "Resending..." : "Resend OTP"}
                </button>
              )}
            </p>

            <div className="flex items-center justify-center">
              <ThemeBtnOne
                type="button"
                disabled={otp.some((d) => !d) || verifyingOtp}
                onClick={handleVerifyOtp}
                text={verifyingOtp ? "Verifying..." : "  Verify Number"}
                className="w-50 bg-rose-500 text-white py-4 cursor-pointer px-4 rounded-full font-serif"
              />
            </div>
          </div>
        )}

        {step === "success" && (
          <div
            key="success"
            className="text-center py-6 animate-[fadeIn_0.3s_ease-out]"
          >
            <div className="mx-auto mb-5 w-14 h-14 rounded-full bg-rose-500 flex items-center justify-center">
              <Check size={26} className="text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 mb-2 font-serif">
              You&apos;re verified
            </h1>
            <p className="text-sm text-slate-500 mb-8">
              Logged in with {country.dialCode} {phone}
            </p>

            <div className="flex items-center justify-center">
              <ThemeBtnOne
                type="button"
                disabled={otp.some((d) => !d)}
                onClick={() => router.push("/my-matches/matches")}
                text="   Continue"
                className="w-50 bg-rose-500 text-white py-4 cursor-pointer px-4 rounded-full font-serif"
              />
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Login;

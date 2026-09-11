"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Check,
  Crown,
  Star,
  Gem,
  Trophy,
  Infinity as InfinityIcon,
  Calendar,
  Phone,
  PhoneCall,
  MessageSquare,
  Eye,
  Heart,
  TrendingUp,
  Sparkles,
  Tag,
  Loader2,
  LucideIcon,
} from "lucide-react";
import {
  useGetPackagesQuery,
  type MembershipPackage,
} from "@/Redux/packagesApi";
import { profileApi, useGetMyProfileQuery } from "@/Redux/profileApi";
import {
  usePreviewPaymentMutation,
  useCreateOrderMutation,
  useVerifyPaymentMutation,
} from "@/Redux/paymentApi";
import {
  loadRazorpayScript,
  type RazorpaySuccessResponse,
} from "@/app/config/razorpayScript";

interface Feature {
  icon: LucideIcon;
  text: string;
}

interface Plan {
  id: string;
  tabLabel: string;
  tabSub: string;
  icon: LucideIcon;
  headerTitle: string;
  headerTagline: string;
  price: number;
  originalPrice?: number; // struck-through "before discount" price
  months: number | null; // null = "till you marry" (no fixed term)
  features: Feature[];
  highlight?: boolean; // pulled out as the full-width featured plan
}

// Icons cycle across plans in display order (API doesn't return an icon).
const PLAN_ICONS: LucideIcon[] = [Star, Crown, Gem, Trophy, InfinityIcon];

// Keyword -> icon so each feature line keeps a relevant icon, same as the
// original hardcoded PLANS did per-line.
const FEATURE_ICON_RULES: { keywords: string[]; icon: LucideIcon }[] = [
  { keywords: ["valid"], icon: Calendar },
  { keywords: ["phone number"], icon: Phone },
  { keywords: ["message"], icon: MessageSquare },
  { keywords: ["horoscope"], icon: Eye },
  { keywords: ["interest"], icon: Heart },
  { keywords: ["call"], icon: PhoneCall },
  { keywords: ["priority", "visibility"], icon: TrendingUp },
  { keywords: ["best", "serious", "long-term"], icon: Sparkles },
];

const iconForFeature = (text: string): LucideIcon => {
  const lower = text.toLowerCase();
  const match = FEATURE_ICON_RULES.find((rule) =>
    rule.keywords.some((kw) => lower.includes(kw)),
  );
  return match?.icon ?? Check;
};

// Converts duration/durationType into the number of months used for the
// "per month" price breakdown (null = no fixed term, e.g. "Till You Marry").
const toMonths = (pkg: MembershipPackage): number | null => {
  if (pkg.durationType === "MONTH") return pkg.duration;
  if (pkg.durationType === "YEAR") return pkg.duration * 12;
  return null; // DAY-based or anything else: skip the per-month breakdown
};

const toPlan = (
  pkg: MembershipPackage,
  index: number,
  isLast: boolean,
): Plan => ({
  id: pkg._id,
  tabLabel: pkg.title,
  tabSub: `₹${pkg.price.toLocaleString("en-IN")}`,
  icon: PLAN_ICONS[index % PLAN_ICONS.length],
  headerTitle: pkg.title,
  headerTagline: pkg.description,
  price: pkg.price,
  originalPrice:
    pkg.originalPrice && pkg.originalPrice > pkg.price
      ? pkg.originalPrice
      : undefined,
  months: toMonths(pkg),
  features: pkg.features.map((text) => ({ icon: iconForFeature(text), text })),
  // The "Till You Marry" style plan is the featured/highlighted one — same
  // as the original design's TOP_PLAN. It's the last plan by display order.
  highlight: isLast,
});

const discountPercent = (plan: Plan) =>
  plan.originalPrice
    ? Math.round(((plan.originalPrice - plan.price) / plan.originalPrice) * 100)
    : null;

const Membership = () => {
  const dispatch = useDispatch();
  const { data, isLoading, isError } = useGetPackagesQuery();
  const { data: profileData } = useGetMyProfileQuery();

  const profile = profileData?.data;
  const profileId = profile?._id;
  // Only treat it as an "upgrade" if the user has a currently active plan.
  const currentPackageId = profile?.subscription?.isActive
    ? profile.subscription.packageId
    : undefined;

  const plans = useMemo<Plan[]>(() => {
    const packages = [...(data?.data ?? [])]
      .filter((pkg) => !pkg.isDeleted)
      .sort((a, b) => a.displayOrder - b.displayOrder);

    return packages.map((pkg, index) =>
      toPlan(pkg, index, index === packages.length - 1),
    );
  }, [data]);

  const regularPlans = plans.filter((p) => !p.highlight);
  const topPlan = plans.find((p) => p.highlight) ?? plans[plans.length - 1];

  const [activeId, setActiveId] = useState<string | null>(null);

  // Default to the first regular plan once packages load.
  useEffect(() => {
    if (!activeId && plans.length > 0) {
      setActiveId(regularPlans[0]?.id ?? plans[0].id);
    }
  }, [plans, regularPlans, activeId]);

  const activePlan = plans.find((p) => p.id === activeId) ?? plans[0];
  const currentPlan = plans.find((p) => p.id === currentPackageId);

  // ---------- Upgrade proration preview ----------
  const [
    triggerPreview,
    { data: previewData, isLoading: isPreviewLoading, reset: resetPreview },
  ] = usePreviewPaymentMutation();

  const isCurrentPlan = Boolean(
    currentPackageId && activePlan && currentPackageId === activePlan.id,
  );

  // A "downgrade" is any plan priced at or below the plan already active —
  // never offered as a purchase, regardless of what the preview API returns.
  const isDowngrade = Boolean(
    currentPlan &&
    activePlan &&
    !isCurrentPlan &&
    activePlan.price <= currentPlan.price,
  );

  const isUpgrade = Boolean(
    currentPackageId &&
    activePlan &&
    currentPackageId !== activePlan.id &&
    !isDowngrade,
  );

  useEffect(() => {
    if (isUpgrade && profileId && activePlan) {
      triggerPreview({ profileId, packageId: activePlan.id });
    } else {
      resetPreview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpgrade, profileId, activePlan?.id]);

  const payableAmount =
    isUpgrade && previewData?.success ? previewData.data.payableAmount : null;
  const unusedAmount =
    isUpgrade && previewData?.success ? previewData.data.unusedAmount : null;

  // ---------- Payment flow ----------
  const [createOrder] = useCreateOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();
  const [isPaying, setIsPaying] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handlePayment = async () => {
    if (!activePlan || isCurrentPlan || isDowngrade) return;
    setPaymentError(null);
    setIsPaying(true);

    try {
      const orderRes = await createOrder({
        packageId: activePlan.id,
      }).unwrap();

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !window.Razorpay) {
        throw new Error("Unable to load payment gateway. Please try again.");
      }

      const { orderId, amount, currency, paymentId } = orderRes.data;

      const razorpay = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
        amount,
        currency,
        order_id: orderId,
        name: "Matrimony",
        description: `${activePlan.headerTitle} membership`,
        prefill: {
          name: [
            profile?.basicDetails?.firstName,
            profile?.basicDetails?.lastName,
          ]
            .filter(Boolean)
            .join(" "),
          email: profile?.contactDetails?.email,
          contact: profile?.contactDetails?.phoneNumber,
        },
        theme: { color: "#e11d48" },
        handler: async (response: RazorpaySuccessResponse) => {
          try {
            await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              idempotencyKey:
                typeof crypto !== "undefined" && "randomUUID" in crypto
                  ? crypto.randomUUID()
                  : paymentId,
            }).unwrap();

            // Subscription changed — refresh the profile so
            // subscription.packageId reflects the new plan.
            dispatch(profileApi.util.invalidateTags(["Profile"]));
          } catch {
            setPaymentError(
              "Payment was received but verification failed. Please contact support.",
            );
          } finally {
            setIsPaying(false);
          }
        },
        modal: {
          ondismiss: () => setIsPaying(false),
        },
      });

      razorpay.on("payment.failed", () => {
        setPaymentError("Payment failed. Please try again.");
        setIsPaying(false);
      });

      razorpay.open();
    } catch {
      setPaymentError("Something went wrong while starting the payment.");
      setIsPaying(false);
    }
  };

  if (isLoading) {
    return (
      <section className="w-full bg-[#FDF8F3] px-5 py-10">
        <div className="mx-auto flex max-w-xl items-center justify-center gap-2 py-20 text-sm text-stone-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading membership plans...
        </div>
      </section>
    );
  }

  if (isError || plans.length === 0 || !activePlan || !topPlan) {
    return (
      <section className="w-full bg-[#FDF8F3] px-5 py-10">
        <div className="mx-auto max-w-xl py-20 text-center text-sm text-rose-500">
          Unable to load membership plans. Please try again.
        </div>
      </section>
    );
  }

  const ActiveIcon = activePlan.icon;
  const perMonth =
    activePlan.months && activePlan.months > 1
      ? Math.round(activePlan.price / activePlan.months)
      : null;
  const savePct = discountPercent(activePlan);
  const displayPrice = payableAmount ?? activePlan.price;
  const ctaLabel = isCurrentPlan
    ? "Current Plan"
    : isDowngrade
      ? "Not Available"
      : isUpgrade
        ? `Upgrade to ${activePlan.headerTitle}`
        : `Choose ${activePlan.headerTitle}`;
  const isCtaDisabled =
    isPaying || isCurrentPlan || isDowngrade || (isUpgrade && isPreviewLoading);

  return (
    <section className="w-full bg-[#FDF8F3] px-5 py-10">
      <div className="mx-auto max-w-xl">
        {/* Regular plan tabs */}
        <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {regularPlans.map((plan) => {
            const Icon = plan.icon;
            const isActive = activeId === plan.id;
            return (
              <button
                key={plan.id}
                type="button"
                onClick={() => setActiveId(plan.id)}
                className={`flex shrink-0 cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-all ${
                  isActive
                    ? "border-transparent bg-linear-to-r from-rose-500 to-rose-500 text-white shadow-md shadow-amber-200"
                    : "border-slate-200 bg-white text-slate-600"
                }`}
              >
                <Icon
                  className={`h-3.5 w-3.5 ${isActive ? "text-white" : "text-slate-400"}`}
                  fill={isActive ? "currentColor" : "none"}
                />
                <span className="flex flex-col items-start leading-none">
                  <span>{plan.tabLabel}</span>
                  <span
                    className={`mt-0.5 text-[10px] font-normal ${isActive ? "text-white/80" : "text-slate-400"}`}
                  >
                    {plan.tabSub}
                  </span>
                </span>
                {isActive && (
                  <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-white/25">
                    <Check className="h-2.5 w-2.5 text-white" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Top plan — full width, own row, stands out from the scroll */}
        <button
          type="button"
          onClick={() => setActiveId(topPlan.id)}
          className={`mt-2 flex w-full cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all ${
            activeId === topPlan.id
              ? "border-transparent bg-linear-to-r from-[#2b1a0e] via-[#1a1108] to-black shadow-md shadow-amber-900/30"
              : "border-amber-200 bg-linear-to-r from-amber-50 to-white"
          }`}
        >
          <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-rose-300 via-amber-500 to-rose-600">
            <topPlan.icon
              className="h-4.5 w-4.5 text-white"
              fill="currentColor"
            />
          </span>
          <span className="flex-1">
            <span
              className={`block text-sm font-bold ${activeId === topPlan.id ? "text-white" : "text-slate-900"}`}
            >
              {topPlan.tabLabel}
            </span>
            <span
              className={`block text-[11px] ${activeId === topPlan.id ? "text-white/60" : "text-slate-400"}`}
            >
              Best value · one-time payment
            </span>
          </span>
          <span className="flex flex-col items-end">
            <span
              className={`text-sm font-bold ${activeId === topPlan.id ? "text-white" : "text-slate-900"}`}
            >
              {topPlan.tabSub}
            </span>
            {topPlan.originalPrice && (
              <span
                className={`text-[10px] line-through ${activeId === topPlan.id ? "text-white/40" : "text-slate-400"}`}
              >
                ₹{topPlan.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </span>
        </button>

        {/* Detail card */}
        <div className="mt-5 overflow-hidden rounded-4xl bg-white shadow-[0_25px_60px_-25px_rgba(0,0,0,0.25)]">
          {/* Header */}
          <div className="relative overflow-hidden bg-linear-to-br from-[#2b1a0e] via-[#1a1108] to-black px-7 pb-14 pt-7">
            {/* Diagonal gold streaks */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -right-6 -top-10 h-56 w-40 rotate-20 bg-linear-to-b from-amber-400/25 via-amber-500/10 to-transparent" />
              <div className="absolute right-6 -top-10 h-56 w-24 rotate-20 bg-linear-to-b from-amber-300/15 via-transparent to-transparent" />
              <div className="absolute -right-16 top-4 h-56 w-16 rotate-20 bg-linear-to-b from-amber-500/20 via-transparent to-transparent" />
            </div>

            <div className="relative flex items-center gap-4">
              {/* Coin badge */}
              <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-linear-to-br from-rose-300 via-amber-500 to-rose-600 shadow-lg shadow-amber-900/50" />
                <div className="absolute inset-0.75 rounded-full border-2 border-amber-200/40" />
                <ActiveIcon
                  className="relative h-7 w-7 text-white"
                  fill="currentColor"
                />
                <Sparkles
                  className="absolute -right-1 -top-1 h-4 w-4 text-amber-200"
                  fill="currentColor"
                />
              </div>

              <div>
                <h3 className="font-serif text-2xl font-bold text-white">
                  {activePlan.headerTitle}
                </h3>
                <p className="mt-0.5 text-xs text-white/60">
                  {activePlan.headerTagline}
                </p>
              </div>
            </div>
          </div>

          {/* Price panel */}
          <div className="mt-0 rounded-[28px] rounded-t-none bg-[#FDF3E2] px-6 pb-5 pt-5">
            <div className="flex items-end gap-2">
              {isUpgrade && isPreviewLoading ? (
                <span className="flex items-center gap-2 text-sm text-slate-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Calculating upgrade price...
                </span>
              ) : (
                <>
                  <span className="font-serif text-4xl font-bold text-slate-900">
                    ₹{displayPrice.toLocaleString("en-IN")}
                  </span>
                  {(activePlan.originalPrice ||
                    (isUpgrade && payableAmount !== null)) && (
                    <span className="mb-1 text-base text-slate-400 line-through">
                      ₹
                      {(
                        activePlan.originalPrice ?? activePlan.price
                      ).toLocaleString("en-IN")}
                    </span>
                  )}
                </>
              )}
            </div>

            {isUpgrade && payableAmount !== null && !isPreviewLoading && (
              <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                <Tag className="h-3 w-3" />₹
                {unusedAmount?.toLocaleString("en-IN")} credited from your
                current plan
              </span>
            )}

            {!isUpgrade && savePct !== null && (
              <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                <Tag className="h-3 w-3" />
                Save ₹
                {(activePlan.originalPrice! - activePlan.price).toLocaleString(
                  "en-IN",
                )}{" "}
                ({savePct}%)
              </span>
            )}

            {!isUpgrade && perMonth && (
              <p className="mt-2 text-sm text-slate-500">
                ₹{perMonth.toLocaleString("en-IN")} per month
              </p>
            )}
          </div>

          {/* Features */}
          <ul className="px-7 pt-2">
            {activePlan.features.map((f) => {
              const Icon = f.icon;
              return (
                <li
                  key={f.text}
                  className="flex items-center gap-3 border-b border-slate-100 py-3.5 last:border-b-0"
                >
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-rose-500">
                    <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                  </span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm text-slate-700">{f.text}</span>
                </li>
              );
            })}
          </ul>

          {/* CTA */}
          <div className="px-7 pb-7 pt-5">
            <button
              type="button"
              onClick={handlePayment}
              disabled={isCtaDisabled}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-linear-to-r from-rose-500 to-rose-500 py-3.5 text-sm font-bold font-serif text-white shadow-md shadow-amber-200 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPaying ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ActiveIcon className="h-4 w-4" fill="currentColor" />
              )}
              {isPaying ? "Processing..." : ctaLabel}
            </button>
            {paymentError && (
              <p className="mt-3 text-center text-xs font-medium text-rose-500">
                {paymentError}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Membership;

"use client";

import React, { useMemo, useState } from "react";
import {
  Check,
  Crown,
  Sparkles,
  Heart,
  Star,
  Award,
  Gem,
  X,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import {
  useGetPackagesQuery,
  type MembershipPackage,
} from "@/Redux/packagesApi";
import {
  useCreateOrderMutation,
  useVerifyPaymentMutation,
  usePreviewPaymentMutation,
  type PreviewPaymentData,
} from "@/Redux/paymentApi";
import { useGetMyProfileQuery } from "@/Redux/profileApi";
import {
  loadRazorpayScript,
  type RazorpaySuccessResponse,
} from "@/app/config/razorpayScript";

// Cycled onto packages in order since the API doesn't send an icon per plan
const ICONS: React.ElementType[] = [Star, Crown, Sparkles, Award, Gem, Heart];

const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string;

const formatDuration = (duration: number, durationType: string) => {
  const unit = durationType.charAt(0) + durationType.slice(1).toLowerCase();
  return `${duration} ${unit}${duration > 1 ? "s" : ""}`;
};

const Membership = () => {
  const { data, isLoading, isError, refetch } = useGetPackagesQuery();
  const { data: profileData } = useGetMyProfileQuery();
  const [selected, setSelected] = useState<string | null>(null);
  const [payingPlanId, setPayingPlanId] = useState<string | null>(null);

  const [createOrder] = useCreateOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();
  const [previewPayment] = usePreviewPaymentMutation();

  // ── Upgrade preview modal state ─────────────────────────────────
  const [previewLoadingPlanId, setPreviewLoadingPlanId] = useState<
    string | null
  >(null);
  const [previewPlan, setPreviewPlan] = useState<MembershipPackage | null>(
    null,
  );
  const [previewInfo, setPreviewInfo] = useState<PreviewPaymentData | null>(
    null,
  );

  const packages = useMemo(() => {
    const list = (data?.data ?? []).filter((pkg) => !pkg.isDeleted);
    return [...list].sort((a, b) => a.displayOrder - b.displayOrder);
  }, [data]);

  const activeSelection = selected ?? packages[packages.length - 1]?._id;

  const subscription = profileData?.data?.subscription;
  const hasActiveSubscription = Boolean(subscription?.isActive);
  const currentPackageId = subscription?.packageId;
  const currentPackage = useMemo(
    () => packages.find((p) => p._id === currentPackageId) || null,
    [packages, currentPackageId],
  );

  // Only treat this as an "upgrade" (needing a preview/proration step) when
  // the user already has an active plan, is choosing a *different* plan,
  // and the new plan costs more than their current one.
  const isUpgradeCandidate = (pkg: MembershipPackage) =>
    hasActiveSubscription &&
    Boolean(currentPackageId) &&
    pkg._id !== currentPackageId &&
    (!currentPackage || pkg.price > currentPackage.price);

  // ── Actually start Razorpay checkout + create-order flow ───────────
  const startCheckout = async (pkg: MembershipPackage) => {
    setPayingPlanId(pkg._id);

    try {
      // 1. Load the Razorpay checkout script (no-op if already loaded)
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Couldn't load the payment gateway. Please retry.");
        setPayingPlanId(null);
        return;
      }

      const RazorpayCheckout = window.Razorpay;
      if (!RazorpayCheckout) {
        toast.error("Payment gateway failed to initialize. Please retry.");
        setPayingPlanId(null);
        return;
      }

      const orderRes = await createOrder({ packageId: pkg._id }).unwrap();
      const { orderId, amount, currency } = orderRes.data;

      const idempotencyKey = `b92bf75b-7f51-4377-9477-d52e291c9253`;

      // 3. Open Razorpay's checkout popup with that order
      const razorpay = new RazorpayCheckout({
        key: RAZORPAY_KEY_ID,
        amount,
        currency,
        order_id: orderId,
        name: "Your Matrimony",
        description: `${pkg.title} membership`,
        theme: { color: "#e11d48" }, // matches rose-600
        handler: async (response: RazorpaySuccessResponse) => {
          // 4. On success, verify the signature server-side
          try {
            await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              idempotencyKey,
            }).unwrap();

            // 5. Subscription is now active on the backend
            toast.success(`${pkg.title} membership activated!`);
          } catch {
            toast.error(
              "Payment received but verification failed. Contact support if this persists.",
            );
          } finally {
            setPayingPlanId(null);
          }
        },
        modal: {
          ondismiss: () => setPayingPlanId(null),
        },
      });

      razorpay.open();
    } catch {
      toast.error("Couldn't start the payment. Please try again.");
      setPayingPlanId(null);
    }
  };

  // ── Entry point from the plan card's CTA button ─────────────────────
  const handleChoosePlan = async (pkg: MembershipPackage) => {
    setSelected(pkg._id);

    // No active subscription, or same/lower plan — go straight to checkout
    // exactly like before, no extra step.
    if (!isUpgradeCandidate(pkg)) {
      startCheckout(pkg);
      return;
    }

    // Upgrading from an active plan — fetch the discounted payable amount
    // first and let the user confirm before opening Razorpay.
    const profileId = profileData?.data?._id;
    if (!profileId) {
      // Fallback: if profile id isn't available for some reason, don't block
      // the user — proceed with the normal checkout flow.
      startCheckout(pkg);
      return;
    }

    setPreviewLoadingPlanId(pkg._id);
    try {
      const previewRes = await previewPayment({
        profileId,
        packageId: pkg._id,
      }).unwrap();
      setPreviewPlan(pkg);
      setPreviewInfo(previewRes.data);
    } catch {
      toast.error("Couldn't calculate upgrade pricing. Please try again.");
    } finally {
      setPreviewLoadingPlanId(null);
    }
  };

  const closePreview = () => {
    setPreviewPlan(null);
    setPreviewInfo(null);
  };

  const confirmUpgrade = () => {
    if (!previewPlan) return;
    const pkg = previewPlan;
    closePreview();
    startCheckout(pkg);
  };

  return (
    <section className="w-full bg-[#FDF8F3] py-0 px-5 sm:px-8 lg:px-8">
      <div className="mx-auto max-w-7xl  bg-white p-8 py-15">
        {/* Heading */}
        <div className="text-center">
          <span className="rounded-full bg-rose-100 px-4 py-1 text-xs font-bold tracking-widest text-black">
            MEMBERSHIP PLANS
          </span>
          <h2 className="mt-3 font-serif text-3xl font-bold text-slate-900 sm:text-4xl">
            Choose How You Want to{" "}
            <span className="text-rose-600">Find Them</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-slate-500">
            Every plan unlocks genuine, verified profiles. Pick the pace that
            matches your search.
          </p>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-5 lg:gap-6">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-[520px] animate-pulse rounded-3xl border border-slate-100 bg-slate-50"
              />
            ))}
          </div>
        )}

        {/* Error state */}
        {!isLoading && isError && (
          <div className="mt-14 flex flex-col items-center gap-3 rounded-2xl border border-rose-100 bg-rose-50/50 py-12 text-center">
            <p className="text-sm text-slate-600">
              We couldn&apos;t load membership plans right now.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-full bg-rose-600 px-5 py-2 text-sm font-semibold text-white hover:bg-rose-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && packages.length === 0 && (
          <div className="mt-14 rounded-2xl border border-slate-100 bg-slate-50/60 py-12 text-center text-sm text-slate-500">
            No membership plans are available at the moment.
          </div>
        )}

        {/* Plans */}
        {!isLoading && !isError && packages.length > 0 && (
          <div className="mt-14 grid grid-cols-1 items-start gap-6 md:grid-cols-3 md:gap-5 lg:gap-6">
            {packages.map((plan, index) => {
              const Icon = ICONS[index % ICONS.length];
              const isSelected = activeSelection === plan._id;
              const featured = Boolean(plan.badge);
              const savings =
                plan.originalPrice && plan.originalPrice > plan.price
                  ? (plan.discountPercentage ??
                    Math.round(
                      ((plan.originalPrice - plan.price) / plan.originalPrice) *
                        100,
                    ))
                  : null;
              const isCurrentPlan =
                hasActiveSubscription && plan._id === currentPackageId;
              const isBusy =
                payingPlanId === plan._id || previewLoadingPlanId === plan._id;

              return (
                <div
                  key={plan._id}
                  onClick={() => setSelected(plan._id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      setSelected(plan._id);
                  }}
                  className={`relative flex cursor-pointer flex-col rounded-3xl border bg-white p-7 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 ${
                    featured
                      ? "border-rose-600 shadow-[0_25px_60px_-25px_rgba(225,29,72,0.45)] md:-translate-y-3"
                      : isSelected
                        ? "border-rose-300 shadow-lg"
                        : "border-slate-200 hover:border-rose-200 hover:shadow-md"
                  }`}
                >
                  {/* Ribbon */}
                  {featured && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="flex items-center gap-1.5 rounded-full bg-rose-600 px-4 py-1.5 text-xs font-bold tracking-wide text-white shadow-md shadow-rose-200">
                        <Heart className="h-3 w-3" fill="currentColor" />
                        {plan.badge?.toUpperCase()}
                      </span>
                    </div>
                  )}

                  {savings ? (
                    <span className="absolute right-5 top-6 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-600">
                      {savings}% OFF
                    </span>
                  ) : null}

                  {/* Icon + name */}
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-full ${
                      featured
                        ? "bg-rose-600 text-white"
                        : "bg-rose-50 text-rose-600"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-serif text-2xl font-bold text-slate-900">
                    {plan.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mt-6 flex items-end gap-2">
                    <span className="font-serif text-4xl font-bold text-slate-900">
                      &#8377;{plan.price.toLocaleString("en-IN")}
                    </span>
                    {plan.originalPrice ? (
                      <span className="mb-1 text-sm text-slate-400 line-through">
                        &#8377;{plan.originalPrice.toLocaleString("en-IN")}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-xs font-medium text-slate-400">
                    {formatDuration(plan.duration, plan.durationType)}
                    {savings ? ` · you save ${savings}%` : ""}
                  </p>

                  {/* CTA */}
                  <button
                    type="button"
                    disabled={isBusy || isCurrentPlan}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleChoosePlan(plan);
                    }}
                    className={`mt-6 cursor-pointer w-full rounded-full py-3 text-sm font-bold font-serif transition disabled:cursor-not-allowed disabled:opacity-60 ${
                      featured
                        ? "bg-rose-600 text-white hover:bg-rose-700"
                        : "bg-rose-50 text-rose-600 hover:bg-rose-100"
                    }`}
                  >
                    {isCurrentPlan
                      ? "Current Plan"
                      : previewLoadingPlanId === plan._id
                        ? "Calculating..."
                        : payingPlanId === plan._id
                          ? "Processing..."
                          : featured
                            ? `Start ${plan.title}`
                            : `Choose ${plan.title}`}
                  </button>

                  {/* Features */}
                  <ul className="mt-7 space-y-3 border-t border-slate-100 pt-6">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2.5 text-sm text-slate-600"
                      >
                        <Check
                          className={`mt-0.5 h-4 w-4 shrink-0 ${
                            featured ? "text-rose-600" : "text-emerald-500"
                          }`}
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}

        {/* Reassurance line */}
        <p className="mt-10 text-center text-xs text-slate-400">
          All plans include Blue Tick profile verification. Prices are inclusive
          of taxes. Cancel your renewal any time.
        </p>
      </div>

      {/* ── Upgrade preview confirmation modal ─────────────────────── */}
      {previewPlan && previewInfo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={closePreview}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white p-7 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <h3 className="font-serif text-xl font-bold text-slate-900">
                Upgrade to {previewInfo.packageName}
              </h3>
              <button
                type="button"
                onClick={closePreview}
                className="text-slate-400 hover:text-slate-600"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-3 rounded-2xl bg-rose-50/60 p-4 text-sm">
              <div className="flex items-center justify-between text-slate-600">
                <span>Plan price</span>
                <span className="font-semibold text-slate-900">
                  &#8377;{previewInfo.packagePrice.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Credit from current plan</span>
                <span className="font-semibold text-emerald-600">
                  − &#8377;{previewInfo.unusedAmount.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Remaining days on current plan</span>
                <span className="font-semibold text-slate-900">
                  {previewInfo.remainingDays}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-rose-100 pt-3">
                <span className="font-semibold text-slate-900">
                  You pay now
                </span>
                <span className="font-serif text-2xl font-bold text-rose-600">
                  &#8377;{previewInfo.payableAmount.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={closePreview}
                className="flex-1 rounded-full border border-slate-200 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmUpgrade}
                className="flex-1 rounded-full bg-rose-600 py-3 text-sm font-bold text-white hover:bg-rose-700"
              >
                Confirm &amp; Pay
              </button>
            </div>
          </div>
        </div>
      )}

      <Toaster position="top-center" reverseOrder={false} />
    </section>
  );
};

export default Membership;

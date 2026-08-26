import { Check, Crown } from "lucide-react";
import React from "react";

const PLANS = [
  {
    name: "Gold",
    price: "₹1,999",
    perks: ["30 interests / month", "View contact details", "Priority listing"],
  },
  {
    name: "Platinum",
    price: "₹3,999",
    perks: [
      "Unlimited interests",
      "Relationship manager",
      "Verified badge",
      "Priority listing",
    ],
  },
];

const Upgrade = () => {
  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className="rounded-2xl border border-stone-200 bg-white p-6"
          >
            <span className="flex items-center gap-2 text-rose-600 font-bold">
              <Crown size={18} /> {plan.name}
            </span>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {plan.price}{" "}
              <span className="text-sm font-medium text-stone-400">
                / 3 months
              </span>
            </p>
            <ul className="mt-4 space-y-2">
              {plan.perks.map((perk) => (
                <li
                  key={perk}
                  className="flex items-center gap-2 text-sm text-slate-600"
                >
                  <Check size={15} className="text-emerald-500 shrink-0" />{" "}
                  {perk}
                </li>
              ))}
            </ul>
            <button className="mt-5 w-full rounded-full bg-rose-600 py-2.5 text-sm font-bold text-white hover:bg-rose-700 transition">
              Choose {plan.name}
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default Upgrade;

import React from "react";
import {
  Heart,
  HeartHandshake,
  CheckCircle2,
  Send,
  Ban,
  XCircle,
} from "lucide-react";

const counters = [
  {
    title: "Accepted Interest",
    count: 24,
    icon: CheckCircle2,
    bg: "bg-green-50",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    title: "Interested Received",
    count: 18,
    icon: Heart,
    bg: "bg-pink-50",
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600",
  },
  {
    title: "Interest Sent",
    count: 32,
    icon: Send,
    bg: "bg-sky-50",
    iconBg: "bg-sky-100",
    iconColor: "text-sky-600",
  },
  {
    title: "Blocked Users",
    count: 5,
    icon: Ban,
    bg: "bg-red-50",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
  },
  {
    title: "Declined Interest",
    count: 9,
    icon: XCircle,
    bg: "bg-orange-50",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  {
    title: "Matched",
    count: 14,
    icon: HeartHandshake,
    bg: "bg-violet-50",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
  },
];

const TopCounter = () => {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
      {counters.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className={`${item.bg} h-36 rounded-2xl border border-gray-200 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md`}
          >
            <div className="flex h-full flex-col justify-between">
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.iconBg}`}
                >
                  <Icon className={item.iconColor} size={24} />
                </div>

                <span className="text-3xl font-bold text-slate-800">
                  {item.count}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-semibold leading-5 text-slate-800">
                  {item.title}
                </h3>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TopCounter;

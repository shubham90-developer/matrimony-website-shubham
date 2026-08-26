import {
  HeartHandshake,
  GraduationCap,
  Coffee,
  PlaneTakeoff,
  ShieldCheck,
  Users,
  Sparkles,
} from "lucide-react";

const perks = [
  {
    icon: HeartHandshake,
    title: "Health cover for family",
    description: "Comprehensive insurance for you, your spouse, and parents.",
  },
  {
    icon: PlaneTakeoff,
    title: "25 days off + flexibility",
    description: "Generous leave policy and hybrid-friendly working hours.",
  },
  {
    icon: GraduationCap,
    title: "Learning budget",
    description: "Annual allowance for courses, books, and conferences.",
  },
  {
    icon: Coffee,
    title: "Team offsites",
    description: "Quarterly team days and an annual company-wide offsite.",
  },
  {
    icon: ShieldCheck,
    title: "Parental leave",
    description: "Paid leave for new parents, regardless of gender.",
  },
  {
    icon: Users,
    title: "Small, senior teams",
    description: "Work directly with founders — no layers to wade through.",
  },
];

const WhyJoinUs = () => {
  return (
    <>
      <div className="mx-auto max-w-7xl  bg-rose-100 mt-10 p-8 py-15">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-4 py-1 text-xs font-bold tracking-widest text-rose-600">
            <Sparkles className="h-3 w-3" />
            WHY JOIN US
          </span>
          <h2 className="mt-3 font-serif text-2xl font-bold text-slate-900 sm:text-3xl">
            A Team That Takes Care of Its Own
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {perks.map((perk) => {
            const Icon = perk.icon;
            return (
              <div
                key={perk.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-rose-200 hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-serif text-lg font-semibold text-slate-900">
                  {perk.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                  {perk.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default WhyJoinUs;

import { Suspense } from "react";
import { Metadata } from "next";
import MyMatchesDetails from "./components/MyMatchesDetails";
import MatchSidebar from "@/app/components/MatchSidebar";

export const metadata: Metadata = {
  title: "My Matches | Your Website Name",
  description: "Browse membership plans to find your perfect life partner.",
};

const MyMatchesDetailsPage = () => {
  return (
    <>
      <section className="w-full bg-[#FDF8F3] px-5 sm:px-8 lg:px-8">
        <div className="mx-auto max-w-7xl bg-white p-2 py-15">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-[300px_1fr]">
            <MatchSidebar />
            <Suspense
              fallback={
                <div className="p-6 text-sm text-stone-500">
                  Loading profile...
                </div>
              }
            >
              <MyMatchesDetails />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
};

export default MyMatchesDetailsPage;

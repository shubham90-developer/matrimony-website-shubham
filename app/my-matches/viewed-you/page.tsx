import MatchSidebar from "@/app/components/MatchSidebar";
import React from "react";
import ProfileVisitors from "./components/ViewedProfiles";

export const metadata = {
  title: "Viewed You | Your Website Name",
  description: "Browse membership plans to find your perfect life partner.",
};

const ViewedYouPage = () => {
  return (
    <>
      <section className="w-full bg-[#FDF8F3] px-5 sm:px-8 lg:px-8">
        <div className="mx-auto max-w-7xl bg-white p-2 py-15">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-[300px_1fr]">
            <MatchSidebar />
            <div className="min-w-0">
              <ProfileVisitors />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ViewedYouPage;

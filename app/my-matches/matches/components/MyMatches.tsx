import React from "react";
import TopFilters from "./TopFilters";
import ProfilesCards from "./ProfilesCards";

const MyMatches = () => {
  return (
    <section className="space-y-6">
      <TopFilters />
      <ProfilesCards />
    </section>
  );
};

export default MyMatches;

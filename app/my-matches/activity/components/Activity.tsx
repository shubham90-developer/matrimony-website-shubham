import React from "react";
import TopCounter from "./TopCounter";
import ActivityProfiles from "./ActivityProfiles";

const Activity = () => {
  return (
    <>
      <section className="space-y-6">
        <TopCounter />
        <ActivityProfiles />
      </section>
    </>
  );
};

export default Activity;

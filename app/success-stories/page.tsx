import { Metadata } from "next";
import React from "react";
import SuccessStory from "./components/SuccessStory";
import Breadcrumb from "../components/Breadcrumb";

export const metadata: Metadata = {
  title: "Success Stories | Your Website Name",
  description:
    "Read inspiring customer success stories and testimonials from our happy clients.",
};

const SuccessStoryPage = () => {
  return (
    <>
      <Breadcrumb
        title="Success Stories"
        currentPage="Success Stories"
        backgroundImage="/img/home-banner/4.jpg"
      />
      <SuccessStory />
    </>
  );
};

export default SuccessStoryPage;

import { Metadata } from "next";
import Breadcrumb from "../components/Breadcrumb";
import AboutUs from "./components/AboutUs";

export const metadata: Metadata = {
  title: "About Us | Your Website Name",
  description: "Browse membership plans to find your perfect life partner.",
};

const AboutUsPage = () => {
  return (
    <>
      <Breadcrumb
        title="About Us"
        currentPage="About Us"
        backgroundImage="/img/home-banner/4.jpg"
      />
      <AboutUs />
    </>
  );
};

export default AboutUsPage;

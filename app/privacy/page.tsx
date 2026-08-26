import { Metadata } from "next";
import Breadcrumb from "../components/Breadcrumb";
import PrivacyPolicy from "./components/PrivacyPolicy";

export const metadata: Metadata = {
  title: "Privacy Policy | Your Website Name",
  description: "Browse membership plans to find your perfect life partner.",
};

const PrivacyPolicyPage = () => {
  return (
    <>
      <Breadcrumb
        title="Privacy Policy"
        currentPage="Privacy Policy"
        backgroundImage="/img/home-banner/4.jpg"
      />
      <PrivacyPolicy />
    </>
  );
};

export default PrivacyPolicyPage;

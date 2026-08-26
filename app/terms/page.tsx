import { Metadata } from "next";
import Breadcrumb from "../components/Breadcrumb";
import Terms from "./components/Terms";

export const metadata: Metadata = {
  title: "Terms & Conditions | Your Website Name",
  description: "Browse membership plans to find your perfect life partner.",
};

const TermsPage = () => {
  return (
    <>
      <Breadcrumb
        title="Terms & Conditions"
        currentPage="Terms & Conditions"
        backgroundImage="/img/home-banner/4.jpg"
      />
      <Terms />
    </>
  );
};

export default TermsPage;

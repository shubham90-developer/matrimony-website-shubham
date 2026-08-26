import { Metadata } from "next";
import Breadcrumb from "../components/Breadcrumb";
import Careers from "./components/Careers";

export const metadata: Metadata = {
  title: "Careers | Your Website Name",
  description: "Browse membership plans to find your perfect life partner.",
};

const CareersPage = () => {
  return (
    <>
      <Breadcrumb
        title="Careers"
        currentPage="Careers"
        backgroundImage="/img/home-banner/4.jpg"
      />
      <Careers />
    </>
  );
};

export default CareersPage;

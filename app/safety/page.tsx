import { Metadata } from "next";
import Breadcrumb from "../components/Breadcrumb";
import Safety from "./components/Safety";

export const metadata: Metadata = {
  title: "Safety | Your Website Name",
  description: "Browse membership plans to find your perfect life partner.",
};

const SafetyPage = () => {
  return (
    <>
      <Breadcrumb
        title="Safety"
        currentPage="Safety"
        backgroundImage="/img/home-banner/4.jpg"
      />
      <Safety />
    </>
  );
};

export default SafetyPage;

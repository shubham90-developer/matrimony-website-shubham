import { Metadata } from "next";
import Breadcrumb from "../components/Breadcrumb";
import HelpCenter from "./components/HelpCenter";

export const metadata: Metadata = {
  title: "Help | Your Website Name",
  description: "Browse membership plans to find your perfect life partner.",
};

const HelpCenterPage = () => {
  return (
    <>
      <Breadcrumb
        title="Help Center"
        currentPage="Help Center"
        backgroundImage="/img/home-banner/4.jpg"
      />
      <HelpCenter />
    </>
  );
};

export default HelpCenterPage;

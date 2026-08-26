import { Metadata } from "next";
import Breadcrumb from "../components/Breadcrumb";
import Press from "./components/Press";

export const metadata: Metadata = {
  title: "Press & Media | Your Website Name",
  description: "Browse membership plans to find your perfect life partner.",
};

const PressPage = () => {
  return (
    <>
      <Breadcrumb
        title="Press"
        currentPage="Press"
        backgroundImage="/img/home-banner/4.jpg"
      />
      <Press />
    </>
  );
};

export default PressPage;

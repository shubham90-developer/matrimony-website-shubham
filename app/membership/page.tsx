import { Metadata } from "next";
import Breadcrumb from "../components/Breadcrumb";
import Membership from "./components/Membership";

export const metadata: Metadata = {
  title: "Membership | Your Website Name",
  description: "Browse membership plans to find your perfect life partner.",
};

const MembershipPage = () => {
  return (
    <>
      <Breadcrumb
        title="Membership"
        currentPage="Membership"
        backgroundImage="/img/home-banner/4.jpg"
      />
      <Membership />
    </>
  );
};

export default MembershipPage;

import { Metadata } from "next";
import Breadcrumb from "../components/Breadcrumb";
import Fraud from "./components/Fraud";

export const metadata: Metadata = {
  title: "Fraud Alert | Your Website Name",
  description: "Browse membership plans to find your perfect life partner.",
};

const FraudPage = () => {
  return (
    <>
      <Breadcrumb
        title="Fraud Alert"
        currentPage="Fraud Alert"
        backgroundImage="/img/home-banner/4.jpg"
      />
      <Fraud />
    </>
  );
};

export default FraudPage;

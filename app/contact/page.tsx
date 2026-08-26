import { Metadata } from "next";
import Breadcrumb from "../components/Breadcrumb";
import ContactUs from "./components/ContactUs";

export const metadata: Metadata = {
  title: "Contact Us | Your Website Name",
  description: "Browse membership plans to find your perfect life partner.",
};

const ContactUsPage = () => {
  return (
    <>
      <Breadcrumb
        title="Contact Us"
        currentPage="Contact Us"
        backgroundImage="/img/home-banner/4.jpg"
      />
      <ContactUs />
    </>
  );
};

export default ContactUsPage;

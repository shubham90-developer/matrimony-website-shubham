import { Metadata } from "next";
import BasicSearch from "./components/BasicSearch";

export const metadata: Metadata = {
  title: "Basic Search | Your Website Name",
  description: "Browse membership plans to find your perfect life partner.",
};

const BasicSearchPage = () => {
  return (
    <>
      <BasicSearch />
    </>
  );
};

export default BasicSearchPage;

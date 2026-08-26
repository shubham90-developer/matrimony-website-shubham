import { Metadata } from "next";
import AdvancedSearch from "./components/AdvancedSearch";

export const metadata: Metadata = {
  title: "Advanced Search | Your Website Name",
  description: "Browse membership plans to find your perfect life partner.",
};

const AdvancedSearchPage = () => {
  return (
    <>
      <AdvancedSearch />
    </>
  );
};

export default AdvancedSearchPage;

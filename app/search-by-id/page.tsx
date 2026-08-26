import { Metadata } from "next";
import SearchById from "./components/SearchById";

export const metadata: Metadata = {
  title: " Search | Your Website Name",
  description: "Browse membership plans to find your perfect life partner.",
};

const SearchByIdPage = () => {
  return (
    <>
      <SearchById />
    </>
  );
};

export default SearchByIdPage;

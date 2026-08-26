import { Metadata } from "next";
import PartnerPreferences from "./components/PartnerPreferences";

export const metadata: Metadata = {
  title: "partner preferences | Your Website Name",
  description: "Browse membership plans to find your perfect life partner.",
};

const PartnerPreferencesPage = () => {
  return (
    <>
      <section className="w-full bg-[#FDF8F3] px-5 sm:px-8 lg:px-8">
        <div className="mx-auto max-w-7xl bg-white p-2 py-15">
          <div className="">
            <PartnerPreferences />
          </div>
        </div>
      </section>
    </>
  );
};

export default PartnerPreferencesPage;

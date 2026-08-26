import { Metadata } from "next";
import MatchSidebar from "@/app/components/MatchSidebar";
import Notifications from "./components/Notifications";

export const metadata: Metadata = {
  title: "My notifications | Your Website Name",
  description: "Browse membership plans to find your perfect life partner.",
};

const NotificationScreenPage = () => {
  return (
    <>
      <section className="w-full bg-[#FDF8F3] px-5 sm:px-8 lg:px-8">
        <div className="mx-auto max-w-7xl bg-white p-2 py-15">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-[300px_1fr]">
            <MatchSidebar />
            <Notifications />
          </div>
        </div>
      </section>
    </>
  );
};

export default NotificationScreenPage;

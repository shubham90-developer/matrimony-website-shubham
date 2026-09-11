import { Metadata } from "next";
import MatchSidebar from "@/app/components/MatchSidebar";
import MessengerDetails from "./components/MessengerDetails";

export const metadata: Metadata = {
  title: "My Chat | Your Website Name",
  description: "Browse membership plans to find your perfect life partner.",
};

// Next.js 15+ (this project is on Next 16) makes `searchParams` a Promise
// in Server Component pages, so it must be awaited — reading properties
// off it synchronously silently returns undefined, which is why the call
// button previously wasn't getting a receiverProfileId at all.
const ChatScreenDetailsPage = async ({
  searchParams,
}: {
  searchParams?: Promise<{
    receiverId?: string;
    name?: string;
    avatar?: string;
  }>;
}) => {
  const resolvedParams = (await searchParams) ?? {};
  const receiverProfileId = resolvedParams.receiverId;
  const name = resolvedParams.name;
  const avatar = resolvedParams.avatar;

  return (
    <>
      <section className="w-full bg-[#FDF8F3] px-5 sm:px-8 lg:px-8">
        <div className="mx-auto max-w-7xl bg-white p-2 py-15">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-[300px_1fr]">
            <MatchSidebar />
            <MessengerDetails
              receiverProfileId={receiverProfileId}
              name={name}
              avatar={avatar}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default ChatScreenDetailsPage;

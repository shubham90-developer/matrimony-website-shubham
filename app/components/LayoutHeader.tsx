"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import ProfileHeader from "./ProfileHeader";

const LayoutHeader = () => {
  const pathname = usePathname();

  const showProfileHeader =
    pathname.startsWith("/my-profile") || pathname.startsWith("/my-matches");

  return showProfileHeader ? <ProfileHeader /> : <Header />;
};

export default LayoutHeader;

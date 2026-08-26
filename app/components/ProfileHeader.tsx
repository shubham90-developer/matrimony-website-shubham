"use client";

import Link from "next/link";
import { Bell, UserRoundPlus } from "lucide-react";
import Logo from "./Logo";
import ProfileSideDrawer from "./ProfileSideDrawer";

const ProfileHeader = () => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-xs">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Logo />

        {/* Right Icons */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Profile */}
          <Link
            href="/my-profile"
            className="flex h-11 w-11 items-center hover:bg-rose-100 justify-center rounded-full border border-gray-200 bg-white text-slate-600 transition hover:border-pink-500 hover:text-pink-600 hover:shadow-md"
          >
            <UserRoundPlus size={22} />
          </Link>

          {/* Notification */}
          <Link
            href="/my-matches/notifications"
            className="relative flex h-11 w-11 items-center hover:bg-rose-100 justify-center rounded-full border border-gray-200 bg-white text-slate-600 transition hover:border-pink-500 hover:text-pink-600 hover:shadow-md"
          >
            <Bell size={22} />

            {/* Notification Dot */}
            <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-pink-500"></span>
          </Link>

          {/* Menu */}

          <ProfileSideDrawer />
        </div>
      </div>
    </header>
  );
};

export default ProfileHeader;

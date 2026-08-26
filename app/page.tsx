import React from "react";
import HeroBanner from "./pages/hero/HeroBanner";
import Steps from "./pages/hero/Steps";
import DownloadApk from "./components/DownloadApk";
import Plans from "./components/Plans";
import RealStories from "./pages/hero/RealStories";
import ShadiExperience from "./pages/hero/ShadiExperience";
import Faq from "./faq/components/Faq";
import BrouseProfile from "./components/BrouseProfile";
import Counter from "./pages/hero/Counter";

const page = () => {
  return (
    <>
      <HeroBanner />
      <Steps />
      <DownloadApk />
      <Plans />
      <RealStories />
      <Counter />
      <ShadiExperience />
      <Faq />
      <BrouseProfile />
    </>
  );
};

export default page;

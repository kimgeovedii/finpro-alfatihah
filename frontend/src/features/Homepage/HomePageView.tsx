import { HeroSection } from "./HeroSection";
import { MainFooter } from "../../components/layout/MainFooter";
import { MainNavbar } from "../../components/layout/MainNavbar";
import { MapsView } from "./MapsView";
import { AllowAccess } from "./AllowAccess";
import { RecommendationSlide } from "./RecommendationSlide";
import { ExclusiveVoucher } from "./ExclusiveVoucher";
import { NotificationHandler } from "../../components/common/NotificationHandler";
import { Suspense } from "react";

export const HomePageView = () => {
  return (
    <>
      <Suspense><NotificationHandler /></Suspense>
        <HeroSection />
        <MapsView />
        <AllowAccess />
        <RecommendationSlide />
        <ExclusiveVoucher />
    </>
  );
};

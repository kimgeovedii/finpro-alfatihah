import { HeroSection } from "./HeroSection";
import { MainFooter } from "../../components/layout/MainFooter";
import { MainNavbar } from "../../components/layout/MainNavbar";
import { MapsView } from "./MapsView";
import { AllowAccess } from "./AllowAccess";
import { RecommendationSlide } from "./RecommendationSlide";
import { ExclusiveVoucher } from "./ExclusiveVoucher";

export const LandingPageView = () => {
  return (
    <div className="bg-surface min-h-screen">
      <MainNavbar />
      <main className="max-w-7xl mx-auto px-6 lg:px-8 space-y-12 py-8 relative z-10">
        <HeroSection />
        <MapsView />
        <AllowAccess />
        <RecommendationSlide />
        <ExclusiveVoucher />
      </main>
      <MainFooter />
    </div>
  );
};

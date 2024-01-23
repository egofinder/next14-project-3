import { LandingContent } from "@/components/custom-ui/landing-content";
import { LandingHero } from "@/components/custom-ui/landing-hero";
import LandingNavbar from "@/components/custom-ui/landing-navbar";

const LandingPage = () => {
  return (
    <div className="h-full">
      <LandingNavbar />
      <LandingHero />
      <LandingContent />
    </div>
  );
};

export default LandingPage;

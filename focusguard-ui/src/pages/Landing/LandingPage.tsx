import LandingLayout from "../../layouts/LandingLayout";

import Hero from "../../components/landing/Hero";
import Features from "../../components/landing/Features";
import HowItWorks from "../../components/landing/HowItWorks";
import AISection from "../../components/landing/AISection";
import ChromeSection from "../../components/landing/ChromeSection";
import AnalyticsSection from "../../components/landing/AnalyticsSection";
import CTA from "../../components/landing/CTA";
import Solutions from "../../components/landing/Solutions";
import Pricing from "../../components/landing/Pricing";

const LandingPage = () => {
  return (
    <LandingLayout>
      <Hero />

      <Features />

      <Solutions />

      <Pricing />

      <HowItWorks />

      <AISection />

      <ChromeSection />

      <AnalyticsSection />

      <CTA />
    </LandingLayout>
  );
};

export default LandingPage;
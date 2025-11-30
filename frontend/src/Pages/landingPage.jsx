import React from "react";
import BackgroundLines from "@/components/Landing/BackgroundLines";
import HeroSection from "@/components/Landing/HeroSection";
import FeaturesSection from "@/components/Landing/FeaturesSection";
import QuoteSection from "@/components/Landing/QuoteSection";
import Footer from "@/components/Landing/Footer";
import Navbar from "@/components/Landing/Navbar";

export default function LandingPage() {
  return (
    <div className=" w-screen min-h-screen overflow-hidden    xl:px-16 relative">
      <Navbar />
      <BackgroundLines />
      <div className="h-full w-full px-6 md:px-16 py-16 ">
        <HeroSection />
        <FeaturesSection />
        <QuoteSection />
      </div>
      <Footer />
    </div>
  );
}

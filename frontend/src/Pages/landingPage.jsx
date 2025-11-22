import React from "react";
import BackgroundLines from "@/components/Landing/BackgroundLines";
import HeroSection from "@/components/Landing/HeroSection";
import FeaturesSection from "@/components/Landing/FeaturesSection";
import QuoteSection from "@/components/Landing/QuoteSection";
import Footer from "@/components/Landing/Footer";
import Navbar from "@/components/Landing/Navbar";

export default function LandingPage() {
  return (
    <div className="bg-white w-screen min-h-screen overflow-hidden px-16 relative">
      <Navbar />
      <BackgroundLines />
      <div className="h-full w-full p-16">
        <HeroSection />
        <FeaturesSection />
        <QuoteSection />
      </div>
      <Footer />
    </div>
  );
}

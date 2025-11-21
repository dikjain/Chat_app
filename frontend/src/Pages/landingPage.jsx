import React from "react";
import BackgroundLines from "../components/BackgroundLines";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import QuoteSection from "../components/QuoteSection";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

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

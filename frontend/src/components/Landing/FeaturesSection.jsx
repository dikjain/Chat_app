import React from "react";
import RealTimeMessagingBox from "@/components/Features/RealTimeMessagingBox";
import AudioCallBox from "@/components/Features/AudioCallBox";
import StoriesBox from "@/components/Features/StoriesBox";
import LiveLocationBox from "@/components/Features/LiveLocationBox";
import MultilingualBox from "@/components/Features/MultilingualBox";
import TransferBox from "@/components/Features/TransferBox";

export default function FeaturesSection() {
  return (
    <section className="w-full flex items-center justify-center">
      <div className="grid grid-cols-4 grid-rows-2 gap-4 h-[600px] w-full">
        {/* First row - 4 equal boxes */}
        <RealTimeMessagingBox />
        <AudioCallBox />
        <StoriesBox />
        <LiveLocationBox />

        <TransferBox />
        <MultilingualBox />
      </div>
    </section>
  );
}



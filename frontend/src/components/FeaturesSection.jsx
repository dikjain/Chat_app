import React from "react";
import RealTimeMessagingBox from "./RealTimeMessagingBox";
import AudioCallBox from "./AudioCallBox";
import VideoCallBox from "./VideoCallBox";
import StoriesBox from "./StoriesBox";
import LiveLocationBox from "./LiveLocationBox";
import MultilingualBox from "./MultilingualBox";
import TransferBox from "./TransferBox";

export default function FeaturesSection() {
  return (
    <section className="w-full flex items-center justify-center">
      <div className="grid grid-cols-4 grid-rows-2 gap-4 h-[600px] w-full">
        {/* First row - 4 equal boxes */}
        <RealTimeMessagingBox />
        <AudioCallBox />
        <VideoCallBox />
        <StoriesBox />

        <LiveLocationBox />
        <TransferBox />
        <MultilingualBox />
      </div>
    </section>
  );
}



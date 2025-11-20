import React from "react";
import RealTimeMessagingBox from "../components/RealTimeMessagingBox";
import AudioCallBox from "../components/AudioCallBox";
import VideoCallBox from "../components/VideoCallBox";
import StoriesBox from "../components/StoriesBox";
import LiveLocationBox from "../components/LiveLocationBox";
import MultilingualBox from "../components/MultilingualBox";
import TransferBox from "../components/TransferBox";

export default function LandingPage() {
  return (
    <div className="bg-white w-screen min-h-screen overflow-hidden px-32 flex items-center justify-center">
      <div className="grid grid-cols-4 grid-rows-2 gap-4 h-[600px] w-full">
        {/* First row - 4 equal boxes */}
        <RealTimeMessagingBox />
        <AudioCallBox />
        <VideoCallBox />
        <StoriesBox />

        {/* Second row - 2 equal boxes and 1 larger box */}
        <LiveLocationBox />
        <TransferBox />
        <MultilingualBox />
      </div>
    </div>
  );
}

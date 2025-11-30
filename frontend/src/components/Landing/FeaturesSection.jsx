import React from "react";
import RealTimeMessagingBox from "../Features/RealTimeMessagingBox";
import AudioCallBox from "../Features/AudioCallBox";
import VideoCallBox from "../Features/VideoCallBox";
import StoriesBox from "../Features/StoriesBox";
import LiveLocationBox from "../Features/LiveLocationBox";
import MessageTypeBox from "../Features/messageType";
import MultilingualBox from "../Features/MultilingualBox";

export default function FeaturesSection() {
  return (
    <section className="w-full flex items-center justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-auto md:h-[1200px] lg:h-[600px] w-full" style={{ gridAutoRows: '1fr' }}>
        {/* First row - 4 equal boxes */}
        <RealTimeMessagingBox />
        <AudioCallBox />
        <VideoCallBox />
        <StoriesBox />

        {/* Second row */}
        <LiveLocationBox />
        <MessageTypeBox />
        <MultilingualBox />
      </div>
    </section>
  );
}



import React from "react";


const MessageTypeBox = ({ className = "" }) => {
  return (
    <div
      className={`bg-neutral-50 border border-neutral-300 h-full relative overflow-hidden rounded-lg px-4 py-6 group ${className}`}
    >
      <div className="w-full z-0 h-full scale-75 ease-out group-hover:scale-110 transition-all duration-300 opacity-60 group-hover:opacity-80 translate-y-1/2 absolute bottom-0 right-0 bg-[radial-gradient(circle,_#22c55e,_#4ade80,_#86efac,_#bbf7d0,_transparent,transparent)] blur-[64px]"></div>
    </div>
  );
};

export default MessageTypeBox;

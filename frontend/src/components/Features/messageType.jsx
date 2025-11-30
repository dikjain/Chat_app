import React, { useState } from "react";
import { StripedPattern } from "@/components/UI/StripedPattern";
import { motion } from "framer-motion";
import FeatureHeader from "./FeatureHeader";


const File = ({ isHovered }) => (
  <motion.div 
  animate={{ 
    rotate: isHovered ? 8 : 4,
    x: isHovered ? 60 : 10,
  }}
  transition={{ 
    type: "spring", 
    stiffness: 300, 
    damping: 20 
  }} className=" rounded-lg h-44 w-36 absolute bg-white shadow-[0px_1px_2px_0_rgba(0,0,0,0.14)] overflow-hidden flex flex-col items-center justify-between p-2">
    {Array.from({ length: 10 }, (_, i) => (
      <div key={i} style={{ height: 1 }} className="w-full  bg-neutral-200 " />
    ))}
  </motion.div>
)

const Video = ({ isHovered }) => (
  <motion.div 
  animate={{ 
    y: isHovered ? -10 : 0,
    scale: isHovered ? 1.1 : 1,
  }}
  transition={{ 
    type: "spring", 
    stiffness: 300, 
    damping: 20 
  }}
  className=" rounded-lg  h-44 w-36  absolute bg-white  shadow-[0px_1px_2px_0_rgba(0,0,0,0.14)] overflow-hidden p-1 z-50">
    <div className="size-full bg-neutral-200  rounded-md overflow-hidden relative p-2 gap-2 flex flex-col items-center justify-center">

      <div className="size-full bg-white  rounded-sm overflow-hidden relative p-1">
        <StripedPattern className="[mask-image:radial-gradient(300px_circle_at_center,white,transparent)] text-neutral-200" />
      </div>


<div className=" py-2 px-1 rounded-sm w-full bg-white">
      <div className="h-0.5 w-full bg-neutral-300 rounded-full relative flex items-center ">
        <div className="absolute left-1/2 -translate-x-1/2 size-2 shadow bg-neutral-500 z-10 rounded-full "></div>
        <div className="absolute  h-full w-1/2 bg-neutral-400  "></div>
      </div>
  </div>


    </div>
  </motion.div>
)
const Image = ({ isHovered }) => (
  <motion.div 
  animate={{ 
    rotate: isHovered ? -8 : -4,
    x: isHovered ? -60 : -10,
  }}
  transition={{ 
    type: "spring", 
    stiffness: 300, 
    damping: 20 
  }} className=" rounded-lg h-40 w-32  absolute bg-white z-20  shadow-[0px_1px_2px_0_rgba(0,0,0,0.14)] overflow-hidden p-1">
    <div className="size-full bg-neutral-200  rounded-md overflow-hidden relative p-2 gap-2 flex flex-col items-center justify-center">

    <div className="size-full bg-white rounded-sm shadow-sm overflow-hidden relative p-1" style={{
      backgroundImage: `repeating-linear-gradient(
        45deg,
        transparent,
        transparent 8px,
        #ffffff 8px,
        #e5e5e5 16px
      ), repeating-linear-gradient(
        -45deg,
        transparent,
        transparent 8px,
        #ffffff 8px,
        #f5f5f5 16px
      )`,
      backgroundSize: '16px 16px'
    }}>
    </div>


    </div>
  </motion.div>
)

const FileShareIcon = () => (
  <svg width="18" height="18" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M7.5 8.5L12.5 3.5L17.5 8.5"
      stroke="currentColor"
      strokeMiterlimit="10"
      strokeLinejoin="round"
      strokeLinecap="round"
      strokeWidth="1.5"
    />
    <path
      d="M12.5 3.5V15.5"
      stroke="currentColor"
      strokeMiterlimit="10"
      strokeLinejoin="round"
      strokeLinecap="round"
      strokeWidth="1.5"
    />
    <path
      d="M4.5 15.5V19.5C4.5 20.0523 4.94772 20.5 5.5 20.5H19.5C20.0523 20.5 20.5 20.0523 20.5 19.5V15.5"
      stroke="currentColor"
      strokeMiterlimit="10"
      strokeLinejoin="round"
      strokeLinecap="round"
      strokeWidth="1.5"
    />
  </svg>
);

const MessageTypeBox = ({ className = "" }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`bg-neutral-50 border border-neutral-300 h-full relative overflow-hidden rounded-lg px-4 py-4 group flex flex-col ${className}`}
    >
      <FeatureHeader 
        title="Media Sharing" 
        description="Share images, videos, and documents seamlessly" 
      />

      <div className="flex items-center justify-center gap-2 mt-4 flex-1 relative z-10">
        <Video isHovered={isHovered} />
      <File isHovered={isHovered}   />
      <Image isHovered={isHovered} />
      </div>

      <div className="w-full z-0 h-full scale-75 ease-out group-hover:scale-110 transition-all duration-300 opacity-40 group-hover:opacity-60 translate-y-1/2 absolute bottom-0 right-0 bg-[radial-gradient(circle,_#22c55e,_#4ade80,_#86efac,_#bbf7d0,_transparent,transparent)] blur-[64px]"></div>
      <div 
        className="w-full z-[100] absolute inset-0 bg-white pointer-events-none"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent, transparent, transparent,  white)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, transparent, transparent, white)'
        }}
      ></div>
    </div>
  );
};

export default MessageTypeBox;

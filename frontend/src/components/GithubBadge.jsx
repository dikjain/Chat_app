import React, { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";
import { PlusIcon } from "../svg/svgs.jsx";

export default function GithubBadge() {
  const [isHovered, setIsHovered] = useState(false);
  
  const cornerPositions = [
    { position: "-translate-x-1/2 -translate-y-1/2 top-0 left-0" },
    { position: "translate-x-1/2 -translate-y-1/2 top-0 right-0" },
    { position: "-translate-x-1/2 translate-y-1/2 bottom-0 left-0" },
    { position: "translate-x-1/2 translate-y-1/2 bottom-0 right-0" }
  ];

  return (
    <div className="p-2 relative  scale-75 md:scale-100  border w-fit  mx-auto"> 
      {cornerPositions.map((corner, index) => (
        <PlusIcon 
          key={index}
          className={`absolute ${corner.position} w-4 h-4`}
        />
      ))}

    <motion.div 
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
    className="bg-gray-200 rounded-full p-1 flex items-center font-serif cursor-default shadow-[inset_0px_1px_2px_rgba(0,0,0,0.2)]">
       <span className="text-sm font-inter px-2 absolute text-neutral-600  ">We're Proudly </span> 
      <div
    className={`px-2 flex gap-2 p-1 bg-white rounded-full relative z-10 items-center justify-center shadow-[0px_1px_2px_rgba(0,0,0,0.2)] ${isHovered ? "ml-[110px]" : "ml-0"} transition-all duration-300`}>
        <FaGithub className="text-2xl" />
        <span className="text-xs text-neutral-600  font-inter uppercase font-semibold">open source</span>
      </div>
    </motion.div>
           </div>
  );
}

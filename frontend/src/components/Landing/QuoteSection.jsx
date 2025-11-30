import React from "react";
import Noise from "@/components/Noise";
import { PlusIcon } from "@/svg/svgs.jsx";

export default function QuoteSection() {
  const cornerPositions = [
    { position: "-translate-x-1/2 -translate-y-1/2 top-0 left-0" },
    { position: "translate-x-1/2 -translate-y-1/2 top-0 right-0" },
    { position: "-translate-x-1/2 translate-y-1/2 bottom-0 left-0" },
    { position: "translate-x-1/2 translate-y-1/2 bottom-0 right-0" }
  ];

  return (
    <section className="mx-auto flex items-center justify-center w-fit py-32 md:py-64">
      <div className=" p-2 md:p-4 relative border border-neutral-200 w-fit">
        {cornerPositions.map((corner, index) => (
          <PlusIcon 
            key={index}
            className={`absolute ${corner.position} w-4 h-4`}
          />
        ))}
        <div 
          className="w-full  relative overflow-hidden py-4 md:py-8 px-4 md:px-16 rounded-xl bg-gradient-to-b from-green-400 to-green-700 flex items-center justify-center shadow-[inset_0px_2px_4px_rgba(255,255,255,0.6)]"
        >
          <div className="absolute inset-0">
            <Noise
              patternSize={1}
              patternScaleX={1}
              patternScaleY={1}
              patternRefreshInterval={8}
              patternAlpha={12}
            />
          </div>
          <span className=" text-2xl md:text-4xl text-center sm:text-left xl:text-6xl font-medium font-inter text-neutral-200/80">
            "We ain't no <span className="text-neutral-200 underline font-semibold italic">Nokia</span> ,<br/>{" "} yet we connecting people."
          </span>
        </div>
      </div>
    </section>
  );
}

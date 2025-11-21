import React from "react";
import Noise from "./Noise";

export default function QuoteSection() {
  return (
    <section className="mx-auto flex items-center justify-center w-fit py-32">
      <div 
        style={{boxShadow : "inset 0px 2px 4px rgba(255,255,255,0.6)"}}
        className="w-full h-[200px] relative overflow-hidden py-6 px-16 rounded-xl bg-gradient-to-b from-green-400 to-green-700 flex items-center justify-center"
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
        <span className="text-6xl font-medium font-inter text-neutral-200/80">
          "We ain't no <span className="text-neutral-200 underline font-semibold">Nokia</span> ,<br/>{" "} yet we connecting people."
        </span>
      </div>
    </section>
  );
}


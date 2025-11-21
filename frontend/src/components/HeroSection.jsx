import React from "react";
import { MainButton } from "./MainButton";
import GithubBadge from "./GithubBadge";

export default function HeroSection() {
  return (
    <section className="w-full min-h-screen py-16  relative ">
      <GithubBadge />

      <h2 className="text-5xl font-medium font-inter mt-16 italic capitalize">
        better way to talk<br/><span 
          className="text-green-600 font-semibold font-saira">smarter</span> way to connect
      </h2>

      <div className="mt-12 ml-4 flex gap-2">
        <MainButton className={"h-fit"}>
          Try Chat-ly 
        </MainButton>
      </div>

      <div
       className="size-full p-24   pr-0 relative">
        <div className="size-full relative  ">
            <div style={{maskImage : "linear-gradient(to bottom,   transparent,   transparent , black)"}} className="absolute bg-white inset-0"/>
        <div  className="size-full border-8 border-neutral-200  rounded-xl overflow-hidden  ">
        <img 
          src="https://www.sellyoursaas.org/medias/image/sellyoursaas.org/images/Example_screen_datadog.png" 
          alt="Hero Image" 
          className="w-full h-full object-cover "
          style={{
            transformOrigin: 'center ',
            borderRadius: '8px',
            opacity: 1,
        }}
        />
        </div>
        </div>
      </div>
    </section>
  );
}


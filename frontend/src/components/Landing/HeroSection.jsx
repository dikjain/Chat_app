import React from "react";
import { MainButton } from "./MainButton";
import GithubBadge from "../GithubBadge";

export default function HeroSection() {
  return (
    <section className="w-full min-h-screen md:py-16 py-8  relative ">
      <GithubBadge />

      <h2 className=" text-4xl xl:text-5xl text-neutral-600 font-medium font-inter  md:mt-16 mt-8 italic capitalize">
        better way to talk<br/><span 
          className="text-green-600   font-semibold font-saira">smarter</span> way to connect
      </h2>

      <div className="mt-6 md:mt-12 xl:ml-4 ml-0 flex gap-2">
        <MainButton className={"h-fit"}>
          Try Chat-ly 
        </MainButton>
      </div>

      <div
       className="size-full mt-8 md:mt-0 pr-0    p-2 md:p-16 xl:p-24 relative">
        <div className="size-full relative  ">
            <div className="absolute bg-white inset-0 [mask-image:linear-gradient(to_bottom,transparent,transparent,transparent,transparent,black)]  md:[mask-image:linear-gradient(to_bottom,transparent,transparent,black)]"/>
        <div  className="size-full border-8 border-neutral-200  rounded-xl overflow-hidden  ">
        <img 
          src="https://www.sellyoursaas.org/medias/image/sellyoursaas.org/images/Example_screen_datadog.png" 
          alt="Hero Image" 
          className="w-full h-full object-cover origin-center rounded-lg opacity-100"
        />
        </div>
        </div>
      </div>
    </section>
  );
}


import { useEffect, useState } from "react";
import logo from "@/assets/logo.png";
import FeatureHeader from "./FeatureHeader";


const StoriesIcon = () => (
  <svg width="18" height="18" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12.5" cy="12.5" r="10" stroke="currentColor" strokeMiterlimit="10" strokeLinejoin="round" strokeLinecap="round" strokeWidth="1.5"/>
    <circle cx="12.5" cy="12.5" r="6" stroke="currentColor" strokeMiterlimit="10" strokeLinejoin="round" strokeLinecap="round" strokeWidth="1.5"/>
    <circle cx="12.5" cy="12.5" r="2" fill="currentColor"/>
  </svg>
);

const StoriesBox = ({ className = "" }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [ currentIndex, setCurrentIndex ] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => prevIndex === 7 ? 1 : prevIndex + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`bg-neutral-50 border relative group border-neutral-300 overflow-hidden gap-6 rounded-lg px-4 py-4 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <FeatureHeader 
        title="Stories" 
        description="Share moments that disappear in 24 hours" 
      />

      {/* Add your custom stories preview content here */}
      <div className="h-64 w-64 absolute -bottom-8 p-2 bg-white rounded-lg overflow-hidden rounded-br-none border border-neutral-200 shadow-md -translate-x-[20%]">
        <div className="size-full relative  bg-neutral-100 border border-neutral-200   rounded-md overflow-hidden">
            <div className="w-full h-6 border-b border-neutral-200 flex items-center justify-between px-2 gap-1">
              {Array.from({ length: 7 }).map((_, index) => {
                const storyIndex = index + 1;
                return (
                  <div key={storyIndex} onClick={() => setCurrentIndex(storyIndex)} className={`w-4 h-4  transition-all duration-300 bg-neutral-200 rounded-full border border-neutral-300 ${currentIndex === storyIndex ? 'group-hover:bg-green-200' : ''}`}></div>
                );
              })}
            </div>

            <div className=" size-full flex items-center justify-center p-10">
                <div className="size-full bg-stone-200 rounded-md p-2 pb-0 border border-neutral-300">
                <div className="size-full border border-neutral-300 bg-neutral-100 rounded-md p-2 flex items-center justify-center">
                    <img src={logo} alt="story" className="size-24 blur-sm group-hover:blur-none transition-all duration-300 object-cover rounded-md" />
                
                </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default StoriesBox;

import { useState } from "react";
import PixelBlast from "@/components/Authentication/PixelBlast";

const VideoCallIcon = () => (
  <svg width="18" height="18" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5.5 7.5C5.5 6.94772 5.94772 6.5 6.5 6.5H13.5C14.0523 6.5 14.5 6.94772 14.5 7.5V17.5C14.5 18.0523 14.0523 18.5 13.5 18.5H6.5C5.94772 18.5 5.5 18.0523 5.5 17.5V7.5Z"
      stroke="currentColor"
      strokeMiterlimit="10"
      strokeLinejoin="round"
      strokeLinecap="round"
      strokeWidth="1.5"
    />
    <path
      d="M14.5 9.5L19.5 6.5V18.5L14.5 15.5"
      stroke="currentColor"
      strokeMiterlimit="10"
      strokeLinejoin="round"
      strokeLinecap="round"
      strokeWidth="1.5"
    />
  </svg>
);

const VideoPreview = ({translateX, translateY, translateZ,rotateY,rotateX,scale}) => {
  return (
    <div 
      style={{
        transform: `translateX(${translateX}) translateY(${translateY}) translateZ(${translateZ}) rotateY(${rotateY}) rotateX(${rotateX}) scale(${scale})`,
        transition: 'transform 0.3s ease-out',
        transformStyle: 'preserve-3d'
      }}
      className="h-48 w-64  absolute bottom-6 left-1/2 bg-white rounded-lg overflow-hidden border border-neutral-200 shadow-md ">
      <div className="h-6  border-b border-neutral-200  flex bg-gray-100 items-center px-3 justify-center">
        <div className="size-3 rounded bg-neutral-400  flex items-center justify-center">
          <div className=" size-full scale-50 rounded-full bg-neutral-200"/>
        </div>
      </div>

      <div className=" absolute  inset-4 mt-5  mx-auto bg-gray-100 rounded-sm border border-neutral-200 ">
        <PixelBlast
        variant="circle"
        pixelSize={6}
        color="#d0d0d0"
        patternScale={3}
        patternDensity={2}
        pixelSizeJitter={0.5}
        speed={0.6}
        edgeFade={0.25}
        transparent/>
        </div>
      <div className="absolute bottom-2 left-20 right-20 h-4 mx-auto bg-white border border-neutral-200 shadow-sm rounded flex items-center justify-center gap-2 px-2">
        {/* Mic icon */}
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="2" width="4" height="6" rx="2" stroke="currentColor" strokeWidth="1" fill="none"/>
          <path d="M6 9V11" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
          <path d="M3 6H9" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
        </svg>
        
        <div className="w-px h-2 bg-neutral-300"/>
        
        {/* Call cut icon */}
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="6" cy="6" r="5" fill="#EF4444" stroke="#EF4444" strokeWidth="0.5"/>
          <path d="M4 4L8 8M8 4L4 8" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
        
        <div className="w-px h-2 bg-neutral-300"/>
        
        {/* Camera icon */}
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="4" width="8" height="6" rx="1" stroke="currentColor" strokeWidth="1" fill="none"/>
          <path d="M8 4L10 2H11V10H10L8 8" stroke="currentColor" strokeWidth="1" fill="none"/>
          <circle cx="6" cy="7" r="1.5" stroke="currentColor" strokeWidth="1" fill="none"/>
        </svg>
      </div>
    </div>
  );
};

const VideoCallBox = ({ className = "" }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`bg-neutral-50 border relative border-neutral-300 gap-6 rounded-lg px-4 py-6 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ perspective: '1000px' }}
    >
      {/* <div className="absolute top-0 left-0 w-full h-full  rounded-lg">
        <PixelBlast
        variant="circle"
        pixelSize={6}
        color="#f0f0f0"
        patternScale={3}
        patternDensity={2}
        pixelSizeJitter={0.5}
        speed={0.6}
        edgeFade={0.25}
        transparent/>
      </div> */}
      <div className="flex items-center gap-2">
        <VideoCallIcon />
        <h1 className="text-base font-medium text-neutral-700">Video Call</h1>
      </div>

      <>
        <VideoPreview translateX={'-24%'} translateY={'10%'} translateZ={'-10px'} rotateY={'-45deg'} rotateX={'10deg'} scale={0.7}/>
        <VideoPreview translateX={'-80%'} translateY={'-10%'} translateZ={'-10px'} rotateY={'40deg'} rotateX={'10deg'} scale={0.55}/>
      </>
    </div>
  );
};

export default VideoCallBox;


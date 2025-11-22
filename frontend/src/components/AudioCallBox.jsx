import { useState } from "react";

const AudioCallIcon = () => (
  <svg width="18" height="18" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M7.5 4.5C7.5 3.94772 7.94772 3.5 8.5 3.5C9.05228 3.5 9.5 3.94772 9.5 4.5V6.5C9.5 7.05228 9.05228 7.5 8.5 7.5C7.94772 7.5 7.5 7.05228 7.5 6.5V4.5Z"
      stroke="currentColor"
      strokeMiterlimit="10"
      strokeLinejoin="round"
      strokeLinecap="round"
      strokeWidth="1.5"
    />
    <path
      d="M15.5 4.5C15.5 3.94772 15.9477 3.5 16.5 3.5C17.0523 3.5 17.5 3.94772 17.5 4.5V6.5C17.5 7.05228 17.0523 7.5 16.5 7.5C15.9477 7.5 15.5 7.05228 15.5 6.5V4.5Z"
      stroke="currentColor"
      strokeMiterlimit="10"
      strokeLinejoin="round"
      strokeLinecap="round"
      strokeWidth="1.5"
    />
    <path
      d="M9.5 7.5L15.5 7.5C16.0523 7.5 16.5 7.94772 16.5 8.5V11.5C16.5 12.0523 16.0523 12.5 15.5 12.5H9.5C8.94772 12.5 8.5 12.0523 8.5 11.5V8.5C8.5 7.94772 8.94772 7.5 9.5 7.5Z"
      stroke="currentColor"
      strokeMiterlimit="10"
      strokeLinejoin="round"
      strokeLinecap="round"
      strokeWidth="1.5"
    />
    <path
      d="M4.5 2.5C4.5 2.22386 4.72386 2 5 2C5.27614 2 5.5 2.22386 5.5 2.5C5.5 2.77614 5.27614 3 5 3C4.72386 3 4.5 2.77614 4.5 2.5Z"
      stroke="currentColor"
      strokeMiterlimit="10"
      strokeLinejoin="round"
      strokeLinecap="round"
      strokeWidth="1.5"
    />
    <path
      d="M19.5 2.5C19.5 2.22386 19.7239 2 20 2C20.2761 2 20.5 2.22386 20.5 2.5C20.5 2.77614 20.2761 3 20 3C19.7239 3 19.5 2.77614 19.5 2.5Z"
      stroke="currentColor"
      strokeMiterlimit="10"
      strokeLinejoin="round"
      strokeLinecap="round"
      strokeWidth="1.5"
    />
  </svg>
);

const AudioCallBox = ({ className = "" }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`bg-neutral-50 border relative border-neutral-300  gap-6 rounded-lg px-4 py-6 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-2">
        <AudioCallIcon />
        <h1 className="text-base font-medium text-neutral-700">Audio Call</h1>
      </div>

      {/* Add your custom audio call preview content here */}
      <div className="h-48 w-64 absolute bottom-6  left-1/2 -translate-x-1/2  bg-white rounded-lg overflow-hidden border border-neutral-200 shadow-sm">
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="text-sm text-gray-500">Audio Call Preview</div>
            {/* Add your audio call specific UI here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioCallBox;






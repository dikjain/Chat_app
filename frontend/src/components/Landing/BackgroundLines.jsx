import React from 'react';
import { PlusIcon } from '@/svg/svgs';

const BackgroundLines = () => {
  return (
    <div className=" inset-0 absolute">
      <div className="absolute top-16 left-16  z-10 w-4 h-4 -translate-x-1/2 -translate-y-1/2">
        <PlusIcon className="w-4 h-4  "  stroke="#00000080" />
      </div>
      <div className="absolute bottom-16 left-16  z-10 w-4 h-4 -translate-x-1/2 translate-y-1/2">
        <PlusIcon className="w-4 h-4  "  stroke="#00000080" />
      </div>
      <div className="absolute top-16 right-16  z-10 w-4 h-4 translate-x-1/2 -translate-y-1/2">
        <PlusIcon className="w-4 h-4  "  stroke="#00000080" />
      </div>
      <div className="absolute bottom-16 right-16  z-10 w-4 h-4 translate-x-1/2 translate-y-1/2">
        <PlusIcon className="w-4 h-4  "  stroke="#00000080" />
      </div>
      <div className="absolute  bottom-16 h-px w-full bg-gray-300"></div>
      <div className="absolute  top-16 h-px w-full bg-gray-300"></div>
      <div className="absolute left-16 top-0 w-px h-full bg-gray-300"></div>
      <div className="absolute right-16 top-0 w-px h-full bg-gray-300"></div>
    </div>
  );
};

export default BackgroundLines;
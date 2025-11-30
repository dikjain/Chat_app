import React from 'react';
import { PlusIcon } from '../../svg/svgs';

const BackgroundLines = () => {
  return (
    <div className=" inset-0 absolute">
      <div className="absolute top-16 xl:left-16 md:left-8 left-3  z-10 w-4 h-4 -translate-x-1/2 -translate-y-1/2">
        <PlusIcon className="w-4 h-4  "  stroke="#00000080" />
      </div>
      <div className="absolute bottom-16  xl:left-16 md:left-8 left-3  z-10 w-4 h-4 -translate-x-1/2 translate-y-1/2">
        <PlusIcon className="w-4 h-4  "  stroke="#00000080" />
      </div>
      <div className="absolute top-16 xl:right-16 md:right-8 right-3  z-10 w-4 h-4 translate-x-1/2 -translate-y-1/2">
        <PlusIcon className="w-4 h-4  "  stroke="#00000080" />
      </div>
      <div className="absolute bottom-16 xl:right-16 md:right-8 right-3  z-10 w-4 h-4 translate-x-1/2 translate-y-1/2">
        <PlusIcon className="w-4 h-4  "  stroke="#00000080" />
      </div>
      <div className="absolute  bottom-16 h-px w-full bg-gray-300"></div>
      <div className="absolute  top-16  h-px w-full bg-gray-300"></div>
      <div className="absolute xl:left-16 md:left-8 left-3   top-0 w-px h-full bg-gray-300"></div>
      <div className="absolute xl:right-16 md:right-8 right-3  top-0 w-px h-full bg-gray-300"></div>
    </div>
  );
};

export default BackgroundLines;
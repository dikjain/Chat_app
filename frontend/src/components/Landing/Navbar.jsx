import React from "react";
import logo from "../../assets/logo.png";

export default function Navbar() {
  return (
    <div className="h-16 flex items-center justify-between px-10 xl:px-32 absolute top-0 left-0 right-0">
      <div className="flex items-center gap-2">
        <img src={logo} alt="logo" className="h-10 w-10" />
        <h1 className="text-2xl font-bold">Chat-ly</h1>
      </div>
      <button className="text-neutral-500 z-20 py-0.5 rounded-md font-saira font-medium flex items-center gap-1">
        Get Started
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#737373"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="7" y1="17" x2="17" y2="7"></line>
          <polyline points="7 7 17 7 17 17"></polyline>
        </svg>
      </button>
    </div>
  );
}


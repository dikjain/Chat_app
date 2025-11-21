import React from "react";

export const PlusIcon = ({ className = "", stroke = "#00000070", strokeWidth = "1" }) => (
  <svg 
    className={className}
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={stroke} 
    strokeWidth={strokeWidth} 
    strokeLinecap="round"
  >
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);


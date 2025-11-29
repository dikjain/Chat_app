import { useState } from "react";
import { motion } from "framer-motion";

const TabSlider = ({ tabs, onTabChange, defaultTab }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <div className="bg-black/10 rounded-md p-1 flex items-center h-8 mx-auto w-fit justify-center shadow-in">
      <span className="flex items-center h-full justify-center gap-1 whitespace-nowrap">
        {tabs.flatMap((tab, index) => [
          <span key={tab} className="relative h-full flex items-center justify-center cursor-pointer min-w-fit" onClick={() => handleTabClick(tab)}>
            {activeTab === tab && (
              <motion.span
                layoutId="active-tab-bg"
                className="w-full h-full bg-white rounded-sm shadow-out absolute inset-0"
              />
            )}
            <span className="relative z-10 px-2 sm:px-3 text-xs font-saira font-medium text-neutral-500 whitespace-nowrap">
              {tab}
            </span>
          </span>,
          index < tabs.length - 1 && (
            <span key={`separator-${index}`} className="w-px h-6 bg-neutral-300 flex-shrink-0" />
          )
        ])}
      </span>
    </div>
  );
};

export default TabSlider;

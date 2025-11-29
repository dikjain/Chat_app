import { useState } from "react";
import { motion } from "framer-motion";
import FeatureHeader from "./FeatureHeader";

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

const CircleAvatar = ({ person, size = "w-8 h-8", borderColor = "border-black/30", opacity = 1 }) => (
  <motion.div
  layout={person.id === 6 ? false : true}
  style={{zIndex: person.id === 6 ? 100 : 1, boxShadow: person.id === 6 ? "0 0 10px 0 rgba(0, 0, 0, 0.1)" : "none", opacity: opacity}}
   className={`${size} transition-opacity duration-300 rounded-full border ${borderColor} overflow-hidden`}>
    <img
      src={person.image}
      alt={person.name}
      className="w-full h-full object-cover"
    />
  </motion.div>
);

const people = [
  {
    id: 1,
    name: "John Doe",
    designation: "Software Engineer",
    image:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80",
  },
  {
    id: 2,
    name: "Robert Johnson",
    designation: "Product Manager",
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 3,
    name: "Jane Smith",
    designation: "Data Scientist",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 4,
    name: "Emily Davis",
    designation: "UX Designer",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 5,
    name: "Tyler Durden",
    designation: "Soap Developer",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80",
  },
  {
    id: 6,
    name: "Dora",
    designation: "The Explorer",
    image:
      "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3534&q=80",
  },
];

const AudioCallBox = ({ className = "" }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`bg-neutral-50 border relative border-neutral-300 flex flex-col gap-2 rounded-lg px-4 py-4 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <FeatureHeader 
        title="Audio Call" 
        description="Quickly jump between one-on-one and group calls" 
      />

      <div className="relative size-full flex items-center   ">
        {/* Top left corner images */}
        <motion.div 
        layout
        className="absolute  border border-neutral-200 px-2 py-1 rounded-lg    flex gap-2">
          <CircleAvatar person={people[0]} opacity={isHovered ?  0.5 : 1} size="w-10 h-10"   />
          {!isHovered && (
            <motion.div layoutId="emily-avatar">
              <CircleAvatar person={people[5]} size="w-10 h-10"   />
            </motion.div>
          )}
        </motion.div>

        {/* Bottom right corner - grid arrangement */}
        <div className="absolute border border-neutral-200 p-2 rounded-lg right-0">
          <div className="grid grid-cols-3 gap-2 place-items-center">
            {people.map((person) => {
              if (person.id === 6 && !isHovered) return null;
              
              return (
                <motion.div
                  key={person.id}
                  layoutId={person.id === 6 ? "emily-avatar" : undefined}
                >
                  <CircleAvatar person={person} opacity={person.id === 6 ? 1 : isHovered ? 1 : 0.5} />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioCallBox;

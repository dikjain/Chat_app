import { useRef, useState } from "react";

const FeatureBox = ({ icon, title, className = "" }) => {
  const [isHovered, setIsHovered] = useState(false);
  const messages = [
    { id: 1, text: "Hey! How are you doing?", type: "received" },
    { id: 2, text: "Hey! How are you doing?", type: "sent" },
    { id: 3, text: "Great to hear!", type: "received" },
    { id: 4, text: "That's awesome! 🎉", type: "sent" },
  ];
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTimeout(() => {
      messagesContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }, 50);
  };

  return (
    <div
      className={`bg-neutral-50 border relative border-neutral-300  gap-6 rounded-lg px-4 py-6 ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-center gap-2">
        {icon}
        {title && <h1 className="text-base font-medium text-neutral-700">{title}</h1>}
      </div>

      <div className="h-48 w-64 absolute bottom-6  left-1/2 -translate-x-1/2  bg-white rounded-lg overflow-hidden border border-neutral-200 shadow-sm">
        <div className="h-6 flex bg-gray-100 items-center px-3 gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        
        {/* Chat messages area */}
        <div
          ref={messagesContainerRef}
          className="p-3 space-y-2 h-32 bg-gray-50 overflow-y-auto"
          style={{ scrollBehavior: "smooth" }}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`transition-opacity duration-300 ${
                message.id === 4 ? (isHovered ? "opacity-100" : "opacity-0") : ""
              } ${message.type === "received" ? "flex items-start gap-0.5" : "flex justify-end gap-0.5"}`}
            >
              {message.type === "received" ? (
                <>
                  <div className="w-5  h-5 -translate-y-2 rounded-full bg-neutral-400 flex-shrink-0"></div>
                  <div className="bg-white rounded-lg px-2 py-1 text-xs text-gray-500 border max-w-32">
                    {message.text}
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-blue-500 text-white/80 border rounded-lg px-2 py-1 text-xs max-w-48">
                    {message.text}
                  </div>
                  <div className="w-5  h-5 -translate-y-2 rounded-full bg-neutral-600 flex-shrink-0"></div>
                </>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input area */}
        <div className="h-8 bg-neutral-50 flex items-center px-2 gap-1">
          <div className={`flex-1 py-1 bg-gray-100 border font-medium  rounded-full text-xs flex items-center px-2 ${isHovered ? "text-gray-400" : "text-black/50"}`}>
            {isHovered ? "Type a message..." : "That's awesome! 🎉" }
          </div>
          <div className="p-2 bg-blue-500 rotate-180 rounded-full flex items-center justify-center">
            <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
              <path d="M1 6L11 1L6 6L11 11L1 6Z" fill="white" stroke="white" strokeWidth="1"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureBox;


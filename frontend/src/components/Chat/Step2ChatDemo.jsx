import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import ChatListItem from "./ChatListItem";
import cursorSvg from "/cursor.svg";

const Step2ChatDemo = () => {
  const [activeChatIndex, setActiveChatIndex] = useState(0);
  const [cursorPosition, setCursorPosition] = useState({ top: 0, left: 0 });
  const chatRefs = useRef([]);
  const containerRef = useRef(null);

  // Dummy data for ChatListItem components
  const dummyChats = [
    {
      _id: "dummy1",
      isGroupChat: false,
      users: [
        { _id: "user1", name: "John Doe", pic: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150" },
        { _id: "user2", name: "Jane Smith", pic: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150" }
      ],
      latestMessage: {
        content: "Hey, how are you doing?",
        sender: { name: "John Doe" }
      }
    },
    {
      _id: "dummy2",
      isGroupChat: true,
      chatName: "Project Team",
      users: [
        { _id: "user1", name: "Alice Johnson", pic: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150" },
        { _id: "user3", name: "Bob Wilson", pic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" },
        { _id: "user4", name: "Carol Brown", pic: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150" }
      ],
      latestMessage: {
        content: "Meeting at 3 PM today",
        sender: { name: "Alice Johnson" }
      }
    },
    {
      _id: "dummy3",
      isGroupChat: false,
      users: [
        { _id: "user1", name: "Mike Davis", pic: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150" },
        { _id: "user5", name: "Sarah Connor", pic: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150" }
      ],
      latestMessage: {
        content: "Thanks for the help!",
        sender: { name: "Sarah Connor" }
      }
    }
  ];

  const dummyUser = { _id: "user1", name: "Current User" };
  const dummyOnlinePeople = ["user2", "user3"];

  // Update cursor position when active chat changes
  useEffect(() => {
    const updatePosition = () => {
      const activeRef = chatRefs.current[activeChatIndex];
      const container = containerRef.current;
      if (!activeRef || !container) return;
      
      const rect = activeRef.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      
      setCursorPosition({
        top: rect.top - containerRect.top + rect.height / 2 - 14,
        left: rect.left / 6,
      });
    };

    updatePosition();
    const timeout = setTimeout(updatePosition, 100);

    return () => clearTimeout(timeout);
  }, [activeChatIndex]);

  // Cycle through chats with setTimeout
  useEffect(() => {
    if (chatRefs.current.length === 0) return;

    const interval = setInterval(() => {
      setActiveChatIndex((prev) => (prev + 1) % dummyChats.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [dummyChats.length]);

  return (
    <div ref={containerRef} className="space-y-2 px-8 overflow-y-auto flex-1 relative">
      {dummyChats.map((chat, index) => (
        <div
          key={chat._id}
          ref={(el) => (chatRefs.current[index] = el)}
          className="relative"
        >
          <ChatListItem
            chat={chat}
            loggedUser={dummyUser}
            user={dummyUser}
            selectedChat={index === activeChatIndex ? chat : null}
            onlinepeople={dummyOnlinePeople}
            setSelectedChat={() => {}}
          />
        </div>
      ))}
      {chatRefs.current.length > 0 && (
        <motion.div
          layoutId="cursor"
          className="absolute pointer-events-none z-50 left-1/2"
          initial={false}
          animate={cursorPosition}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        >
          <img src={cursorSvg} alt="cursor" className="w-7 h-7" />
        </motion.div>
      )}
    </div>
  );
};

export default Step2ChatDemo;


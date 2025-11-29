import { useEffect, useState } from "react";
import SingleChat from "./SingleChat";
import { useChatStore } from "@/stores";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const selectedChat = useChatStore((state) => state.selectedChat);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
    style={{ flex: isMobile ? '1 1 100%' : '0 1 70%' }}
      className={`${selectedChat ? "flex" : "hidden"} h-full ring-neutral-300 ring-2 md:flex items-center flex-col p-3 bg-white rounded-lg border overflow-hidden`}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </div>
  );
};

export default Chatbox;
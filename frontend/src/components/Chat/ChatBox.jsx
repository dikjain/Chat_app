import SingleChat from "./SingleChat";
import { useChatStore } from "@/stores";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const selectedChat = useChatStore((state) => state.selectedChat);

  return (
    <div
    style={{ flex: '0 1 70%' }}
      className={`${selectedChat ? "flex" : "hidden"} h-full ring-neutral-300 ring-2 md:flex items-center flex-col p-3 bg-white rounded-lg border overflow-hidden`}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </div>
  );
};

export default Chatbox;
import SingleChat from "./SingleChat";
import { useChatStore } from "@/stores";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const selectedChat = useChatStore((state) => state.selectedChat);

  return (
    <div
      className={`${selectedChat ? "flex" : "hidden"} md:flex items-center flex-col p-3 bg-black w-full md:w-[68%] rounded-lg border overflow-hidden`}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </div>
  );
};

export default Chatbox;
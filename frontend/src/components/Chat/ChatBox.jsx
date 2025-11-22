import "@/styles/components.css";
import SingleChat from "./SingleChat";
import { ChatState } from "@/context/Chatprovider";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <div
      className={`${selectedChat ? "flex" : "hidden"} md:flex items-center flex-col p-3 bg-black w-full md:w-[68%] rounded-lg border overflow-hidden`}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </div>
  );
};

export default Chatbox;
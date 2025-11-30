import { Plus } from "lucide-react";
import GroupChatModal from "../Modals/GroupChatModal";
import ButtonWrapper from "../UI/buttonWrapper";
import TabSlider from "../UI/TabSlider";

const MyChatsHeader = () => {
  const tabs = ["My Chats", "Online Users"];

  return (
    <div className=" xl:pt-3 xl:pb-3 pb-2 pt-0 w-full flex xl:flex-row flex-col-reverse xl:justify-between xl:items-center items-stretch gap-3 font-saira">
      <div className="flex-shrink-0 xl:w-auto w-full">
        <TabSlider tabs={tabs} defaultTab="My Chats" />
      </div>
      <div className="flex-shrink-0 xl:w-auto w-full flex justify-end">
        <GroupChatModal>
          <ButtonWrapper>
            <button className="flex items-center text-[10px] gap-1 xl:text-xs whitespace-nowrap  bg-white text-black rounded-md px-2 py-1 shadow-[0_1px_2px_0_rgba(0,0,0,0.3)]">
              <Plus className="ml-1 h-2 w-2 xl:h-4 xl:w-4" />
              New Group Chat
            </button>
          </ButtonWrapper>
        </GroupChatModal>
      </div>
    </div>
  );
};

export default MyChatsHeader;

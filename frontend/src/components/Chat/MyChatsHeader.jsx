import { Plus } from "lucide-react";
import GroupChatModal from "@/components/Modals/GroupChatModal";
import ButtonWrapper from "@/components/UI/buttonWrapper";
import TabSlider from "@/components/UI/TabSlider";

const MyChatsHeader = () => {
  const tabs = ["My Chats", "Online Users"];

  return (
    <div className="py-3 text-lg   flex w-full justify-between items-center font-saira">
      <TabSlider tabs={tabs} defaultTab="My Chats" />
      <GroupChatModal>
        <ButtonWrapper>
          <button className="flex text-lg gap-1 md:text-xs lg:text-md bg-white text-black rounded-md px-2 py-1 shadow-[0_1px_2px_0_rgba(0,0,0,0.3)]">
            <Plus className="ml-1 h-4 w-4" />
            New Group Chat
          </button>
        </ButtonWrapper>
      </GroupChatModal>
    </div>
  );
};

export default MyChatsHeader;

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import { motion } from "framer-motion";
import { accessChat } from "@/api";
import ChatLoading from "@/components/Chat/ChatLoading";
import UserListItem from "@/components/UI/UserListItem";
import { useAuthStore, useChatStore } from "@/stores";
import { FaSearch } from "react-icons/fa";
import { useUserSearch } from "@/hooks";
import ButtonWrapper from "./buttonWrapper";
import NotificationDropdown from "./NotificationDropdown";
import ProfileDropdown from "./ProfileDropdown";
import GoButton from "./GoButton";


function SideDrawer() {
  const [search, setSearch] = useState("");
  const [loadingChat, setLoadingChat] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const setSelectedChat = useChatStore((state) => state.setSelectedChat);
  const addChat = useChatStore((state) => state.addChat);
  
  const { searchUsers, searchResult, loading } = useUserSearch();

  const handleSearch = async () => {
    await searchUsers(search);
  };

  const handleAccessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const data = await accessChat(userId);
      addChat(data); // Use Zustand action
      setSelectedChat(data);
      setIsOpen(false);
    } finally {
      setLoadingChat(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center w-full">
          <ButtonWrapper onClick={() => setIsOpen(true)}>
            <span className="bg-white hover:bg-neutral-50 px-3 z-10 flex items-center justify-center py-1.5 relative rounded-md font-medium font-saira text-sm text-neutral-600 border border-neutral-200 shadow-[0_1px_2px_0_rgba(0,0,0,0.2)] gap-2 transition-colors">
              <FaSearch className="w-3 h-3" />
              Search Users
            </span>
          </ButtonWrapper>

        <div className="flex gap-2">
          <NotificationDropdown />
          <ProfileDropdown />
        </div>
      </div>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" className="bg-stone-100 border-neutral-200 w-[300px] sm:w-[400px]">
          <SheetHeader className="border-b border-neutral-200 pb-2">
            <SheetTitle className="text-neutral-500 font-semibold " >
              Search Users
            </SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-2 mt-4 h-full ">
            <div className="flex gap-2 pb-2 flex-shrink-0">
              <Input
                placeholder="Search by name or email"
                className="bg-white border-neutral-300 placeholder:text-neutral-400 text-neutral-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <GoButton onClick={handleSearch} />
            </div>
            <div className="flex-1 overflow-y-auto scroll-smooth" style={{ scrollBehavior: 'smooth' }}>
              {loading ? (
                <ChatLoading />
              ) : (
                <div className="space-y-2 pb-12">
                  {searchResult?.map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => handleAccessChat(user._id)}
                    />
                  ))}
                </div>
              )}
              {loadingChat && (
                <div className="ml-auto flex">
                  <Spinner className="h-6 w-6" style={{ color: "#10b981" }} />
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

export default SideDrawer;

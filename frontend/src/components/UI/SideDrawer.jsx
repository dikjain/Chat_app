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
import { accessChat } from "@/api";
import ChatLoading from "@/components/Chat/ChatLoading";
import UserListItem from "@/components/UI/UserListItem";
import { useAuthStore, useChatStore } from "@/stores";
import { FaSearch } from "react-icons/fa";
import { useUserSearch } from "@/hooks";
import ButtonWrapper from "./buttonWrapper";
import NotificationDropdown from "./NotificationDropdown";
import ProfileDropdown from "./ProfileDropdown";


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
      <div
        className="flex justify-between items-center     text-[#10b981] w-full   "
      >
          <ButtonWrapper onClick={() => setIsOpen(true)}>
            <span className="bg-white hover:bg-white/70 px-3 z-10 flex items-center justify-center py-1.5 relative rounded-md font-medium font-saira text-sm text-neutral-500 shadow-[0_1px_2px_0_rgba(0,0,0,0.3)] gap-2">
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
        <SheetContent side="left" className="bg-black text-[#10b981] w-[300px] sm:w-[400px]">
          <SheetHeader className="border-b pb-2" style={{ color: "#10b981" }}>
            <SheetTitle>Search Users</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-4 mt-4">
            <div className="flex gap-2 pb-2">
              <Input
                placeholder="Search by name or email"
                className="bg-black border-[#10b981] placeholder:text-gray-500"
                style={{ color: "#10b981", borderColor: "#10b981" }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch} className="bg-green-600 hover:bg-green-700">
                Go
              </Button>
            </div>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAccessChat(user._id)}
                />
              ))
            )}
            {loadingChat && (
              <div className="ml-auto flex">
                <Spinner className="h-6 w-6" style={{ color: "#10b981" }} />
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

export default SideDrawer;

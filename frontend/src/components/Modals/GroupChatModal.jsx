import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { toast } from "sonner";
  import { searchUsers, createGroupChat } from "@/api";
  import { useState } from "react";
  import { useAuthStore, useChatStore, useThemeStore } from "@/stores";
  import UserBadgeItem from "@/components/UI/UserBadgeItem";
  import UserListItem from "@/components/UI/UserListItem";
  
  const GroupChatModal = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
  
    const user = useAuthStore((state) => state.user);
    const chats = useChatStore((state) => state.chats);
    const addChat = useChatStore((state) => state.addChat);
    const primaryColor = useThemeStore((state) => state.primaryColor);
  
    const handleGroup = (userToAdd) => {
      if (selectedUsers.includes(userToAdd)) {
        toast.warning("User already added");
        return;
      }
  
      setSelectedUsers([...selectedUsers, userToAdd]);
    };
  
    const handleSearch = async (query) => {
      setSearch(query);
      if (!query) {
        return;
      }
  
      try {
        setLoading(true);
        const data = await searchUsers(search);
        setLoading(false);
        setSearchResult(data);
      } catch (error) {
        // Error handling is done by interceptor
        setLoading(false);
      }
    };
  
    const handleDelete = (delUser) => {
      setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
    };
  
    const handleSubmit = async () => {
      if (!groupChatName || !selectedUsers) {
        toast.warning("Please fill all the fields");
        return;
      }
  
      try {
        const data = await createGroupChat(groupChatName, selectedUsers);
        addChat(data);
        setIsOpen(false);
        toast.success("New Group Chat Created!");
      } catch (error) {
        // Error handling is done by interceptor
      }
    };
  
    return (
      <>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild onClick={() => setIsOpen(true)}>
            {children}
          </DialogTrigger>
          <DialogContent className="bg-black text-[#10b981] max-w-lg border" style={{ borderColor: primaryColor }}>
            <DialogHeader>
              <DialogTitle className="text-[35px] font-['Work_sans'] flex justify-center text-[#10b981]">
                Create Group Chat
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center">
              <div className="w-full mb-3">
                <Input
                  placeholder="Chat Name"
                  className="bg-black border-[#10b981] placeholder:text-gray-500 text-[#10b981]"
                  onChange={(e) => setGroupChatName(e.target.value)}
                />
              </div>
              <div className="w-full mb-1">
                <Input
                  placeholder="Add Users eg: abc123, ad"
                  className="bg-black border-[#10b981] placeholder:text-gray-500 text-[#10b981]"
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              <div className="w-full flex flex-wrap">
                {selectedUsers.map((u) => (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleDelete(u)}
                  />
                ))}
              </div>
              {loading ? (
                <div>Loading...</div>
              ) : (
                searchResult
                  ?.slice(0, 4)
                  .map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => handleGroup(user)}
                    />
                  ))
              )}
            </div>
            <DialogFooter>
              <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                Create Chat
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  };
  
  export default GroupChatModal;

  
import { Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { searchUsers, renameGroupChat, addUserToGroup, removeUserFromGroup } from "@/api";
import { useState } from "react";
import { useAuthStore, useChatStore, useThemeStore } from "@/stores";
import UserBadgeItem from "@/components/UI/UserBadgeItem";
import UserListItem from "@/components/UI/UserListItem";

const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);

  const user = useAuthStore((state) => state.user);
  const selectedChat = useChatStore((state) => state.selectedChat);
  const setSelectedChat = useChatStore((state) => state.setSelectedChat);
  const updateChat = useChatStore((state) => state.updateChat);

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

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const data = await renameGroupChat(selectedChat._id, groupChatName);
      updateChat(selectedChat._id, data);
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      // Error handling is done by interceptor
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast.error("User Already in group!");
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast.error("Only admins can add someone!");
      return;
    }

    try {
      setLoading(true);
      const data = await addUserToGroup(selectedChat._id, user1._id);
      updateChat(selectedChat._id, data);
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      // Error handling is done by interceptor
      setLoading(false);
    }
    setGroupChatName("");
  };

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast.error("Only admins can remove someone!");
      return;
    }

    try {
      setLoading(true);
      const data = await removeUserFromGroup(selectedChat._id, user1._id);
      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      // Error handling is done by interceptor
      setLoading(false);
    }
    setGroupChatName("");
  };

  return (
    <>
      <Button variant="ghost" size="icon" className="flex" onClick={() => setIsOpen(true)}>
        <Eye className="h-4 w-4" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-black text-[#10b981] max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[35px] font-['Work_sans'] flex justify-center text-[#10b981]">
              {selectedChat.chatName}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center">
            <div className="w-full flex flex-wrap pb-3">
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  admin={selectedChat.groupAdmin}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </div>
            <div className="flex w-full mb-3">
              <Input
                placeholder="Chat Name"
                className="bg-black border-[#10b981] placeholder:text-gray-500 text-[#10b981]"
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                className="ml-1 bg-green-600 hover:bg-green-700"
                onClick={handleRename}
                disabled={renameloading}
              >
                {renameloading ? <Spinner className="mr-2 h-4 w-4" /> : null}
                Update
              </Button>
            </div>
            <div className="w-full mb-1">
              <Input
                placeholder="Add User to group"
                className="bg-black border-[#10b981] placeholder:text-gray-500 text-[#10b981]"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            {loading ? (
              <Spinner className="h-8 w-8" style={{ color: "#10b981" }} />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => handleRemove(user)} className="bg-red-600 hover:bg-red-700">
              Leave Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UpdateGroupChatModal;
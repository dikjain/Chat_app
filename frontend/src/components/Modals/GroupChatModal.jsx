import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { searchUsers, createGroupChat } from "@/api";
import { useState } from "react";
import { useChatStore } from "@/stores";
import UserBadgeItem from "@/components/UI/UserBadgeItem";
import UserListItem from "@/components/UI/UserListItem";

const GroupChatModal = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const addChat = useChatStore((state) => state.addChat);

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
      setSearchResult([]);
      return;
    }

    try {
      setLoading(true);
      const data = await searchUsers(query);
      setSearchResult(data);
    } catch (error) {
      // Error handling is done by interceptor
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleSubmit = async () => {
    if (!groupChatName.trim() || selectedUsers.length === 0) {
      toast.warning("Please fill all the fields");
      return;
    }

    try {
      const data = await createGroupChat(groupChatName, selectedUsers);
      addChat(data);
      setIsOpen(false);
      setGroupChatName("");
      setSelectedUsers([]);
      setSearch("");
      setSearchResult([]);
      toast.success("New Group Chat Created!");
    } catch (error) {
      // Error handling is done by interceptor
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        {children}
      </DialogTrigger>
      <DialogContent className="bg-white border-stone-200 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium text-center text-neutral-800">
            Create Group Chat
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3">
          <Input
            placeholder="Enter chat name"
            value={groupChatName}
            onChange={(e) => setGroupChatName(e.target.value)}
            className="bg-white border-stone-200 placeholder:text-stone-400 text-neutral-800 outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus:border-stone-300"
          />

          <Input
            placeholder="Search users to add..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="bg-white border-stone-200 placeholder:text-stone-400 text-neutral-800 outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus:border-stone-300"
          />

          {selectedUsers.length > 0 && (
            <div className="flex flex-wrap gap-2 p-2 bg-stone-50 rounded-md border border-stone-200">
              {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </div>
          )}

          <div className="max-h-48 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center py-4 text-stone-500 text-sm">
                Loading...
              </div>
            ) : (
              <div className="space-y-1">
                {searchResult?.slice(0, 4).map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <button 
            onClick={handleSubmit} 
            className="px-4 py-2 bg-black text-white rounded-md text-sm font-medium transition-colors hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed outline-none focus:outline-none focus-visible:outline-none focus:ring-0"
            disabled={!groupChatName.trim() || selectedUsers.length === 0 || loading}
          >
            Create Chat
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GroupChatModal;
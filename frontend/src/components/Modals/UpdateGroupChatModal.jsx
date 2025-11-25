import { Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useState } from "react";
import { useAuthStore, useChatStore } from "@/stores";
import { useUserSearch } from "@/hooks/queries";
import { useDebounce } from "@/hooks/useDebounce";
import { 
  useRenameGroupChat, 
  useAddUserToGroup, 
  useRemoveUserFromGroup 
} from "@/hooks/mutations/useChatMutations";
import UserBadgeItem from "@/components/UI/UserBadgeItem";
import UserListItem from "@/components/UI/UserListItem";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 300);
  const { data: searchResult = [], isLoading: searchLoading } = useUserSearch(
    debouncedSearch,
    {
      enabled: debouncedSearch.trim().length > 0,
    }
  );

  const renameGroupChatMutation = useRenameGroupChat();
  const addUserToGroupMutation = useAddUserToGroup();
  const removeUserFromGroupMutation = useRemoveUserFromGroup();

  const user = useAuthStore((state) => state.user);
  const selectedChat = useChatStore((state) => state.selectedChat);
  const setSelectedChat = useChatStore((state) => state.setSelectedChat);
  const updateChat = useChatStore((state) => state.updateChat);

  const handleRename = () => {
    if (!groupChatName) return;

    renameGroupChatMutation.mutate(
      { chatId: selectedChat._id, chatName: groupChatName },
      {
        onSuccess: (data) => {
          updateChat(selectedChat._id, data);
          setSelectedChat(data);
          setFetchAgain(!fetchAgain);
          setGroupChatName("");
        },
      }
    );
  };

  const handleAddUser = (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast.error("User Already in group!");
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast.error("Only admins can add someone!");
      return;
    }

    addUserToGroupMutation.mutate(
      { chatId: selectedChat._id, userId: user1._id },
      {
        onSuccess: (data) => {
          updateChat(selectedChat._id, data);
          setSelectedChat(data);
          setFetchAgain(!fetchAgain);
          setGroupChatName("");
        },
      }
    );
  };

  const handleRemove = (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast.error("Only admins can remove someone!");
      return;
    }

    removeUserFromGroupMutation.mutate(
      { chatId: selectedChat._id, userId: user1._id },
      {
        onSuccess: (data) => {
          user1._id === user._id ? setSelectedChat(null) : setSelectedChat(data);
          setFetchAgain(!fetchAgain);
          setGroupChatName("");
        },
      }
    );
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 hover:bg-neutral-100 rounded-md transition-colors"
        aria-label="View Group Details"
      >
        <Eye className="h-4 w-4" />
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-white border-stone-200 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-medium text-center text-neutral-800">
              {selectedChat.chatName}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3">
            {selectedChat.users.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-1 p-2 bg-stone-50 rounded-md border border-stone-200">
                {selectedChat.users.map((u) => (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    admin={selectedChat.groupAdmin}
                    handleFunction={() => handleRemove(u)}
                  />
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <Input
                placeholder="Chat Name"
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
                className="bg-white border-stone-200 placeholder:text-stone-400 text-neutral-800 outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus:border-stone-300"
              />
              <button
                onClick={handleRename}
                disabled={!groupChatName?.trim() || renameGroupChatMutation.isPending}
                className="px-4 py-2 bg-black text-white rounded-md text-sm font-medium transition-colors hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed outline-none focus:outline-none focus-visible:outline-none focus:ring-0 whitespace-nowrap"
              >
                {renameGroupChatMutation.isPending ? <Spinner className="mr-2 h-4 w-4 inline" /> : null}
                Update
              </button>
            </div>

            <Input
              placeholder="Add User to group"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white border-stone-200 placeholder:text-stone-400 text-neutral-800 outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus:border-stone-300"
            />

            <div className="max-h-48 overflow-y-auto">
              {searchLoading || addUserToGroupMutation.isPending ? (
                <div className="flex justify-center py-4 text-stone-500 text-sm">
                  Loading...
                </div>
              ) : (
                <div className="space-y-1">
                  {searchResult?.slice(0, 4).map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => handleAddUser(user)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <button
              onClick={() => handleRemove(user)}
              disabled={removeUserFromGroupMutation.isPending}
              className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium transition-colors hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed outline-none focus:outline-none focus-visible:outline-none focus:ring-0"
            >
              {removeUserFromGroupMutation.isPending ? 'Leaving...' : 'Leave Group'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UpdateGroupChatModal;
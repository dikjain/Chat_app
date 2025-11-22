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
  import axios from "axios";
  import { useState } from "react";
  import { ChatState } from "@/context/Chatprovider";
  import UserBadgeItem from "@/components/UI/UserBadgeItem";
  import UserListItem from "@/components/UI/UserListItem";
  
  const GroupChatModal = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
  
    const { user, chats, setChats, primaryColor } = ChatState();
  
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
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get(`/api/user?search=${search}`, config);
        setLoading(false);
        setSearchResult(data);
      } catch (error) {
        toast.error("Error Occured!", {
          description: "Failed to Load the Search Results",
        });
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
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.post(
          `/api/chat/group`,
          {
            name: groupChatName,
            users: JSON.stringify(selectedUsers.map((u) => u._id)),
          },
          config
        );
        setChats([data, ...chats]);
        setIsOpen(false);
        toast.success("New Group Chat Created!");
      } catch (error) {
        toast.error("Failed to Create the Chat!", {
          description: error.response.data,
        });
      }
    };
  
    return (
      <>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild onClick={() => setIsOpen(true)}>
            {children}
          </DialogTrigger>
          <DialogContent className="bg-black text-[#10b981] max-w-lg" style={{ border: `1px solid ${primaryColor}` }}>
            <DialogHeader>
              <DialogTitle className="text-[35px] font-['Work_sans'] flex justify-center text-[#10b981]">
                Create Group Chat
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center">
              <div className="w-full mb-3">
                <Input
                  placeholder="Chat Name"
                  className="bg-black border-[#10b981] placeholder:text-gray-500"
                  style={{ color: "#10b981" }}
                  onChange={(e) => setGroupChatName(e.target.value)}
                />
              </div>
              <div className="w-full mb-1">
                <Input
                  placeholder="Add Users eg: abc123, ad"
                  className="bg-black border-[#10b981] placeholder:text-gray-500"
                  style={{ color: "#10b981" }}
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

  
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { Bell, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { accessChat } from "@/api";
import ChatLoading from "@/components/Chat/ChatLoading";
import ProfileModal from "@/components/Modals/ProfileModal";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";
import { getSender } from "@/utils/chatLogics";
import UserListItem from "@/components/UI/UserListItem";
import { useAuthStore, useChatStore, useNotificationStore, useThemeStore } from "@/stores";
import { FaSearch } from "react-icons/fa";
import StatusModal from "@/components/Modals/StatusModal";
import LanguageModal from "@/components/Modals/LanguageModal";
import { useSocket, useUserSearch } from "@/hooks";


function SideDrawer() {
  const [search, setSearch] = useState("");
  const [loadingChat, setLoadingChat] = useState(false);
  const [showColorInputs, setShowColorInputs] = useState(false);
  
  const user = useAuthStore((state) => state.user);
  const clearUser = useAuthStore((state) => state.clearUser);
  const setSelectedChat = useChatStore((state) => state.setSelectedChat);
  const addChat = useChatStore((state) => state.addChat);
  const notifications = useNotificationStore((state) => state.notifications);
  const removeNotification = useNotificationStore((state) => state.removeNotification);
  const primaryColor = useThemeStore((state) => state.primaryColor);
  const setPrimaryColor = useThemeStore((state) => state.setPrimaryColor);
  
  const { socket, emit } = useSocket();
  const { searchUsers, searchResult, loading } = useUserSearch();
  
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isOpen) {
      setShowColorInputs(false);
    }
  }, [isOpen]);

  const logoutHandler = () => {
    emit("userDisconnected", user);
    clearUser();
    navigate("/");
  };

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
    <TooltipProvider>
      <div
        className="flex justify-between items-center bg-black text-[#10b981] w-full px-[10px] py-[5px] border-[3px]"
        style={{ borderColor: primaryColor }}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" onClick={() => setIsOpen(true)} className="bg-green-600 hover:bg-green-700">
              <FaSearch style={{ fill: primaryColor }} />
              <span className="hidden md:flex px-4" style={{ color: primaryColor }}>
                Search User
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            Search Users to chat
          </TooltipContent>
        </Tooltip>
        <p className="text-2xl font-['Atomic_Age']" style={{ color: primaryColor }}>
          A{" "}
          <span className="font-bold text-white text-5xl px-[5px] border-b-2" style={{borderBottomColor: primaryColor, textDecoration: `line-through ${primaryColor}`}}>
            Basic
          </span>{" "}
          <span className="font-bold text-white text-[35px] px-[5px] border-b-2" style={{borderBottomColor: primaryColor}}>Chat</span> App
        </p>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-1">
                <NotificationBadge
                  count={notifications.length}
                  effect={Effect.SCALE}
                />
                <Bell
                  className="text-2xl m-1 rounded-full"
                  style={{ backgroundColor: primaryColor }}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black text-[#10b981] z-[1000] pl-2">
              {!notifications.length && (
                <p className="text-[#10b981] px-2 py-1.5">No New Messages</p>
              )}
              {notifications.slice(-10).map((notif) => (
                <DropdownMenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    removeNotification(notif._id);
                  }}
                  className="bg-black z-[1000]"
                  style={{ color: primaryColor }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="bg-black text-[#10b981]">
                <Avatar className="h-8 w-8 border-2" style={{ borderColor: primaryColor }}>
                  <AvatarImage src={user.pic} alt={user.name} />
                  <AvatarFallback>{user.name?.charAt(0)?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <ChevronDown
                  className="rounded-full"
                  style={{ backgroundColor: primaryColor }}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black text-[#10b981] z-[9999]">
              <ProfileModal profileUser={user}>
                <DropdownMenuItem className="bg-black z-[1000]" style={{ color: "#10b981" }}>
                  My Profile
                </DropdownMenuItem>
              </ProfileModal>
              <DropdownMenuSeparator />
              <StatusModal>
                <DropdownMenuItem className="bg-black" style={{ color: "#10b981" }}>
                  My Status
                </DropdownMenuItem>
              </StatusModal>
              <DropdownMenuSeparator />
              <LanguageModal>
                <DropdownMenuItem className="bg-black" style={{ color: "#10b981" }}>
                  Language
                </DropdownMenuItem>
              </LanguageModal>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logoutHandler} className="bg-black z-[1000]" style={{ color: "#10b981" }}>
                Logout
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="flex justify-around items-center p-2">
                {!showColorInputs ? (
                  <>
                    <button
                      className="rounded-full w-[25px] h-[25px] border-[0.5px] border-white"
                      style={{ background: "linear-gradient(45deg,black , #e69500,#d48500, black)" }}
                      onClick={() => setPrimaryColor('#e69500')}
                    />
                    <button
                      className="rounded-full w-[25px] h-[25px] border-[0.5px] border-white"
                      style={{ background: "linear-gradient(45deg,black , #6b0073,#950aff, black)" }}
                      onClick={() => setPrimaryColor('#a32bff')}
                    />
                    <button
                      className="rounded-full w-[25px] h-[25px] border-[0.5px] border-white"
                      style={{ background: "linear-gradient(45deg,black , #0099b0,#007a92, black)" }}
                      onClick={() => setPrimaryColor('#0099b0')}
                    />
                    <button
                      className="rounded-full w-[25px] h-[25px] border-[0.5px] border-white"
                      style={{ background: `linear-gradient(45deg,black,${primaryColor},#10b981,black)` }}
                      onClick={() => setShowColorInputs(true)}
                    />
                  </>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="flex justify-between gap-2 items-center">
                      <input
                        type="color"
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        title="Select Primary Color"
                        className="w-10 h-5"
                      />
                      <input
                        type="color"
                        title="Select Secondary Color"
                        className="w-10 h-5"
                      />
                    </div>
                    <Button className="mt-2" onClick={() => setShowColorInputs(false)}>
                      Go Back
                    </Button>
                  </div>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" className="bg-black text-[#10b981] w-[300px] sm:w-[400px]">
          <SheetHeader className="border-b pb-2" style={{ color: primaryColor }}>
            <SheetTitle>Search Users</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-4 mt-4">
            <div className="flex gap-2 pb-2">
              <Input
                placeholder="Search by name or email"
                className="bg-black border-[#10b981] placeholder:text-gray-500"
                style={{ color: "#10b981", borderColor: primaryColor }}
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
    </TooltipProvider>
  );
}

export default SideDrawer;



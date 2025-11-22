import { Plus } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useEffect, useRef, useState, useMemo } from "react";
import { getSender } from "@/utils/chatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "@/components/Modals/GroupChatModal";
import { Button } from "@/components/ui/button";
import { ChatState } from "@/context/Chatprovider";
import io from "socket.io-client";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { FaVideo } from "react-icons/fa";
import { config as appConfig } from "@/constants/config";



const MyChats = ({ fetchAgain }) => {
  const ENDPOINT = appConfig.SOCKET_URL;
  const Socket = useMemo(() => io(ENDPOINT), [ENDPOINT]);
  const [loggedUser, setLoggedUser] = useState();
  const [onlinepeople ,setonlinepeople] = useState([]) 

  const { selectedChat, setSelectedChat, user, chats, setChats , chatsVideo, primaryColor } = ChatState();

  

  const fetchChats = async () => {
    try {
      const requestConfig = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", requestConfig);
      setChats(data);
    } catch (error) {
      toast.error("Error Occured!", {
        description: "Failed to Load the chats",
      });
    }
  };

  useEffect(() => {
    // Listen for online users
    Socket.on("onlineUsers", (dat) => {
      setonlinepeople(dat);
    });
  
    // Emit "dedi" event
    Socket.on("detailde", () => {
      Socket.emit("dedi", user);
    });
    // Handle user disconnection
    const handleDisconnect = () => Socket.emit("userDisconnected", user);
  
    // Add event listeners
    window.addEventListener("beforeunload", handleDisconnect);
  
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        handleDisconnect();
      } else if (document.visibilityState === "visible") {
        Socket.connect();  // Attempt to reconnect the socket if disconnected
        Socket.emit("userReconnected", user); // Notify the server that the user is back online
      }
    });
  
    // Cleanup the event listeners when the component unmounts
    return () => {
      window.removeEventListener("beforeunload", handleDisconnect);
      document.removeEventListener("visibilitychange", handleDisconnect);
      document.removeEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible" && !Socket.connected) {
          Socket.connect();
          Socket.emit("userReconnected", user);
        }
      });
    };
  }, [Socket, user]);
  

  
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);
  
  useGSAP(()=>{
    gsap.to(".chat", {y:0,zIndex:500,opacity:1,stagger:0.15,ease: "power3.in"})
    gsap.to(".yo", {y:0,zIndex:500,opacity:1,stagger:0.075,ease: "power2.in"})
},[chats])



  return (
    <div
    className={`${selectedChat ? "hidden" : "flex"} md:flex flex-col items-center p-3 bg-black w-full md:w-[31%] rounded-lg border`}
    >
      <div
        className="pb-3 px-3 text-[28px] md:text-[30px] flex w-full justify-around items-center font-['Atomic_Age']"
        style={{ color: primaryColor }}
      >
        My Chats
        <GroupChatModal>
          <Button
            className="flex text-[17px] md:text-[10px] lg:text-[17px] font-['Roboto']"
          >
            New Group Chat
            <Plus className="ml-1 h-4 w-4" />
          </Button>
        </GroupChatModal>
      </div>
      <div
        className="flex flex-col p-3 bg-[#020202] w-full h-full rounded-lg overflow-y-scroll"
        style={{ 
          border: `2px solid ${primaryColor}`,
          boxShadow: "0px 0px 10px 5px #10b981"
        }}
      >
        {chats ? (
            chats.map((chat) => (
              <div
              className="chat cursor-pointer transition-all duration-200 px-3 py-2 mx-[7px] my-[2px] rounded-lg relative font-['Roboto'] font-light z-30"
              onClick={() => setSelectedChat(chat)}
              style={{
                transform: "translateY(-100px)",
                opacity: 0,
                backgroundColor: selectedChat ? (selectedChat._id === chat._id ? primaryColor : "#E8E8E8") : "#E8E8E8",
                boxShadow: selectedChat ? (selectedChat._id === chat._id ? "#10b981 0px 0px 12px 5px" : "#10b981 0px 0px 7px 2px") : "#10b981 0px 0px 7px 2px",
                border: "#10b981 solid 2px",
              }}
              key={chat._id}
              >
                {!chat.isGroupChat && chat.users[0] && chat.users[1] && (chat.users[0]._id == user._id ? onlinepeople.includes(chat.users[1]._id) :onlinepeople.includes(chat.users[0]._id)) && <div id="online" style={{right:"5%",width:"10px",top:"40%",translate:"0px 0px", height:"10px",borderRadius:"999px", position:"absolute",backgroundColor:"#10b981"}}></div>}
                <p className="yo font-medium" style={{ transform: "translateY(200px)", opacity: 0, color: selectedChat ? (selectedChat._id === chat._id ? "white" : "black") : "black" }}>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </p>

                {chat.latestMessage && (
                  <p className="yo text-xs" style={{ transform: "translateY(200px)", opacity: 0, color: selectedChat ? (selectedChat._id === chat._id ? "white" : "black") : "black" }}>
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content 
                      ? (chat.latestMessage.content.length > 50
                        ? chat.latestMessage.content.substring(0, 51) + "..."
                        : chat.latestMessage.content)
                      : "File"}
                  </p>
                )}

                {chatsVideo.some(videouser => videouser.selectedChat._id === chat._id) && (
                  <FaVideo style={{ position: "absolute", right: "40px", top: "50%", transform: "translateY(-50%)", color: "#10b981" }} />
                )}
              </div>
            ))
        ) : (
          <ChatLoading />
        )}
      </div>
    </div>
  );
};

export default MyChats;

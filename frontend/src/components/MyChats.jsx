import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useRef, useState, useMemo } from "react";
import { getSender } from "../configs/ChatLogics";
import ChatLoading from "../Chatloading";
import GroupChatModal from "../GroupChatmodal";
import { Button } from "@chakra-ui/react";
import { ChatState } from "../Context/Chatprovider";
import io from "socket.io-client";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { FaVideo } from "react-icons/fa";



const MyChats = ({ fetchAgain }) => {
  const ENDPOINT = "https://chat-app-3-2cid.onrender.com/";
  const Socket = useMemo(() => io(ENDPOINT), [ENDPOINT]);
  const [loggedUser, setLoggedUser] = useState();
  const [onlinepeople ,setonlinepeople] = useState([]) 

  const { selectedChat, setSelectedChat, user, chats, setChats , a , chatsVideo } = ChatState();

  const toast = useToast();

  

  const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
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
    <Box
    display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
    flexDir="column"
    alignItems="center"
    p={3}
    bg="white"
    w={{ base: "100%", md: "31%" }}
    borderRadius="lg"
    borderWidth="1px"
    backgroundColor={"black"}
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        display="flex"
        width="100%"
        justifyContent="space-around"
        alignItems="center"
        color={"#48bb78"}
        fontFamily={"Atomic Age"}
        
        >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
            fontFamily={"Roboto"}
            >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#020202"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="scroll"
        border={"2px solid #48bb78"}
        boxShadow={"0px 0px 10px 5px green"}
        >
        {chats ? (
            chats.map((chat) => (
              <Box
              className="chat"
              onClick={selectedChat ? () => !a && setSelectedChat(chat) : () => setSelectedChat(chat)}
              cursor="pointer"
              bg={selectedChat ? (selectedChat._id === chat._id ? "#48bb78" : "#E8E8E8") : "#E8E8E8"}
                boxShadow={selectedChat ? (selectedChat._id === chat._id ? "green 0px 0px 12px 5px" : "green 0px 0px 7px 2px") : "green 0px 0px 7px 2px"}
                border={"green solid 2px"}
                transition={"all 0.2s ease-in-out"}
                px={3}
                transform={"translateY(-100px)"}
                opacity={0}
                py={2}
                mx={"7px"}
                my={"2px"}
                borderRadius="lg"
                key={chat._id}
                position="relative"
                fontFamily={"Roboto"}
                fontWeight={"300"}
                zIndex={"30"}
              >
                {!chat.isGroupChat &&  (chat.users[0]._id == user._id ? onlinepeople.includes(chat.users[1]._id) :onlinepeople.includes(chat.users[0]._id)) && <div id="online" style={{right:"5%",width:"10px",top:"40%",translate:"0px 0px", height:"10px",borderRadius:"999px", position:"absolute",backgroundColor:"green"}}></div>}
                <Text className="yo" transform={"translateY(200px)"} opacity={0} fontWeight={"500"} color={ selectedChat ? (selectedChat._id === chat._id ? "white" : "black") : "black"}>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>

                {chat.latestMessage && (
                  <Text className="yo" transform={"translateY(200px)"} opacity={0} fontSize="xs" color={ selectedChat ? (selectedChat._id === chat._id ? "white" : "black") : "black"}>
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content 
                      ? (chat.latestMessage.content.length > 50
                        ? chat.latestMessage.content.substring(0, 51) + "..."
                        : chat.latestMessage.content)
                      : "File"}
                  </Text>
                )}

                {chatsVideo.some(videouser => videouser.selectedChat._id === chat._id) && (
                  <FaVideo style={{ position: "absolute", right: "40px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
                )}
              </Box>
            ))
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;

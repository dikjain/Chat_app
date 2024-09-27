
import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { getSender } from "../configs/ChatLogics";
import ChatLoading from "./Chatloading";
import GroupChatModal from "./miscellenaeous/GroupChatmodal";
import { Button } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import io from "socket.io-client";
const ENDPOINT = "http://localhost:3000";

const MyChats = ({ fetchAgain }) => {
  let Socket;
  const [loggedUser, setLoggedUser] = useState();
  const [onlinepeople ,setonlinepeople] = useState([]) 

  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

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
      console.log(chats);
      
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

  useEffect(()=>{
    Socket = io(ENDPOINT);
  },[])

  useEffect(()=>{
    Socket.on("onlineUsers",(dat)=>{
      setonlinepeople(dat)
    })


    Socket.on("detailde",()=>{
      Socket.emit("dedi",user)
    })   
    window.addEventListener("unload", ()=> Socket.emit("userDisconnected", user))

    // Cleanup the event listener and disconnect socket when component unmounts
    return () => {
      window.addEventListener("unload", ()=> Socket.emit("userDisconnected", user))
    };

  },[Socket,io])
 
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

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
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
        border={"2px solid #48bb78"}
        boxShadow={"0px 0px 10px 5px green"}
      >
        {chats ? (
          <Stack  >
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#48bb78" : "#E8E8E8"}
                color={selectedChat === chat ? "red" : "black"}
                boxShadow={selectedChat === chat ? "black 0px 0px 10px" : ""}
                border={selectedChat === chat ? "green solid 1px" : ""}
                transition={"all 0.2s ease-in-out"}
                px={3}
                py={2}
                mx={"7px"}
                my={"2px"}
                borderRadius="lg"
                key={chat._id}
                position="relative"
                fontFamily={"Roboto"}
                fontWeight={"300"}
              >
                {!chat.isGroupChat &&  (chat.users[0]._id == user._id ? onlinepeople.includes(chat.users[1]._id) :onlinepeople.includes(chat.users[0]._id)) && <div id="online" style={{right:"5%",width:"10px",top:"40%",translate:"0px 0px", height:"10px",borderRadius:"999px", position:"absolute",backgroundColor:"green"}}></div>}
                <Text fontWeight={"500"} color={selectedChat === chat ? "white" : "black"}>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>

                {chat.latestMessage && (
                  <Text fontSize="xs" color={selectedChat === chat ? "white" : "black"}>
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;

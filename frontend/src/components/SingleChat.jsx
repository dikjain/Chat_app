import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import "./style.css";
import { IconButton, Spinner, useToast, Button } from "@chakra-ui/react";
import { getSender, getSenderFull } from "../configs/ChatLogics";
import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "../ProfileModal";
import ScrollableChat from "./ScrollableChats";
// import Lottie from "react-lottie";
// import animationData from "../animations/typing.json";
import { GoogleGenerativeAI } from "@google/generative-ai";

import io from "socket.io-client";
import UpdateGroupChatModal from "../UpdateGroupChatmodal";
import { ChatState } from "../Context/Chatprovider";
const ENDPOINT = "https://chat-app-3-2cid.onrender.com/";
var socket, selectedChatCompare;

import Notification from "../assets/notification.mp3"

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [sent, setsent] = useState(false);
  const toast = useToast();
  const inputRef = useRef(null);
  const [aiMessage, setAIMessage] = useState("");
  const [aiTyping, setAITyping] = useState(false);


//api
const generateContents = async (prompt) => {
  try{
  setAITyping(true);
  const genAI = new GoogleGenerativeAI("AIzaSyBp2UduAnIpMswiu8JYu3uMX5F3fcFtVL0");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent("hey , you are message auto completer , here a user is chatting and has provided his half message as a prompt , complete the message making sure that the length of message is like a normal message , prompt : " + prompt);
  setAIMessage(result.response.text());
  setAITyping(false);
  }catch(error){
    toast({
      title: "Error Occured!",
      description: error.message,
      status: "error",
      duration: 3000,
      isClosable: true,
      position: "bottom",
    });
    
  }
}

//api
  const sound = new Audio(Notification)
  const { selectedChat, setSelectedChat, setChats, user, notification, setNotification } =
    ChatState();

  const fetchMessages = useCallback(async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
      const iol = await axios.get("/api/chat", config);        
      setChats(iol.data);
      

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  }, [selectedChat, setChats, toast, user.token]);

  
  const config = {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${user.token}`,
    },
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage && !sent) {
      setAIMessage("");
      setsent(true);
      try {
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
        socket.emit("new message", data);
        setMessages((prevMessages) => [...prevMessages, data]);
        const iop = await axios.get("/api/chat", config);        
        setChats(iop.data);
        setsent(false);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    } else if (event.key === "Enter" && sent) {
      toast({
        title: "Error Occured!",
        description: "Wait before sending another message",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const getmessages = async()=>{
    const iol = await axios.get("/api/chat", config);        
    setChats(iol.data);
  }

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    return () => {
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat, fetchMessages]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain((prevFetchAgain) => !prevFetchAgain);
          getmessages();
          sound.play();

        }
      } else {
         getmessages();
        setMessages((prevMessages) => [...prevMessages, newMessageRecieved]);
      }
    });
  }, [notification, setFetchAgain]);


  const typingHandler =((e) => {
    
    if(e.target.value.length == 0){
      setAIMessage("");
    }
    if(!aiTyping){
      generateContents(e.target.value);
    } 
    setNewMessage(e.target.value);
  });

  const toggleSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser does not support speech recognition.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (isListening) {
      stopSpeechRecognition();
    } else {
      startSpeechRecognition();
    }
  };

  const startSpeechRecognition = () => {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      const currentTranscript = finalTranscript + interimTranscript;
      
      // Fix: append only the new transcript to newMessage
      const updatedMessage = newMessage + currentTranscript; 
      setNewMessage(updatedMessage.trim());

      // Ensure caret moves with the text
      if (inputRef.current) {
        inputRef.current.scrollLeft = inputRef.current.scrollWidth;
      }
    };

    recognition.onerror = (event) => {
      console.error("Error occurred in recognition:", event.error);
      if (event.error === "aborted") {
        setIsListening(false);
      } else {
        toast({
          title: "Speech Recognition Error",
          description: `An error occurred: ${event.error}`,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    };

    recognition.onend = () => {
      if (isListening) {
        recognition.start();
      } else {
        setIsListening(false);
      }
    };

    recognition.start();
    setIsListening(true);
    window.recognition = recognition;
  };

  const stopSpeechRecognition = () => {
    setIsListening(false);
    if (window.recognition) {
      window.recognition.stop();
    }
  };    

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
            fontFamily={"Atomic Age"}
            color={"#48bb78"}
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              ))}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            border={"2px solid #48bb78"}
            boxShadow={"0px 0px 10px 5px green"}  
            bg="#020202"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
              borderRadius={"999px"}
                size="xl"
                w={10}
                h={10}
                alignSelf="center"
                margin="auto"
                backgroundColor={"#48bb78"}
                _before={{
                  content: '""',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  borderRadius: '50%',
                  width: '90%',
                  height: '90%',
                  backgroundColor: 'black',
                }}
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
            >
               <Box display="flex" alignItems="center" mt={"20px"} pos="relative">
                <Input
                  onClick={()=>{setNewMessage(aiMessage); setAIMessage("");}}
                  zIndex={"50"}
                  h="70%"
                  variant="filled"
                  bg="black"
                  color={"#48bb78"}
                  pos="absolute"
                  placeholder="Ai Assistant..."
                  top={"-70%"}
                  value={aiMessage}
                  readOnly
                  cursor={"pointer"}
                />
                <Input
                  variant="filled"
                  bg="#E0E0E0"
                  color={"#48bb78"}
                  placeholder="Enter a message.."
                  value={newMessage}
                  onChange={typingHandler}
                  ref={inputRef}
                />
                <Button
                  onClick={toggleSpeechRecognition}
                  colorScheme={isListening ? "red" : "green"}
                  ml={2}
                >
                  {isListening ? "Stop" : "Speak"}
                </Button>
              </Box>
            </FormControl>
          </Box>
        </>
      ) : (
        // to get socket.io on same page
        <Box display="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} color={"#48bb78"}  fontFamily="Atomic Age">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
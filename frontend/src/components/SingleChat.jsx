import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import "./style.css";
import { IconButton, Spinner, useToast, Button, Avatar } from "@chakra-ui/react";
import { getSender, getSenderFull } from "../configs/ChatLogics";
import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "../ProfileModal";
import ScrollableChat from "./ScrollableChats";
// import Lottie from "react-lottie";
// import animationData from "../animations/typing.json";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { gsap } from "gsap";
import { FiFile } from "react-icons/fi"; // Importing file icon from react-icons
import { FaVideo } from "react-icons/fa"; // Importing video icon from react-icons
import { useNavigate } from "react-router-dom"; // Importing useNavigate from react-router-dom
import { MdLocationOn, MdMic } from "react-icons/md"; // Importing location and mic icons from react-icons

import io from "socket.io-client";
import UpdateGroupChatModal from "../UpdateGroupChatmodal";
import { ChatState } from "../Context/Chatprovider";
const ENDPOINT = "https://chat-app-3-2cid.onrender.com/";
var socket, selectedChatCompare;

import Notification from "../assets/notification.mp3";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [sent, setsent] = useState(false);
  const toast = useToast();
  const inputRef = useRef(null);
  const [aiMessage, setAIMessage] = useState("");
  const [aiTyping, setAITyping] = useState(false);
  const [msgaaya, setMsgaaya] = useState(false);
  const navigate = useNavigate(); // Initializing useNavigate

  //api
  const generateContents = async (prompt) => {
    try {
      setAITyping(true);
      const genAI = new GoogleGenerativeAI("AIzaSyBp2UduAnIpMswiu8JYu3uMX5F3fcFtVL0");
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(
        "Please complete the following message along with the user's input naturally as if it were sent by the user. Ensure the response feels like a continuation of the user's input and match the language used. Only provide the completed message without any additional text. Here's the message: " +
          prompt
      );
      setAIMessage(result.response.text());
      setAITyping(false);
    } catch (error) {
      setAITyping(false);
    }
  };

  //api
  const sound = new Audio(Notification);
  const { selectedChat, setSelectedChat, setChats, user, notification, setNotification , setVideocall  ,setIsOneOnOneCall , videoCallUser, setVideoCallUser , setChatsVideo, primaryColor, secondaryColor } = ChatState();

  const fetchMessages = useCallback(async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
      setMessages(data);
      setLoading(false);
      // const iol = await axios.get("/api/chat", config);
      // setChats(iol.data);

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
  }, [selectedChat, toast, user.token]);

  const config = {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${user.token}`,
    },
  };

  const sendMessage = useCallback(async (event) => {
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
        setMsgaaya(true);
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
  }, [sent, selectedChat, config]);

  const getmessages = async () => {
    const iol = await axios.get("/api/chat", config);
    setChats(iol.data);
  };

  const sendLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const locationMessage = `https://www.google.com/maps?q=${latitude},${longitude}`;
        try {
          const { data } = await axios.post(
            "/api/message",
            {
              content: locationMessage,
              chatId: selectedChat,
              type : "location"
            },
            config
          );
          socket.emit("new message", data);
          setMessages((prevMessages) => [...prevMessages, data]);
          setMsgaaya(true);
          const iop = await axios.get("/api/chat", config);
          setChats(iop.data);
        } catch (error) {
          toast({
            title: "Error Occured!",
            description: "Failed to send the location",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        }
      });
    } else {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser does not support geolocation.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

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
    socket.emit('koihai');
  
    const handleVideoCallUsers = (newMessageReceived) => {
      
      if (newMessageReceived.length > 0) {
        const updatedVideoCallUsers = newMessageReceived.filter(
          users => users.user._id !== user._id
        );
        if (updatedVideoCallUsers.length > 0) {
          setVideoCallUser(updatedVideoCallUsers);
        }else{
          setVideoCallUser([]);
        }
      }
    };
  
    const handleJoin = (newMessageReceived) => {
      const Revisedmsg = newMessageReceived.filter(users => users.user._id !== user._id);
      setVideoCallUser(Revisedmsg);
    };
    
    const handleLeave = (newMessageReceived) => {
      const Revisedmsg = newMessageReceived.filter(users => users.user._id !== user._id);
      if(Revisedmsg.length > 0){
        setVideoCallUser(Revisedmsg);
      }else{
        setVideoCallUser([]);
      }
    };
  
    socket.on('videoCallUsers', handleVideoCallUsers);
    socket.on('join_hua', handleJoin);
    socket.on('leave_hua', handleLeave);
  
    // Cleanup function to remove socket listeners
    return () => {
      socket.off('videoCallUsers', handleVideoCallUsers);
      socket.off('join_hua', handleJoin);
      socket.off('leave_hua', handleLeave);
    };
  }, []);

  useEffect(() => {
    const handleMessageReceived = (newMessageRecieved) => {
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
        setMsgaaya(true);
      }
    };

    socket.on("message recieved", handleMessageReceived);

    return () => {
      socket.off("message recieved", handleMessageReceived);
    };
  }, [setFetchAgain, notification]);

  const typingHandler =  useCallback((e) => {
    if (e.target.value.length == 0) {
      setAIMessage("");
    }
    if (!aiTyping) {
      generateContents(e.target.value);
    }
    setNewMessage(e.target.value);
  },[aiTyping])

  const toggleSpeechRecognition = () => {
    if (!("webkitSpeechRecognition" in window)) {
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

  const handleFileUpload = async (e) => {
    return new Promise((resolve, reject) => {
      const inputElement = document.createElement("input");
      inputElement.type = "file";
      inputElement.accept = "image/*,audio/*,application/pdf";
      inputElement.onchange = async (e) => {
        let file = e.target.files[0];
        if (file) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("chatId", selectedChat._id);
          formData.append("sender", user._id);

          try {
            const response = await axios.post("/api/message/upload", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${user.token}`,
              },
            });
            resolve(response.data);
            socket.emit("new message", response.data);
            setMessages((prevMessages) => [...prevMessages, response.data]);
            setMsgaaya(true);
            const iop = await axios.get("/api/chat", config);
            setChats(iop.data);
            setsent(false);
          } catch (error) {
            reject(error.message);
          }
        }
      };

      inputElement.click();
    });
  };

  const handleVideoCall = () => {
    navigate(`/videocall/${selectedChat._id}`);
  };

  useEffect(() => {
      setChatsVideo(videoCallUser);
  }, [videoCallUser]);


  return (
    <>
      {selectedChat ? (
        <>
          <Box
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
            fontFamily={"Atomic Age"}
            color={primaryColor}
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  <Box display="flex" color={primaryColor} gap={4} alignItems="center">
                    {getSender(user, selectedChat.users).length > 7 && window.innerWidth < 550 ? (
                      <Avatar size="sm" border={`1px solid ${primaryColor}`} name={getSender(user, selectedChat.users)} src={getSenderFull(user, selectedChat.users).pic} />
                    ) : (
                      getSender(user, selectedChat.users)
                    )}
                    <ProfileModal profileUser={getSenderFull(user, selectedChat.users)} />
                  </Box>
                </>
              ) : (
                <>
                  <Box display="flex" color={primaryColor} gap={4} alignItems="center">
                    {selectedChat.chatName.toUpperCase()}
                    <UpdateGroupChatModal
                      fetchMessages={fetchMessages}
                      fetchAgain={fetchAgain}
                      setFetchAgain={setFetchAgain}
                    />
                  </Box>
                </>
              ))}
              <IconButton
                icon={<FaVideo />}
                size="sm"
                aria-label="Start Video Call"
                onClick={() => {setVideocall(true); selectedChat.isGroupChat ? setIsOneOnOneCall(false) : setIsOneOnOneCall(true); handleVideoCall()}}
              /> 
              {videoCallUser && videoCallUser.map((u,i) => (selectedChat._id == u.selectedChat._id &&
              <img key={i} src={u.user.pic}  alt="User" style={{ position: "absolute",backgroundColor:"black", borderRadius: "50%", width: "20px",border: `0.5px solid ${primaryColor}`, height: "20px", transform: `translateX(${-70*i}%)`, right: "60px" }} />
              ))}
          </Box>
          <Box
            id="msgdabba"
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            border={`2px solid ${primaryColor}`}
            boxShadow={`0px 0px 10px 5px ${secondaryColor}`}
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
                backgroundColor={primaryColor}
                _before={{
                  content: '""',
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  borderRadius: "50%",
                  width: "90%",
                  height: "90%",
                  backgroundColor: "black",
                }}
              />
            ) : (
              <div style={{ position: "relative", overflowX: "hidden", maxWidth: "100%" }} className="messages">
                <ScrollableChat msgaaya={msgaaya} setMsgaaya={setMsgaaya} messages={messages} setMessages={setMessages} />
              </div>
            )}

            <FormControl onKeyDown={sendMessage} id="first-name" isRequired mt={3}>
              <Box display="flex" alignItems="center" mt={"20px"} pos="relative">
                <Input
                  onClick={() => {
                    setNewMessage(aiMessage);
                    setAIMessage("");
                  }}
                  zIndex={"50"}
                  // h="70%"
                  variant="filled"
                  bg="black"
                  color={primaryColor}
                  pos="absolute"
                  placeholder="Ai Assistant..."
                  top={"-70%"}
                  value={aiMessage}
                  readOnly
                  cursor={"pointer"}
                  height={"fit-content"}
                />
                <IconButton
                  icon={<FiFile />} // Using file icon from react-icons
                  size="sm"
                  variant="outline"
                  colorScheme="teal"
                  aria-label="Upload File"
                  height={"40px"}
                  padding={"0px"}
                  margin={"0px"}
                  bg={primaryColor}
                  ml={2}
                  _hover={{}}
                  onClick={handleFileUpload}
                />
                <Input
                  variant="filled"
                  bg="#E0E0E0"
                  color={primaryColor}
                  placeholder="Enter a message.."
                  value={newMessage}
                  onChange={typingHandler}
                  ref={inputRef}
                />
                <IconButton
                  icon={<MdMic />}
                  size="sm"
                  variant="outline"
                  colorScheme={isListening ? "red" : primaryColor}
                  aria-label="Toggle Speech Recognition"
                  height={"40px"}
                  padding={"0px"}
                  margin={"0px"}
                  bg={isListening ? "red" : primaryColor}
                  ml={2}
                  _hover={{}}
                  onClick={toggleSpeechRecognition}
                />
                <IconButton
                  icon={<MdLocationOn />} // Using location icon from react-icons
                  size="sm"
                  variant="outline"
                  colorScheme="blue"
                  aria-label="Send Location"
                  height={"40px"}
                  padding={"0px"}
                  margin={"0px"}
                  bg={primaryColor}
                  ml={2}
                  _hover={{}}
                  onClick={sendLocation}
                />
              </Box>
            </FormControl>
          </Box>
        </>
      ) : (
        // to get socket.io on same page
        <Box display="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} color={primaryColor} fontFamily="Atomic Age">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;


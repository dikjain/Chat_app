import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import "@/styles/components.css";
import { getSender, getSenderFull } from "@/utils/chatLogics";
import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import ProfileModal from "@/components/Modals/ProfileModal";
import ScrollableChat from "./ScrollableChats";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { gsap } from "gsap";
import { FiFile } from "react-icons/fi"; // Importing file icon from react-icons
import { FaVideo } from "react-icons/fa"; // Importing video icon from react-icons
import { useNavigate } from "react-router-dom"; // Importing useNavigate from react-router-dom
import { MdLocationOn, MdMic } from "react-icons/md"; // Importing location and mic icons from react-icons

import io from "socket.io-client";
import UpdateGroupChatModal from "@/components/Modals/UpdateGroupChatModal";
import { ChatState } from "@/context/Chatprovider";
import { config as appConfig } from "@/constants/config";

const ENDPOINT = appConfig.SOCKET_URL;
var socket, selectedChatCompare;

import Notification from "@/assets/notification.mp3";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [sent, setsent] = useState(false);
  const inputRef = useRef(null);
  const [aiMessage, setAIMessage] = useState("");
  const [aiTyping, setAITyping] = useState(false);
  const [msgaaya, setMsgaaya] = useState(false);
  const navigate = useNavigate(); // Initializing useNavigate

  //api
  const generateContents = async (prompt) => {
    try {
      setAITyping(true);
      const genAI = new GoogleGenerativeAI(appConfig.GOOGLE_AI_API_KEY);
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
  const { selectedChat, setSelectedChat, setChats, user, notification, setNotification , setVideocall  ,setIsOneOnOneCall , videoCallUser, setVideoCallUser , setChatsVideo, primaryColor } = ChatState();

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
      toast.error("Error Occured!", {
        description: "Failed to Load the Messages",
      });
    }
  }, [selectedChat, user.token]);

  const requestConfig = {
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
          requestConfig
        );
        socket.emit("new message", data);
        setMessages((prevMessages) => [...prevMessages, data]);
        setMsgaaya(true);
        const iop = await axios.get("/api/chat", requestConfig);
        setChats(iop.data);
        setsent(false);
      } catch (error) {
        toast.error("Error Occured!", {
          description: "Failed to send the Message",
        });
      }
    } else if (event.key === "Enter" && sent) {
      toast.error("Error Occured!", {
        description: "Wait before sending another message",
      });
    }
  }, [sent, selectedChat, requestConfig]);

  const getmessages = async () => {
    const iol = await axios.get("/api/chat", requestConfig);
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
            requestConfig
          );
          socket.emit("new message", data);
          setMessages((prevMessages) => [...prevMessages, data]);
          setMsgaaya(true);
          const iop = await axios.get("/api/chat", requestConfig);
          setChats(iop.data);
        } catch (error) {
          toast.error("Error Occured!", {
            description: "Failed to send the location",
          });
        }
      });
    } else {
      toast.error("Geolocation Not Supported", {
        description: "Your browser does not support geolocation.",
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
    socket.emit('get_video_users');
  
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
    socket.on('video_user_joined', handleJoin);
    socket.on('video_user_left', handleLeave);
  
    // Cleanup function to remove socket listeners
    return () => {
      socket.off('videoCallUsers', handleVideoCallUsers);
      socket.off('video_user_joined', handleJoin);
      socket.off('video_user_left', handleLeave);
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

    socket.on("message received", handleMessageReceived);

    return () => {
      socket.off("message received", handleMessageReceived);
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
      toast.error("Speech Recognition Not Supported", {
        description: "Your browser does not support speech recognition.",
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
        toast.error("Speech Recognition Error", {
          description: `An error occurred: ${event.error}`,
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
            const iop = await axios.get("/api/chat", requestConfig);
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
          <div
            className="text-[28px] md:text-[30px] pb-3 px-2 w-full flex justify-between items-center font-['Atomic_Age']"
            style={{ color: primaryColor }}
          >
            <Button
              className={`${window.innerWidth < 768 ? "flex" : "hidden"} md:hidden`}
              variant="ghost"
              size="icon"
              onClick={() => setSelectedChat("")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  <div className="flex gap-4 items-center" style={{ color: primaryColor }}>
                    {getSender(user, selectedChat.users).length > 7 && window.innerWidth < 550 ? (
                      <Avatar className="h-8 w-8" style={{ border: `1px solid ${primaryColor}` }}>
                        <AvatarImage src={getSenderFull(user, selectedChat.users).pic} alt={getSender(user, selectedChat.users)} />
                        <AvatarFallback>{getSender(user, selectedChat.users)?.charAt(0)?.toUpperCase()}</AvatarFallback>
                      </Avatar>
                    ) : (
                      getSender(user, selectedChat.users)
                    )}
                    <ProfileModal profileUser={getSenderFull(user, selectedChat.users)} />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex gap-4 items-center" style={{ color: primaryColor }}>
                    {selectedChat.chatName.toUpperCase()}
                    <UpdateGroupChatModal
                      fetchMessages={fetchMessages}
                      fetchAgain={fetchAgain}
                      setFetchAgain={setFetchAgain}
                    />
                  </div>
                </>
              ))}
              <Button
                variant="ghost"
                size="icon"
                aria-label="Start Video Call"
                onClick={() => {setVideocall(true); selectedChat.isGroupChat ? setIsOneOnOneCall(false) : setIsOneOnOneCall(true); handleVideoCall()}}
              >
                <FaVideo />
              </Button> 
              {videoCallUser && videoCallUser.map((u,i) => (selectedChat._id == u.selectedChat._id &&
              <img key={i} src={u.user.pic}  alt="User" style={{ position: "absolute",backgroundColor:"black", borderRadius: "50%", width: "20px",border: `0.5px solid ${primaryColor}`, height: "20px", transform: `translateX(${-70*i}%)`, right: "60px" }} />
              ))}
          </div>
          <div
            id="msgdabba"
            className="flex flex-col justify-end p-3 bg-[#020202] w-full h-full rounded-lg overflow-y-hidden"
            style={{ 
              border: `2px solid ${primaryColor}`,
              boxShadow: "0px 0px 10px 5px #10b981"
            }}
          >
            {loading ? (
              <div className="flex justify-center items-center m-auto">
                <Spinner className="h-10 w-10" style={{ color: primaryColor }} />
              </div>
            ) : (
              <div style={{ position: "relative", overflowX: "hidden", maxWidth: "100%" }} className="messages">
                <ScrollableChat msgaaya={msgaaya} setMsgaaya={setMsgaaya} messages={messages} setMessages={setMessages} />
              </div>
            )}

            <div onKeyDown={sendMessage} className="mt-3">
              <div className="flex items-center mt-5 relative">
                <Input
                  onClick={() => {
                    setNewMessage(aiMessage);
                    setAIMessage("");
                  }}
                  className="absolute -top-[70%] z-50 bg-black cursor-pointer h-fit"
                  style={{ color: primaryColor }}
                  placeholder="Ai Assistant..."
                  value={aiMessage}
                  readOnly
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 p-0 m-0 ml-2"
                  style={{ backgroundColor: primaryColor }}
                  aria-label="Upload File"
                  onClick={handleFileUpload}
                >
                  <FiFile />
                </Button>
                <Input
                  className="bg-[#E0E0E0]"
                  style={{ color: primaryColor }}
                  placeholder="Enter a message.."
                  value={newMessage}
                  onChange={typingHandler}
                  ref={inputRef}
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 p-0 m-0 ml-2"
                  style={{ backgroundColor: isListening ? "red" : primaryColor }}
                  aria-label="Toggle Speech Recognition"
                  onClick={toggleSpeechRecognition}
                >
                  <MdMic />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 p-0 m-0 ml-2"
                  style={{ backgroundColor: primaryColor }}
                  aria-label="Send Location"
                  onClick={sendLocation}
                >
                  <MdLocationOn />
                </Button>
              </div>
            </div>
          </div>
        </>
      ) : (
        // to get socket.io on same page
        <div className="flex items-center justify-center h-full">
          <p className="text-3xl pb-3 font-['Atomic_Age']" style={{ color: primaryColor }}>
            Click on a user to start chatting
          </p>
        </div>
      )}
    </>
  );
};

export default SingleChat;

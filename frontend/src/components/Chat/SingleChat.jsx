import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { getSender, getSenderFull } from "@/utils/chatLogics";
import { useEffect, useState, useRef, useCallback } from "react";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import ProfileModal from "@/components/Modals/ProfileModal";
import ScrollableChat from "./ScrollableChats";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FiFile } from "react-icons/fi"; // Importing file icon from react-icons
import { FaVideo } from "react-icons/fa"; // Importing video icon from react-icons
import { useNavigate } from "react-router-dom"; // Importing useNavigate from react-router-dom
import { MdLocationOn, MdMic } from "react-icons/md"; // Importing location and mic icons from react-icons

import UpdateGroupChatModal from "@/components/Modals/UpdateGroupChatModal";
import { useAuthStore, useChatStore, useNotificationStore, useVideoCallStore, useThemeStore } from "@/stores";
import { useChat, useSocket } from "@/hooks";
import { config as appConfig } from "@/constants/config";

import Notification from "@/assets/notification.mp3";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  // Custom hooks - single source of truth
  const { 
    fetchMessages, 
    sendMessage: sendMessageHook, 
    sendFile,
    fetchChats,
    loading: chatLoading
  } = useChat();
  const { socket, on, off, emit, isConnected } = useSocket();
  
  // Local UI state
  const [newMessage, setNewMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [sent, setsent] = useState(false);
  const inputRef = useRef(null);
  const [aiMessage, setAIMessage] = useState("");
  const [aiTyping, setAITyping] = useState(false);
  const navigate = useNavigate();
  
  // Store references
  const selectedChatCompareRef = useRef(null);

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
  const user = useAuthStore((state) => state.user);
  const selectedChat = useChatStore((state) => state.selectedChat);
  const setSelectedChat = useChatStore((state) => state.setSelectedChat);
  const getMessages = useChatStore((state) => state.getMessages);
  const messages = selectedChat ? getMessages(selectedChat._id) : [];
  const notifications = useNotificationStore((state) => state.notifications);
  const setVideoCallActive = useVideoCallStore((state) => state.setVideoCallActive);
  const setIsOneOnOneCall = useVideoCallStore((state) => state.setIsOneOnOneCall);
  const videoCallUsers = useVideoCallStore((state) => state.videoCallUsers);
  const setVideoCallUsers = useVideoCallStore((state) => state.setVideoCallUsers);
  const setChatsVideo = useVideoCallStore((state) => state.setChatsVideo);
  const primaryColor = useThemeStore((state) => state.primaryColor);

  // Fetch messages when chat changes
  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat._id);
      selectedChatCompareRef.current = selectedChat;
    }
  }, [selectedChat, fetchMessages]);

  const handleSendMessage = useCallback(async (event) => {
    if (event.key === "Enter" && newMessage && !sent && selectedChat) {
      setAIMessage("");
      setsent(true);
      try {
        const messageContent = newMessage;
        setNewMessage("");
        await sendMessageHook(messageContent, selectedChat._id);
        setsent(false);
      } catch (error) {
        // Error handling is done by interceptor
        setsent(false);
      }
    } else if (event.key === "Enter" && sent) {
      toast.error("Error Occured!", {
        description: "Wait before sending another message",
      });
    }
  }, [sent, selectedChat, newMessage, sendMessageHook]);


  const sendLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const locationMessage = `https://www.google.com/maps?q=${latitude},${longitude}`;
        if (selectedChat) {
          try {
            await sendMessageHook(locationMessage, selectedChat._id, "location");
          } catch (error) {
            // Error handling is done by interceptor
          }
        }
      });
    } else {
      toast.error("Geolocation Not Supported", {
        description: "Your browser does not support geolocation.",
      });
    }
  };

  // Video call socket events - using shared socket instance
  useEffect(() => {
    if (!socket || !isConnected) return;

    emit('get_video_users');

    const handleVideoCallUsers = (newMessageReceived) => {
      if (newMessageReceived.length > 0) {
        const updatedVideoCallUsers = newMessageReceived.filter(
          users => users.user._id !== user._id
        );
        setVideoCallUsers(updatedVideoCallUsers.length > 0 ? updatedVideoCallUsers : []);
      }
    };

    const handleJoin = (newMessageReceived) => {
      const Revisedmsg = newMessageReceived.filter(users => users.user._id !== user._id);
      setVideoCallUsers(Revisedmsg);
    };
    
    const handleLeave = (newMessageReceived) => {
      const Revisedmsg = newMessageReceived.filter(users => users.user._id !== user._id);
      setVideoCallUsers(Revisedmsg.length > 0 ? Revisedmsg : []);
    };

    on('videoCallUsers', handleVideoCallUsers);
    on('video_user_joined', handleJoin);
    on('video_user_left', handleLeave);

    return () => {
      off('videoCallUsers');
      off('video_user_joined');
      off('video_user_left');
    };
  }, [socket, isConnected, user, on, off, emit, setVideoCallUsers]);

  // Real-time message handling - handled by useChat hook
  // This effect handles additional UI updates (sound, fetchAgain)
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleMessageReceived = (newMessageRecieved) => {
      const chatId = newMessageRecieved.chat._id;
      
      // If message is for different chat, play sound and refresh
      if (!selectedChatCompareRef.current || selectedChatCompareRef.current._id !== chatId) {
        if (!notifications.find(n => n._id === newMessageRecieved._id)) {
          setFetchAgain((prevFetchAgain) => !prevFetchAgain);
          fetchChats();
          sound.play();
        }
      } else {
        // Message is for current chat - UI update handled by useChat
        fetchChats();
      }
    };

    on("message received", handleMessageReceived);

    return () => {
      off("message received");
    };
  }, [socket, isConnected, notifications, on, off, fetchChats]);

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

  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    return new Promise((resolve, reject) => {
      if (!fileInputRef.current) {
        reject(new Error("File input not available"));
        return;
      }
      
      const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
          try {
            const data = await sendFile(file, selectedChat._id);
            resolve(data);
            setsent(false);
          } catch (error) {
            reject(error.message);
          }
        }
        // Reset input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        fileInputRef.current?.removeEventListener('change', handleFileChange);
      };

      fileInputRef.current.addEventListener('change', handleFileChange);
      fileInputRef.current.click();
    });
  };

  const handleVideoCall = () => {
    navigate(`/videocall/${selectedChat._id}`);
  };

  useEffect(() => {
      setChatsVideo(videoCallUsers);
  }, [videoCallUsers]);


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
                      <Avatar className="h-8 w-8 border" style={{ borderColor: primaryColor }}>
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
                onClick={() => {setVideoCallActive(true); selectedChat.isGroupChat ? setIsOneOnOneCall(false) : setIsOneOnOneCall(true); handleVideoCall()}}
              >
                <FaVideo />
              </Button> 
              {videoCallUsers && videoCallUsers.map((u,i) => (selectedChat._id == u.selectedChat._id &&
              <img 
                key={i} 
                src={u.user.pic}  
                alt="User" 
                className="absolute bg-black rounded-full w-5 h-5 right-[60px] border-[0.5px]"
                style={{ 
                  borderColor: primaryColor, 
                  transform: `translateX(${-70*i}%)`
                }} 
              />
              ))}
          </div>
          <div
            id="msgdabba"
            className="flex flex-col justify-end p-3 bg-[#020202] w-full h-full rounded-lg overflow-y-hidden border-2 shadow-[0px_0px_10px_5px_#10b981]"
            style={{ borderColor: primaryColor }}
          >
            {chatLoading ? (
              <div className="flex justify-center items-center m-auto">
                <Spinner className="h-10 w-10" style={{ color: primaryColor }} />
              </div>
            ) : (
              <div className="flex flex-col overflow-y-scroll scrollbar-none relative overflow-x-hidden max-w-full">
                <ScrollableChat messages={messages} />
              </div>
            )}

            <div onKeyDown={handleSendMessage} className="mt-3">
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
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,audio/*,application/pdf"
                  className="hidden"
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

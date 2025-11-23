import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import { useState, useRef, useEffect, useCallback } from "react";
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from "@/utils/chatLogics";
import { useAuthStore, useChatStore, useThemeStore } from "@/stores";
import { toast } from "sonner";
import { motion } from "framer-motion"; // Import framer-motion
import { GoogleGenerativeAI } from "@google/generative-ai";
import { config as appConfig } from "@/constants/config";
import { useChat } from "@/hooks";


const ScrollableChat = ({ messages }) => {
  const [renderCount, setRenderCount] = useState(0);
  const [speakVisible, setSpeakVisible] = useState(null); // State to control which message has the "Speak" button
  const [boling, setboling] = useState(false); // State to control which message has the "Speak" button
  const [speakingMessageIndex, setSpeakingMessageIndex] = useState(null); // Track which message is being spoken

  const user = useAuthStore((state) => state.user);
  const selectedChat = useChatStore((state) => state.selectedChat);
  const primaryColor = useThemeStore((state) => state.primaryColor);
  const [d , setd] = useState(false)  
  const [curmsglen , setcurmsglen] = useState(0)

  // Custom hooks - single source of truth
  const { deleteMessage: deleteMessageHook, fetchChats } = useChat();

  const speakText = useCallback((text, i) => {   
    setboling(true);
    setSpeakingMessageIndex(i);
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "hi-IN";
      utterance.voice = speechSynthesis.getVoices().find(voice => voice.lang === "hi-IN");
      utterance.rate = 0.9; // Slightly slower for better clarity
      utterance.pitch = 1.2; // Slightly higher pitch for better engagement
      utterance.onend = () => {
        setboling(false);
        setSpeakingMessageIndex(null);
      };
      setTimeout(() => {
        setboling(false);
        setSpeakingMessageIndex(null);
      }, 7500);
      
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    } else {
      toast.error("Text-to-Speech Not Supported", {
        description: "Your browser does not support text-to-speech.",
      });
    }
  }, []);

  let todayIST = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }).slice(0, 9);
  

  const handleDragEnd = (event, info, index) => {
    if(vismsg[index].sender._id === user._id){
      if(info.offset.x > 30 && speakVisible){
        setSpeakVisible(null);
      }
      if (info.offset.x < -30) {
        setSpeakVisible(index);
    } 
    }else {
      if(info.offset.x < -30 && speakVisible){
        setSpeakVisible(null);
      }
      if(info.offset.x > 30) {
        setSpeakVisible(index);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (speakVisible !== null) {
        const clickedElement = event.target.closest(".allmsg");
        if (!clickedElement) {
          setSpeakVisible(null);
        }
      }
    };

    if (speakVisible !== null) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [speakVisible]);

  const formatTime = useCallback((t) => {
    const date = new Date(t).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' }).split('/').map(num => num.padStart(2, '0')).join('/');
    const time = new Date(t).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }).split(':').map(num => num.padStart(2, '0')).join(':');
    return `${date} - ${time}`;
  }, []);

  const [vismsg, setvismsg] = useState(null)
  const [qq, setqq] = useState(15)
  useEffect(()=>{
    if (messages.length < 16) {
      setvismsg(messages);
    } else {
      setvismsg(messages.slice(messages.length-qq,messages.length));
    }
  },[messages,qq , selectedChat])

useEffect(()=>{
  if(messages && messages.length > 0 && vismsg && vismsg.length > 0){
    setcurmsglen(vismsg.length)
  }
},[vismsg])





  

  const deleteMessage = useCallback(async (messageId) => {
    if (!selectedChat) return;
    
    try {
      await deleteMessageHook(messageId, selectedChat._id);
      setSpeakVisible(null);
    } catch (error) {
      toast.error("Failed to delete message", {
        description: error?.response?.data?.message || error.message,
      });
    }
  }, [selectedChat, deleteMessageHook]);



  const [c,setc] = useState(null)
  const [translating,setTranslating] = useState(false)


  const HandleTranslate =async(i,msg)=>{
    if(c == null){
      setc(i)
      setTimeout(()=>{setc(null)},700)
      return
    }

    if(c == i && !translating && vismsg[i].type !== "location"){
      vismsg[i].content = "translating..."
      setTranslating(true)
      const genAI = new GoogleGenerativeAI(appConfig.GOOGLE_AI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      try {
        const result = await model.generateContent(
          `You are given a message , Translate it into ${user.TranslateLanguage ? user.TranslateLanguage : "English"} , without any additional text . return only the translated message and if you are unable to translate it return the same message. Here's the message: ` +
            msg
        );
       vismsg[i].content = result.response.text()
        setc(null)
        setTranslating(false)
      } catch (error) {
        vismsg[i].content = msg
        setc(null)
        setTranslating(false)
        toast.error("Error Translating", {
          description: error?.response?.data?.message || error.message,
        });
      }
    }
    
    
  }
  
     


  return (
    <TooltipProvider>
      <ScrollableFeed>
      { messages.length -qq > 0 ? (
        <button 
          className="w-1/2 py-[3px] translate-x-1/2 rounded-full self-center text-white"
          style={{ backgroundColor: primaryColor }}
          onClick={()=> {messages.length -qq > 10 ?setqq((l)=>l+10) : setqq(messages.length);setd(true)}}
        >
          load more
        </button>
      ) : null}
        {vismsg &&
          vismsg.map((m, i) => (
            <div 
              className={`allmsg flex relative transition-opacity ${
                speakingMessageIndex !== null && speakingMessageIndex !== i ? "opacity-50" : "opacity-100"
              } ${speakVisible !== null && speakVisible !== i ? "opacity-50" : ""}`} 
              key={m._id}
            >
              {isSameSender(vismsg, m, i, user._id)&& (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Avatar
                    className={`messagee${m._id} mt-[7px] mr-1 h-8 w-8 cursor-pointer`}
                    id={`messagee${m.sender._id === user._id ? "R" : "L"}`}
                    >
                      <AvatarImage src={m.sender.pic} alt={m.sender.name} />
                      <AvatarFallback>{m.sender.name?.charAt(0)?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="start">
                    {m.sender.name}
                  </TooltipContent>
                </Tooltip>
              )}
            <motion.span
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(event, info) => handleDragEnd(event, info, i)}
              id={`messagee${m.sender._id === user._id ? "R" : "L"}`}
              className={`messagee${m._id} ${m.sender._id === user._id ? "ml-auto" : "ml-0"} mt-[10px] mb-[10px] rounded-[20px] px-[15px] py-2 max-w-[75%] relative z-[50] flex items-center justify-center flex-col break-words whitespace-pre-wrap bg-black font-['DynaPuff']`}
              style={{
                opacity: 0,
                transition: "none",
                color: m.sender._id === user._id ? primaryColor : "#fff",
                border: m.sender._id === user._id ? "1px solid #fff" : `1px solid ${primaryColor}`,
              }}
              onClick={()=>HandleTranslate(i,m.content)}
              >
              {selectedChat.isGroupChat && <span className="font-bold" style={{color:primaryColor}}>{m.sender._id === user._id ? "" : m.sender.name + " : "}</span>} 
              {m.content ? (
                m.type === "location" ? (
                  <a href={m.content} target="_blank" rel="noopener noreferrer" className="underline text-blue-500 font-sans">{m.content}</a>
                ) : (
                  m.content
                )
              ) : (
                <div 
                  onClick={() => window.open(m.file, "_blank")}
                  className="h-[150px] w-[150px] bg-gray-100 flex items-end justify-center rounded-[10px] opacity-80 bg-cover bg-center cursor-pointer"
                  style={{ backgroundImage: `url(${m.file})` }}
                >
                  <img
                    src={m.file}
                    alt="File thumbnail"
                    loading="lazy"
                    className="block h-full w-full object-cover rounded-[10px]"
                  />
                </div>
              )}
              {m.file && (
                <p className="text-[10px] max-w-[150px] text-center font-semibold" style={{color: m.sender._id === user._id ? primaryColor : "#fff"}}>
                  {m.file.split("/").pop()}
                </p>
              )}
              <span
              className={`text-[8px] p-[5px] whitespace-nowrap min-w-fit w-fit -bottom-5 opacity-45 md:text-[8px] md:p-[2px] md:opacity-52 sm:text-[6px] sm:p-[2px] sm:-bottom-[10px] sm:opacity-65 ${m.sender._id === user._id ? "right-0 rounded-tl-[99px] rounded-tr-none rounded-br-[99px] rounded-bl-[99px]" : "left-1/2 -translate-x-1/2 rounded-tl-none rounded-tr-[99px] rounded-br-[99px] rounded-bl-[99px]"} absolute z-[100] bg-[#10b981] text-white font-['Atomic_Age']`}
              >
                {formatTime(m.createdAt).slice(0, 9) === todayIST?`${Number(formatTime(m.createdAt).slice(13,15)) >9 ?  formatTime(m.createdAt).slice(13,17) + formatTime(m.createdAt).slice(20,24) : formatTime(m.createdAt).slice(13,17) + formatTime(m.createdAt).slice(20,24)}`: `${Number(formatTime(m.createdAt).slice(11,14)) >9 ? formatTime(m.createdAt).slice(0,9) +" -"+   formatTime(m.createdAt).slice(11,17) + formatTime(m.createdAt).slice(20,23) :formatTime(m.createdAt).slice(0,11) +  formatTime(m.createdAt).slice(11,16) + formatTime(m.createdAt).slice(19,24)}`}
              </span>
              {m.content && speakVisible === i && !boling && (
                <span
                  onClick={() => speakText(m.content,i)}
                  className={`absolute top-[30px] ${m.sender._id === user._id ? "left-[-50px]" : "right-[-50px]"} bg-gray-500 hover:bg-[#10b981] text-white rounded px-[5px] py-[2px] cursor-pointer text-xs z-[100] transition-colors`}
                >
                  Speak
                </span>
              )}
              {speakVisible === i && m.sender._id === user._id && !boling && (
                <span
                  onClick={() => deleteMessage(m._id)}
                  className={`absolute ${m.sender._id === user._id ? "left-[-92px]" : "right-[-92px]"} top-0 bg-gray-500 hover:bg-red-500 text-white rounded px-[5px] py-[2px] cursor-pointer text-xs transition-colors`}
                >
                  Delete For All
                </span>
              )}
            </motion.span>
          </div>
        ))}
      </ScrollableFeed>
    </TooltipProvider>
  );
};

export default ScrollableChat;

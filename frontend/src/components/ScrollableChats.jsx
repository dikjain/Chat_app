import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import { useState, useRef, useEffect } from "react";
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from "../configs/ChatLogics";
import { ChatState } from "../Context/Chatprovider";
import "./UserAvatar/Scroll.css";

const ScrollableChat = ({ messages }) => {
  const [speakVisible, setSpeakVisible] = useState(null); // State to control which message has the "Speak" button
  const [boling, setboling] = useState(false); // State to control which message has the "Speak" button

  const messageRef = useRef(null);


  const speakText = (text) => {   
    setboling(true);
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "hi-IN";
      utterance.voice = speechSynthesis.getVoices().find(voice => voice.lang === "hi-IN");
      utterance.rate = 0.9; // Slightly slower for better clarity
      utterance.pitch = 1.2; // Slightly higher pitch for better engagement
      utterance.onend = () => {
        setboling(false);
      };
      setTimeout(() => {
        if(setboling) setboling(false)
      }, 7500);
      
      speechSynthesis.cancel(); // Cancel any ongoing speech
      speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "Text-to-Speech Not Supported",
        description: "Your browser does not support text-to-speech.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  let todayIST = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }).slice(0, 9);
  

  const handleTextClick = (index) => {
    setSpeakVisible(index === speakVisible ? null : index); // Toggle "Speak" button visibility
  };

  const { user } = ChatState();
  const formatTime = (t) => new Date(t).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }).replace(',', ' -');

  const [vismsg, setvismsg] = useState(null)
  const [qq, setqq] = useState(15)
  useEffect(()=>{
    setvismsg(messages.slice(messages.length-qq,messages.length))
  },[messages,qq])

  return (
    <ScrollableFeed>
    { messages.length -qq > 0 ? <button style={{width:"50%",padding:"3px 0px",transform:"translateX(50%)", borderRadius:"999px" , backgroundColor:"#48bb78",alignSelf:"center",justifySelf:"center"}} onClick={()=> messages.length -qq > 10 ?setqq((l)=>l+10) : setqq(messages.length)}>load more</button> : null}
      {vismsg &&
        vismsg.map((m, i) => (
          <div style={{ display: "flex", position: "relative" }} key={m._id}>
            {isSameSender(vismsg, m, i, user._id)&& (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            <span
              onClick={() => handleTextClick(i)} // Click event to show/hide "Speak" button
              style={{
                backgroundColor: `${m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"}`,
                marginLeft: `${m.sender._id === user._id ? "auto" : "0px"}`,
                // marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: 10,
                marginBottom:10,
                borderRadius: "20px",
                padding: "8px 15px",
                maxWidth: "75%",
                position: "relative",
                zIndex:"50",
                color:"black"
              }}
            >
              {m.content}
              
              <span
              style={{
                fontFamily:" 'Atomic Age', sans-serif,Roboto, Arial",
                left:`${m.sender._id === user._id ? "" : "50%"}`,
                right:`${m.sender._id === user._id ? "50%" : ""}`,
                position: "absolute",
                zIndex:"100",
                backgroundColor:"grey",
                color:"white",
              }}
              className={`yotem ${m.sender._id === user._id ? "raayit" : "lefat" }`}
              >{formatTime(m.createdAt).slice(0, 9) === todayIST?`${Number(formatTime(m.createdAt).slice(11,14)) >9 ?  formatTime(m.createdAt).slice(11,17) + formatTime(m.createdAt).slice(20,23) : formatTime(m.createdAt).slice(11,16) + formatTime(m.createdAt).slice(19,23)}` : `${Number(formatTime(m.createdAt).slice(11,14)) >9 ? formatTime(m.createdAt).slice(0,9) +" -"+   formatTime(m.createdAt).slice(11,17) + formatTime(m.createdAt).slice(20,23) :formatTime(m.createdAt).slice(0,9) +" -"+  formatTime(m.createdAt).slice(11,16) + formatTime(m.createdAt).slice(19,23)}`}</span>
              {speakVisible === i && !boling && (
                <span
                ref={messageRef}
                  onClick={() => speakText(m.content)}
                  onMouseEnter={() => {messageRef.current.style.backgroundColor = "green";}}
                  onMouseLeave={() => {messageRef.current.style.backgroundColor = "black";}}
                  style={{
                    position: "absolute",
                    left: `${m.sender._id === user._id ? "-50px" : ""}`,
                    right: `${m.sender._id === user._id ? "" : "-50px"}`,
                    top: "0",
                    backgroundColor: "black",
                    color: "white",
                    borderRadius: "5px",
                    padding: "2px 5px",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  Speak
                </span>
              )}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;

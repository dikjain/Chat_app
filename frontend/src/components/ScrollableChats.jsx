import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import { useState, useRef, useEffect } from "react";
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from "../configs/ChatLogics";
import { ChatState } from "../Context/Chatprovider";
import "./UserAvatar/Scroll.css";
import gsap from "gsap";
import { Text, useToast } from "@chakra-ui/react";
import axios from "axios"; // Import axios
import { motion } from "framer-motion"; // Import framer-motion


const ScrollableChat = ({ msgaaya, setMsgaaya, messages, setMessages }) => {
  const [speakVisible, setSpeakVisible] = useState(null); // State to control which message has the "Speak" button
  const [boling, setboling] = useState(false); // State to control which message has the "Speak" button

  const { user , setChats , selectedChat , a , seta } = ChatState();
  const messageRef = useRef(null);
  const messageRef2 = useRef(null);
  const toast = useToast();
  const [msggya , setMsggya] = useState(false)

  const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Fetch the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const speakText = (text,i) => {   
    setboling(true);
    document.querySelectorAll(".allmsg").forEach(el => {
      el.style.opacity = "0.5";
    });
    document.querySelectorAll(".allmsg")[i].style.opacity = "1";
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "hi-IN";
      utterance.voice = speechSynthesis.getVoices().find(voice => voice.lang === "hi-IN");
      utterance.rate = 0.9; // Slightly slower for better clarity
      utterance.pitch = 1.2; // Slightly higher pitch for better engagement
      utterance.onend = () => {
        setboling(false);
        document.querySelectorAll(".allmsg").forEach(el => {
          el.style.opacity = "1";
        });
      utterance.addEventListener('end', () => {
        setboling(false);
        document.querySelectorAll(".allmsg").forEach(el => {
          el.style.opacity = "1";
        });
      });
      };
      setTimeout(() => {
        setboling(false);
        document.querySelectorAll(".allmsg").forEach(el => {
          el.style.opacity = "1";
        });
      }, 7500);
      
      speechSynthesis.cancel();
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
  

  const handleDragEnd = (event, info, index) => {
    if(vismsg[index].sender._id === user._id){
      if(info.offset.x > 30 && speakVisible){
        setSpeakVisible(null);
        document.querySelectorAll(".allmsg").forEach(el => {
          el.style.opacity = "1";
        });
      }
      if (info.offset.x < -30) {
        setSpeakVisible(index);
        document.querySelectorAll(".allmsg").forEach(el => {
          el.style.opacity = "0.5";
        });
        document.querySelectorAll(".allmsg")[index].style.opacity = "1";
    } 
    }else {
      if(info.offset.x < -30 && speakVisible){
        setSpeakVisible(null);
        document.querySelectorAll(".allmsg").forEach(el => {
          el.style.opacity = "1";
        });
      }
      if(info.offset.x > 30) {
        setSpeakVisible(index);
        document.querySelectorAll(".allmsg").forEach(el => {
          el.style.opacity = "0.5";
        });
        document.querySelectorAll(".allmsg")[index].style.opacity = "1";
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (speakVisible !== null) {
        const allMessages = document.querySelectorAll(".allmsg");
        const clickedInside = Array.from(allMessages).some((el, index) => {
          return el.contains(event.target) && index === speakVisible;
        });

        if (!clickedInside) {
          setSpeakVisible(null);
          allMessages.forEach(el => {
            el.style.opacity = "1";
          });
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

  const formatTime = (t) => {
    const date = new Date(t).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' }).split('/').map(num => num.padStart(2, '0')).join('/');
    const time = new Date(t).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }).split(':').map(num => num.padStart(2, '0')).join(':');
    return `${date} - ${time}`;
  };

  const [vismsg, setvismsg] = useState(null)
  const [qq, setqq] = useState(15)
  useEffect(()=>{
    if (messages.length < 16) {
      setvismsg(messages);
    } else {
      setvismsg(messages.slice(messages.length-qq,messages.length));
    }
  },[messages,qq , selectedChat])



  useEffect(() => {
    if (vismsg && vismsg.length > 0) {
      if(a){
        seta(false)
        gsap.fromTo(
          "#messageeL", 
          { x: "-200%" , scale:0.1,duration:0.01, opacity:0}, 
          { x: "0",scale:1, opacity:1,stagger:0.1, ease: "elastic.out(1,0.7)", onComplete: () => gsap.set("#messageeL", { clearProps: "transform" }) }
        );
        gsap.fromTo(
          "#messageeR", 
          { x: "200%" , scale:0.1,duration:0.0001, opacity:0}, 
          { x: "0", scale:1, opacity:1,  stagger:0.1, ease: "elastic.out(1,0.7)", onComplete: () => gsap.set("#messageeR", { clearProps: "transform" }) }
        );
      }
    }
  }, [vismsg]);

  useEffect(()=>{
    seta(true)
  },[selectedChat])



  useEffect(() => {
    if (messages.length > 0 && msggya) {
      const prevmsg = messages[messages.length - vismsg.length];
      setTimeout(()=>{
      gsap.fromTo(
        `.messagee${prevmsg._id}`,
        { x: prevmsg.sender._id === user._id ? "200%" : "-200%", scale: 0.1, duration: 0.01, opacity:0 },
        { x: "0", scale: 1 , opacity:1 , duration:0.8, ease: "elastic.out(1, 0.7)", onComplete: () => gsap.set(`.messagee${prevmsg._id}`, { clearProps: "transform" }) }
      );
      setMsggya(false);
      },20)

    }
  }, [messages, msggya, user._id]);
  useEffect(() => {
    if (messages.length > 0 && msgaaya) {
      const newestMessage = messages[messages.length - 1];
      setTimeout(()=>{
      gsap.fromTo(
        `.messagee${newestMessage._id}`,
        { x: newestMessage.sender._id === user._id ? "200%" : "-200%", scale: 0.1, duration: 0.01, opacity:0 },
        { x: "0", scale: 1 , opacity:1 , duration:0.8, ease: "elastic.out(1, 0.7)", onComplete: () => gsap.set(`.messagee${newestMessage._id}`, { clearProps: "transform" }) }
      );
      setMsgaaya(false);
      },1)

    }
  }, [messages, msgaaya, user._id]);

  

  const deleteMessage = async (messageId) => {
    try{      
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const deleteMessagePromise = axios.post(`/api/Message/delete`, { messageId }, config);
      const changeLatestMessagePromise = axios.post(`/api/message/ChangeLatestMessage`, { chatId: selectedChat._id, latestMessage: messageId === messages[messages.length-1]._id ? (messages[messages.length-2] ? messages[messages.length-2]._id : null) : messages[messages.length-1]._id }, config);
      await Promise.all([deleteMessagePromise, changeLatestMessagePromise]);
      setMessages(prevMessages => prevMessages.filter(message => message._id !== messageId));
      setMsggya(true)
      fetchChats();
      toast({
        title: "Message deleted successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }catch(error){
      toast({
        title: "Failed to delete message",
        description: error?.response?.data?.message || error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
     


  return (
    <ScrollableFeed>
    { messages.length -qq > 0 ? <button style={{width:"50%",padding:"3px 0px",transform:"translateX(50%)", borderRadius:"999px" , backgroundColor:"#48bb78",alignSelf:"center",justifySelf:"center" , color:"white" }} onClick={()=> {messages.length -qq > 10 ?setqq((l)=>l+10) : setqq(messages.length);seta(true)}}>load more</button> : null}
      {vismsg &&
        vismsg.map((m, i) => (
          <div className="allmsg" style={{ display: "flex", position: "relative"}} key={m._id}>
            {isSameSender(vismsg, m, i, user._id)&& (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                transition="none"
                className={`messagee${m._id}`}
                id={`messagee${m.sender._id === user._id ? "R" : "L"}`}   
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            <motion.span
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(event, info) => handleDragEnd(event, info, i)}
              id={`messagee${m.sender._id === user._id ? "R" : "L"}`}
              className={`messagee${m._id}`}
              style={{
                opacity:0,
                transition:"none",
                backgroundColor: `${m.sender._id === user._id ? "#000" : "#000"}`,
                marginLeft: `${m.sender._id === user._id ? "auto" : "0px"}`,
                // marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: 10,
                marginBottom:10,
                borderRadius: "20px",
                padding: "8px 15px",
                maxWidth: "75%",
                position: "relative",
                zIndex:"50",
                color:`${m.sender._id === user._id ? "#48bb78" : "#fff"}`,
                border:`${m.sender._id === user._id ? "1px solid #fff" : "1px solid #48bb78"}`,
                display:"flex",
                fontFamily:"'DynaPuff', sans-serif",
                alignItems:"center",
                justifyContent:"center",
                flexDirection:"column"
                
              }}
              >
              {selectedChat.isGroupChat && <span style={{fontWeight:"bold", color:"#48bb78"}}>{m.sender._id === user._id ? "" : m.sender.name + " : "}</span>} 
              {m.content ? m.content : (
                <div 
                onClick={() => window.open(m.file, "_blank")}
                style={{
                  height: "150px",
                  width: "150px",
                  backgroundColor: "#f0f0f0",
                  display: "flex",
                  alignItems: "end",
                  justifyContent: "center",
                  borderRadius: "10px",
                  backgroundImage: `url(${m.file}) `,
                  opacity: 0.8,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  cursor:"pointer"
                }}>
                </div>
              )}
              {m.file && <Text style={{ fontSize:"10px",maxWidth:"150px" ,textAlign:"center",fontWeight:"semibold",color:`${m.sender._id === user._id ? "#48bb78" : "#fff"}`}}>{m.file.split("/").pop()}</Text>}
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
              >{formatTime(m.createdAt).slice(0, 9) === todayIST?`${Number(formatTime(m.createdAt).slice(13,15)) >9 ?  formatTime(m.createdAt).slice(13,17) + formatTime(m.createdAt).slice(20,24) : formatTime(m.createdAt).slice(13,17) + formatTime(m.createdAt).slice(20,24)}`: `${Number(formatTime(m.createdAt).slice(11,14)) >9 ? formatTime(m.createdAt).slice(0,9) +" -"+   formatTime(m.createdAt).slice(11,17) + formatTime(m.createdAt).slice(20,23) :formatTime(m.createdAt).slice(0,11) +  formatTime(m.createdAt).slice(11,16) + formatTime(m.createdAt).slice(19,24)}`}
               </span>
              {m.content && speakVisible === i && !boling && (
                <span
                ref={messageRef}
                  onClick={() => speakText(m.content,i)}
                  onMouseEnter={() => {messageRef.current.style.backgroundColor = "green";}}
                  onMouseLeave={() => {messageRef.current.style.backgroundColor = "grey";}}

                  style={{
                    position: "absolute",
                    left: `${m.sender._id === user._id ? "-50px" : ""}`,
                    right: `${m.sender._id === user._id ? "" : "-50px"}`,
                    top: "30px",
                    backgroundColor: "grey",
                    color: "white",
                    borderRadius: "5px",
                    padding: "2px 5px",
                    cursor: "pointer",
                    fontSize: "12px",
                    zIndex:"100",
                  }}
                >
                  Speak
                </span>
              )}
              {speakVisible === i && m.sender._id === user._id && !boling && (
                <span
                ref={messageRef2}
                  onClick={() => deleteMessage(m._id)}
                  onMouseEnter={() => {messageRef2.current.style.backgroundColor = "red";}}
                  onMouseLeave={() => {messageRef2.current.style.backgroundColor = "grey";}}
                  style={{
                    position: "absolute",
                    left: `${m.sender._id === user._id ? "-92px" : ""}`,
                    right: `${m.sender._id === user._id ? "" : "-92px"}`,
                    top: "0px",
                    backgroundColor: "grey",
                    color: "white",
                    borderRadius: "5px",
                    padding: "2px 5px",
                    cursor: "pointer",
                    fontSize: "12px"
                  }}
                >
                  Delete For All
                </span>
              )}
            </motion.span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;

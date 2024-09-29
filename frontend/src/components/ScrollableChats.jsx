import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import { useState, useRef } from "react";
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from "../configs/ChatLogics";
import { ChatState } from "../Context/Chatprovider";

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

  const handleTextClick = (index) => {
    setSpeakVisible(index === speakVisible ? null : index); // Toggle "Speak" button visibility
  };

  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex", position: "relative" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) || isLastMessage(messages, i, user._id)) && (
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
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                position: "relative",
              }}
            >
              {m.content}
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

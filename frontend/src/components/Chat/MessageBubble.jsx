import { motion } from "framer-motion";
import MessageContent from "./MessageContent";
import MessageTime from "./MessageTime";
import MessageActions from "./MessageActions";

const MessageBubble = ({
  message,
  index,
  isCurrentUser,
  isGroupChat,
  formattedTime,
  speakVisible,
  isSpeaking,
  onDragEnd,
  onTranslate,
  onSpeak,
  onDelete,
}) => {
  return (
    <motion.span
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(event, info) => onDragEnd(event, info, index)}
      id={`messagee${isCurrentUser ? "R" : "L"}`}
      className={`messagee${message._id} ${
        isCurrentUser ? "ml-auto" : "ml-0"
      } rounded-2xl  ${message.file ? "px-1" : "px-4"} py-1 max-w-[75%] border  ${isCurrentUser ? "text-neutral-500  border-neutral-200" : "text-black border-neutral-300"}  relative z-[50] flex  ${isCurrentUser ? "items-end" : "items-start"} justify-center flex-col break-words whitespace-pre-wrap bg-white shadow-md `}
      onClick={() => onTranslate(index, message.content)}
    >
      <MessageContent 
        message={message} 
        isCurrentUser={isCurrentUser} 
        isGroupChat={isGroupChat}
      />
      <MessageTime 
        createdAt={message.createdAt}
        formattedTime={formattedTime}
        isCurrentUser={isCurrentUser}
      />
      <MessageActions
        message={message}
        index={index}
        isCurrentUser={isCurrentUser}
        speakVisible={speakVisible}
        isSpeaking={isSpeaking}
        onSpeak={onSpeak}
        onDelete={onDelete}
      />
    </motion.span>
  );
};

export default MessageBubble;


const MessageActions = ({ 
  message, 
  index, 
  isCurrentUser, 
  speakVisible, 
  isSpeaking, 
  onSpeak, 
  onDelete 
}) => {
  if (speakVisible !== index || isSpeaking) return null;

  return (
    <>
      {message.content && (
        <span
          onClick={() => onSpeak(message.content, index)}
          className={`absolute top-[30px] ${
            isCurrentUser ? "left-[-50px]" : "right-[-50px]"
          } bg-gray-500 hover:bg-[#10b981] text-white rounded px-[5px] py-[2px] cursor-pointer text-xs z-[100] transition-colors`}
        >
          Speak
        </span>
      )}
      {isCurrentUser && (
        <span
          onClick={() => onDelete(message._id)}
          className={`absolute ${
            isCurrentUser ? "left-[-92px]" : "right-[-92px]"
          } top-0 bg-gray-500 hover:bg-red-500 text-white rounded px-[5px] py-[2px] cursor-pointer text-xs transition-colors`}
        >
          Delete For All
        </span>
      )}
    </>
  );
};

export default MessageActions;


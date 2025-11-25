import MessageAvatar from "./MessageAvatar";
import MessageBubble from "./MessageBubble";

const MessageItem = ({
  message,
  index,
  visibleMessages,
  user,
  selectedChat,
  isCurrentUser,
  showAvatar,
  formattedTime,
  speakVisible,
  isSpeaking,
  speakingIndex,
  onDragEnd,
  onTranslate,
  onSpeak,
  onDelete,
}) => {
  return (
    <div 
      className={` flex relative transition-opacity ${
        speakingIndex !== null && speakingIndex !== index ? "opacity-50" : "opacity-100"
      } ${speakVisible !== null && speakVisible !== index ? "opacity-50" : ""}`}
    >
      {showAvatar && (
        <MessageAvatar message={message} isCurrentUser={isCurrentUser} />
      )}
      <MessageBubble
        message={message}
        index={index}
        isCurrentUser={isCurrentUser}
        isGroupChat={selectedChat?.isGroupChat}
        formattedTime={formattedTime}
        speakVisible={speakVisible}
        isSpeaking={isSpeaking}
        onDragEnd={onDragEnd}
        onTranslate={onTranslate}
        onSpeak={onSpeak}
        onDelete={onDelete}
      />
    </div>
  );
};

export default MessageItem;


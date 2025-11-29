const MessageTime = ({ createdAt, formattedTime, isCurrentUser }) => {
  const getRelativeTime = (timestamp) => {
    if (!timestamp) return "";
    
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - messageTime) / 1000);
    
    if (diffInSeconds < 60) {
      return "just now";
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? 'min' : 'mins'} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    }
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks} ${diffInWeeks === 1 ? 'week' : 'weeks'} ago`;
  };

  const relativeTime = getRelativeTime(createdAt);

  return (
    <span
      className={`text-[9px] md:text-[10px] whitespace-nowrap opacity-60 text-neutral-500 ${
        isCurrentUser 
          ? "self-end" 
          : "self-start"
      }`}
    >
      {relativeTime}
    </span>
  );
};

export default MessageTime;


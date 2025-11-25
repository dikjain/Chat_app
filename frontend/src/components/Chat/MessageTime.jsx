const MessageTime = ({ createdAt, formattedTime, isCurrentUser }) => {
  return (
    <span
      className={`text-[8px] p-[5px] whitespace-nowrap min-w-fit w-fit -bottom-5 opacity-45 md:text-[8px] md:p-[2px] md:opacity-52 sm:text-[6px] sm:p-[2px] sm:-bottom-[10px] sm:opacity-65 ${
        isCurrentUser 
          ? "right-0 rounded-tl-[99px] rounded-tr-none rounded-br-[99px] rounded-bl-[99px]" 
          : "left-1/2 -translate-x-1/2 rounded-tl-none rounded-tr-[99px] rounded-br-[99px] rounded-bl-[99px]"
      } absolute z-[100] bg-[#10b981] text-white font-['Atomic_Age']`}
    >
      {formattedTime}
    </span>
  );
};

export default MessageTime;


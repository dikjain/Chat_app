import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const MessageAvatar = ({ message, isCurrentUser }) => {
  if (!message.sender) return null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Avatar
          className={`messagee${message._id} mt-[7px] mr-1 h-8 w-8 cursor-pointer`}
          id={`messagee${isCurrentUser ? "R" : "L"}`}
        >
          <AvatarImage src={message.sender?.pic} alt={message.sender?.name} />
          <AvatarFallback>{message.sender?.name?.charAt(0)?.toUpperCase()}</AvatarFallback>
        </Avatar>
      </TooltipTrigger>
      <TooltipContent side="bottom" align="start">
        {message.sender?.name}
      </TooltipContent>
    </Tooltip>
  );
};

export default MessageAvatar;


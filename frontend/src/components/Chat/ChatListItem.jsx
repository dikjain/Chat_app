import { getSender } from "../../utils/chatLogics";
import { getUserPics } from "../../lib/utils";

const ChatListItem = ({ chat, loggedUser, user, selectedChat, onlinepeople, setSelectedChat }) => {
  const userPics = getUserPics(chat, user?._id);
  
  return (
    <div
      className={`cursor-pointer border group ${selectedChat?._id === chat._id ? 'bg-white' : 'bg-neutral-100 hover:bg-white'} transition-all duration-100 border-neutral-300 px-3 py-2 rounded-lg relative font-light z-30 shadow-[0_2px_3px_0_rgba(0,0,0,0.15)]`}
      onClick={() => setSelectedChat(chat)}
    >
      {!chat.isGroupChat && chat.users[0] && chat.users[1] && (chat.users[0]._id === user._id ? onlinepeople.includes(chat.users[1]._id) : onlinepeople.includes(chat.users[0]._id)) && (
        <div className="absolute right-[5%] top-[40%] w-[10px] h-[10px] rounded-full bg-[#10b981] shadow-[#48bb78_0px_0px_5px_1px]"></div>
      )}
      <div className="flex items-center gap-2">
        {userPics.length > 0 && (
          <div className="flex items-center shrink-0">
            {userPics.map((pic, index) => (
              <img
                key={index}
                src={pic}
                alt=""
                className={`rounded-full shadow-[0px_1px_2px_0px_rgba(0,0,0,0.3)] object-cover border border-white ${userPics.length > 1 ? 'w-8 h-8' : 'w-10 h-10'}`}
                style={userPics.length > 1 && index > 0 ? { marginLeft: '-8px' } : {}}
                onError={(e) => {
                  e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png';
                }}
              />
            ))}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className={`font-medium group-hover:text-neutral-600 ${selectedChat?._id === chat._id ? "text-neutral-600" : "text-neutral-500"}`}>
            {!chat.isGroupChat
              ? getSender(loggedUser, chat.users)
              : chat.chatName}
          </p>

          {chat.latestMessage ? (
            <p className={`text-xs ${selectedChat?._id === chat._id ? "text-neutral-500" : "text-neutral-400"}`}>
              {chat.latestMessage.sender?.name && (
                <b>{chat.latestMessage.sender.name} : </b>
              )}
              {chat.latestMessage.content 
                ? (chat.latestMessage.content.length > 50
                  ? chat.latestMessage.content.substring(0, 51) + "..."
                  : chat.latestMessage.content)
                : "File"}
            </p>
          ) : (
            <p className="text-xs text-neutral-400">
              No messages yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatListItem;

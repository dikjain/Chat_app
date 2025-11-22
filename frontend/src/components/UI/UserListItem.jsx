import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ChatState } from "@/context/Chatprovider";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <div
      onClick={handleFunction}
      className="cursor-pointer bg-black hover:bg-green-500 hover:text-white w-full flex items-center text-green-300 px-3 py-2 mb-2 rounded-lg border border-green-400 transition-colors"
    >
      <Avatar className="mr-2 h-8 w-8 cursor-pointer">
        <AvatarImage src={user.pic} alt={user.name} />
        <AvatarFallback>{user.name?.charAt(0)?.toUpperCase()}</AvatarFallback>
      </Avatar>
      <div>
        <p className="text-white">{user.name}</p>
        <p className="text-xs text-green-300">
          <b className="text-white">Email : </b>
          {user.email}
        </p>
      </div>
    </div>
  );
};

export default UserListItem;

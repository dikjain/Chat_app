import { X } from "lucide-react";
import { Badge } from "./badge";
import { cn } from "../../lib/utils";

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
    <Badge
      className={cn(
        "px-2 py-1 rounded-lg  my-1 cursor-pointer",
        "bg-gradient-to-t from-green-600 to-green-400 text-white hover:bg-gradient-to-t hover:from-green-700 hover:to-green-500",
        "text-xs"
      )}
      onClick={handleFunction}
    >
      {user.name}
      {admin === user._id && <span> (Admin)</span>}
      <X className="ml-1 h-3 w-3 inline" />
    </Badge>
  );
};

export default UserBadgeItem;
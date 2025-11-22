import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
    <Badge
      className={cn(
        "px-2 py-1 rounded-lg m-1 mb-2 cursor-pointer",
        "bg-purple-600 text-white hover:bg-purple-700",
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
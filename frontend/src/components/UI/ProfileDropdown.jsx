import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
// Modals used in ProfileDropdown:
// 1. ProfileModal - User profile view/edit (profile picture, name, email, language selection, view status)
// 2. StatusModal - Create/view user status updates
import ProfileModal from "@/components/Modals/ProfileModal";
import StatusModal from "@/components/Modals/StatusModal";
import { useAuthStore } from "@/stores";
import { useSocket } from "@/hooks";
import ButtonWrapper from "./buttonWrapper";

function ProfileDropdown() {
  const user = useAuthStore((state) => state.user);
  const clearUser = useAuthStore((state) => state.clearUser);
  const { emitUserDisconnected } = useSocket();
  const navigate = useNavigate();

  const logoutHandler = () => {
    emitUserDisconnected();
    clearUser();
    navigate("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ButtonWrapper className="rounded-full" scaleDown={0.9}>
          <Avatar className="h-8 w-8 bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.2)] border border-neutral-200 rounded-full">
            <AvatarImage src={user.pic} alt={user.name} />
            <AvatarFallback className="text-xs text-neutral-600">{user.name?.charAt(0)?.toUpperCase()}</AvatarFallback>
          </Avatar>
        </ButtonWrapper>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white border-neutral-200 z-[1000] pl-2">
        <ProfileModal profileUser={user}>
          <DropdownMenuItem 
            className="bg-white hover:bg-neutral-50 text-neutral-600 z-[1000] transition-colors"
            onSelect={(e) => e.preventDefault()}
          >
            My Profile
          </DropdownMenuItem>
        </ProfileModal>
        <DropdownMenuSeparator />
        <StatusModal>
          <DropdownMenuItem 
            className="bg-white hover:bg-neutral-50 text-neutral-600 z-[1000] transition-colors"
            onSelect={(e) => e.preventDefault()}
          >
            My Status
          </DropdownMenuItem>
        </StatusModal>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onSelect={logoutHandler} 
          className="bg-white hover:bg-neutral-50 text-neutral-600 z-[1000] transition-colors"
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ProfileDropdown;

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import ProfileModal from "@/components/Modals/ProfileModal";
import StatusModal from "@/components/Modals/StatusModal";
import LanguageModal from "@/components/Modals/LanguageModal";
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
        <ButtonWrapper className={"rounded-full"} scaleDown={0.9}>
          <Avatar className="h-8 w-8  bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.3)]   rounded-full">
            <AvatarImage src={user.pic} alt={user.name} />
            <AvatarFallback className="text-xs text-neutral-500">{user.name?.charAt(0)?.toUpperCase()}</AvatarFallback>
          </Avatar>
        </ButtonWrapper>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-black text-[#10b981] z-[9999]">
        <ProfileModal profileUser={user}>
          <DropdownMenuItem className="bg-black z-[1000]" style={{ color: "#10b981" }}>
            My Profile
          </DropdownMenuItem>
        </ProfileModal>
        <DropdownMenuSeparator />
        <StatusModal>
          <DropdownMenuItem className="bg-black" style={{ color: "#10b981" }}>
            My Status
          </DropdownMenuItem>
        </StatusModal>
        <DropdownMenuSeparator />
        <LanguageModal>
          <DropdownMenuItem className="bg-black" style={{ color: "#10b981" }}>
            Language
          </DropdownMenuItem>
        </LanguageModal>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logoutHandler} className="bg-black z-[1000]" style={{ color: "#10b981" }}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ProfileDropdown;


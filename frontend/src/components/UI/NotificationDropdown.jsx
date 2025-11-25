import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// Modals used in NotificationDropdown:
// None - This dropdown only navigates to chats, no modals are used
import { Bell } from "lucide-react";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";
import { getSender } from "@/utils/chatLogics";
import { useAuthStore, useChatStore, useNotificationStore } from "@/stores";
import ButtonWrapper from "./buttonWrapper";

function NotificationDropdown() {
  const user = useAuthStore((state) => state.user);
  const setSelectedChat = useChatStore((state) => state.setSelectedChat);
  const notifications = useNotificationStore((state) => state.notifications);
  const removeNotification = useNotificationStore((state) => state.removeNotification);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ButtonWrapper className="rounded-full" scaleDown={0.9}>
          <NotificationBadge
            count={notifications.length}
            effect={Effect.SCALE}
          />
          <span className="bg-white hover:bg-neutral-50 size-full px-1.5 z-10 flex items-center justify-center relative rounded-full font-medium font-saira text-sm text-neutral-600 border border-neutral-200 shadow-[0_1px_2px_0_rgba(0,0,0,0.2)] gap-2 transition-colors">
            <Bell className="w-5 h-5 text-neutral-600" />
          </span>
        </ButtonWrapper>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white border-neutral-200 z-[1000] pl-2">
        {!notifications.length && (
          <p className="text-neutral-500 px-2 py-1.5">No New Messages</p>
        )}
        {notifications.slice(-10).map((notif) => (
          <DropdownMenuItem
            key={notif._id}
            onSelect={() => {
              setSelectedChat(notif.chat);
              removeNotification(notif._id);
            }}
            className="bg-white hover:bg-neutral-50 text-neutral-600 z-[1000] transition-colors"
          >
            {notif.chat.isGroupChat
              ? `New Message in ${notif.chat.chatName}`
              : `New Message from ${getSender(user, notif.chat.users)}`}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default NotificationDropdown;

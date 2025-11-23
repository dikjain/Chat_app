import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getUserPics(chat, currentUserId) {
  if (!chat?.users) return [];
  
  const otherUsers = chat.users.filter(user => user?._id?.toString() !== currentUserId?.toString());
  
  if (chat.isGroupChat) {
    return otherUsers.slice(0, 3).map(user => user?.pic).filter(Boolean);
  } else {
    return otherUsers.length > 0 && otherUsers[0]?.pic ? [otherUsers[0].pic] : [];
  }
}

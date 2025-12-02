import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get user profile pictures from a chat
 * @param chat - The chat object containing users
 * @param currentUserId - The ID of the current user to exclude
 * @returns Array of user profile picture URLs
 */
export function getUserPics(chat, currentUserId) {
  if (!chat?.users || !Array.isArray(chat.users)) return [];
  
  const otherUsers = chat.users.filter(user => {
    if (!user?._id) return false;
    return user._id.toString() !== currentUserId?.toString();
  });
  
  if (chat.isGroupChat) {
    // For group chats, return up to 3 user pics
    return otherUsers
      .slice(0, 3)
      .map(user => user?.pic)
      .filter(Boolean);
  } else {
    // For one-on-one chats, return the other user's pic
    return otherUsers.length > 0 && otherUsers[0]?.pic 
      ? [otherUsers[0].pic] 
      : [];
  }
}

/**
 * Validate email format
 * @param email - Email string to validate
 * @returns Boolean indicating if email is valid
 */
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Format file size to human-readable format
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "1.5 MB")
 */
export function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Debounce function to limit function calls
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

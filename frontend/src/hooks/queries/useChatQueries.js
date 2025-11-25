import { useQuery } from '@tanstack/react-query'
import { getAllChats } from '@/api/chat'
import { getMessages } from '@/api/message'
import { queryKeys } from '@/api/queryKeys'

/**
 * Get all chats for the current user
 * @param {object} options - Additional query options
 * @returns {object} Query result with data, isLoading, error, etc.
 */
export const useChats = (options = {}) => {
  return useQuery({
    queryKey: queryKeys.chats.list(),
    queryFn: getAllChats,
    staleTime: 1000 * 30, // 30 seconds - chats update frequently
    refetchInterval: 1000 * 60, // Refetch every minute in background
    ...options,
  })
}

/**
 * Get messages for a specific chat
 * @param {string} chatId - Chat ID
 * @param {object} options - Additional query options
 * @returns {object} Query result with data, isLoading, error, etc.
 */
export const useMessages = (chatId, options = {}) => {
  return useQuery({
    queryKey: queryKeys.messages.list(chatId),
    queryFn: () => getMessages(chatId),
    enabled: !!chatId, // Only fetch if chatId exists
    staleTime: 1000 * 10, // 10 seconds - messages update very frequently
    ...options,
  })
}


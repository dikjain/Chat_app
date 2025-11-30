import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  sendMessage as sendMessageAPI,
  uploadFile as uploadFileAPI,
  deleteMessage as deleteMessageAPI,
  updateLatestMessage,
  accessChat,
  createGroupChat,
  renameGroupChat,
  addUserToGroup,
  removeUserFromGroup,
} from '../../api'
import { queryKeys } from '../../api/queryKeys'
import { toast } from 'sonner'

/**
 * Send a message mutation
 * @returns {object} Mutation object with mutate, isPending, error, etc.
 */
export const useSendMessage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ content, chatId, type = 'text' }) =>
      sendMessageAPI(content, chatId, type),
    onSuccess: (message, variables) => {
      // Optimistically update messages cache
      queryClient.setQueryData(
        queryKeys.messages.list(variables.chatId),
        (oldMessages = []) => [...oldMessages, message]
      )

      // Invalidate chats to update latest message
      queryClient.invalidateQueries({ queryKey: queryKeys.chats.list() })
    },
    onError: (error) => {
      toast.error('Failed to send message', {
        description: error.message || 'Please try again',
      })
    },
  })
}

/**
 * Upload file as message mutation
 * @returns {object} Mutation object with mutate, isPending, error, etc.
 */
export const useUploadFile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (formData) => uploadFileAPI(formData),
    onSuccess: (message, variables) => {
      const chatId = variables.get('chatId')

      // Optimistically update messages
      queryClient.setQueryData(
        queryKeys.messages.list(chatId),
        (oldMessages = []) => [...oldMessages, message]
      )

      // Invalidate chats
      queryClient.invalidateQueries({ queryKey: queryKeys.chats.list() })
    },
    onError: (error) => {
      toast.error('Failed to upload file', {
        description: error.message || 'Please try again',
      })
    },
  })
}

/**
 * Delete message mutation
 * @returns {object} Mutation object with mutate, isPending, error, etc.
 */
export const useDeleteMessage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ messageId, chatId }) => {
      const currentMessages = queryClient.getQueryData(queryKeys.messages.list(chatId)) || []
      const latestMessageId =
        messageId === currentMessages[currentMessages.length - 1]?._id
          ? (currentMessages[currentMessages.length - 2]?._id || null)
          : currentMessages[currentMessages.length - 1]?._id

      await Promise.all([
        deleteMessageAPI(messageId),
        updateLatestMessage(chatId, latestMessageId)
      ])

      return { messageId, chatId }
    },
    onMutate: async ({ messageId, chatId }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.messages.list(chatId) })

      // Snapshot previous value
      const previousMessages = queryClient.getQueryData(queryKeys.messages.list(chatId))

      // Optimistically update
      queryClient.setQueryData(
        queryKeys.messages.list(chatId),
        (old = []) => old.filter(msg => msg._id !== messageId)
      )

      return { previousMessages }
    },
    onError: (error, variables, context) => {
      // Rollback on error
      queryClient.setQueryData(
        queryKeys.messages.list(variables.chatId),
        context.previousMessages
      )
      toast.error('Failed to delete message', {
        description: error.message || 'Please try again',
      })
    },
    onSuccess: (data, variables) => {
      // Invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.messages.list(variables.chatId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.chats.list() })
      toast.success('Message deleted successfully')
    },
  })
}

/**
 * Access or create one-on-one chat mutation
 * @returns {object} Mutation object with mutate, isPending, error, etc.
 */
export const useAccessChat = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId) => accessChat(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chats.list() })
    },
  })
}

/**
 * Create group chat mutation
 * @returns {object} Mutation object with mutate, isPending, error, etc.
 */
export const useCreateGroupChat = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ name, users }) => createGroupChat(name, users),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chats.list() })
      toast.success('New Group Chat Created!')
    },
    onError: (error) => {
      toast.error('Failed to create group chat', {
        description: error.message || 'Please try again',
      })
    },
  })
}

/**
 * Rename group chat mutation
 * @returns {object} Mutation object with mutate, isPending, error, etc.
 */
export const useRenameGroupChat = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ chatId, chatName }) => renameGroupChat(chatId, chatName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chats.list() })
      toast.success('Group chat renamed successfully')
    },
    onError: (error) => {
      toast.error('Failed to rename group chat', {
        description: error.message || 'Please try again',
      })
    },
  })
}

/**
 * Add user to group mutation
 * @returns {object} Mutation object with mutate, isPending, error, etc.
 */
export const useAddUserToGroup = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ chatId, userId }) => addUserToGroup(chatId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chats.list() })
      toast.success('User added to group')
    },
    onError: (error) => {
      toast.error('Failed to add user', {
        description: error.message || 'Please try again',
      })
    },
  })
}

/**
 * Remove user from group mutation
 * @returns {object} Mutation object with mutate, isPending, error, etc.
 */
export const useRemoveUserFromGroup = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ chatId, userId }) => removeUserFromGroup(chatId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chats.list() })
      toast.success('User removed from group')
    },
    onError: (error) => {
      toast.error('Failed to remove user', {
        description: error.message || 'Please try again',
      })
    },
  })
}


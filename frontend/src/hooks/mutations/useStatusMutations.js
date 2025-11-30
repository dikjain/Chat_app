import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createStatus, deleteStatus } from '../../api/status'
import { queryKeys } from '../../api/queryKeys'
import { toast } from 'sonner'

/**
 * Create status mutation
 * @returns {object} Mutation object with mutate, isPending, error, etc.
 */
export const useCreateStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, content, mediaUrl }) => 
      createStatus(userId, content, mediaUrl),
    onSuccess: (data, variables) => {
      // Invalidate status for the user
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.status.byUser(variables.userId) 
      })
      toast.success('Status created successfully')
    },
    onError: (error) => {
      toast.error('Failed to create status', {
        description: error.message || 'Please try again',
      })
    },
  })
}

/**
 * Delete status mutation
 * @returns {object} Mutation object with mutate, isPending, error, etc.
 */
export const useDeleteStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ statusId, userId }) => deleteStatus(statusId),
    onMutate: async ({ statusId, userId }) => {
      await queryClient.cancelQueries({ 
        queryKey: queryKeys.status.byUser(userId) 
      })

      const previousStatus = queryClient.getQueryData(
        queryKeys.status.byUser(userId)
      )

      // Optimistically remove status
      queryClient.setQueryData(
        queryKeys.status.byUser(userId),
        (old = []) => old.filter(s => s._id !== statusId)
      )

      return { previousStatus }
    },
    onError: (error, variables, context) => {
      // Rollback on error
      queryClient.setQueryData(
        queryKeys.status.byUser(variables.userId),
        context.previousStatus
      )
      toast.error('Failed to delete status', {
        description: error.message || 'Please try again',
      })
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.status.byUser(variables.userId) 
      })
      toast.success('Status deleted successfully')
    },
  })
}


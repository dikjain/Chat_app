import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateUser } from '../../api/auth'
import { updateUserLanguage } from '../../api/user'
import { queryKeys } from '../../api/queryKeys'
import { toast } from 'sonner'

/**
 * Update user profile mutation
 * @returns {object} Mutation object with mutate, isPending, error, etc.
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, name, pic }) => updateUser(userId, name, pic),
    onSuccess: (data, variables) => {
      // Invalidate user details cache
      queryClient.invalidateQueries({ queryKey: queryKeys.user.all })
      toast.success('Profile updated successfully')
    },
    onError: (error) => {
      toast.error('Failed to update profile', {
        description: error.message || 'Please try again',
      })
    },
  })
}

/**
 * Update user language preference mutation
 * @returns {object} Mutation object with mutate, isPending, error, etc.
 */
export const useUpdateUserLanguage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, language }) => updateUserLanguage(userId, language),
    onSuccess: () => {
      // Invalidate user details cache
      queryClient.invalidateQueries({ queryKey: queryKeys.user.all })
      toast.success('Language updated successfully')
    },
    onError: (error) => {
      toast.error('Failed to update language', {
        description: error.message || 'Please try again',
      })
    },
  })
}


import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { login, signup } from '@/api/auth'
import { useAuthStore } from '@/stores'
import { toast } from 'sonner'
import { queryKeys } from '@/api/queryKeys'

/**
 * Login mutation
 * @returns {object} Mutation object with mutate, isPending, error, etc.
 */
export const useLogin = () => {
  const navigate = useNavigate()
  const setUser = useAuthStore((state) => state.setUser)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ email, password }) => login(email, password),
    onSuccess: (data) => {
      setUser(data)
      queryClient.invalidateQueries({ queryKey: queryKeys.user.all })
      toast.success('Login Successful')
      navigate('/chats')
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed'
      toast.error('Login Failed', { description: errorMessage })
    },
  })
}

/**
 * Signup mutation
 * @returns {object} Mutation object with mutate, isPending, error, etc.
 */
export const useSignup = () => {
  const navigate = useNavigate()
  const setUser = useAuthStore((state) => state.setUser)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ name, email, password, pic }) => signup(name, email, password, pic),
    onSuccess: (data) => {
      setUser(data)
      queryClient.invalidateQueries({ queryKey: queryKeys.user.all })
      toast.success('Registration Successful')
      navigate('/chats')
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Signup failed'
      toast.error('Registration Failed', { description: errorMessage })
    },
  })
}


import { useQuery } from '@tanstack/react-query'
import { getUserDetails, searchUsers } from '../../api/user'
import { queryKeys } from '../../api/queryKeys'

/**
 * Get user details by email
 * @param {string} email - User email address
 * @param {object} options - Additional query options
 * @returns {object} Query result with data, isLoading, error, etc.
 */
export const useUserDetails = (email, options = {}) => {
  return useQuery({
    queryKey: queryKeys.user.details(email),
    queryFn: () => getUserDetails(email),
    enabled: !!email, // Only run if email exists
    staleTime: 1000 * 60 * 5, // 5 minutes - user details don't change often
    ...options,
  })
}


/**
 * Search users with query string
 * @param {string} searchQuery - Search query string
 * @param {object} options - Additional query options
 * @returns {object} Query result with data, isLoading, error, etc.
 */
export const useUserSearch = (searchQuery, options = {}) => {
  return useQuery({
    queryKey: queryKeys.user.search(searchQuery),
    queryFn: () => searchUsers(searchQuery),
    enabled: !!searchQuery && searchQuery.trim().length > 0, // Only search if query exists and is not empty
    staleTime: 1000 * 60, // 1 minute - search results stay fresh for 1 minute
    ...options,
  })
}


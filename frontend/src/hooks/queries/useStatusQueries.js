import { useQuery } from '@tanstack/react-query'
import { fetchStatus } from '../../api/status'
import { queryKeys } from '../../api/queryKeys'

/**
 * Get status for a specific user
 * @param {string} userId - User ID
 * @param {object} options - Additional query options
 * @returns {object} Query result with data, isLoading, error, etc.
 */
export const useStatus = (userId, options = {}) => {
  return useQuery({
    queryKey: queryKeys.status.byUser(userId),
    queryFn: () => fetchStatus(userId),
    enabled: !!userId, // Only fetch if userId exists
    staleTime: 1000 * 30, // 30 seconds - status updates periodically
    ...options,
  })
}


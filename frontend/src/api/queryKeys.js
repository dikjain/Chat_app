// Centralized query keys for better type safety and refactoring
// This helps with cache invalidation and query management

export const queryKeys = {
  // User queries
  user: {
    all: ['user'],
    details: (email) => ['user', 'details', email],
    search: (query) => ['user', 'search', query],
  },
  
  // Chat queries
  chats: {
    all: ['chats'],
    list: () => [...queryKeys.chats.all, 'list'],
  },
  
  // Message queries
  messages: {
    all: ['messages'],
    list: (chatId) => [...queryKeys.messages.all, 'list', chatId],
  },
  
  // Status queries
  status: {
    all: ['status'],
    byUser: (userId) => [...queryKeys.status.all, userId],
  },
}

import { create } from "zustand";

/**
 * Chat Store - Manages chat-related state
 * No persistence needed (fetched from server)
 */
export const useChatStore = create((set, get) => ({
  // State
  chats: [],
  selectedChat: null,
  messages: {},

  // Actions
  setChats: (chats) => set({ chats }),

  addChat: (chat) => {
    const currentChats = get().chats;
    if (!currentChats.find((c) => c._id === chat._id)) {
      set({ chats: [chat, ...currentChats] });
    }
  },

  updateChat: (chatId, updates) => {
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat._id === chatId ? { ...chat, ...updates } : chat
      ),
      selectedChat:
        state.selectedChat?._id === chatId
          ? { ...state.selectedChat, ...updates }
          : state.selectedChat,
    }));
  },

  setSelectedChat: (chat) => set({ selectedChat: chat }),

  clearSelectedChat: () => set({ selectedChat: null }),

  setMessages: (chatId, messages) => {
    set((state) => ({
      messages: { ...state.messages, [chatId]: messages },
    }));
  },

  addMessage: (chatId, message) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: [...(state.messages[chatId] || []), message],
      },
    }));
  },

  removeMessage: (chatId, messageId) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: (state.messages[chatId] || []).filter(
          (msg) => msg._id !== messageId
        ),
      },
    }));
  },

  // Getters
  getMessages: (chatId) => get().messages[chatId] || [],
  getChat: (chatId) => get().chats.find((chat) => chat._id === chatId),
}));


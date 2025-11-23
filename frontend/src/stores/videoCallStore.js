import { create } from "zustand";

/**
 * Video Call Store - Manages video call state
 */
export const useVideoCallStore = create((set, get) => ({
  // State
  isVideoCallActive: false,
  isOneOnOneCall: true,
  videoCallUsers: [],
  chatsVideo: [],

  // Actions
  setVideoCallActive: (isActive) => set({ isVideoCallActive: isActive }),

  setIsOneOnOneCall: (isOneOnOne) => set({ isOneOnOneCall: isOneOnOne }),

  setVideoCallUsers: (users) => set({ videoCallUsers: users }),

  addVideoCallUser: (user) => {
    set((state) => ({
      videoCallUsers: [...state.videoCallUsers, user],
    }));
  },

  removeVideoCallUser: (userId) => {
    set((state) => ({
      videoCallUsers: state.videoCallUsers.filter(
        (user) => user.user._id !== userId
      ),
    }));
  },

  setChatsVideo: (chats) => set({ chatsVideo: chats }),

  resetVideoCall: () => {
    set({
      isVideoCallActive: false,
      isOneOnOneCall: true,
      videoCallUsers: [],
      chatsVideo: [],
    });
  },
}));


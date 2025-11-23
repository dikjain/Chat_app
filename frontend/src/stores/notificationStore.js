import { create } from "zustand";

export const useNotificationStore = create((set, get) => ({
  // State
  notifications: [],

  // Actions
  setNotifications: (notifications) => set({ notifications }),

  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
    }));
  },

  removeNotification: (notificationId) => {
    set((state) => ({
      notifications: state.notifications.filter(
        (notif) => notif._id !== notificationId
      ),
    }));
  },

  clearNotifications: () => set({ notifications: [] }),

  // Getters
  getNotificationCount: () => get().notifications.length,
}));


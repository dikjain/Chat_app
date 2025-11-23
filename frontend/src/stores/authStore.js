import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,

      // Actions
      setUser: (userData) => {
        set({
          user: userData,
          isAuthenticated: !!userData,
        });
      },

      updateUser: (updates) => {
        const currentUser = get().user;
        if (!currentUser) return;

        const updatedUser = { ...currentUser, ...updates };
        set({
          user: updatedUser,
          isAuthenticated: true,
        });
      },

      updateUserField: (field, value) => {
        const currentUser = get().user;
        if (!currentUser) return;

        set({
          user: { ...currentUser, [field]: value },
          isAuthenticated: true,
        });
      },

      clearUser: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },

      // Getters
      getUser: () => get().user,
      getToken: () => get().user?.token,
    }),
    {
      name: "userInfo", // sessionStorage key
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);


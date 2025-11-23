import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Theme Store - Manages UI theme state
 * Persists to localStorage (not sessionStorage) so theme persists across sessions
 */
export const useThemeStore = create(
  persist(
    (set) => ({
      primaryColor: "#48bb78",

      setPrimaryColor: (color) => set({ primaryColor: color }),
    }),
    {
      name: "theme", // localStorage key
    }
  )
);


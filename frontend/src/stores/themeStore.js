import { create } from "zustand";
import { persist } from "zustand/middleware";

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


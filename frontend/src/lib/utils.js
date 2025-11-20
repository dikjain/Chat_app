/**
 * Utility function to merge class names
 * Similar to clsx but simpler
 */
export function cn(...classes) {
  return classes
    .filter(Boolean)
    .map((cls) => {
      if (typeof cls === "string") return cls;
      if (typeof cls === "object" && cls !== null) {
        return Object.entries(cls)
          .filter(([_, value]) => value)
          .map(([key]) => key)
          .join(" ");
      }
      return "";
    })
    .join(" ")
    .trim();
}


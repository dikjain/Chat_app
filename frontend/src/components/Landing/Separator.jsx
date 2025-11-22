import * as React from "react";
import { cn } from "@/utils/utils";

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}) {
  return (
    <div
      data-slot="separator"
      data-decorative={decorative}
      data-orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className
      )}
      role={decorative ? "none" : "separator"}
      aria-orientation={orientation}
      {...props}
    />
  );
}

export { Separator };


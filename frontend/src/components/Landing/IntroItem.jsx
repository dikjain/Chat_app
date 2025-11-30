import { cn } from "../../utils/utils";

export function IntroItem({ className, ...props }) {
  return (
    <div
      className={cn("flex items-center gap-4 font-mono text-sm", className)}
      {...props}
    />
  );
}

export function IntroItemIcon({ className, ...props }) {
  return (
    <div
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded-lg border border-gray-300 bg-gray-100 ring-1 ring-gray-200 ring-offset-1 ring-offset-white",
        "[&_svg]:pointer-events-none [&_svg]:text-gray-600 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      aria-hidden="true"
      {...props}
    />
  );
}

export function IntroItemContent({ className, ...props }) {
  return <p className={cn("text-balance", className)} {...props} />;
}

export function IntroItemLink({ className, ...props }) {
  return (
    <a
      className={cn("underline-offset-4 hover:underline", className)}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  );
}


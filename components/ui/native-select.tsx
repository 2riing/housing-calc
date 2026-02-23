import * as React from "react"

import { cn } from "@/lib/utils"

interface NativeSelectProps extends React.ComponentProps<"select"> {
  variant?: "default" | "ghost"
}

function NativeSelect({
  className,
  variant = "default",
  children,
  ...props
}: NativeSelectProps) {
  return (
    <div className="relative w-full min-w-0">
      <select
        data-slot="native-select"
        className={cn(
          "appearance-none cursor-pointer",
          variant === "default" && [
            "border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          ],
          variant === "ghost" && [
            "w-full min-w-0 bg-transparent py-1.5 pl-3 pr-8 text-sm outline-none transition-colors",
            "focus-visible:outline-none",
            "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          ],
          className
        )}
        {...props}
      >
        {children}
      </select>
      <svg
        className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/40"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  )
}

export { NativeSelect }

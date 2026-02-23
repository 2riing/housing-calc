import * as React from "react"

import { cn } from "@/lib/utils"

interface NativeSelectProps extends React.ComponentProps<"select"> {
  variant?: "default" | "ghost"
}

function NativeSelect({
  className,
  variant = "default",
  ...props
}: NativeSelectProps) {
  return (
    <select
      data-slot="native-select"
      className={cn(
        variant === "default" && [
          "border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        ],
        variant === "ghost" && [
          "w-full min-w-0 bg-transparent py-2.5 px-3 text-sm outline-none transition-colors",
          "focus-visible:outline-none",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        ],
        className
      )}
      {...props}
    />
  )
}

export { NativeSelect }

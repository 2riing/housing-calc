import * as React from "react"

import { cn } from "@/lib/utils"

interface ToggleSwitchProps extends Omit<React.ComponentProps<"input">, "type"> {
  label?: string
}

const ToggleSwitch = React.forwardRef<HTMLInputElement, ToggleSwitchProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <label className="flex cursor-pointer items-center gap-2.5 px-3 py-1.5">
        <input
          type="checkbox"
          className="peer sr-only"
          ref={ref}
          {...props}
        />
        <div
          className={cn(
            "relative h-[22px] w-[40px] shrink-0 rounded-full transition-colors duration-200",
            "bg-input",
            "after:absolute after:left-[3px] after:top-[3px] after:h-4 after:w-4 after:rounded-full after:bg-background after:shadow-sm after:transition-transform after:duration-200",
            "peer-checked:bg-primary peer-checked:after:translate-x-[18px]",
            "peer-focus-visible:ring-[3px] peer-focus-visible:ring-ring/20",
            "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
            className
          )}
        />
        {label && (
          <span className="text-sm text-foreground select-none">{label}</span>
        )}
      </label>
    )
  }
)
ToggleSwitch.displayName = "ToggleSwitch"

export { ToggleSwitch }

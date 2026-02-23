"use client"

import * as React from "react"
import { Select as SelectPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root
const SelectValue = SelectPrimitive.Value

function SelectTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.SelectTrigger>) {
  return (
    <SelectPrimitive.SelectTrigger
      data-slot="select-trigger"
      className={cn(
        "flex w-full min-w-0 cursor-pointer items-center justify-between bg-transparent py-2.5 pl-3 pr-2.5 text-sm outline-none transition-colors",
        "data-[placeholder]:text-muted-foreground/60",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.SelectIcon asChild>
        <svg
          className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40"
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
      </SelectPrimitive.SelectIcon>
    </SelectPrimitive.SelectTrigger>
  )
}

function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.SelectContent>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.SelectContent
        data-slot="select-content"
        className={cn(
          "relative z-50 max-h-[min(var(--radix-select-content-available-height),24rem)] min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-xl border border-border bg-popover shadow-lg",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
          position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1",
          className
        )}
        position={position}
        {...props}
      >
        <SelectPrimitive.SelectViewport
          className={cn(
            "p-1",
            position === "popper" && "w-full min-w-[var(--radix-select-trigger-width)]"
          )}
        >
          {children}
        </SelectPrimitive.SelectViewport>
      </SelectPrimitive.SelectContent>
    </SelectPrimitive.Portal>
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.SelectItem>) {
  return (
    <SelectPrimitive.SelectItem
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-lg px-3 py-2 text-sm outline-none transition-colors",
        "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
        "data-[state=checked]:font-medium",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.SelectItemIndicator className="ml-auto">
        <svg
          className="h-3.5 w-3.5 text-primary"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </SelectPrimitive.SelectItemIndicator>
    </SelectPrimitive.SelectItem>
  )
}

export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue }

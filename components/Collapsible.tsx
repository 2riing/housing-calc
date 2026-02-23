"use client";

import { useState } from "react";
import {
  Collapsible as CollapsibleRoot,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export default function Collapsible({
  title,
  children,
  defaultOpen = false,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <CollapsibleRoot
      open={open}
      onOpenChange={setOpen}
      className="mt-3 overflow-hidden rounded-xl border border-border"
    >
      <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-2.5 text-xs text-muted-foreground transition hover:bg-muted/50">
        <span>🔍 {title}</span>
        <span className={cn("transition-transform", open && "rotate-180")}>
          ▾
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent className="border-t border-border/50 px-4 py-3">
        {children}
      </CollapsibleContent>
    </CollapsibleRoot>
  );
}

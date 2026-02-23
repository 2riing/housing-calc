import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

interface Props {
  label: string;
  htmlFor: string;
  error?: string;
  suffix?: string;
  children: ReactNode;
}

export default function FormField({
  label,
  htmlFor,
  error,
  suffix,
  children,
}: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label
        htmlFor={htmlFor}
        className="text-[11px] font-medium text-muted-foreground"
      >
        {label}
      </Label>
      <div
        className={cn(
          "group/field flex items-center overflow-hidden rounded-xl transition-all duration-200",
          "bg-muted/50 border border-transparent",
          "hover:bg-muted/70",
          "focus-within:bg-background focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/20 focus-within:shadow-sm",
          error && "border-destructive bg-destructive/5"
        )}
      >
        {children}
        {suffix && (
          <span className="shrink-0 pr-3 text-[11px] font-medium text-muted-foreground/50 group-focus-within/field:text-muted-foreground/70">
            {suffix}
          </span>
        )}
      </div>
      {error && <p className="text-[11px] text-destructive">{error}</p>}
    </div>
  );
}

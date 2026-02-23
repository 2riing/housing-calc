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
          "flex items-center overflow-hidden rounded-xl border bg-background transition",
          "focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/20",
          error ? "border-destructive" : "border-input"
        )}
      >
        {children}
        {suffix && (
          <span className="shrink-0 self-stretch flex items-center border-l border-input bg-muted px-3 text-[11px] font-medium text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
      {error && <p className="text-[11px] text-destructive">{error}</p>}
    </div>
  );
}

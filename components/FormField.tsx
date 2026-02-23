import type { ReactNode } from "react";

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
      <label htmlFor={htmlFor} className="text-[11px] font-medium text-stone-400">
        {label}
      </label>
      <div className="flex items-center overflow-hidden rounded-xl border border-stone-200 bg-white transition focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-100">
        {children}
        {suffix && (
          <span className="shrink-0 self-stretch flex items-center border-l border-stone-200 bg-stone-50 px-3 text-[11px] font-medium text-stone-400">
            {suffix}
          </span>
        )}
      </div>
      {error && <p className="text-[11px] text-red-400">{error}</p>}
    </div>
  );
}

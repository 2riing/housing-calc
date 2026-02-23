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
    <div className="flex flex-col gap-1">
      <label htmlFor={htmlFor} className="text-xs text-gray-400">
        {label}
      </label>
      {suffix ? (
        <div className="flex items-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50/50 transition-within focus-within:border-blue-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100">
          {children}
          <span className="shrink-0 border-l border-gray-200 bg-gray-100/80 px-2.5 py-2 text-xs text-gray-400">
            {suffix}
          </span>
        </div>
      ) : (
        children
      )}
      {error && <p className="text-[11px] text-red-400">{error}</p>}
    </div>
  );
}

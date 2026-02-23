import { formatKRW } from "@/lib/format";

interface Props {
  emoji?: string;
  title: string;
  value: number;
  description?: string;
  highlight?: boolean;
}

export default function ResultCard({
  emoji,
  title,
  value,
  description,
  highlight,
}: Props) {
  return (
    <div
      className={`rounded-2xl border p-4 transition-all ${
        highlight
          ? "border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-sm"
          : "border-gray-100 bg-white"
      }`}
    >
      <div className="flex items-center gap-2">
        {emoji && <span className="text-lg">{emoji}</span>}
        <p className="text-xs text-gray-400">{title}</p>
      </div>
      <p className="mt-1.5 text-xl font-bold tracking-tight">{formatKRW(value)}</p>
      {description && (
        <p className="mt-0.5 text-[11px] text-gray-400">{description}</p>
      )}
    </div>
  );
}

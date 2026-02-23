interface Props {
  messages?: string[];
}

export default function Disclaimer({ messages }: Props) {
  const defaults = [
    "이 결과는 단순화된 모델 기반이며, 실제와 다를 수 있습니다.",
    "정확한 내용은 해당 금융기관 또는 국세청에 문의하세요.",
  ];

  const items = messages && messages.length > 0 ? messages : defaults;

  return (
    <div className="mt-6 rounded-xl bg-stone-100/60 px-4 py-3">
      <p className="mb-1.5 text-xs font-medium text-stone-500">
        참고사항
      </p>
      <ul className="space-y-0.5 text-[11px] leading-relaxed text-stone-400">
        {items.map((m, i) => (
          <li key={i}>· {m}</li>
        ))}
      </ul>
    </div>
  );
}

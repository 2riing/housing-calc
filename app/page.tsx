import Image from "next/image";
import Link from "next/link";
import PageShell from "@/components/PageShell";

const cards = [
  {
    href: "/buy",
    emoji: "🏡",
    title: "집을 살 수 있을까?",
    desc: "월급, 저축, 대출 한도 — 현실적인 매수 가능 금액을 알려드립니다. 희망은 자유지만 통장은 정직하니까요.",
    bg: "from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100",
    accent: "text-blue-600",
  },
  {
    href: "/rent",
    emoji: "🔑",
    title: "전세를 얻을 수 있을까?",
    desc: "버팀목, 디딤돌... 이름은 들어봤는데 나는 되는 건지? 소득, 자산, 무주택 여부만 넣으면 자격부터 한도까지.",
    bg: "from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100",
    accent: "text-green-600",
  },
  {
    href: "/tax",
    emoji: "💸",
    title: "집 팔면 남는 돈?",
    desc: "팔면 얼마 남을까 — 양도세, 중개비 다 빼고 진짜 내 손에 들어오는 금액을 알려드립니다.",
    bg: "from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100",
    accent: "text-orange-600",
  },
];

export default function Home() {
  return (
    <PageShell>
      <div className="mb-12 text-center">
        <Image
          src="/logo.jpg"
          alt="내집내놔"
          width={120}
          height={120}
          className="mx-auto rounded-full"
        />
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
          내집내놔
        </h1>
        <p className="mt-3 text-base text-gray-500">
          내 월급이 허락하는 집, 그리고 애증의 세금
        </p>
      </div>

      <div className="grid gap-4">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className={`group flex items-start gap-4 rounded-2xl bg-gradient-to-r p-5 transition-all ${c.bg}`}
          >
            <span className="text-3xl">{c.emoji}</span>
            <div className="flex-1">
              <h2 className={`font-bold ${c.accent}`}>{c.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-gray-500">
                {c.desc}
              </p>
            </div>
            <span className="mt-1 text-gray-300 transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        ))}
      </div>

      <p className="mt-10 text-center text-xs leading-relaxed text-gray-300">
        모든 계산은 공식 자료 기반이지만 참고용입니다.
        <br />
        실제 대출·세금은 금융기관과 세무사에게 확인하세요.
      </p>
    </PageShell>
  );
}

import Image from "next/image";
import Link from "next/link";

export default function PageShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="pt-8 pb-4">
        <div className="flex items-center justify-center gap-6">
          <nav className="flex flex-col items-end gap-2 text-sm font-medium text-stone-400">
            <Link
              href="/buy"
              className="rounded-full px-4 py-1.5 transition hover:bg-sky-50 hover:text-sky-600"
            >
              매매
            </Link>
            <Link
              href="/tax"
              className="rounded-full px-4 py-1.5 transition hover:bg-sky-50 hover:text-sky-600"
            >
              매도
            </Link>
          </nav>

          <Link href="/">
            <Image
              src="/logo.jpg"
              alt="내집내놔"
              width={100}
              height={100}
              className="rounded-full"
            />
          </Link>

          <nav className="flex flex-col items-start gap-2 text-sm font-medium text-stone-400">
            <Link
              href="/rent"
              className="rounded-full px-4 py-1.5 transition hover:bg-sky-50 hover:text-sky-600"
            >
              전세
            </Link>
            <Link
              href="/rent"
              className="rounded-full px-4 py-1.5 transition hover:bg-sky-50 hover:text-sky-600"
            >
              월세
            </Link>
          </nav>
        </div>

        <div className="mt-3 text-center">
          <Link href="/" className="text-2xl font-extrabold tracking-tight text-stone-800">
            내집내놔
          </Link>
          <p className="mt-1.5 text-sm text-stone-400">
            내 월급이 허락하는 집, 그리고 아맞다 세금
          </p>
        </div>
      </div>
      <main className="mx-auto max-w-2xl px-4 py-6">{children}</main>
      <footer className="mx-auto max-w-2xl px-4 py-8 text-center text-[11px] text-stone-300">
        <a
          href="/sources"
          className="inline-block rounded-full border border-stone-200 px-3 py-1 text-stone-400 transition hover:border-sky-300 hover:text-sky-500"
        >
          근거 자료 보기
        </a>
        <p className="mt-3">
          참고용 계산기입니다. 정확한 심사·세금은 해당 기관에 문의하세요.
        </p>
      </footer>
    </>
  );
}

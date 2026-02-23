import Header from "./Header";

export default function PageShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-8">{children}</main>
      <footer className="mx-auto max-w-2xl px-4 py-8 text-center text-[11px] text-gray-300">
        <a
          href="/sources"
          className="inline-block rounded-full border border-gray-200 px-3 py-1 text-gray-400 transition hover:bg-green-50 hover:text-green-600"
        >
          근거 자료 보기
        </a>
        <p className="mt-3">
          ⚠️ 참고용 계산기입니다. 정확한 심사·세금은 해당 기관에 문의하세요.
        </p>
      </footer>
    </>
  );
}

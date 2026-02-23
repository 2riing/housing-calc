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
      <footer className="py-8 text-center text-[11px] text-gray-300">
        ⚠️ 참고용 계산기입니다. 정확한 심사·세금은 해당 기관에 문의하세요.
      </footer>
    </>
  );
}

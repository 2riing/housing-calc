import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "내집내놔 — 내 월급이 허락하는 집, 그리고 아맞다 세금",
  description:
    "매수 가능가, 전세대출 자격·한도, 양도소득세까지. 내 조건에 맞는 집을 계산해 보세요.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-stone-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}

/**
 * 숫자를 한국 원(₩) 형식으로 포맷
 * e.g. 150000000 → "1억 5,000만 원"
 */
export function formatKRW(value: number): string {
  if (value === 0) return "0원";

  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (abs >= 100_000_000) {
    const eok = Math.floor(abs / 100_000_000);
    const remainder = abs % 100_000_000;
    if (remainder === 0) return `${sign}${eok}억 원`;
    const man = Math.floor(remainder / 10_000);
    if (man === 0) return `${sign}${eok}억 원`;
    return `${sign}${eok}억 ${man.toLocaleString("ko-KR")}만 원`;
  }

  if (abs >= 10_000) {
    const man = Math.floor(abs / 10_000);
    return `${sign}${man.toLocaleString("ko-KR")}만 원`;
  }

  return `${sign}${abs.toLocaleString("ko-KR")}원`;
}

/**
 * 숫자를 콤마 포맷
 */
export function formatNumber(value: number): string {
  return value.toLocaleString("ko-KR");
}

/**
 * 퍼센트 포맷
 */
export function formatPercent(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * 만원 단위 입력을 원 단위로 변환
 */
export function manwonToWon(manwon: number): number {
  return manwon * 10_000;
}

/**
 * 원 단위를 만원 단위로 변환
 */
export function wonToManwon(won: number): number {
  return Math.floor(won / 10_000);
}

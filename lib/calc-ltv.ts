import type { LtvRule } from "./types";

export interface LtvInput {
  regionType: string;   // "regulated" | "metro" | "non_metro"
  housingCount: number; // 0=무주택, 1=1주택, 2+=다주택
  isFirstTime: boolean;
}

export interface LtvResult {
  ltv: number;
  note: string;
}

/**
 * 조건에 따라 적용 LTV를 자동 결정
 */
export function calcLtv(input: LtvInput, rules: LtvRule[]): LtvResult {
  const count = Math.min(input.housingCount, 2); // 2 이상은 동일 취급

  // exact match: regionType + housingCount + isFirstTime
  const exact = rules.find(
    (r) =>
      r.regionType === input.regionType &&
      r.housingCount === count &&
      r.isFirstTime === input.isFirstTime
  );
  if (exact) return { ltv: exact.ltv, note: exact.note };

  // fallback: regionType + housingCount (isFirstTime=false)
  const fallback = rules.find(
    (r) =>
      r.regionType === input.regionType &&
      r.housingCount === count &&
      !r.isFirstTime
  );
  if (fallback) return { ltv: fallback.ltv, note: fallback.note };

  return { ltv: 0.7, note: "기본 LTV 70% 적용" };
}

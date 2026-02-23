import type { LtvRule } from "./types";

export interface LtvInput {
  regionType: string;   // "regulated" | "metro" | "non_metro"
  housingCount: number; // 0=무주택, 1=1주택, 2+=다주택
  isFirstTime: boolean;
  tag?: string;         // "multi_child_2" | "multi_child_3" 등
}

export interface LtvResult {
  ltv: number;
  note: string;
}

/**
 * 조건에 따라 적용 LTV를 자동 결정
 *
 * 우선순위: tag 매칭 > isFirstTime 매칭 > 일반 매칭
 */
export function calcLtv(input: LtvInput, rules: LtvRule[]): LtvResult {
  const count = Math.min(input.housingCount, 2); // 2 이상은 동일 취급

  // 1순위: tag 매칭 (다자녀 등 우대)
  if (input.tag) {
    const byTag = rules.find(
      (r) =>
        r.regionType === input.regionType &&
        r.housingCount === count &&
        r.tag === input.tag
    );
    if (byTag) return { ltv: byTag.ltv, note: byTag.note };
  }

  // 2순위: isFirstTime 매칭
  if (input.isFirstTime) {
    const byFirstTime = rules.find(
      (r) =>
        r.regionType === input.regionType &&
        r.housingCount === count &&
        r.isFirstTime === true &&
        !r.tag
    );
    if (byFirstTime) return { ltv: byFirstTime.ltv, note: byFirstTime.note };
  }

  // 3순위: 일반 매칭 (isFirstTime=false, tag 없음)
  const general = rules.find(
    (r) =>
      r.regionType === input.regionType &&
      r.housingCount === count &&
      !r.isFirstTime &&
      !r.tag
  );
  if (general) return { ltv: general.ltv, note: general.note };

  return { ltv: 0.7, note: "기본 LTV 70% 적용" };
}

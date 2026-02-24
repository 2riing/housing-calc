import type {
  RentFormInput,
  RentProductResult,
  LoanProduct,
} from "./types";

/**
 * "전세를 얻을 수 있을까?" 계산기
 *
 * 각 대출상품별로 자격 심사 + 한도 계산
 */
export function evaluateRentProduct(
  input: RentFormInput,
  product: LoanProduct
): RentProductResult {
  const reasons: string[] = [];
  let eligible = true;

  const { deposit, region, annualIncome, totalAsset, isHomeless, tag, age, marriageYears } = input;
  const { eligibility, limits } = product;

  // 나이 체크
  if (eligibility.ageRange && age !== undefined) {
    if (age < eligibility.ageRange.min || age > eligibility.ageRange.max) {
      eligible = false;
      reasons.push(
        `나이 ${age}세 → 대상 만 ${eligibility.ageRange.min}~${eligibility.ageRange.max}세`
      );
    }
  }

  // 신혼부부 혼인기간 체크 (혼인 7년 이내)
  if (tag === "newlywed" && marriageYears !== undefined && marriageYears > 7) {
    eligible = false;
    reasons.push(`혼인 ${marriageYears}년차 → 7년 이내 요건 미충족`);
  }

  // 무주택 체크
  if (eligibility.mustBeHomeless && !isHomeless) {
    eligible = false;
    reasons.push("무주택자 요건 미충족");
  }

  // 소득 체크
  if (eligibility.incomeMax !== null && annualIncome > eligibility.incomeMax) {
    eligible = false;
    reasons.push(
      `연소득 ${annualIncome.toLocaleString()}원 > 한도 ${eligibility.incomeMax.toLocaleString()}원`
    );
  }

  // 자산 체크
  if (eligibility.assetMax !== null && totalAsset > eligibility.assetMax) {
    eligible = false;
    reasons.push(
      `순자산 ${totalAsset.toLocaleString()}원 > 한도 ${eligibility.assetMax.toLocaleString()}원`
    );
  }

  // 가구특성 체크
  if (!eligibility.tags.includes(tag) && !eligibility.tags.includes("general")) {
    eligible = false;
    reasons.push(`가구특성 '${tag}'이(가) 해당 상품 대상이 아님`);
  }

  // 지역 체크
  if (!eligibility.regions.includes(region)) {
    eligible = false;
    reasons.push(`지역 '${region}'이(가) 해당 상품 대상이 아님`);
  }

  // 한도 계산
  let maxLoanAmount = 0;
  if (eligible) {
    // 태그+지역에 맞는 limit 찾기 (exact match 우선, fallback to general)
    const matchingLimit =
      limits.find((l) => l.tag === tag && l.region === region) ??
      limits.find((l) => l.tag === "general" && l.region === region);

    if (matchingLimit) {
      const byMax = matchingLimit.maxAmount;
      if (deposit > 0) {
        // 전세: 보증금 대비 비율과 최대한도 중 작은 값
        const byRatio = Math.floor(deposit * matchingLimit.ratioMax);
        maxLoanAmount = Math.min(byRatio, byMax);
        reasons.push(
          `한도 = min(보증금×${(matchingLimit.ratioMax * 100).toFixed(0)}%, 최대 ${byMax.toLocaleString()}원)`
        );
      } else {
        // 매매: 보증금 없으므로 최대한도 직접 적용
        maxLoanAmount = byMax;
        reasons.push(`한도 = 최대 ${byMax.toLocaleString()}원`);
      }
    } else {
      reasons.push("해당 조건에 맞는 한도 정보가 없음");
    }
  }

  const requiredCash = Math.max(0, deposit - maxLoanAmount);

  return {
    product,
    eligible,
    reasons,
    maxLoanAmount,
    requiredCash,
  };
}

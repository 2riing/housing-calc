# 내집내놔 크로스체크 리포트

> 검증일: 2026-02-24
> 대상: 가이드(guide/page.tsx) vs 계산기 로직(calc-*.ts) vs 데이터(public/data/*.json) vs 외부 링크

---

## 요약

| 구분 | 건수 |
|------|------|
| CRITICAL (데이터 오류 / 링크 깨짐) | 2 |
| MAJOR (가이드-데이터 수치 불일치) | 3 |
| MODERATE (구조적 불일치 / 스키마 문제) | 3 |
| MINOR (권장 개선사항) | 4 |

---

## 1. CRITICAL Issues

### 1-1. 중개보수 요율표 불일치 (`tax_rules.json` vs 가이드)

가이드 섹션 3에 명시된 중개보수 상한요율표(2021.10 개편 기준)와 `tax_rules.json`의 `brokerageFee.tiers` 데이터가 상위 구간에서 불일치합니다.

| 구간 | 가이드 (정확) | tax_rules.json (오류) |
|------|---------------|----------------------|
| 5천만원 미만 | 0.6%, 한도 25만원 | 0.6%, 25만원 ✅ |
| 5천만~2억 미만 | 0.5%, 한도 80만원 | 0.5%, 80만원 ✅ |
| 2억~**9억** 미만 | **0.4%**, 한도 없음 | ~**6억**, 0.4% ❌ |
| **9억~12억** 미만 | **0.5%**, 한도 없음 | ~**9억**, 0.5% ❌ |
| **12억~15억** 미만 | **0.6%**, 한도 없음 | **누락** ❌ |
| **15억 이상** | **0.7%**, 한도 없음 | >9억, **0.9%** ❌ |

**영향**: 양도세 계산기(`/tax`)에서 9억 이상 매물의 중개수수료가 잘못 계산됩니다.
- 예시: 12억 매물 → 가이드 기준 600만원(0.5%), JSON 기준 1,080만원(0.9%)으로 **480만원 과대 산출**

**수정 필요 파일**: `public/data/tax_rules.json` → `brokerageFee.tiers`

```json
"tiers": [
  { "upTo": 50000000, "rate": 0.006, "cap": 250000 },
  { "upTo": 200000000, "rate": 0.005, "cap": 800000 },
  { "upTo": 900000000, "rate": 0.004, "cap": null },
  { "upTo": 1200000000, "rate": 0.005, "cap": null },
  { "upTo": 1500000000, "rate": 0.006, "cap": null },
  { "upTo": null, "rate": 0.007, "cap": null }
]
```

---

### 1-2. sources.json 링크 404: `myhome_lease`

| 항목 | 값 |
|------|-----|
| ID | `myhome_lease` |
| URL | `https://www.myhome.go.kr/hws/portal/cont/selectContDetail.do#` |
| HTTP 상태 | **404 Not Found** |
| 사용처 | 버팀목 전세자금대출, 청년전용 버팀목, 신혼부부 전용 전세자금 |

**영향**: 3개 전세 상품의 출처 링크가 깨져 있어 사용자가 원본 자료를 확인할 수 없습니다.

**수정 방향**: 마이홈포털에서 해당 대출 안내 페이지의 현재 URL을 확인 후 교체 필요

---

## 2. MAJOR Issues

### 2-1. 디딤돌대출 금리 불일치

| 항목 | 가이드 섹션 2 | loan_products.json |
|------|---------------|-------------------|
| 금리 범위 | 연 **2.35% ~ 3.95%** | **2.15% ~ 3.0%** |

가이드와 JSON 데이터의 금리 범위가 다릅니다. 둘 중 어느 쪽이 최신인지 확인 후 통일 필요.

**관련 파일**: `app/guide/page.tsx:164`, `public/data/loan_products.json` (`purchase_didimdol`)

---

### 2-2. 신생아 특례 구입자금 금리 불일치

| 항목 | 가이드 섹션 2 | loan_products.json |
|------|---------------|-------------------|
| 금리 범위 | 연 **1.6% ~ 4.5%** | **1.6% ~ 3.3%** |

최대 금리가 1.2%p 차이. 소득 구간에 따라 달라지므로 정확한 범위를 확인 필요.

**관련 파일**: `app/guide/page.tsx:172`, `public/data/loan_products.json` (`purchase_newborn`)

---

### 2-3. 보금자리론 — 가이드에만 존재, 데이터 없음

가이드 섹션 2에서 보금자리론을 상세히 설명하고 있으나, `loan_products.json`에 해당 상품이 없습니다.

> 가이드 내용: "무주택/1주택 · 연소득 7,000만원 이하 · 6억원 이하 주택 · 최대 3.6억원 · 고정금리 연 3~4%대"

**영향**: 매수 계산기(`/buy`)의 정책상품 매칭에서 보금자리론이 평가되지 않습니다.

**수정 방향**:
- (A) `loan_products.json`에 보금자리론 상품 추가
- (B) 가이드에서 "계산기 미반영" 안내 추가

---

## 3. MODERATE Issues

### 3-1. LTV 규제지역 세분화 불일치

가이드의 설명과 데이터 구조가 규제지역 처리에서 불일치합니다.

| 위치 | 설명 |
|------|------|
| 가이드 섹션 6 (line 462) | "투기과열 **50%** / 조정대상 **60%**" |
| 가이드 섹션 2 (line 128) | "규제지역: **50~60%**" |
| ltv_rules.json | `regulated` 단일 카테고리 → **50%** |

**영향**: 조정대상지역(투기과열 미지정)의 LTV가 실제 60%일 수 있으나 앱에서는 50%로 계산됩니다.

**수정 방향**:
- (A) `regulated`를 `speculative_overheated`(50%)와 `adjustment`(60%)로 분리
- (B) 가이드의 설명을 "규제지역(투기과열+조정) 50%"로 통일

---

### 3-2. buySchema targetYears 범위 vs UI 라디오 버튼

| 위치 | 값 |
|------|-----|
| `schemas.ts` (line 16) | `.min(1, "1년 이상 입력해주세요")` |
| `buy/page.tsx` (line 157) | 라디오: `[0, 1, 3, 5]` → "당장" = 0 |

"당장"(targetYears=0)을 선택하면 Zod 스키마 검증에 실패합니다. 현재는 Zod validation이 폼에 적용되지 않아 런타임 문제는 없지만, 향후 스키마를 적용할 경우 충돌 발생.

**수정**: `schemas.ts`에서 `.min(0)` 으로 변경하거나, targetYears를 optional로 처리

---

### 3-3. 매수 계산기에서 부대비용 미포함 (안내 없음)

가이드 섹션 1과 3에서 "부대비용: 매매가의 약 3~5%"를 강조하고 있으나, 매수 계산기(`calc-buy.ts`)에서는 부대비용을 전혀 반영하지 않습니다.

현재 Disclaimer에도 부대비용 미포함 안내가 없습니다.

**수정 방향**: 매수 계산기 Disclaimer에 "부대비용(취득세, 중개수수료 등 매매가의 3~5%)은 미포함" 안내 추가 권장

---

## 4. MINOR Issues

### 4-1. 대법원 인터넷등기소 HTTP URL

가이드의 참고 사이트 링크가 `http://www.iros.go.kr`로 되어 있으나, 실제로는 `https://www.iros.go.kr`로 리다이렉트됩니다. HTTPS URL로 직접 연결하는 것이 권장됩니다.

**위치**: `app/guide/page.tsx:747`

---

### 4-2. sources.json 링크 비특이성

아래 출처들이 메인페이지로 연결되어 사용자가 구체적 정보를 찾기 어렵습니다.

| ID | 현재 URL | 문제 |
|----|----------|------|
| `fss_dsr` | https://www.fss.or.kr/fss/kr/main.html | 금감원 메인, DSR 페이지 아님 |
| `gov_ltv` | https://www.fss.or.kr/fss/kr/main.html | 위와 동일한 URL |
| `molit_brokerage` | https://www.myhome.go.kr/ | 마이홈 메인, 중개보수 페이지 아님 |

**수정 방향**: 각 주제에 맞는 구체적 서브페이지 URL로 업데이트 권장

---

### 4-3. 전세 대출 상품 지역 매핑 설명 없음

전세 상품(`loan_products.json`)은 지역을 `metro`와 `non_metro`만 사용하는데, UI에서는 `regulated`(조정대상지역)도 선택 가능합니다.

코드에서 `regulated` → `metro`로 자동 매핑(`buy/page.tsx:105`, `rent/page.tsx:75`)하지만, 이 매핑에 대한 사용자 안내가 없습니다.

**수정 방향**: "조정대상지역은 수도권 기준으로 평가됩니다" 등 안내 추가 권장

---

### 4-4. Disclaimer에 가정값(금리 4%, 30년) 명시 위치 차이

매수 계산기의 핵심 가정값(금리 4%, 30년 원리금균등상환)이 Disclaimer에는 있으나, ResultCard description에도 일부 표시되어 정보가 분산되어 있습니다. 통일된 안내 위치가 바람직합니다.

---

## 5. 정합성 확인 완료 항목 (이상 없음)

### 양도소득세 세율표

가이드 섹션 5의 8단계 세율표 ↔ `tax_rules.json` brackets 8개 ↔ `calc-tax.ts` 로직 → **모두 일치** ✅

| 과세표준 | 세율 | 누진공제 | 가이드 | JSON | calc-tax.ts |
|---------|------|---------|--------|------|-------------|
| ~1,400만 | 6% | 0 | ✅ | ✅ | ✅ |
| ~5,000만 | 15% | 126만 | ✅ | ✅ | ✅ |
| ~8,800만 | 24% | 576만 | ✅ | ✅ | ✅ |
| ~1.5억 | 35% | 1,544만 | ✅ | ✅ | ✅ |
| ~3억 | 38% | 1,994만 | ✅ | ✅ | ✅ |
| ~5억 | 40% | 2,594만 | ✅ | ✅ | ✅ |
| ~10억 | 42% | 3,594만 | ✅ | ✅ | ✅ |
| 10억 초과 | 45% | 6,594만 | ✅ | ✅ | ✅ |

### 기본공제 250만원 / 지방소득세 10%

- `tax_rules.json`: basicDeduction 2,500,000 / localIncomeTaxRate 0.1 ✅
- `calc-tax.ts`: JSON에서 읽어서 적용 ✅
- `tax/page.tsx`: "기본공제 250만원 적용" 표시 ✅

### DSR 40% 기준

- 가이드 섹션 2: "은행권 DSR 40%" ✅
- `calc-buy.ts:31`: `dsrRatio = 0.4` ✅
- `buy/page.tsx` Disclaimer: "DSR 40% … 기준 추정치" ✅

### 매수 가능가 계산 로직

`calc-buy.ts`의 수식과 `buy/page.tsx`의 assumption 표시가 일치 ✅:
1. 미래자산 = 현금 + (월저축 × 12 × 연수)
2. 월상환가능 = (연소득/12) × 40% - 기존부채
3. 추정대출 = PV(금리4%, 30년) × 월상환가능
4. 매수가능가 = min(자기자금/(1-LTV), 자기자금+대출)

### LTV 자동 계산 로직

`calc-ltv.ts` → exact match 우선, fallback 처리 → 기본값 70% ✅
`ltv_rules.json` 데이터와 `buy/page.tsx` 연동 정상 ✅

### 전세 대출 자격 심사 로직

`calc-rent.ts`의 5가지 체크(무주택, 소득, 자산, 가구특성, 지역) ↔ `loan_products.json` eligibility 필드 → **일치** ✅

---

## 6. 외부 링크 유효성 검증

### sources.json 링크

| ID | URL | HTTP | 결과 |
|----|-----|------|------|
| nts_capgain | https://www.nts.go.kr/...?mi=2312&cntntsId=7711 | 200 | ✅ 정상 |
| nts_tax_brackets | https://www.nts.go.kr/...?mi=2227&cntntsId=7667 | 200 | ✅ 정상 |
| myhome_lease | https://www.myhome.go.kr/hws/portal/cont/selectContDetail.do# | **404** | ❌ **페이지 없음** |
| hf_didimdol | https://www.hf.go.kr/ko/sub01/sub01_02_01.do | 200 | ✅ 정상 |
| fss_dsr | https://www.fss.or.kr/fss/kr/main.html | 200 | ⚠️ 메인페이지 |
| gov_ltv | https://www.fss.or.kr/fss/kr/main.html | 200 | ⚠️ 동일 메인페이지 |
| molit_brokerage | https://www.myhome.go.kr/ | 200 | ⚠️ 메인페이지 |

### 가이드 참고 사이트 링크

| 사이트 | URL | HTTP | 결과 |
|--------|-----|------|------|
| 실거래가 공개시스템 | https://rt.molit.go.kr/ | 200 | ✅ 정상 |
| 대법원 인터넷등기소 | http://www.iros.go.kr | 200 | ⚠️ HTTPS 리다이렉트 |
| 청약홈 | https://www.applyhome.co.kr/ | 200 | ✅ 정상 |
| 마이홈포털 | https://www.myhome.go.kr/ | 200 | ✅ 정상 |
| 한국주택금융공사 | https://www.hf.go.kr/ | 200 | ✅ 정상 |
| 국세청 홈택스 | https://www.hometax.go.kr/ | 200 | ✅ 정상 |
| 위택스 | https://www.wetax.go.kr/ | 200 | ✅ 정상 |
| 정부24 | https://www.gov.kr/ | 200 | ✅ 정상 |

---

## 7. 수정 우선순위 제안

| 순위 | 이슈 | 난이도 | 영향도 |
|------|------|--------|--------|
| 1 | 중개보수 요율표 JSON 수정 (1-1) | 낮음 | 높음 (금액 오류) |
| 2 | myhome_lease 링크 수정 (1-2) | 낮음 | 높음 (출처 접근 불가) |
| 3 | 디딤돌/신생아 금리 통일 (2-1, 2-2) | 낮음 | 중간 |
| 4 | 보금자리론 상품 추가 또는 안내 (2-3) | 중간 | 중간 |
| 5 | 부대비용 미포함 안내 추가 (3-3) | 낮음 | 낮음 |
| 6 | HTTP → HTTPS / 링크 특이성 개선 (4-*) | 낮음 | 낮음 |

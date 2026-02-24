# 내집내놔

> 내 월급이 허락하는 집, 그리고 아맞다 세금

한국 부동산 매수/전세/양도 시 필요한 계산을 한곳에서. 모든 계산 결과에 **기준일**과 **공식 근거 링크**를 표시합니다.

## 주요 기능

| 페이지 | 설명 |
|--------|------|
| **집을 살 수 있을까?** | 보유현금, 소득, 저축 기반 매수 가능 금액 추정. LTV/DSR 규제 반영, 디딤돌/신생아특례 등 정책대출 자격·한도 함께 확인 |
| **전세사기는 무섭지만 전세는 살고 싶어** | 전세보증금 대출 자격 확인 및 예상 한도. 버팀목, 청년전용, 신혼부부 전용 등 상품별 비교 |
| **집 팔면 남는 게 있나?** | 양도소득세 + 중개수수료를 계산하고 실수령액 확인. 필요경비 항목별 입력 지원 |
| **주택 구매 완전 가이드** | 자금 준비부터 입주까지 — 대출, 세금, 청약, 등기부등본 등 집 사기 전에 알아야 할 모든 것 |

## 기술 스택

- **프레임워크**: Next.js 15 (App Router) + React 19 + TypeScript
- **스타일링**: TailwindCSS v4 + Radix UI (shadcn/ui)
- **폼/검증**: React Hook Form + Zod
- **배포**: Vercel (정적 빌드)
- **패키지 매니저**: pnpm

## 로컬 실행

```bash
pnpm install
pnpm dev
```

http://localhost:3000 접속

## 빌드

```bash
pnpm build
```

`out/` 디렉토리에 정적 파일 생성

## 프로젝트 구조

```
housing-calc/
├── app/
│   ├── layout.tsx            # 루트 레이아웃 (ko, Vercel Analytics)
│   ├── page.tsx              # 홈 — 서비스 카드 목록
│   ├── buy/page.tsx          # 매수 가능 금액 계산
│   ├── rent/page.tsx         # 전세 대출 자격·한도
│   ├── tax/page.tsx          # 양도세 + 중개수수료 + 실수령액
│   ├── guide/page.tsx        # 주택 구매 가이드
│   └── sources/page.tsx      # 데이터 출처 목록
├── lib/
│   ├── calc-buy.ts           # 매수 계산 (미래자산, DSR, PV)
│   ├── calc-rent.ts          # 전세 대출 자격 심사 + 한도
│   ├── calc-tax.ts           # 양도소득세 + 중개수수료
│   ├── calc-ltv.ts           # LTV 규제 매핑
│   ├── types.ts              # 전체 타입 정의
│   ├── data.ts               # JSON 데이터 로더
│   ├── format.ts             # 금액·퍼센트 포맷
│   ├── schemas.ts            # Zod 폼 검증 스키마
│   └── useSharedFields.ts    # 공유 필드 Hook (localStorage)
├── components/
│   ├── PageShell.tsx          # 페이지 레이아웃 셸
│   ├── FormField.tsx          # 폼 필드 래퍼
│   ├── ResultCard.tsx         # 결과 카드
│   ├── Collapsible.tsx        # 접기/펼치기
│   ├── Disclaimer.tsx         # 면책조항
│   ├── SourceBadge.tsx        # 출처 배지
│   └── ui/                    # shadcn 기본 컴포넌트
├── public/data/               # 정적 데이터 JSON
│   ├── loan_products.json     # 대출 상품 (자격, 한도, 금리)
│   ├── ltv_rules.json         # LTV 규제 규칙
│   ├── tax_rules.json         # 세율표 + 중개보수 요율표
│   └── sources.json           # 공식 근거 링크
├── scripts/
│   └── update-data.mjs        # 데이터 갱신 스크립트
└── TEST_REPORT.md             # 정밀 테스트 리포트
```

## 데이터 갱신 절차

데이터는 `/public/data/*.json`으로 관리됩니다. 외부 API를 호출하지 않으며, 수동 업데이트 후 커밋합니다.

### 1. JSON 파일 직접 편집

| 파일 | 용도 |
|------|------|
| `loan_products.json` | 대출 상품 정보 (자격, 한도, 금리) |
| `ltv_rules.json` | LTV 규제 규칙 (조정/비조정/비수도권) |
| `tax_rules.json` | 양도세 세율표 + 중개보수 요율표 |
| `sources.json` | 공식 근거 링크 |
| `last_updated.json` | 업데이트 기준일 |

### 2. 업데이트 스크립트 실행

```bash
pnpm update-data
```

기준일 갱신 + JSON 유효성 검사 + 포맷 정리를 수행합니다.

### 3. 커밋 & 푸시

```bash
git add public/data
git commit -m "data: YYYY-MM-DD 기준 데이터 갱신"
git push
```

Vercel이 자동으로 재배포합니다.

## 배포

1. GitHub에 push
2. Vercel에서 Import → Framework: Next.js
3. 자동 배포 완료

## 계산 기준

| 항목 | 근거 |
|------|------|
| 양도소득세 세율 | 소득세법 제55조 제1항 (2025 귀속 기본세율) |
| 중개보수 요율 | 공인중개사법 시행규칙 별표 (2021.10.19 개편) |
| LTV 규제 | 금융위원회 가계대출 규제 고시 |
| 정책대출 | 주택도시기금 운용지침, 한국주택금융공사 기준 |

## 향후 계획

- 1세대1주택 비과세 / 장기보유특별공제 / 다주택 중과
- 스트레스 DSR 반영
- 공공데이터 API 연동 자동화
- 취득세 자동 계산

## 라이선스

MIT

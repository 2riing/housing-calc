# 주거·대출·세금 계산기

공식 근거 링크가 포함된 주거 관련 계산기 MVP.

## 기능

1. **내가 집을 살 수 있을까?** — 보유현금, 소득, 저축 기반 매수 가능 가격 추정
2. **전세를 얻을 수 있을까?** — 전세보증금 대출 자격 확인 및 예상 한도
3. **양도소득세 (단순 계산)** — 기본세율 기반 양도세 계산

모든 결과에 **기준일** + **공식 근거 링크**를 표시합니다.

## 기술 스택

- Next.js (App Router) + TypeScript
- TailwindCSS v4
- React Hook Form + Zod
- 정적 배포 (Vercel)

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

## 배포 (Vercel)

1. GitHub에 push
2. Vercel에서 Import → Framework: Next.js
3. 자동 배포 완료

## 데이터 갱신 절차

이 프로젝트의 데이터는 `/public/data/*.json` 파일로 관리됩니다.
외부 API를 직접 호출하지 않으며, 로컬에서 수동 업데이트 후 커밋합니다.

### 1단계: 데이터 파일 수정

`public/data/` 디렉토리의 JSON 파일을 직접 편집합니다:

| 파일 | 용도 |
|------|------|
| `last_updated.json` | 업데이트 기준일 |
| `sources.json` | 공식 근거 링크 모음 |
| `loan_products.json` | 대출 상품 정보 (자격, 한도, 금리) |
| `tax_rules.json` | 세율표, 기본공제 등 |

### 2단계: 업데이트 스크립트 실행

```bash
pnpm update-data
# 또는
node scripts/update-data.mjs
```

스크립트가 수행하는 작업:
- `last_updated.json`의 기준일을 오늘로 갱신
- `sources.json`의 확인일(checkedAt)을 오늘로 갱신
- 각 JSON 파일의 유효성 검사
- JSON 포맷 정리

### 3단계: 커밋 & 푸시

```bash
git add public/data
git commit -m "data: 2025-XX-XX 기준 데이터 갱신"
git push
```

Vercel이 자동으로 재배포합니다.

## 프로젝트 구조

```
housing-calc/
├── app/
│   ├── layout.tsx          # 루트 레이아웃
│   ├── page.tsx            # 홈 (서비스 소개)
│   ├── buy/page.tsx        # 집 구매 가능성
│   ├── rent/page.tsx       # 전세 대출 가능성
│   ├── tax/page.tsx        # 양도소득세 (단순)
│   └── sources/page.tsx    # 근거 링크 모음
├── components/             # 공유 UI 컴포넌트
├── lib/                    # 계산 로직, 타입, 유틸리티
├── public/data/            # 정적 데이터 JSON
├── scripts/                # 로컬 업데이트 스크립트
└── README.md
```

## 향후 계획 (2차)

- DSR 정교 계산 (금융기관별 기준)
- 1세대1주택 비과세 / 장기보유특별공제 / 다주택 중과
- 공공데이터 API 연동 자동화
- 추가 대출 상품 (보금자리론, 신생아특례 등)

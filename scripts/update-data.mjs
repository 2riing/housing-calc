#!/usr/bin/env node

/**
 * 데이터 업데이트 스크립트 (로컬 실행 전용)
 *
 * 사용법: node scripts/update-data.mjs
 *
 * 기능:
 * 1. last_updated.json의 updatedAt을 오늘 날짜로 갱신
 * 2. sources.json의 각 항목 checkedAt을 오늘 날짜로 갱신
 * 3. JSON 파일 포맷 정리
 * 4. 기본 유효성 검사
 *
 * 2차 확장: 공공데이터 API 연동, 크롤링 등
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "..", "public", "data");

const today = new Date().toISOString().split("T")[0];

function readJson(filename) {
  const path = join(DATA_DIR, filename);
  if (!existsSync(path)) {
    console.error(`[ERROR] 파일 없음: ${path}`);
    process.exit(1);
  }
  return JSON.parse(readFileSync(path, "utf-8"));
}

function writeJson(filename, data) {
  const path = join(DATA_DIR, filename);
  writeFileSync(path, JSON.stringify(data, null, 2) + "\n", "utf-8");
  console.log(`  [OK] ${filename} 갱신 완료`);
}

// ── 1. last_updated.json ──
console.log("\n=== 데이터 업데이트 시작 ===\n");

const lastUpdated = readJson("last_updated.json");
lastUpdated.updatedAt = today;
writeJson("last_updated.json", lastUpdated);

// ── 2. sources.json ──
const sourcesData = readJson("sources.json");

// 유효성 검사
for (const src of sourcesData.sources) {
  if (!src.id || !src.title || !src.url) {
    console.error(`[ERROR] sources.json 항목 불완전: ${JSON.stringify(src)}`);
    process.exit(1);
  }
  src.checkedAt = today;
}
writeJson("sources.json", sourcesData);

// ── 3. loan_products.json 유효성 검사 ──
const loanData = readJson("loan_products.json");
for (const product of loanData.products) {
  if (!product.id || !product.name || !product.type) {
    console.error(
      `[ERROR] loan_products.json 항목 불완전: ${JSON.stringify(product)}`
    );
    process.exit(1);
  }
  if (!["lease", "purchase"].includes(product.type)) {
    console.error(
      `[ERROR] product.type은 lease|purchase여야 합니다: ${product.id}`
    );
    process.exit(1);
  }
  product.version = today;
}
writeJson("loan_products.json", loanData);

// ── 4. tax_rules.json 유효성 검사 ──
const taxData = readJson("tax_rules.json");
const cg = taxData.capitalGainsSimple;
if (!cg || !cg.brackets || cg.brackets.length === 0) {
  console.error("[ERROR] tax_rules.json capitalGainsSimple.brackets 누락");
  process.exit(1);
}
for (const b of cg.brackets) {
  if (typeof b.rate !== "number" || typeof b.deduction !== "number") {
    console.error(`[ERROR] brackets 항목 불완전: ${JSON.stringify(b)}`);
    process.exit(1);
  }
}
cg.version = today;
writeJson("tax_rules.json", taxData);

console.log(`\n=== 완료! 기준일: ${today} ===`);
console.log("다음 단계: git add public/data && git commit && git push\n");

"use client";

import PageShell from "@/components/PageShell";
import Collapsible from "@/components/Collapsible";

export default function GuidePage() {
  return (
    <PageShell>
      <h1 className="mb-1 text-xl font-bold">
        📖 주택 구매 완전 가이드
      </h1>
      <p className="mb-2 text-sm text-muted-foreground">
        2025-2026년 기준 · 결심부터 입주까지 한눈에
      </p>
      <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
        집 사는 게 처음이라 뭐부터 해야 할지 막막하죠?
        걱정 마세요. 자금 준비부터 입주까지, 제가 순서대로 하나씩 알려드릴게요.
        어려운 용어도 쉽게 풀어서 설명할 테니 편하게 읽어보세요 🙂
      </p>

      {/* 1. 자금 준비 */}
      <Collapsible title="1. 💰 자금 준비 — 내 통장부터 확인해요" defaultOpen>
        <div className="space-y-4 text-sm leading-relaxed text-foreground">
          <p className="text-muted-foreground">
            자, 집을 사려면 가장 먼저 해야 할 일이 뭘까요?
            바로 <strong className="text-foreground">&quot;지금 내가 얼마나 모을 수 있는지&quot;</strong> 파악하는 거예요.
            집값만 생각하면 안 되고, 세금이나 수수료 같은 부대비용도 꼭 같이 계산해야 해요.
          </p>

          <div>
            <h3 className="mb-2 font-semibold">총 필요 자금은 이렇게 나눠요</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="pb-2 pr-4">항목</th>
                    <th className="pb-2">비율/금액</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  <tr><td className="py-1.5 pr-4">자기자본</td><td>최소 매매가의 20~30%</td></tr>
                  <tr><td className="py-1.5 pr-4">대출 가능 금액</td><td>LTV/DSR 기준에 따라 산정</td></tr>
                  <tr><td className="py-1.5 pr-4">부대비용</td><td>매매가의 약 3~5%</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              쉽게 말하면, 5억짜리 집을 사려면 <strong className="text-foreground">최소 1억 + 부대비용 1,500~2,500만원</strong> 정도는 있어야 한다는 뜻이에요.
            </p>
          </div>

          <div>
            <h3 className="mb-2 font-semibold">내 자기자본, 이것들 다 합쳐보세요</h3>
            <ul className="list-inside list-disc space-y-1 text-muted-foreground">
              <li>현재 보유 현금 및 예적금</li>
              <li>전세보증금 회수 가능 금액</li>
              <li>주식/펀드 등 유동화 가능 자산</li>
              <li>가족 증여 (직계존비속 5,000만원 / 배우자 6억원 비과세 한도)</li>
            </ul>
            <p className="mt-2 text-xs text-muted-foreground">
              💡 여기서 핵심은요, 전세보증금 돌려받을 금액도 자기자본에 포함된다는 거예요.
              지금 전세 살고 있다면 그 보증금이 곧 종잣돈이 되는 셈이에요.
            </p>
          </div>
        </div>
      </Collapsible>

      {/* 2. 대출 관련 */}
      <Collapsible title="2. 🏦 대출 — 은행이 나한테 얼마나 빌려줄까?">
        <div className="space-y-4 text-sm leading-relaxed text-foreground">
          <p className="text-muted-foreground">
            대출 얘기만 나오면 LTV, DTI, DSR... 알파벳이 넘쳐나죠?
            겁먹지 마세요. 핵심만 딱 짚어드릴게요.
            이 세 가지만 이해하면 은행이 왜 그 금액을 불러주는지 바로 감이 와요.
          </p>

          <div>
            <h3 className="mb-2 font-semibold">LTV · DTI · DSR — 쉽게 정리!</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="pb-2 pr-3">용어</th>
                    <th className="pb-2 pr-3">쉬운 뜻</th>
                    <th className="pb-2">계산 방법</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  <tr>
                    <td className="py-1.5 pr-3 font-medium">LTV</td>
                    <td className="py-1.5 pr-3 text-muted-foreground">집값 대비 대출 비율 (담보인정비율)</td>
                    <td className="py-1.5 text-muted-foreground">(대출잔액 / 주택가격) × 100</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 pr-3 font-medium">DTI</td>
                    <td className="py-1.5 pr-3 text-muted-foreground">연봉 대비 대출 상환 비율 (총부채상환비율)</td>
                    <td className="py-1.5 text-muted-foreground">(주담대 원리금 + 기타 이자) / 연소득 × 100</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 pr-3 font-medium">DSR</td>
                    <td className="py-1.5 pr-3 text-muted-foreground">모든 빚 상환액 vs 연봉 (총부채원리금상환비율)</td>
                    <td className="py-1.5 text-muted-foreground">(모든 대출 원리금) / 연소득 × 100</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              💡 이것만 기억하면 돼요 → LTV는 <strong className="text-foreground">&quot;집값의 몇 %까지 빌려줄래?&quot;</strong>,
              DSR은 <strong className="text-foreground">&quot;네 월급으로 갚을 수 있어?&quot;</strong>를 따지는 거예요.
            </p>
          </div>

          <div>
            <h3 className="mb-2 font-semibold">LTV 규제 — 나는 몇 %까지 대출받을 수 있을까?</h3>
            <p className="mb-2 text-xs text-muted-foreground">
              주택 수, 지역에 따라 빌릴 수 있는 비율이 달라요. 아래 표를 확인해보세요.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="pb-2 pr-3">구분</th>
                    <th className="pb-2 pr-3">규제지역</th>
                    <th className="pb-2">비규제지역</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  <tr><td className="py-1.5 pr-3">무주택 세대주</td><td className="py-1.5 pr-3">50~60%</td><td className="py-1.5">70%</td></tr>
                  <tr><td className="py-1.5 pr-3">생애최초</td><td className="py-1.5 pr-3">70%</td><td className="py-1.5">80%</td></tr>
                  <tr><td className="py-1.5 pr-3">1주택</td><td className="py-1.5 pr-3">50~60%</td><td className="py-1.5">70%</td></tr>
                  <tr><td className="py-1.5 pr-3">2주택 이상</td><td className="py-1.5 pr-3 font-medium text-destructive">대출 불가</td><td className="py-1.5">60%</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              생애최초 구매자는 규제지역에서도 70%까지 가능해요. 첫 집이라면 이 혜택 꼭 챙기세요!
            </p>
          </div>

          <div>
            <h3 className="mb-2 font-semibold">DSR 규제 — 내 월급으로 감당되는지 체크</h3>
            <p className="mb-2 text-xs text-muted-foreground">
              쉽게 말하면, 모든 대출의 원리금 상환액이 내 연봉의 일정 비율을 넘으면 대출이 안 돼요.
            </p>
            <ul className="list-inside list-disc space-y-1 text-muted-foreground">
              <li>은행권 DSR <strong className="text-foreground">40%</strong> / 비은행권 <strong className="text-foreground">50%</strong></li>
              <li>총 대출 1억원 초과 시 적용</li>
              <li>변동/혼합금리 대출 시 스트레스 금리 1.5%p 가산</li>
            </ul>
            <p className="mt-2 text-xs text-muted-foreground">
              💡 카드론, 학자금대출, 자동차 할부 같은 기존 빚도 전부 포함되니까, 주담대 받기 전에 기존 대출을 정리하면 한도가 올라갈 수 있어요.
            </p>
          </div>

          <div>
            <h3 className="mb-2 font-semibold">정책 대출 — 정부가 싸게 빌려주는 대출이 있어요!</h3>
            <p className="mb-2 text-xs text-muted-foreground">
              시중은행 금리가 부담된다면, 정부 정책대출을 먼저 확인해보세요.
              금리가 훨씬 낮아서 이자 부담이 확 줄어요.
            </p>
            <div className="space-y-3">
              <div className="rounded-lg border border-border p-3">
                <h4 className="mb-1 text-xs font-bold">🏠 디딤돌대출</h4>
                <p className="text-xs text-muted-foreground">무주택 세대주 · 연소득 6,000만원 이하 · 5억원 이하 주택 · 최대 2.5억원 (신혼 4억) · 연 2.35~3.95%</p>
              </div>
              <div className="rounded-lg border border-border p-3">
                <h4 className="mb-1 text-xs font-bold">🏡 보금자리론</h4>
                <p className="text-xs text-muted-foreground">무주택/1주택 · 연소득 7,000만원 이하 · 6억원 이하 주택 · 최대 3.6억원 · 고정금리 연 3~4%대</p>
              </div>
              <div className="rounded-lg border border-border p-3">
                <h4 className="mb-1 text-xs font-bold">👶 신생아 특례 디딤돌</h4>
                <p className="text-xs text-muted-foreground">2년 이내 출생/입양 · 연소득 1.3억원 이하 · 9억원 이하 주택 · 최대 5억원 · 연 1.6~4.5%</p>
              </div>
              <div className="rounded-lg border border-border p-3">
                <h4 className="mb-1 text-xs font-bold">🏢 시중은행 주담대</h4>
                <p className="text-xs text-muted-foreground">변동/혼합/고정 선택 · 연 3.5~5.5%대 · 중도상환수수료 있음 (보통 3년 이내)</p>
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              💡 정책대출 자격이 되면 시중은행보다 금리가 1~2%p 낮아요. 먼저 자격 확인부터 해보세요!
            </p>
          </div>
        </div>
      </Collapsible>

      {/* 3. 매수 시 세금 및 부대비용 */}
      <Collapsible title="3. 🧾 세금 & 부대비용 — 집값 말고 또 뭐가 나가요?">
        <div className="space-y-4 text-sm leading-relaxed text-foreground">
          <p className="text-muted-foreground">
            &quot;집값만 있으면 집 살 수 있는 거 아니야?&quot; — 아니에요!
            취득세, 중개수수료, 법무사비 등등 생각보다 꽤 나가거든요.
            미리 알고 준비해야 잔금날 당황하지 않아요.
          </p>

          <div>
            <h3 className="mb-2 font-semibold">취득세 — 집 살 때 내는 세금 (1주택 기준)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="pb-2 pr-4">취득가액</th>
                    <th className="pb-2">세율</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  <tr><td className="py-1.5 pr-4">6억원 이하</td><td className="py-1.5 font-medium">1%</td></tr>
                  <tr><td className="py-1.5 pr-4">6억 초과 ~ 9억 이하</td><td className="py-1.5 font-medium">1% ~ 3%</td></tr>
                  <tr><td className="py-1.5 pr-4">9억원 초과</td><td className="py-1.5 font-medium">3%</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              + 지방교육세 (취득세의 10%) + 농어촌특별세 (85m² 초과 시 10%)
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              💡 6억 이하 아파트를 1주택으로 사면 취득세가 1%예요. 5억 아파트라면 500만원!
            </p>
          </div>

          <div>
            <h3 className="mb-2 font-semibold">다주택이면 취득세가 확 올라가요</h3>
            <p className="mb-2 text-xs text-muted-foreground">
              이미 집이 있는 분이라면 꼭 확인하세요. 다주택자는 취득세가 최대 12%까지 올라갈 수 있어요.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="pb-2 pr-3">주택 수</th>
                    <th className="pb-2 pr-3">조정대상지역</th>
                    <th className="pb-2">비조정대상</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  <tr><td className="py-1.5 pr-3">1주택</td><td className="py-1.5 pr-3">1~3%</td><td className="py-1.5">1~3%</td></tr>
                  <tr><td className="py-1.5 pr-3">2주택</td><td className="py-1.5 pr-3 font-medium text-destructive">8%</td><td className="py-1.5">1~3%</td></tr>
                  <tr><td className="py-1.5 pr-3">3주택+</td><td className="py-1.5 pr-3 font-medium text-destructive">12%</td><td className="py-1.5 font-medium text-destructive">8%</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="mb-2 font-semibold">중개수수료 — 부동산에 내는 비용</h3>
            <p className="mb-2 text-xs text-muted-foreground">
              흔히 &quot;복비&quot;라고 부르죠. 법으로 정해진 상한요율이 있고, 중개사와 협의해서 깎을 수 있어요.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="pb-2 pr-3">거래금액</th>
                    <th className="pb-2 pr-3">상한요율</th>
                    <th className="pb-2">한도액</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  <tr><td className="py-1.5 pr-3">5천만원 미만</td><td className="py-1.5 pr-3">0.6%</td><td className="py-1.5">25만원</td></tr>
                  <tr><td className="py-1.5 pr-3">5천만~2억 미만</td><td className="py-1.5 pr-3">0.5%</td><td className="py-1.5">80만원</td></tr>
                  <tr><td className="py-1.5 pr-3">2억~9억 미만</td><td className="py-1.5 pr-3">0.4%</td><td className="py-1.5">없음</td></tr>
                  <tr><td className="py-1.5 pr-3">9억~12억 미만</td><td className="py-1.5 pr-3">0.5%</td><td className="py-1.5">없음</td></tr>
                  <tr><td className="py-1.5 pr-3">12억~15억 미만</td><td className="py-1.5 pr-3">0.6%</td><td className="py-1.5">없음</td></tr>
                  <tr><td className="py-1.5 pr-3">15억 이상</td><td className="py-1.5 pr-3">0.7%</td><td className="py-1.5">없음</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">상한요율은 법적 최대치이며, 중개사와 협의하여 인하 가능</p>
          </div>

          <div>
            <h3 className="mb-2 font-semibold">실제로 얼마나 나갈까? — 7억 아파트 예시</h3>
            <p className="mb-2 text-xs text-muted-foreground">
              &quot;대충 얼마 정도 준비해야 해요?&quot; 궁금하시죠. 7억원짜리 84m² 아파트를 1주택으로 살 때 실제 부대비용이에요.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="pb-2 pr-4">항목</th>
                    <th className="pb-2">예상 금액</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  <tr><td className="py-1.5 pr-4">취득세 (~1.67%)</td><td className="py-1.5">~1,167만원</td></tr>
                  <tr><td className="py-1.5 pr-4">지방교육세</td><td className="py-1.5">~117만원</td></tr>
                  <tr><td className="py-1.5 pr-4">중개수수료 (0.4%)</td><td className="py-1.5">~280만원</td></tr>
                  <tr><td className="py-1.5 pr-4">국민주택채권</td><td className="py-1.5">~250~350만원</td></tr>
                  <tr><td className="py-1.5 pr-4">법무사비</td><td className="py-1.5">~50~70만원</td></tr>
                  <tr><td className="py-1.5 pr-4">인지세</td><td className="py-1.5">15만원</td></tr>
                  <tr className="font-semibold">
                    <td className="py-1.5 pr-4">합계</td>
                    <td className="py-1.5">~1,900~2,000만원 (약 2.7~2.9%)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              💡 7억 아파트에 약 <strong className="text-foreground">2,000만원</strong>이 추가로 든다는 뜻이에요. 자금 계획할 때 꼭 넣어두세요!
            </p>
          </div>
        </div>
      </Collapsible>

      {/* 4. 보유 시 세금 */}
      <Collapsible title="4. 🏠 보유 세금 — 집 가지고 있으면 매년 내는 세금">
        <div className="space-y-4 text-sm leading-relaxed text-foreground">
          <p className="text-muted-foreground">
            집을 사고 나면 끝이 아니에요. 매년 재산세가 나오고,
            비싼 집이면 종합부동산세(종부세)도 내야 해요.
            하지만 1주택자는 공제 혜택이 크니까 너무 걱정하지 마세요.
          </p>

          <div>
            <h3 className="mb-2 font-semibold">재산세 — 매년 7·9월에 내요</h3>
            <p className="mb-2 text-xs text-muted-foreground">매년 6월 1일 기준 소유자에게 부과 · 7월(건물분) 9월(토지분) 납부</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="pb-2 pr-4">과세표준 구간</th>
                    <th className="pb-2">세율</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  <tr><td className="py-1.5 pr-4">6천만원 이하</td><td className="py-1.5">0.1%</td></tr>
                  <tr><td className="py-1.5 pr-4">6천만원~1.5억원</td><td className="py-1.5">0.15%</td></tr>
                  <tr><td className="py-1.5 pr-4">1.5억원~3억원</td><td className="py-1.5">0.25%</td></tr>
                  <tr><td className="py-1.5 pr-4">3억원 초과</td><td className="py-1.5">0.4%</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              💡 과세표준은 시세가 아니라 <strong className="text-foreground">공시가격의 60%</strong>예요. 그래서 체감 세율은 생각보다 낮아요.
            </p>
          </div>

          <div>
            <h3 className="mb-2 font-semibold">종합부동산세 — 비싼 집 가진 사람만 해당돼요</h3>
            <p className="mb-2 text-xs text-muted-foreground">매년 6월 1일 기준 · 12월 납부</p>
            <ul className="list-inside list-disc space-y-1 text-xs text-muted-foreground">
              <li>일반: 공시가격 합산 <strong className="text-foreground">9억원</strong> 공제</li>
              <li>1세대 1주택: <strong className="text-foreground">12억원</strong> 공제</li>
              <li>고령자 공제 (60세+): 20~40%</li>
              <li>장기보유 공제 (5년+): 20~50%</li>
              <li>합산 <strong className="text-foreground">최대 80%</strong>까지 공제 가능</li>
            </ul>
            <p className="mt-2 text-xs text-muted-foreground">
              💡 1주택이고 공시가격 12억 이하라면 종부세 대상이 아니에요. 대부분의 1주택자는 해당 안 되니 안심하세요!
            </p>
          </div>
        </div>
      </Collapsible>

      {/* 5. 매도 시 양도소득세 */}
      <Collapsible title="5. 💸 양도소득세 — 집 팔 때 세금은 얼마?">
        <div className="space-y-4 text-sm leading-relaxed text-foreground">
          <p className="text-muted-foreground">
            지금은 &quot;집 사는 법&quot;을 보고 계시지만,
            나중에 팔 때를 미리 알아두면 전략적으로 움직일 수 있어요.
            특히 <strong className="text-foreground">비과세 요건</strong>은 집 사기 전에 반드시 알아야 해요!
          </p>

          <div>
            <h3 className="mb-2 font-semibold">양도소득세 기본 세율</h3>
            <p className="mb-2 text-xs text-muted-foreground">
              양도차익(번 돈)에 대해 소득세를 내는 건데, 많이 벌수록 세율이 올라가는 누진세 구조예요.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="pb-2 pr-3">과세표준</th>
                    <th className="pb-2 pr-3">세율</th>
                    <th className="pb-2">누진공제</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  <tr><td className="py-1.5 pr-3">1,400만원 이하</td><td className="py-1.5 pr-3">6%</td><td className="py-1.5">-</td></tr>
                  <tr><td className="py-1.5 pr-3">~5,000만원</td><td className="py-1.5 pr-3">15%</td><td className="py-1.5">126만원</td></tr>
                  <tr><td className="py-1.5 pr-3">~8,800만원</td><td className="py-1.5 pr-3">24%</td><td className="py-1.5">576만원</td></tr>
                  <tr><td className="py-1.5 pr-3">~1.5억원</td><td className="py-1.5 pr-3">35%</td><td className="py-1.5">1,544만원</td></tr>
                  <tr><td className="py-1.5 pr-3">~3억원</td><td className="py-1.5 pr-3">38%</td><td className="py-1.5">1,994만원</td></tr>
                  <tr><td className="py-1.5 pr-3">~5억원</td><td className="py-1.5 pr-3">40%</td><td className="py-1.5">2,594만원</td></tr>
                  <tr><td className="py-1.5 pr-3">~10억원</td><td className="py-1.5 pr-3">42%</td><td className="py-1.5">3,594만원</td></tr>
                  <tr><td className="py-1.5 pr-3">10억원 초과</td><td className="py-1.5 pr-3">45%</td><td className="py-1.5">6,594만원</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="mb-2 font-semibold">⭐ 1세대 1주택 비과세 요건 — 이건 반드시 외우세요!</h3>
            <p className="mb-2 text-xs text-muted-foreground">
              조건만 맞으면 양도세를 <strong className="text-foreground">한 푼도 안 내도 돼요</strong>. 집 사기 전에 이 조건을 먼저 체크하세요.
            </p>
            <ol className="list-inside list-decimal space-y-1 text-xs text-muted-foreground">
              <li>세대 전원이 1주택만 보유</li>
              <li>취득일로부터 <strong className="text-foreground">2년 이상 보유</strong></li>
              <li>조정대상지역 취득 시 <strong className="text-foreground">2년 이상 실거주</strong> 필수</li>
              <li>양도가액 <strong className="text-foreground">12억원 이하</strong> 시 전액 비과세</li>
            </ol>
            <p className="mt-2 text-xs text-muted-foreground">
              💡 서울에서 집 사면 &quot;2년 보유 + 2년 실거주&quot;를 채워야 비과세를 받을 수 있어요. 전세 놓고 실거주 안 하면 비과세 요건 충족이 안 되니까 주의!
            </p>
          </div>

          <div>
            <h3 className="mb-2 font-semibold">장기보유특별공제 — 오래 갖고 있으면 세금이 줄어요</h3>
            <ul className="list-inside list-disc space-y-1 text-xs text-muted-foreground">
              <li>일반: 3년~15년, 6%~최대 <strong className="text-foreground">30%</strong></li>
              <li>1세대 1주택: 보유분 최대 40% + 거주분 최대 40% = <strong className="text-foreground">최대 80%</strong></li>
            </ul>
            <p className="mt-2 text-xs text-muted-foreground">
              10년 이상 실거주한 1주택자는 양도차익의 80%를 공제받아요. 장기 보유가 절세의 핵심이에요!
            </p>
          </div>

          <div>
            <h3 className="mb-2 font-semibold">다주택자 중과 — 집 여러 채면 세금폭탄?</h3>
            <ul className="list-inside list-disc space-y-1 text-xs text-muted-foreground">
              <li>조정대상지역 2주택: +20%p</li>
              <li>조정대상지역 3주택+: +30%p</li>
              <li className="text-primary">2026년 5월 9일까지 한시 유예 중 (기본세율 적용)</li>
            </ul>
            <p className="mt-2 text-xs text-muted-foreground">
              지금은 유예 기간이라 기본세율이 적용되고 있어요. 하지만 언제 다시 중과될지 모르니 매도 타이밍도 생각해두세요.
            </p>
          </div>
        </div>
      </Collapsible>

      {/* 6. 규제 지역 */}
      <Collapsible title="6. 📍 규제 지역 — 내가 사려는 동네가 규제지역일까?">
        <div className="space-y-4 text-sm leading-relaxed text-foreground">
          <p className="text-muted-foreground">
            같은 집이라도 <strong className="text-foreground">어디에 있느냐</strong>에 따라 대출 한도, 세금, 전매 제한이 완전히 달라져요.
            내가 사려는 동네가 규제지역인지 반드시 확인하세요!
          </p>

          <div>
            <h3 className="mb-2 font-semibold">투기과열지구 + 조정대상지역 (2025년 10월~)</h3>
            <ul className="list-inside list-disc space-y-1 text-xs text-muted-foreground">
              <li><strong className="text-foreground">서울특별시</strong> — 25개 자치구 전역</li>
              <li><strong className="text-foreground">경기도</strong> — 과천, 광명, 성남(분당/수정/중원), 수원(영통/장안/팔달), 안양 동안, 용인 수지, 의왕, 하남</li>
            </ul>
            <p className="mt-2 text-xs text-muted-foreground">
              💡 서울은 전 지역이 투기과열지구 + 조정대상지역이에요. 서울에서 집 사려면 규제 영향을 꼭 알아야 해요.
            </p>
          </div>

          <div>
            <h3 className="mb-2 font-semibold">규제지역이면 뭐가 달라지나요?</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="pb-2 pr-4">항목</th>
                    <th className="pb-2">영향</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  <tr><td className="py-1.5 pr-4">LTV</td><td className="py-1.5">투기과열 50% / 조정대상 60%</td></tr>
                  <tr><td className="py-1.5 pr-4">2주택+ 대출</td><td className="py-1.5 font-medium text-destructive">대출 불가 (LTV 0%)</td></tr>
                  <tr><td className="py-1.5 pr-4">양도세 비과세</td><td className="py-1.5">2년 실거주 요건 추가</td></tr>
                  <tr><td className="py-1.5 pr-4">취득세 중과</td><td className="py-1.5">2주택 8%, 3주택 12%</td></tr>
                  <tr><td className="py-1.5 pr-4">자금조달계획서</td><td className="py-1.5">제출 의무</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              자금조달계획서는 &quot;이 돈 어디서 났어?&quot;를 정부에 보고하는 서류예요. 규제지역에서 집 사면 필수로 내야 해요.
            </p>
          </div>
        </div>
      </Collapsible>

      {/* 7. 1주택 vs 다주택 */}
      <Collapsible title="7. ⚖️ 1주택 vs 다주택 — 차이가 이렇게 커요">
        <div className="space-y-4 text-sm leading-relaxed text-foreground">
          <p className="text-muted-foreground">
            &quot;나중에 투자용으로 한 채 더 사볼까?&quot; 하는 분들, 이 표를 먼저 보세요.
            1주택자와 다주택자의 차이가 상상 이상으로 커요.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="pb-2 pr-3">구분</th>
                  <th className="pb-2 pr-3">1주택자</th>
                  <th className="pb-2">다주택자</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                <tr><td className="py-1.5 pr-3 font-medium">취득세</td><td className="py-1.5 pr-3">1~3%</td><td className="py-1.5">8~12%</td></tr>
                <tr><td className="py-1.5 pr-3 font-medium">양도세 비과세</td><td className="py-1.5 pr-3">12억 이하 비과세</td><td className="py-1.5 text-destructive">불가</td></tr>
                <tr><td className="py-1.5 pr-3 font-medium">장기보유공제</td><td className="py-1.5 pr-3">최대 80%</td><td className="py-1.5">최대 30%</td></tr>
                <tr><td className="py-1.5 pr-3 font-medium">종부세 공제</td><td className="py-1.5 pr-3">12억원</td><td className="py-1.5">9억원</td></tr>
                <tr><td className="py-1.5 pr-3 font-medium">대출</td><td className="py-1.5 pr-3">LTV 50~70%</td><td className="py-1.5 text-destructive">규제지역 불가</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground">
            💡 같은 7억짜리 집을 사도, 1주택자는 취득세 ~1,100만원이지만 다주택자(조정지역)는 <strong className="text-foreground">~5,600만원</strong>이에요.
            다주택 투자는 세금 시뮬레이션을 반드시 먼저 해보세요!
          </p>
        </div>
      </Collapsible>

      {/* 8. 청약 */}
      <Collapsible title="8. 🎯 청약 — 새 아파트를 시세보다 싸게 사는 방법">
        <div className="space-y-4 text-sm leading-relaxed text-foreground">
          <p className="text-muted-foreground">
            청약은 쉽게 말하면 <strong className="text-foreground">새 아파트를 시세보다 저렴하게 살 수 있는 기회</strong>예요.
            경쟁률이 높지만, 가점이 높거나 특별공급 자격이 되면 당첨 확률이 훨씬 올라가요.
          </p>

          <div>
            <h3 className="mb-2 font-semibold">청약통장 — 아직 없으면 지금 당장 만드세요!</h3>
            <ul className="list-inside list-disc space-y-1 text-xs text-muted-foreground">
              <li>월 납입 한도: 최대 <strong className="text-foreground">25만원</strong></li>
              <li>1순위 조건: 가입 후 <strong className="text-foreground">2년 경과</strong> + 예치금 충족</li>
              <li>소득공제: 무주택 세대주, 총급여 7천만원 이하 시 연 납입액의 40% (연 300만원 한도)</li>
            </ul>
            <p className="mt-2 text-xs text-muted-foreground">
              💡 청약통장은 가입 기간이 곧 점수예요. 당장 청약할 계획이 없더라도 일단 만들어두면 나중에 유리해요!
            </p>
          </div>

          <div>
            <h3 className="mb-2 font-semibold">가점제 — 총 84점 만점으로 경쟁해요</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="pb-2 pr-3">항목</th>
                    <th className="pb-2 pr-3">최대</th>
                    <th className="pb-2">기준</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  <tr><td className="py-1.5 pr-3">무주택 기간</td><td className="py-1.5 pr-3 font-medium">32점</td><td className="py-1.5 text-muted-foreground">만 30세부터, 15년+</td></tr>
                  <tr><td className="py-1.5 pr-3">부양가족 수</td><td className="py-1.5 pr-3 font-medium">35점</td><td className="py-1.5 text-muted-foreground">본인 제외 6명+</td></tr>
                  <tr><td className="py-1.5 pr-3">통장 가입 기간</td><td className="py-1.5 pr-3 font-medium">17점</td><td className="py-1.5 text-muted-foreground">15년+</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              부양가족 수가 35점으로 가장 비중이 커요. 결혼하고 가족이 늘면 점수가 크게 올라간답니다.
            </p>
          </div>

          <div>
            <h3 className="mb-2 font-semibold">특별공급 — 일반청약보다 경쟁률이 낮아요</h3>
            <p className="mb-2 text-xs text-muted-foreground">
              아래 조건에 해당되면 별도의 물량으로 경쟁하니까 당첨 확률이 훨씬 높아요!
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="pb-2 pr-3">유형</th>
                    <th className="pb-2 pr-3">대상</th>
                    <th className="pb-2">소득 요건</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  <tr><td className="py-1.5 pr-3">신혼부부</td><td className="py-1.5 pr-3 text-muted-foreground">혼인 7년 이내</td><td className="py-1.5 text-muted-foreground">소득 140% 이하</td></tr>
                  <tr><td className="py-1.5 pr-3">생애최초</td><td className="py-1.5 pr-3 text-muted-foreground">최초 주택 구입</td><td className="py-1.5 text-muted-foreground">소득 160% 이하</td></tr>
                  <tr><td className="py-1.5 pr-3">다자녀</td><td className="py-1.5 pr-3 text-muted-foreground">미성년 3자녀+</td><td className="py-1.5 text-muted-foreground">-</td></tr>
                  <tr><td className="py-1.5 pr-3">노부모 부양</td><td className="py-1.5 pr-3 text-muted-foreground">65세+ 직계존속 3년 부양</td><td className="py-1.5 text-muted-foreground">-</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Collapsible>

      {/* 9. 실무적 체크포인트 */}
      <Collapsible title="9. ✅ 실무 체크포인트 — 실수 없이 계약하려면">
        <div className="space-y-4 text-sm leading-relaxed text-foreground">
          <p className="text-muted-foreground">
            자금 준비 다 했고, 마음에 드는 집도 찾았어요. 자, 이제 계약 전에 꼭 확인해야 할 것들!
            여기서 실수하면 큰 돈 잃을 수 있으니까 꼼꼼하게 체크하세요.
          </p>

          <div>
            <h3 className="mb-2 font-semibold">등기부등본 확인 — 이건 무조건 해야 해요!</h3>
            <p className="mb-2 text-xs text-muted-foreground">
              등기부등본은 그 집의 &quot;신분증&quot; 같은 거예요. 진짜 주인이 맞는지, 빚이 얼마나 걸려있는지 다 나와요.
              대법원 인터넷등기소에서 700원이면 열람 가능! 계약 당일 + 잔금일에 각각 확인하세요.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="pb-2 pr-3">확인 항목</th>
                    <th className="pb-2 pr-3">내용</th>
                    <th className="pb-2">위험 신호</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  <tr><td className="py-1.5 pr-3 font-medium">갑구</td><td className="py-1.5 pr-3 text-muted-foreground">소유자, 가압류</td><td className="py-1.5 text-destructive">가압류/가처분 존재</td></tr>
                  <tr><td className="py-1.5 pr-3 font-medium">을구</td><td className="py-1.5 pr-3 text-muted-foreground">근저당, 전세권</td><td className="py-1.5 text-destructive">설정액이 매매가 근접</td></tr>
                  <tr><td className="py-1.5 pr-3 font-medium">표제부</td><td className="py-1.5 pr-3 text-muted-foreground">주소, 면적, 구조</td><td className="py-1.5 text-destructive">면적/용도 불일치</td></tr>
                  <tr><td className="py-1.5 pr-3 font-medium">소유자</td><td className="py-1.5 pr-3 text-muted-foreground">매도인 일치 여부</td><td className="py-1.5 text-destructive">불일치 시 사기 주의</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              💡 갑구에 &quot;가압류&quot;가 있으면 절대 계약하면 안 돼요! 을구의 근저당 금액이 매매가에 가까우면 깡통주택 위험도 있어요.
            </p>
          </div>

          <div>
            <h3 className="mb-2 font-semibold">현장 방문 — 눈으로 직접 확인하세요</h3>
            <p className="mb-2 text-xs text-muted-foreground">
              사진만 보고 계약하면 안 돼요! 최소 2~3번, 시간대를 바꿔서 방문해보세요.
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div className="rounded-lg border border-border p-2">💧 누수 — 천장/벽 얼룩, 곰팡이</div>
              <div className="rounded-lg border border-border p-2">🌫️ 결로 — 창문 주변, 북쪽 벽면</div>
              <div className="rounded-lg border border-border p-2">🔨 균열 — 벽면/천장 크랙</div>
              <div className="rounded-lg border border-border p-2">🚿 수압 — 모든 수전 동시 개방</div>
              <div className="rounded-lg border border-border p-2">🔊 소음 — 층간소음, 도로소음</div>
              <div className="rounded-lg border border-border p-2">☀️ 일조량 — 남향, 인접 건물</div>
              <div className="rounded-lg border border-border p-2">🚗 주차 — 세대당 주차 대수</div>
              <div className="rounded-lg border border-border p-2">💳 관리비 — 최근 12개월 내역</div>
            </div>
          </div>

          <div>
            <h3 className="mb-2 font-semibold">주변 환경 — 집 안만 보면 안 돼요</h3>
            <ul className="list-inside list-disc space-y-1 text-xs text-muted-foreground">
              <li>교통: 지하철/버스 도보 거리</li>
              <li>학군: 초중고 배정, 학원가</li>
              <li>편의시설: 마트, 병원, 공원</li>
              <li>혐오시설: 변전소, 소각장 인접 여부</li>
              <li>개발 호재/악재: 재건축/재개발 계획, GTX 노선</li>
            </ul>
            <p className="mt-2 text-xs text-muted-foreground">
              💡 실거주 목적이라면 학군과 교통을, 투자 목적이라면 개발 호재를 우선 체크하세요!
            </p>
          </div>
        </div>
      </Collapsible>

      {/* 10. 전체 플로우 */}
      <Collapsible title="10. 🗺️ 전체 플로우 — 결심부터 입주까지 한눈에!">
        <div className="space-y-3 text-sm leading-relaxed text-foreground">
          <p className="mb-2 text-muted-foreground">
            자, 여기까지 잘 따라오셨으면 이제 전체 흐름을 정리할 차례예요.
            집 사는 과정을 7단계로 나눠서 보여드릴게요. 하나씩 차근차근 하면 돼요!
          </p>
          {[
            {
              step: "STEP 1",
              title: "사전 준비 (1~3개월)",
              desc: "제일 먼저 해야 할 일이에요. 여기가 탄탄해야 나머지가 술술 풀려요.",
              items: [
                "자기자본 + 대출 가능 금액 + 부대비용 = 매수 가능 총액 산정",
                "은행 방문하여 대출 사전 심사 (필수!)",
                "정책대출(디딤돌/보금자리론/신생아특례) 자격 확인",
              ],
            },
            {
              step: "STEP 2",
              title: "매물 탐색 (1~6개월)",
              desc: "서두르지 마세요. 좋은 집은 발품을 팔아야 나와요.",
              items: [
                "국토교통부 실거래가 시스템으로 시세 파악",
                "최소 3~5곳 이상 현장 방문",
                "오전/오후/야간 각각 방문하여 일조량·소음 확인",
              ],
            },
            {
              step: "STEP 3",
              title: "계약 체결",
              desc: "떨리는 계약일! 등기부등본 확인은 당일 아침에 꼭 한 번 더!",
              items: [
                "계약 직전 등기부등본 당일 열람 필수",
                "계약금(매매가의 10%)은 매도인 본인 명의 계좌로 송금",
              ],
            },
            {
              step: "STEP 4",
              title: "중도금 지급 (선택)",
              desc: "모든 매매에 중도금이 있는 건 아니에요. 계약 조건에 따라 달라요.",
              items: ["중도금 지급 (있는 경우)", "대출 본 심사 진행"],
            },
            {
              step: "STEP 5",
              title: "잔금 및 소유권 이전 (1~3개월)",
              desc: "잔금날 = 내 집이 되는 날! 이날도 등기부등본 재확인은 필수예요.",
              items: [
                "잔금일 당일 아침 등기부등본 재열람",
                "잔금 지급 후 60일 이내 소유권이전등기 신청",
              ],
            },
            {
              step: "STEP 6",
              title: "신고 및 세금 납부",
              desc: "집은 샀지만 아직 끝이 아니에요! 신고와 납부 기한을 놓치면 가산세가 나와요.",
              items: [
                "실거래 신고 (30일 이내)",
                "취득세 납부 (60일 이내)",
                "전입신고",
              ],
            },
            {
              step: "STEP 7",
              title: "입주 및 사후 관리",
              desc: "드디어 입주! 전입신고와 확정일자까지 마무리하면 완벽해요 🎉",
              items: [
                "이사 → 전입신고 → 확정일자",
                "하자 보수 청구 (해당 시)",
              ],
            },
          ].map((s) => (
            <div key={s.step} className="rounded-lg border border-border p-3">
              <div className="mb-1 flex items-center gap-2">
                <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                  {s.step}
                </span>
                <span className="text-xs font-semibold">{s.title}</span>
              </div>
              <p className="mb-1.5 text-xs text-muted-foreground">{s.desc}</p>
              <ul className="list-inside list-disc space-y-0.5 text-xs text-muted-foreground">
                {s.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Collapsible>

      {/* 참고 사이트 */}
      <div className="mt-6 rounded-xl border border-border p-4">
        <h3 className="mb-1 text-sm font-bold">🔗 주요 참고 사이트</h3>
        <p className="mb-3 text-xs text-muted-foreground">
          직접 확인하고 싶을 때 유용한 공식 사이트들이에요.
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {[
            { name: "실거래가 공개시스템", url: "https://rt.molit.go.kr/" },
            { name: "대법원 인터넷등기소", url: "http://www.iros.go.kr" },
            { name: "청약홈", url: "https://www.applyhome.co.kr/" },
            { name: "마이홈포털", url: "https://www.myhome.go.kr/" },
            { name: "한국주택금융공사", url: "https://www.hf.go.kr/" },
            { name: "국세청 홈택스", url: "https://www.hometax.go.kr/" },
            { name: "위택스", url: "https://www.wetax.go.kr/" },
            { name: "정부24", url: "https://www.gov.kr/" },
          ].map((site) => (
            <a
              key={site.name}
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs transition hover:border-primary/30 hover:shadow-sm"
            >
              <span className="text-muted-foreground/40">↗</span>
              <span className="text-foreground">{site.name}</span>
            </a>
          ))}
        </div>
      </div>

      {/* 면책 */}
      <p className="mt-6 rounded-lg bg-muted/60 px-4 py-3 text-[11px] leading-relaxed text-muted-foreground">
        이 가이드는 2025-2026년 2월 기준 공개된 정보를 바탕으로 작성되었습니다.
        부동산 관련 법규와 세율은 수시로 변경될 수 있으므로, 실제 거래 시에는
        반드시 세무사, 법무사, 공인중개사 등 전문가와 상담하시기 바랍니다.
      </p>
    </PageShell>
  );
}

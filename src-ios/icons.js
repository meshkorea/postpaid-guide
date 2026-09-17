/* iOS에만 있는 아이콘. src/icons.js의 ICON에 얹습니다.
 *
 * 결제수단 아이콘들(현금·카드·분할)과 같은 식으로 그립니다 — 16px, 옅은 파랑
 * 덩어리에 진한 파랑으로 포인트. 작게 들어가므로 잔점은 넣지 않습니다. */

ICON.qr = `<svg viewBox="0 0 20 20" width="16" height="16"><rect x="1.5" y="1.5" width="7" height="7" rx="1.6" fill="#b9d4f7"/><rect x="11.5" y="1.5" width="7" height="7" rx="1.6" fill="#b9d4f7"/><rect x="1.5" y="11.5" width="7" height="7" rx="1.6" fill="#b9d4f7"/><rect x="11.5" y="11.5" width="3" height="3" rx="0.7" fill="#1b64da"/><rect x="15.5" y="11.5" width="3" height="3" rx="0.7" fill="#1b64da"/><rect x="11.5" y="15.5" width="3" height="3" rx="0.7" fill="#1b64da"/><rect x="15.5" y="15.5" width="3" height="3" rx="0.7" fill="#1b64da"/></svg>`

/* 분할 중간 완료 다이얼로그의 체크 (1006:89114 · success 40×40).
 * 마무리 화면의 연한 초록 동그라미와 달리, 여기는 꽉 찬 초록에 흰 체크입니다. */
ICON.checkSolid = `<svg class="mini-done__ic" viewBox="0 0 40 40" fill="none" aria-hidden="true"><circle cx="20" cy="20" r="20" fill="#3eb21f"/><path d="m12.5 20.4 5 5 10-10.6" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`

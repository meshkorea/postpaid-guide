/* iOS에서만 다른 화면들. src/screens.js를 먼저 읽고 그 위에 얹습니다.
 *
 * 안드로이드와 갈리는 곳은 네 군데입니다.
 *   1. KIS Pay가 없습니다 — 카드는 곧장 이지체크로 넘어갑니다
 *   2. 결제수단 시트에 «QR 간편»이 하나 더 있습니다
 *   3. 분할 결제 시트 아래에 QR 버튼이 하나 더 붙습니다
 *   4. 분할 한 회차를 받으면 «결제 완료»가 잠깐 떴다 사라지고, 시트가 닫히며
 *      남은 금액이 찍힌 배달지 화면으로 돌아옵니다
 *
 * 이지체크(KICC)는 두 OS가 같은 앱이라 src/screens.js 것을 그대로 씁니다.
 */

/* ── 이지체크 껍데기 — 제목을 바꿀 수 있게 다시 씁니다 ─────
 * 간편결제 화면은 상단 제목이 «간편결제»·«간편결제 승인»입니다.
 * 기본값이 «신용구매»라 기존 카드 화면들은 손대지 않아도 그대로 돕니다. */
function ecChrome(inner, { back = true, title = '신용구매' } = {}) {
  return `<div class="ec">
    <div class="ec__status"><span class="ec__time">4:28</span><span>✈ ᯤ 🔋</span></div>
    <div class="ec__bar"><span>${back ? '‹' : ''}</span><span>${title}</span><span class="ec__home-ic">⌂</span></div>
    ${inner}
    <div class="ec__indicator"></div>
  </div>`
}

/* ── 결제수단 시트 (iOS) ─────────────────────────────────
 * 현금·카드는 한 줄씩 넓게, QR 간편과 분할은 아래 한 줄에 나란히 놓입니다. */

function methodSheetIos(s) {
  return `${detail(s)}
    <div class="dim"></div>
    <div class="sheet sheet--method">
      <span class="sheet__x">✕</span>
      <h4 class="sheet__title">어떻게 결제하시겠어요?</h4>
      <p class="sheet__amount-label">총 결제 금액</p>
      <p class="sheet__amount">${won(s.remain ?? s.total)}</p>
      <button class="opt" id="m-cash">${ICON.cash} 현금</button>
      <button class="opt" id="m-card">${ICON.card} 카드</button>
      <div class="opt-row">
        <button class="opt" id="m-qr">${ICON.qr} QR 간편</button>
        <button class="opt" id="m-split">${ICON.split} 분할</button>
      </div>
    </div>`
}

/* ── 분할 결제 시트 (iOS) ───────────────────────────────
 * 아래 버튼이 셋입니다 — QR(아이콘만) · 현금 · 카드. */

function splitSheetIos(s) {
  const typed = s.typed || 0
  const remain = s.remain ?? s.total
  const over = typed > remain
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '00', '0', '←']
  const round2 = remain < s.total

  const head = round2
    ? `<p class="split__remain">남은금액 ${won(remain)}</p>
       <p class="split__hint">총 ${won(s.total)}</p>`
    : `<p class="split__total">총 ${won(remain)} 중</p>
       <p class="split__hint">(컵 보증금 900원 포함)</p>`

  const input = typed
    ? `${won(typed)}${round2 ? '<i class="split__clear">✕</i>' : ''}`
    : '<i class="split__caret"></i>얼마를 결제할까요?'

  const on = typed && !over ? ' is-on' : ''

  return `${detail(s)}
    <div class="dim"></div>
    <div class="sheet">
      <span class="sheet__x">✕</span>
      <h4 class="sheet__title">분할 결제</h4>
      ${head}
      <p class="split__input${typed ? ' is-filled' : ''}">${input}</p>
      <p class="split__err">${over ? '남은 금액보다 작게 입력하세요' : ''}</p>
      <div class="split__pad">
        ${
          round2
            ? ''
            : `<div class="quick">
          <button class="quick__btn" id="q-1000">+1천원</button>
          <button class="quick__btn" id="q-5000">+5천원</button>
          <button class="quick__btn" id="q-10000">+1만원</button>
        </div>`
        }
        <div class="keypad">
          ${keys.map((k) => `<button class="keypad__key" id="k-${k === '←' ? 'back' : k}">${k}</button>`).join('')}
        </div>
      </div>
      <div class="split__btns split__btns--ios">
        <button class="split__btn split__btn--qr${on}" id="s-qr">${ICON.qr}</button>
        <button class="split__btn${on}" id="s-cash">${ICON.cash} 현금</button>
        <button class="split__btn${on}" id="s-card">${ICON.card} 카드</button>
      </div>
    </div>`
}

/* ── 한 회차를 받으면 잠깐 뜨는 «결제 완료» ─────────────────
 * 1초쯤 떴다 저절로 사라지고, 시트가 닫히며 남은 금액이 찍힌 배달지 화면으로
 * 돌아갑니다. 현금으로 받은 회차에는 M캐시 잔액이 바뀌었다는 알림이 함께 뜹니다. */

function splitDoneIos(s) {
  const label = { cash: '현금 결제 완료', card: '카드 결제 완료', qr: '간편 결제 완료' }[s.paidWith || 'cash']
  return `${splitSheetIos(s)}
    <div class="dim dim--strong"></div>
    ${
      s.paidWith === 'cash'
        ? `<div class="headsup headsup--split">
      <p class="headsup__t">상품가액 출금</p>
      <p class="headsup__b">상품가액 현금 수취로 M캐시 잔액이 변경되었습니다.</p>
    </div>`
        : ''
    }
    <div class="mini-done">
      ${ICON.checkSolid}
      <p class="mini-done__t">${label}</p>
    </div>`
}

/* ── 이지체크 · 간편결제 (QR) ────────────────────────────
 * 고객 휴대폰의 바코드·QR을 기사님 카메라로 읽는 화면입니다.
 * 실제로는 카메라가 열리지만, 연습이라 고객 폰 모양을 눌러보게 했습니다. */

function ecQr(s = {}) {
  return ecChrome(
    `<div class="ec__body ec__body--qr">
      <p class="ec__h ec__h--qr">BARCODE 또는 QRCODE를<br>카메라에 읽혀주세요</p>
      <div class="qr-cam">
        <div class="qr-phone" id="e-qr-code">
          <p class="qr-phone__t">QR 결제</p>
          <div class="qr-phone__bars"></div>
          <p class="qr-phone__sub">네이버페이 머니카드</p>
        </div>
      </div>
      ${s.reading ? ecBarcodeAlert() : ''}
      <p class="ec__pays">** 지원 가능한 간편페이 종류 **<br>엘페이 카카오페이 알리페이 SSG 네이버페이</p>
    </div>`,
    { title: '간편결제' },
  )
}

/** 바코드를 읽으면 번호를 보여주고 이 번호가 맞는지 물어봅니다. */
function ecBarcodeAlert() {
  return `<div class="ec__alert">
    <h4>[BARCODE READING]</h4>
    <p>바코드 번호 : 404577******352800000<br>사용하시겠습니까?</p>
    <div class="ec__alert-btns">
      <button id="e-qr-ok">확인</button>
      <button id="e-qr-again">다시</button>
    </div>
  </div>`
}

/** 읽힌 번호와 결제 유형을 확인하는 화면입니다. */
function ecQrNum() {
  return ecChrome(
    `<div class="ec__body">
      <p class="ec__h">BARCODE 번호를 입력해주세요</p>
      <div class="ec__qrno">
        <b>식별번호</b>
        <span class="ec__input">404577******352800…<i class="ec__clear">✕</i></span>
      </div>
      <p class="ec__kind">결제 유형 : 현대비자개인</p>
      <p class="ec__guide">바코드 리딩 방법을 선택해주세요.</p>
      <button class="ec__ok" id="e-qrno-ok">확인</button>
    </div>`,
    { title: '간편결제' },
  )
}

/** 금액을 확인하고 승인을 올립니다. 카드 쪽 금액 화면과 같은 모양입니다. */
function ecQrAmount(s) {
  const amt = s.payNow ?? s.total
  const n = amt.toLocaleString('ko-KR')
  return ecChrome(
    `<div class="ec__body">
      <div class="ec__amt">
        <div class="ec__amt-row"><b>금액</b><span class="ec__input">${n}<i class="ec__clear">✕</i></span><em>원</em></div>
        <div class="ec__amt-row"><b>부가세</b><span class="ec__input">0</span><em>원</em></div>
        <div class="ec__amt-row"><b>봉사료</b><span class="ec__input">0</span><em>원</em></div>
        <div class="ec__amt-row is-total"><b>합계</b><span class="ec__input">${n}</span><em>원</em></div>
        <div class="ec__amt-row"><b>할부개월</b>
          <span class="ec__seg"><i class="is-on">일시불</i><i>할부</i></span>
          <span class="ec__input ec__input--sm"></span><em>개월</em></div>
      </div>
      <button class="ec__ok" id="e-qramt-ok">확인</button>
    </div>`,
    { title: '간편결제 승인' },
  )
}

/* ── 갈아끼우기 ──────────────────────────────────────────
 * 이름이 같은 화면은 iOS 것으로 바꾸고, 새 화면은 더합니다. */

Object.assign(SCREENS, {
  methodSheet: methodSheetIos,
  splitSheet: splitSheetIos,
  splitDone: splitDoneIos,
  ecQr,
  ecQrNum,
  ecQrAmount,
})

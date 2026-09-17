/* 연습 화면 그리기 — 각 함수는 state를 받아 HTML 문자열을 돌려줍니다.
 * 탭해야 하는 요소에는 id를 달아 두고, 단계 정의(steps.js)에서 그 id를 가리킵니다. */

const won = (n) => n.toLocaleString('ko-KR') + '원'

/* ── 공통 조각 ───────────────────────────────────────────── */

function statusbar(dark) {
  return `<div class="statusbar${dark ? ' statusbar--dark' : ''}">
    <span>12:00</span>
    <span class="statusbar__icons">▲ ▮ 76%</span>
  </div>`
}

function navbar(dark) {
  return `<div class="navbar${dark ? ' navbar--dark' : ''}"><span>|||</span><span>○</span><span>‹</span></div>`
}

/**
 * 배달지 상세·완료 화면 뒤에 깔리는 지도. 실제 앱 캡처(360×740 기준)를 씁니다.
 * 캡처에 안드로이드 상태바와 지도 위 FAB(오더 받기 · 수행목록)이 함께 들어 있어서,
 * 이 지도를 쓰는 화면은 상태바를 따로 그리지 않습니다.
 */
function mapBg() {
  return `<img class="map" src="${MAP_SRC}" alt="">`
}

/** 빌드할 때 data URI로 바뀝니다 (build.mjs). */
const MAP_SRC = '{{MAP}}'

/* ── 부릉플러스 · 배달지 상세 ─────────────────────────────── */

function detail(s) {
  const cash = s.order === 'cash'
  const remain = s.remain ?? s.total
  const partial = remain < s.total
  const kind = cash ? '현금' : '카드'
  const icon = cash ? ICON.cash : ICON.card

  /* 디자인(882:82730)에서는 바텀시트가 위까지 올라와 있어 지도는 28px만 보이고,
   * 지도 위 FAB(오더 받기·수행목록)은 시트에 가려집니다. */
  return `<div class="screen">
    ${mapBg()}
    <div class="detail">
      <div class="detail__grip"><span class="detail__handle"></span></div>
      <div class="detail__scroll">
        <div class="card">
          <p class="eyebrow">배달지로 이동해주세요</p>
          <h3 class="addr">강남대로 114길 10</h3>
          <p class="addr-sub"><span>강남대로 114길 10 부릉아파트 113동 1906호 (역삼동)</span><span class="copy">복사</span></p>
          <div class="btn-row">
            <span class="btn-line">${ICON.phone} 고객 전화</span>
            <span class="btn-line">${ICON.navi} 길 찾기</span>
          </div>
        </div>
        <div class="card">
          <p class="label">배송메시지</p>
          <p class="value">벨 누르지 말고 문 앞에 두고 노크해주세요</p>
          <span class="btn-line btn-line--sm">${ICON.sms} 문자 전송</span>
        </div>
        <div class="card">
          <p class="label">상품픽업번호</p>
          <p class="value value--lg">F2512011457J8ME2</p>
          <p class="value value--plain">부릉치킨 선릉점</p>
          <div class="amount-row">
            <span class="amount-row__label">결제필요금액</span>
            <span class="amount-row__value">${won(s.total)}</span>
            <span class="badge badge--${cash ? 'cash' : 'card'}">${cash ? '후불현금' : '후불카드'}</span>
          </div>
        </div>
        <div class="card">
          <p class="label">부릉오더번호 (VCC 소통용)</p>
          <p class="value value--lg">20249230141#1212</p>
          <span class="btn-line btn-line--sm">${ICON.vcc} VCC 연결</span>
        </div>
      </div>
      <div class="paybar">
        ${partial ? `<p class="warn-row">${ICON.warn} 잔여 결제 금액 있음</p>` : ''}
        <button class="btn-pay" id="cta">${
          partial ? `${won(remain)} 결제하기` : `${icon} ${kind} ${won(remain)} 결제하기`
        }</button>
        ${partial ? '' : '<button class="paybar__alt" id="alt">다른 방법으로 결제</button>'}
      </div>
    </div>
    ${s.toast ? `<div class="toast">${s.toast}</div>` : ''}
  </div>`
}

/* ── 결제 수단 시트 ──────────────────────────────────────── */

function methodSheet(s) {
  return `${detail(s)}
    <div class="dim"></div>
    <div class="sheet sheet--method">
      <span class="sheet__x">✕</span>
      <h4 class="sheet__title">어떻게 결제하시겠어요?</h4>
      <p class="sheet__amount-label">총 결제 금액</p>
      <p class="sheet__amount">${won(s.remain ?? s.total)}</p>
      <button class="opt" id="m-cash">${ICON.cash} 현금</button>
      <button class="opt" id="m-card">${ICON.card} 카드</button>
      <button class="opt" id="m-split">${ICON.split} 분할</button>
    </div>`
}

/* ── 현금 결제 확인 얼럿 ─────────────────────────────────── */

function cashAlert(s) {
  return `${detail(s)}
    <div class="dim"></div>
    <div class="alert">
      <span class="alert__x">✕</span>
      <h4 class="alert__title">현금으로 결제하시겠어요?</h4>
      <p class="alert__body">고객에게 받은 현금만큼 기사님의 M캐시가 차감돼요.</p>
      <div class="alert__btns">
        <button class="alert__btn" id="a-other">다른 결제방법</button>
        <button class="alert__btn alert__btn--primary" id="a-cash">현금 결제</button>
      </div>
    </div>`
}

/* ── 카드 결제 시트 ──────────────────────────────────────── */

function cardSheet(s) {
  return `${detail(s)}
    <div class="dim"></div>
    <div class="sheet sheet--card">
      <span class="sheet__x">✕</span>
      <h4 class="sheet__title">카드 결제</h4>
      <div class="sheet__opts">
        <button class="opt--accent" id="c-kispay">
          <span class="opt--accent__row">${ICON.kisLogo} KIS Pay 결제</span>
          <span class="opt__sub">NFC · 삼성페이 · 리더기 등</span>
        </button>
        <button class="opt-link" id="c-keyin">카드 직접 입력</button>
      </div>
    </div>`
}

/* ── 분할 결제 시트 ──────────────────────────────────────── */

function splitSheet(s) {
  const typed = s.typed || 0
  const remain = s.remain ?? s.total
  const over = typed > remain
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '00', '0', '←']
  /* 2회차부터는 남은 금액이 미리 채워져 나오고, 빠른 금액 버튼이 없습니다 (882:82614). */
  const round2 = remain < s.total

  const head = round2
    ? `<p class="split__remain">남은금액 ${won(remain)}</p>
       <p class="split__hint">총 ${won(s.total)}</p>`
    : `<p class="split__total">총 ${won(remain)} 중</p>
       <p class="split__hint">(컵 보증금 900원 포함)</p>`

  const input = typed
    ? `${won(typed)}${round2 ? '<i class="split__clear">✕</i>' : ''}`
    : '<i class="split__caret"></i>얼마를 결제할까요?'

  const pad = `<div class="split__pad">
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
    </div>`

  return `${detail(s)}
    <div class="dim"></div>
    <div class="sheet">
      <span class="sheet__x">✕</span>
      <h4 class="sheet__title">분할 결제</h4>
      ${head}
      <p class="split__input${typed ? ' is-filled' : ''}">${input}</p>
      <p class="split__err">${over ? '남은 금액보다 작게 입력하세요' : ''}</p>
      ${pad}
      <div class="split__btns">
        <button class="split__btn${typed && !over ? ' is-on' : ''}" id="s-cash">${ICON.cash} 현금</button>
        <button class="split__btn${typed && !over ? ' is-on' : ''}" id="s-card">${ICON.card} 카드</button>
      </div>
    </div>`
}

/* ── 결제 진행중 ─────────────────────────────────────────── */

function progress(s = {}) {
  /* 로딩은 덮개일 뿐입니다. under에 화면 이름을 주면 직전에 보던 화면을 그대로
   * 뒤에 깔아, 기다리는 동안 화면이 꺼진 것처럼 보이지 않게 합니다. */
  return `<div class="screen">
    ${s.under ? SCREENS[s.under](s) : mapBg()}
    <div class="progress"><div class="progress__card">
      <div class="spinner"></div>
      <p class="progress__label">${s.label || '결제 진행중'}</p>
    </div></div>
  </div>`
}

/* ── 결제·배달 완료 ──────────────────────────────────────── */

function done(s) {
  const kind = { cash: '현금 결제 완료', card: '카드 결제 완료', split: '분할 결제 완료' }[s.doneKind || 'cash']
  return `<div class="screen">
    ${mapBg()}
    <div class="wx">${ICON.weather} 기상할증 적용중</div>
    <div class="headsup">
      <p class="headsup__t">배송수수료 입금</p>
      <p class="headsup__b">배송수수료 입금으로 인해 M캐시 잔액이 변경되었습니다.</p>
    </div>
    <div class="done-sheet">
      <p class="done-sheet__kind">${kind}</p>
      <p class="done-sheet__t">부릉치킨 선릉점 배달 완료</p>
      <p class="done-sheet__amt">3,200원</p>
      <div class="mission">
        <p class="mission__h">${ICON.fire} 진행한 미션 2개</p>
        <div class="mission__row">50건 더 하면 40,000원 <span>30/80</span></div>
        <div class="mission__row">9건 더 하면 10,000원 <span>1/10</span></div>
      </div>
      <button class="btn-pay" id="d-ok">확인</button>
    </div>
  </div>`
}

/* ── KIS Pay 앱 ────────────────────────────────────────────
 * Figma 1342:124984(결제 화면 이동) · 124985(신용결제) · 124986(카메라 결제) · 124987(승인 영수증)
 */

function kisStatus() {
  return `<div class="kis__status"><span>11:11</span><span>◂ ▮ 50%</span></div>`
}

/** 부릉플러스에서 넘어오는 동안 잠깐 보이는 화면 (1342:124984) */
function kispayLoading() {
  return `<div class="kis">
    ${kisStatus()}
    <div class="kis__loading">
      <p class="kis__logo"><b>KIS</b> Pay</p>
      <div class="kis__loading-mid">
        <div class="spinner spinner--kis"></div>
        <p class="kis__loading-t">결제 화면 이동</p>
      </div>
      <p class="kis__loading-s">잠시만 기다려 주세요</p>
    </div>
    ${navbar()}
  </div>`
}

/** 결제수단을 고르는 화면 (1342:124985) */
function kispay(s) {
  const amt = s.payNow ?? s.total
  const vat = Math.round(amt / 11)
  const ways = [
    ['credit', '신용결제'],
    ['samsung', '삼성페이'],
    ['camera', '카메라결제'],
    ['bluetooth', '블루투스결제'],
    ['easy', '간편결제'],
    ['apple', '애플페이'],
  ]
  return `<div class="kis">
    ${kisStatus()}
    <div class="kis__bar">신용결제<span class="kis__x">✕</span></div>
    <div class="kis__body">
      <div class="kis__card">
        <p class="kis__shop">부릉치킨 선릉점</p>
        <p class="kis__field">결제금액</p>
        <div class="kis__amount"><b>${amt.toLocaleString('ko-KR')}</b><i>원</i></div>
        <p class="kis__field">할부기간 선택</p>
        <div class="kis__select">일시불</div>
        <div class="kis__line">면세금액 <b>0 원</b></div>
        <div class="kis__line">부가세 <b>${vat.toLocaleString('ko-KR')} 원</b></div>
        <div class="kis__line">공급가액 <b>${(amt - vat).toLocaleString('ko-KR')} 원</b></div>
      </div>
      <p class="kis__h">결제수단 선택</p>
      <div class="kis__grid">
        ${ways
          .map(
            ([k, label]) =>
              `<button class="kis__way" id="k-way-${k}">${KIS_WAY[k]}<span>${label}</span></button>`,
          )
          .join('')}
      </div>
    </div>
    ${navbar()}
  </div>`
}

/** 카메라로 카드를 비추는 화면 (1342:124986) */
function kispayCamera() {
  return `<div class="cam">
    <div class="cam__status"><span>12:12</span><span>◂ ▮ 85%</span></div>
    <div class="cam__bar"><span>‹</span><span>카메라 결제</span><span>✕</span></div>
    <div class="cam__view">
      <span class="cam__round cam__round--help">?</span>
      <span class="cam__round cam__round--a">◉</span>
      <span class="cam__round cam__round--b">⚡</span>
      <button class="cam__card" id="k-cam-card">
        <span class="cam__card-brand">CLUB SK</span>
        <span class="cam__card-chip"></span>
        <span class="cam__card-no">•••• •••• •••• 8513</span>
        <span class="cam__card-visa">VISA</span>
      </button>
    </div>
    <div class="cam__guide">
      <p class="cam__timer">⏱ 유효시간 0:04</p>
      <p class="cam__t1">사각형 안에 카드가 들어오게 맞춰주세요.</p>
      <p class="cam__t2">실물 카드 여부를 반드시 확인해주세요.</p>
    </div>
    <div class="cam__ways">
      <p class="cam__ways-h">결재방법 변경</p>
      <div class="cam__ways-row">
        <span class="cam__way"><b>NFC</b><span>NFC 결제</span></span>
        <span class="cam__way">${KIS_WAY.bluetooth}<span>블루투스 결제</span></span>
        <span class="cam__way"><b>pay</b><span>삼성페이 결제</span></span>
      </div>
    </div>
    ${navbar()}
  </div>`
}

/**
 * KIS Pay 승인 영수증 (1342:124987 · 현금영수증 발급 완료).
 * 카드 승인과 현금영수증 발급이 같은 서식이라 `receipt`로 갈라 씁니다.
 */
function kispayReceipt(s) {
  const amt = s.payNow ?? s.total
  const vat = Math.round(amt / 11)
  const cash = s.receipt === 'cash'
  const won2 = (n) => n.toLocaleString('ko-KR') + ' 원'
  const rows = (list) =>
    list.map(([k, v]) => `<div class="rc__row"><span>${k}</span><b>${v}</b></div>`).join('')

  return `<div class="rc">
    ${kisStatus()}
    <div class="rc__body">
      <p class="rc__shop">부릉치킨 선릉점</p>
      <p class="rc__amt">${amt.toLocaleString('ko-KR')}<i>원</i></p>
      <p class="rc__kind">${cash ? '소득공제 승인' : '카메라 결제 승인'}</p>
      <div class="rc__sep"></div>
      ${rows(
        cash
          ? [
              ['승인일시', '2026-01-14 11:22:07'],
              ['승인번호', '090018146'],
              ['거래종류', '소득공제'],
              ['식별번호', '010****5678'],
            ]
          : [
              ['승인일시', '2026-01-13 11:57:05'],
              ['승인번호', '00360900'],
              ['카드사', '현대카드'],
              ['카드번호', '4045-77**-****-****'],
              ['할부', '일시불'],
            ],
      )}
      <div class="rc__sep"></div>
      ${rows([
        ['금액', won2(amt - vat)],
        ['부가세', won2(vat)],
        ['합계', won2(amt)],
      ])}
      <div class="rc__sep"></div>
      ${rows([
        ['가맹점명', '부릉치킨 선릉점'],
        ['사업자번호', '116-81-43939'],
        ['단말기번호', '51****08'],
        ['대표자명', '홍길동'],
        ['전화번호', '02-1234-5678'],
        ['주소', '서울특별시 강남구 테헤란로 000'],
      ])}
    </div>
    <div class="rc__tear"></div>
    <div class="rc__foot">
      <button class="rc__btn">영수증 공유</button>
      <button class="rc__btn rc__btn--primary" id="k-ok">확인</button>
    </div>
    ${navbar()}
  </div>`
}

/** KIS Pay 현금영수증 발급 화면 */
function kisCashReceipt(s) {
  const amt = s.payNow ?? s.total
  const vat = Math.round(amt / 11)
  return `<div class="kis">
    ${kisStatus()}
    <div class="kis__bar">현금영수증<span class="kis__x">✕</span></div>
    <div class="kis__body">
      <div class="kis__card">
        <p class="kis__shop">부릉치킨 선릉점</p>
        <p class="kis__field">결제금액</p>
        <div class="kis__amount"><b>${amt.toLocaleString('ko-KR')}</b><i>원</i></div>
        <div class="kis__line">컵보증금 <b>0 원</b></div>
        <div class="kis__line">면세금액 <b>0 원</b></div>
        <div class="kis__line">부가세 <b>${vat.toLocaleString('ko-KR')} 원</b></div>
        <div class="kis__line">공급가액 <b>${(amt - vat).toLocaleString('ko-KR')} 원</b></div>
      </div>
      <div class="kis__tabs">
        <span class="is-on">소득공제용</span><span>지출증빙용</span><span>자진발급</span>
      </div>
      <p class="kis__no">01012345678</p>
      <button class="btn-pay" id="k-issue" style="background:#5b5fc7;margin-top:28px">현금영수증 발행</button>
    </div>
    ${navbar()}
  </div>`
}

/* ── 수행목록 · 결제 내역 · 현금영수증 ─────────────────────
 * `안드로이드_현금 영수증.jpg` 플로우 기준입니다. */

/**
 * 메인 지도 (부릉플러스 `16785:31016`) — 여기서 `수행목록`으로 들어갑니다.
 * 지도 캡처에 `오더 받기`·`수행목록` 버튼이 이미 찍혀 있어서, 그 자리에 투명 버튼을 얹습니다.
 */
function mainMap() {
  return `<div class="screen">
    ${mapBg()}
    <button class="map__fab" id="m-tasks" aria-label="수행목록"></button>
    <div class="map__notice">
      <p class="map__finding">··· 주변 오더를 찾고 있어요</p>
      <p class="map__wx">${ICON.weather} 기상할증 적용중</p>
    </div>
  </div>`
}

/** 수행목록 (882:82111) — 배달 건을 펼치면 `결제내역` 버튼이 나옵니다. */
function taskList() {
  const row = (kind, title, sub, done) => `<div class="tl__row">
    <span class="tl__pin${done ? ' is-done' : ''}"><i>${kind}</i></span>
    <span class="tl__body"><b>${title}</b>${sub ? `<i${done ? ' class="is-done"' : ''}>${sub}</i>` : ''}</span>
    <span class="tl__chev">⌄</span>
  </div>`

  return `<div class="screen screen--plain">
    ${statusbar()}
    <div class="appbar"><span>‹</span><span>수행목록</span><span class="appbar__act">VCC 연결</span></div>
    <div class="tl">
      ${row('배달', '강남대로 114길 10', '부릉치킨 선릉점 고객')}
      <div class="tl__row tl__row--open">
        <span class="tl__pin"><i>배달</i></span>
        <span class="tl__body">
          <b>강남대로 114길 10</b><i>부릉치킨 선릉점 고객</i>
          <p class="tl__addr">강남대로 114길 10 부릉아파트 113동 1906호 (역삼동)</p>
          <p class="tl__meta">상품번호 F2512011457J8ME2<br>부릉번호 20249230141#1212</p>
          <p class="tl__paid">58,500원 결제완료 <span class="badge badge--cash">후불현금</span></p>
          <span class="tl__btns">
            <span class="btn-line btn-line--sm">${ICON.phone} 고객 전화</span>
            <span class="btn-line btn-line--sm">${ICON.sms} 문자 전송</span>
          </span>
          <button class="btn-line btn-line--sm tl__pay" id="t-pay">${ICON.receipt} 결제내역</button>
        </span>
        <span class="tl__chev">⌃</span>
      </div>
      ${row('픽업', '부릉치킨 선릉점 상점명이 길어…', '준비완료', true)}
      ${row('픽업', '부릉치킨 선릉점', '10분 후 픽업')}
      ${row('배달', '강남대로 114길 10', '부릉치킨 선릉점 고객')}
    </div>
    <div class="tl__foot"><span class="toggle"></span> 오더 받기</div>
  </div>`
}

/** 결제 내역 — 현금 건에 `현금 영수증 발급` 버튼이 붙습니다. */
function payHistory(s) {
  return `<div class="screen screen--plain">
    ${statusbar()}
    <div class="appbar"><span>‹</span><span>결제 내역</span><span></span></div>
    <div class="ph">
      <div class="ph__sum">
        <div class="ph__sum-row"><span>총 결제 금액</span><b>${won(s.total)}</b></div>
        <div class="ph__sum-row"><span>잔여 결제 금액</span><b class="is-zero">0원</b></div>
      </div>
      <div class="ph__item">
        <div class="ph__item-top">
          <span class="ph__when">결제일시 <i>2026.01.14 10:37:16</i></span>
          <span class="ph__amt">${won(s.total)}<i>현금</i></span>
        </div>
        <div class="ph__btns">
          <span class="btn-line btn-line--sm">${ICON.phone} 결제 취소 요청</span>
          <button class="btn-line btn-line--sm${s.issued ? ' is-off' : ''}" id="p-receipt">${ICON.receipt} 현금 영수증 발급</button>
        </div>
      </div>
      ${s.issued ? '<p class="ph__toast">현금영수증을 발급했어요</p>' : ''}
    </div>
  </div>`
}

/** 현금영수증 발급번호 입력 시트 */
function receiptSheet(s) {
  const filled = !!s.no
  return `${payHistory(s)}
    <div class="dim"></div>
    <div class="sheet sheet--receipt">
      <span class="sheet__x">✕</span>
      <h4 class="sheet__title">현금영수증 발급번호 입력</h4>
      <label class="radio${s.biz ? '' : ' is-on'}">개인 소득공제용</label>
      <label class="radio${s.biz ? ' is-on' : ''}">사업자 지출증빙</label>
      <div class="field${filled ? ' is-filled' : ''}" id="r-input">
        ${filled ? `${s.no}<i class="field__clear">✕</i>` : '<span class="field__ph">휴대폰 번호 입력</span>'}
      </div>
      <div class="sheet__btns">
        <button class="sheet__btn">취소</button>
        <button class="sheet__btn sheet__btn--go${filled ? '' : ' is-off'}" id="r-issue">발급하기</button>
      </div>
    </div>`
}

/* ── 이지체크(KICC) 앱 ──────────────────────────────────────
 * Figma 1346:124989~124995. 부릉플러스와 달리 iOS 크롬(노치 시계 · 홈 인디케이터)입니다.
 *   124989 가맹점 정보 → 124990 카드 읽히기(리더기 등록 얼럿) → 124991 카드번호 입력(보안 키패드)
 *   → 124992 금액 확인 → 124993 서명(가로) → 124994 KICC 승인 → 124995 결제완료
 */

function ecChrome(inner, { back = true } = {}) {
  return `<div class="ec">
    <div class="ec__bar"><span>${back ? '‹' : ''}</span><span>신용구매</span><span class="ec__home-ic">⌂</span></div>
    ${inner}
    <div class="ec__indicator"></div>
  </div>`
}

/** 화면 제목 줄 — 빨간 자물쇠 + 글씨 */
function ecHead(text) {
  return `<p class="ec__head">${ICON.ecLock} ${text}</p>`
}

function ecCard(rows) {
  return `<div class="ec__panel">
    ${rows.map(([k, v]) => `<div class="ec__row"><b>${k}</b><span>${v}</span></div>`).join('')}
  </div>`
}

/** 1. 가맹점 정보 (1346:124989) */
function easycheckShop() {
  return ecChrome(`<div class="ec__body">
    ${ecHead('가맹점 정보')}
    ${ecCard([
      ['TID', '0788888'],
      ['사업자번호', '1168119948'],
      ['가맹점명', '부릉플러스_상점_모바일'],
      ['대표자명', '부릉플러스_상점_모바일'],
      ['주 소', '123'],
      ['전화번호', '123'],
    ])}
    <button class="ec__ok" id="e-shop-ok">확인</button>
  </div>`)
}

/** 2. 카드를 읽혀주세요 — 리더기 등록 얼럿 (1346:124990) */
function easycheckRead(s) {
  const no = s.cardNo || ['', '', '', '']
  return ecChrome(`<div class="ec__body">
    <p class="ec__h">카드를 읽혀주세요</p>
    <div class="ec__cardno">
      ${no.map((v, i) => `<div id="e-no-${i}"${i === 0 && !v ? ' class="is-focus"' : ''}>${v}</div>`).join('')}
    </div>
    <div class="ec__exp">
      <span>유효기간</span><div>${s.exp ? '28' : ''}</div><span>년</span>
      <div>${s.exp ? '09' : ''}</div><span>월</span>
      <span class="ec__barcode">BARCODE</span>
    </div>
    ${s.readerAlert ? ecReaderAlert() : ''}
    <button class="ec__ok" id="e-read-ok">확인</button>
  </div>`)
}

function ecReaderAlert() {
  return `<div class="ec__alert">
    <h4>리더기 등록</h4>
    <p>등록된 리더기가 없습니다.<br>리더기를 등록하시겠습니까?</p>
    <div class="ec__alert-btns">
      <button id="e-reader-no">취소</button>
      <button id="e-reader-yes">확인</button>
    </div>
  </div>`
}

/** 3. 카드번호 입력 — 숫자가 섞인 보안 키패드 (1346:124991) */
function easycheckKeypad(s) {
  const no = s.cardNo || ['4045', '77**', '', '']
  /* 보안 키패드라 숫자 자리가 매번 섞입니다. 연습에서는 디자인과 같은 배열로 고정합니다. */
  const keys = ['9', '4', '5', '8', '0', '2', '6', '1', '3', '확인', '7', '⌫']
  return ecChrome(`<div class="ec__body ec__body--keypad">
    <div class="ec__reader-row">
      <span class="ec__reader-btn">리더기<br>등록</span>
      <p class="ec__h ec__h--inline">카드를 읽혀주세요</p>
    </div>
    <div class="ec__cardno">
      ${no.map((v, i) => `<div>${v}</div>`).join('')}
    </div>
    <div class="ec__exp">
      <span>유효기간</span><div></div><span>년</span><div></div><span>월</span>
      <span class="ec__barcode">BARCODE</span>
    </div>
    <p class="ec__notice">**등록된 리더기() 전원을 켜주세요. 자동연결 됩니다.<br>리더기등록 버튼은 리더기 변경 등록시에만 눌러주세요</p>
    <div class="ec__keypad">
      ${keys
        .map((k) => {
          if (k === '확인') return `<button class="ec__key ec__key--ok" id="e-key-ok">확인</button>`
          if (k === '⌫') return `<button class="ec__key ec__key--del">⌫</button>`
          return `<button class="ec__key">${k}</button>`
        })
        .join('')}
    </div>
  </div>`)
}

/** 4. 금액 확인 (1346:124992) */
function easycheckAmount(s) {
  const amt = s.payNow ?? s.total
  return ecChrome(`<div class="ec__body">
    <div class="ec__amt">
      <div class="ec__amt-row"><b>금액</b><span class="ec__input">${amt.toLocaleString('ko-KR')}<i class="ec__clear">✕</i></span><em>원</em></div>
      <div class="ec__amt-row"><b>부가세</b><span class="ec__input">0</span><em>원</em></div>
      <div class="ec__amt-row"><b>봉사료</b><span class="ec__input">0</span><em>원</em></div>
      <div class="ec__amt-row is-total"><b>합계</b><span class="ec__input">${amt.toLocaleString('ko-KR')}</span><em>원</em></div>
      <div class="ec__amt-row"><b>할부개월</b>
        <span class="ec__seg"><i class="is-on">일시불</i><i>할부</i></span>
        <span class="ec__input ec__input--sm"></span><em>개월</em></div>
    </div>
    <button class="ec__ok" id="e-amount-ok">확인</button>
  </div>`)
}

/**
 * 5. 서명 화면 (1346:124993) — 화면이 가로로 돕니다.
 * 5만원 이하면 서명 없이 «무서명가맹점» 안내만 뜹니다.
 */
function easycheckSign(s) {
  const amt = s.payNow ?? s.total
  const free = amt <= 50000
  return `<div class="ecl">
    <div class="ecl__stage">
      <div class="ecl__rot">
        <div class="ecl__bar">신용구매</div>
        <div class="ecl__side">
          <span>합계 ${amt.toLocaleString('ko-KR')} 원</span>
          <span>일시불</span>
        </div>
        <div class="ecl__pad">
          ${
            free
              ? '<p class="ecl__msg">5만원 이하 무서명가맹점입니다.</p>'
              : '<p class="ecl__msg ecl__msg--sign">여기에 고객 서명을 받아주세요</p>'
          }
        </div>
      </div>
    </div>
  </div>`
}

/** 6. KICC 승인 (1346:124994) */
function kiccSplash() {
  return `<div class="ec">
    <div class="kicc">
      <div class="kicc__logo">KICC</div>
      <div class="kicc__sub">KOREA INFORMATION &amp; COMMUNICATIONS CO. LTD.<br>Total Bridging People &amp; Shop</div>
      <div class="kicc__wait">잠시만 기다려주세요</div>
    </div>
    <div class="ec__indicator"></div>
  </div>`
}

/** 7. 결제완료 (1346:124995) — 여기서 `확인`을 눌러야 부릉플러스에 결과가 넘어갑니다. */
function easycheckDone(s) {
  const amt = s.payNow ?? s.total
  return ecChrome(
    `<div class="ec__body">
      ${ecHead('결제완료')}
      ${ecCard([
        ['TID', '0788888'],
        ['사업자번호', '1168119948'],
        ['가맹점명', '부릉플러스_상점_모바일팀_초'],
        ['카드종류', '현대비자개인'],
        ['카드번호', '4045-77**-****-8513'],
        ['결제방법', '일시불'],
        ['금액', amt.toLocaleString('ko-KR') + ' 원'],
        ['총거래금액', amt.toLocaleString('ko-KR') + ' 원'],
        ['승인번호', '99162820'],
        ['거래일시', '26/05/29 16:28:20'],
        ['매입사', '현대카드'],
        ['알림', 'TEST용'],
      ])}
      <div class="ec__memo"><button class="ec__gray">메모</button></div>
      <div class="ec__foot">
        <button class="ec__gray">SMS보내기</button>
        <button class="ec__gray">전표전송</button>
        <button class="ec__ok ec__ok--inline" id="e-done-ok">확인</button>
      </div>
    </div>`,
    { back: false },
  )
}

/** 응답을 못 받았을 때 부릉플러스가 띄우는 얼럿 */
function ecError(s) {
  return `${detail(s)}
    <div class="dim"></div>
    <div class="alert">
      <h4 class="alert__title">이지체크 앱에 문제가 발생했어요</h4>
      <p class="alert__body">다시 결제를 시도해 주세요. 문제가 계속되면 VCC로 문의해 주세요.<br><br>사유: (에러코드)</p>
      <div class="alert__btns">
        <button class="alert__btn" id="err-close">닫기</button>
        <button class="alert__btn alert__btn--primary" id="err-vcc">VCC 전화연결</button>
      </div>
    </div>`
}

const SCREENS = {
  detail,
  methodSheet,
  cashAlert,
  cardSheet,
  splitSheet,
  progress,
  done,
  kispay,
  kispayLoading,
  kisCashReceipt,
  mainMap,
  taskList,
  payHistory,
  receiptSheet,
  kispayCamera,
  kispayReceipt,
  easycheckShop,
  easycheckRead,
  easycheckKeypad,
  easycheckAmount,
  easycheckSign,
  kiccSplash,
  easycheckDone,
  ecError,
}

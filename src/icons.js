/* 화면에 쓰는 아이콘 — 외부 요청 없이 한 파일로 유지하려고 전부 인라인 SVG입니다. */

/** 누르는 손 (Material `touch_app`) — 화면 안 표시와 시작 모달이 같은 그림을 씁니다. */
const TOUCH = 'M9 11.24V7.5C9 6.12 10.12 5 11.5 5S14 6.12 14 7.5v3.74c1.21-.81 2-2.18 2-3.74C16 5.01 13.99 3 11.5 3S7 5.01 7 7.5c0 1.56.79 2.93 2 3.74zm9.84 4.63-4.54-2.26c-.17-.07-.35-.11-.54-.11H13v-6c0-.83-.67-1.5-1.5-1.5S10 6.67 10 7.5v10.74l-3.43-.72c-.08-.01-.15-.03-.24-.03-.31 0-.59.13-.79.33l-.79.8 4.94 4.94c.27.27.65.44 1.06.44h6.79c.75 0 1.33-.55 1.44-1.28l.75-5.27c.01-.07.02-.14.02-.2 0-.62-.38-1.16-.91-1.38z'

const ICON = {
  /* 누를 자리를 가리키는 손. 밝은 버튼 위에서도 보이도록 흰 면에 검은 선을 둘렀습니다. */
  hand: `<svg class="hand" viewBox="0 0 24 24"><path d="${TOUCH}" fill="#fff" stroke="#1b2432" stroke-width="1.1" stroke-linejoin="round"/></svg>`,

  /* 고객 전화 · 길 찾기 — 디자인은 Material Symbols 아웃라인(call · turn_right)입니다.
   * 비슷하게 그리려 하면 모양이 어긋나서 원본 패스를 그대로 씁니다. */
  phone: `<svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor"><path d="M6.54 5c.06.89.21 1.76.45 2.59l-1.2 1.2c-.41-1.2-.67-2.47-.76-3.79h1.51m9.86 12.02c.85.24 1.72.39 2.6.45v1.49c-1.32-.09-2.59-.35-3.8-.75l1.2-1.19M7.5 3H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.49c0-.55-.45-1-1-1-1.24 0-2.45-.2-3.57-.57a.84.84 0 0 0-.31-.05c-.26 0-.51.1-.71.29l-2.2 2.2a15.149 15.149 0 0 1-6.59-6.59l2.2-2.2c.28-.28.36-.67.25-1.02A11.36 11.36 0 0 1 8.5 4c0-.55-.45-1-1-1z"/></svg>`,

  navi: `<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M7.6 20.4V10.6a2.6 2.6 0 0 1 2.6-2.6h5.1V4.6L21 9.3l-5.7 4.7V10.6h-5.1v9.8z"/></svg>`,

  sms: `<svg viewBox="0 0 20 20" width="15" height="15" fill="none"><rect x="2.5" y="4.5" width="15" height="11" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="m3.5 6 6.5 4.5L16.5 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,

  /** 결제내역 · 현금영수증 — 전표 */
  receipt: `<svg viewBox="0 0 20 20" width="15" height="15" fill="none"><path d="M4.8 3h10.4v14.2l-2-1.3-1.7 1.3L10 15.9l-1.5 1.3-1.7-1.3-2 1.3V3Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M7.6 7.2h4.8M7.6 10.4h4.8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,

  /** VCC 연결 — 헤드셋 */
  vcc: `<svg viewBox="0 0 20 20" width="15" height="15" fill="none"><path d="M4 12V9.5a6 6 0 0 1 12 0V12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><rect x="2.5" y="11" width="3.5" height="5" rx="1.5" fill="currentColor"/><rect x="14" y="11" width="3.5" height="5" rx="1.5" fill="currentColor"/></svg>`,

  /* 결제 수단 아이콘 — 연한 파랑 한 벌. CTA(파란 버튼)와 결제수단 시트가 같은 아이콘을 씁니다
   * (Figma 882:82730 · 882:82319 · 882:82729). */
  cash: `<svg viewBox="0 0 20 20" width="16" height="16"><circle cx="10" cy="10" r="10" fill="#b9d4f7"/><text x="10" y="14.5" text-anchor="middle" font-size="12" font-weight="800" fill="#1b64da">₩</text></svg>`,

  card: `<svg viewBox="0 0 24 20" width="18" height="15"><rect x="1" y="2" width="22" height="16" rx="3" fill="#b9d4f7"/><rect x="1" y="5.5" width="22" height="3.5" fill="#7ea9e8"/><rect x="4.5" y="12" width="7" height="2.8" rx="1.4" fill="#1b64da"/></svg>`,

  /* 분할 — 사각형 세 칸 + 오른쪽 아래 더하기 */
  split: `<svg viewBox="0 0 20 20" width="16" height="16"><rect x="1.5" y="1.5" width="7.4" height="7.4" rx="1.6" fill="#b9d4f7"/><rect x="11.1" y="1.5" width="7.4" height="7.4" rx="1.6" fill="#b9d4f7"/><rect x="1.5" y="11.1" width="7.4" height="7.4" rx="1.6" fill="#b9d4f7"/><path d="M14.8 11.6v6.4M11.6 14.8h6.4" stroke="#1b64da" stroke-width="2.4" stroke-linecap="round"/></svg>`,

  warn: `<svg viewBox="0 0 20 20" width="15" height="15" fill="none"><path d="M8.7 3.6a1.5 1.5 0 0 1 2.6 0l6.4 11.1a1.5 1.5 0 0 1-1.3 2.3H3.6a1.5 1.5 0 0 1-1.3-2.3L8.7 3.6Z" fill="#ffb92e"/><path d="M10 7.6v3.6M10 13.6v.7" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg>`,

  fire: `<svg viewBox="0 0 20 20" width="14" height="14" fill="none"><path d="M10 2.5s.8 2.6-.9 4.4C7.2 8.9 5 9.9 5 12.6a5 5 0 0 0 10 0c0-2.3-1.3-3.5-2.2-5-.9-1.6-2.8-5.1-2.8-5.1Z" fill="#ff6b35"/></svg>`,

  weather: `<svg viewBox="0 0 20 20" width="14" height="14" fill="none"><circle cx="8" cy="8" r="3.2" fill="#ffb300"/><path d="M6 13.5c0-2 1.7-3.5 3.8-3.5 1.8 0 3.3 1.1 3.7 2.7 1.5.1 2.7 1.3 2.7 2.7 0 1.5-1.3 2.6-2.8 2.6H6.6C4.6 18 3 16.6 3 14.8c0-1.6 1.3-2.9 3-3.1Z" fill="#cfd8e3"/></svg>`,

  /* 시작 모달 — 파란 원 안에 같은 손. 작은 표시용 그림을 키우면 비율이 깨지므로 원본 크기로 다시 그립니다. */
  start: `<svg class="start__icon" viewBox="0 0 60 60"><circle cx="30" cy="30" r="30" fill="#1b64da"/><g transform="translate(30 30) scale(1.55) translate(-12.5 -13)"><path d="${TOUCH}" fill="#fff"/></g></svg>`,

  /* 표지 그림 — 카드와 동전. 그림자 위에 둥둥 뜨게 움직입니다(.cover__float).
   * 사람·탈것은 도형으로 그리면 어색해서 결제 소재로 갑니다. */
  cover: `<svg class="cover__art" viewBox="0 0 220 170" fill="none">
    <ellipse class="cover__shadow" cx="110" cy="150" rx="78" ry="11" fill="rgba(0,0,0,.16)"/>
    <g class="cover__float">
      <g transform="rotate(-11 110 78)">
        <rect x="44" y="34" width="132" height="84" rx="12" fill="#fff"/>
        <rect x="44" y="52" width="132" height="15" fill="#1b64da"/>
        <rect x="58" y="84" width="34" height="9" rx="4.5" fill="#c9d9f3"/>
        <rect x="58" y="99" width="62" height="7" rx="3.5" fill="#e3eafa"/>
        <rect x="140" y="82" width="24" height="24" rx="5" fill="#ffd166"/>
        <rect x="140" y="90" width="24" height="3" fill="#e0ab3c"/>
      </g>
      <circle cx="58" cy="118" r="30" fill="#ffd166"/>
      <circle cx="58" cy="118" r="23" fill="#ffe1a0"/>
      <text x="58" y="127" text-anchor="middle" font-size="26" font-weight="800" fill="#b9821f">₩</text>
    </g>
  </svg>`,

  check: `<svg class="outro__check" viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="30" fill="#e3f6ef"/><path d="m20 33 8.5 8.5L44 25" stroke="#009159" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

  download: `<svg viewBox="0 0 20 20" width="15" height="15" fill="none"><path d="M10 3v8.4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="m6.4 8.4 3.6 3.6 3.6-3.6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 14.4v1.1c0 .8.6 1.5 1.4 1.5h9.2c.8 0 1.4-.7 1.4-1.5v-1.1" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>`,

  chev: `<svg class="track__go" viewBox="0 0 20 20" width="18" height="18" fill="none"><path d="m7.5 4.5 6 5.5-6 5.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

  kisLogo: `<svg viewBox="0 0 20 20" width="18" height="18"><rect width="20" height="20" rx="4.5" fill="#1b64da"/><path d="M6.4 4.6h2.3v4.2l3.6-4.2h2.8l-4 4.6 4.2 6h-2.9l-3-4.4-.7.8v3.6H6.4V4.6Z" fill="#fff"/></svg>`,

  /* 이지체크 화면 제목 앞 빨간 자물쇠 */
  ecLock: `<svg viewBox="0 0 24 24" width="19" height="19"><circle cx="12" cy="12" r="11" fill="#e0413a"/><path d="M9.2 11V9.4a2.8 2.8 0 0 1 5.6 0V11" stroke="#fff" stroke-width="1.5" fill="none"/><rect x="7.6" y="10.6" width="8.8" height="7" rx="1.6" fill="#fff"/><circle cx="12" cy="13.6" r="1.1" fill="#e0413a"/><rect x="11.4" y="14" width="1.2" height="2.4" rx=".6" fill="#e0413a"/></svg>`,

  ecDone: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none"><circle cx="12" cy="12" r="10" fill="#e0413a"/><path d="m7.5 12.3 3.2 3.2L16.5 9" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

  kisDone: `<svg class="kis__done-badge" viewBox="0 0 56 56" fill="none"><circle cx="28" cy="28" r="26" fill="#eef1fd"/><path d="m17 28.5 7.5 7.5L39 21" stroke="#5b5fc7" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
}

/* KIS Pay 결제수단 타일 아이콘 */
const KIS_WAY = {
  credit: `<svg viewBox="0 0 30 30" fill="none"><rect x="3" y="7" width="20" height="14" rx="2.5" stroke="#4a4f63" stroke-width="1.6"/><path d="M3 11.5h20" stroke="#4a4f63" stroke-width="1.6"/><rect x="18" y="14" width="9" height="10" rx="2" fill="#fff" stroke="#4a4f63" stroke-width="1.6"/><text x="22.5" y="21" font-size="5" text-anchor="middle" fill="#4a4f63" font-weight="700">PAY</text></svg>`,
  samsung: `<svg viewBox="0 0 30 30" fill="none"><rect x="8" y="3" width="14" height="24" rx="2.5" stroke="#4a4f63" stroke-width="1.6"/><text x="15" y="17" font-size="5.5" text-anchor="middle" fill="#4a4f63" font-weight="700">NFC</text></svg>`,
  camera: `<svg viewBox="0 0 30 30" fill="none"><path d="M4 9V6h4M26 9V6h-4M4 21v3h4M26 21v3h-4" stroke="#4a4f63" stroke-width="1.8" stroke-linecap="round"/><path d="M8 15h14" stroke="#4a4f63" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  bluetooth: `<svg viewBox="0 0 30 30" fill="none"><rect x="7" y="4" width="16" height="22" rx="2.5" stroke="#4a4f63" stroke-width="1.6"/><path d="M13 11h4M13 15h4" stroke="#4a4f63" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  easy: `<svg viewBox="0 0 30 30" fill="none"><rect x="4" y="9" width="22" height="12" rx="6" fill="#00c4b3"/><text x="15" y="17" font-size="6" text-anchor="middle" fill="#fff" font-weight="700">PAY</text></svg>`,
  apple: `<svg viewBox="0 0 30 30" fill="none"><ellipse cx="15" cy="15" rx="10" ry="7" stroke="#4a4f63" stroke-width="1.6"/><circle cx="15" cy="15" r="3" fill="#4a4f63"/></svg>`,
}

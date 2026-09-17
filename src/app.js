/* 연습 진행 엔진 — 시작 화면 → 단계 → 마무리 화면 */

const app = {
  view: 'cover', // cover(표지) | ready(시작 확인) | step | outro
  track: null,
  index: 0,
  typed: 0,
  cleared: new Set(),
  greeted: false, // 시작 안내 모달은 한 번만 봅니다
}

const $ = (sel, root = document) => root.querySelector(sel)
const frame = () => $('#frame')

/* ── 화면 크기 맞추기 ────────────────────────────────────── */

function fit() {
  const w = window.innerWidth
  const h = window.innerHeight
  const phone = w <= 520
  /* 폰에서는 CSS가 화면을 꽉 채우므로 축소하지 않습니다. */
  if (phone) {
    document.documentElement.style.setProperty('--scale', '1')
    return
  }
  // 컨트롤이 프레임 안으로 들어와서 위아래 여백만 빼면 됩니다.
  /* 테두리 8px이 양쪽에 붙으므로 바깥 크기는 376×796입니다. */
  const scale = Math.min((w - 64) / 376, (h - 56) / 796, 1)
  document.documentElement.style.setProperty('--scale', String(Math.max(scale, 0.42)))
}

/* ── 표지 ──────────────────────────────────────────────────
 * 쿠팡이츠·배민 «연습하기»처럼 표지에서 무엇을 연습할지 먼저 고릅니다. */

function renderCover() {
  frame().innerHTML = `<div class="cover">
    <span class="cover__tag">부릉플러스 기사앱</span>
    <p class="cover__hi">만나서 반가워요!</p>
    <h1 class="cover__title">함께 후불결제<br>연습해볼까요?</h1>
    ${ICON.cover}
    <div class="cover__opts">
      ${TRACKS.map((t, i) => {
        const done = app.cleared.has(t.id)
        return `<button class="cover__opt${done ? ' is-done' : ''}" data-track="${i}">
          <span>${t.title} 연습하기</span>
          ${done ? '<i class="cover__check">✓</i>' : ICON.chev}
        </button>`
      }).join('')}
    </div>
    <p class="cover__foot">연습용 화면이라 실제 결제는 일어나지 않아요</p>
    <a class="cover__switch" href="{{OTHER_HREF}}">{{OTHER_LABEL}}</a>
  </div>`

  frame()
    .querySelectorAll('[data-track]')
    .forEach((el) =>
      el.addEventListener('click', () => {
        app.track = TRACKS[+el.dataset.track]
        app.index = 0
        app.typed = 0
        app.view = startView()
        render()
      }),
    )
}

/** 연습을 시작할 때 볼 화면. 안내를 이미 봤으면 곧장 첫 단계로 들어갑니다. */
function startView() {
  return app.greeted ? 'step' : 'ready'
}

/* ── 시작 확인 ─────────────────────────────────────────────
 * 첫 화면 위에 모달을 띄워 «따라 눌러주세요»를 알려주고 시작합니다. */

function renderReady() {
  const first = app.track.steps[0]
  frame().innerHTML = `
    ${topbar()}
    ${band({ q: `${app.track.title} 연습`, a: '준비되면 <b>시작</b>해주세요' })}
    <div class="viewport" id="vp">
      ${SCREENS[first.screen]({ ...first.state })}
      <div class="dim"></div>
      <div class="start">
        ${ICON.start}
        <h2 class="start__title">같이 연습해볼까요?</h2>
        <p class="start__desc">위에 나오는 설명을 보고<br>그대로 따라 눌러주세요</p>
        <p class="start__notice">연습용 화면이라 <b>실제로 돈이 결제되지 않아요</b></p>
        <button class="start__go" id="go">네, 시작할게요</button>
      </div>
    </div>`

  $('#go').addEventListener('click', () => {
    app.greeted = true
    app.view = 'step'
    render()
  })
}

/** 화면 위 안내 띠 */
/**
 * 그 화면이 어느 앱인지 — 화면 이름으로 알아냅니다.
 * 결제 한 건에 앱이 두세 번 바뀌는데, 기사님은 바뀐 줄 모르고 헤맵니다.
 * 바뀌는 단계에서만 화면이 올라오는 효과를 줘서 «다른 앱이구나»를 알립니다.
 */
function appOf(screen) {
  if (/^kis/.test(screen)) return 'kispay'
  if (/^(easycheck|ec|kicc)/.test(screen)) return 'easycheck'
  return 'vroong'
}

function band({ q, a, note, now, total }) {
  const pct = total ? Math.round(((now + 1) / total) * 100) : 0
  return `<div class="band" id="band">
    <div class="band__bar"><i style="width:${pct}%"></i></div>
    <p class="band__q">${q}</p>
    ${total ? `<span class="band__count">${now + 1} / ${total}</span>` : ''}
    <p class="band__a">${a}</p>
    ${note ? `<p class="band__note">${note}</p>` : ''}
  </div>`
}

/* ── 마무리 화면 ─────────────────────────────────────────── */

function renderOutro() {
  const t = app.track
  const next = TRACKS[TRACKS.indexOf(t) + 1]
  /* 결과는 카드 하나로 묶습니다. 흰 덩어리가 둘이면 어느 쪽을 봐야 할지 흩어집니다. */
  frame().innerHTML = `${topbar()}<div class="outro">
    <div class="outro__card">
      ${ICON.check}
      <h2 class="outro__title">${t.title}<br>연습을 마쳤어요</h2>
      <p class="outro__sub">이대로 하시면 돼요</p>
      <div class="recap">
        <p class="recap__h">기억할 것</p>
        ${t.recap.map((r) => `<p class="recap__li">${r}</p>`).join('')}
      </div>
      ${t.apps ? appLinks(t.apps) : ''}
    </div>
    <button class="outro__btn" id="o-next">${next ? `다음 연습 · ${next.title}` : '처음 화면으로'}</button>
    <div class="outro__links">
      <button class="outro__link" id="o-again">이 연습 다시 하기</button>
      ${next ? '<button class="outro__link" id="o-home">처음 화면으로</button>' : ''}
    </div>
  </div>`

  $('#o-next').addEventListener('click', () => {
    if (next) {
      app.track = next
      app.index = 0
      app.typed = 0
      app.view = startView()
    } else {
      app.view = 'cover'
    }
    render()
  })
  $('#o-again').addEventListener('click', () => {
    app.index = 0
    app.typed = 0
    app.view = 'step'
    render()
  })
  /* 마지막 갈래에서는 위 큰 버튼이 이미 «처음 화면으로»라 따로 두지 않습니다. */
  $('#o-home')?.addEventListener('click', () => {
    app.view = 'cover'
    render()
  })
}

/** 마무리 카드 아래 붙는 앱 설치 버튼. 스토어는 새 창에서 엽니다. */
function appLinks(apps) {
  return `<div class="stores">
    <p class="stores__h">앱이 없으면 먼저 설치해주세요</p>
    ${apps
      .map(
        (a) => `<a class="store" href="${a.url}" target="_blank" rel="noopener">
      ${ICON.download}<span>${a.name} 설치</span>
    </a>`,
      )
      .join('')}
  </div>`
}

/* ── 단계 화면 ───────────────────────────────────────────── */

let autoTimer = null

function currentStep() {
  return app.track.steps[app.index]
}

function renderStep() {
  const step = currentStep()
  const state = { ...step.state }
  if (step.type) state.typed = app.typed

  /* 앞 단계와 앱이 다르면 «다른 앱이 열린다»는 걸 몸으로 알 수 있게 화면을 올려 보냅니다. */
  const prev = app.track.steps[app.index - 1]
  const switched = prev && appOf(prev.screen) !== appOf(step.screen)

  frame().innerHTML = `
    ${topbar()}
    ${band({ ...step, now: app.index, total: app.track.steps.length })}
    <div class="viewport${switched ? ' is-switching' : ''}" id="vp">
      ${SCREENS[step.screen](state)}
      ${step.scene ? scene(step.scene) : ''}
    </div>`

  clearTimeout(autoTimer)
  if (step.auto) {
    autoTimer = setTimeout(next, step.auto)
    return
  }
  /* 시트·얼럿이 올라오는 동안 위치를 재면 강조 링이 어긋나므로, 끝나기를 기다립니다.
   * 스피너처럼 끝나지 않는 애니메이션은 빼고 봅니다.
   * 글꼴도 기다립니다 — 늦게 오면 글자가 다시 흘러 버튼이 밀리는데, 그 전에 재면
   * 링이 엉뚱한 곳에 붙습니다. */
  const vp = $('#vp')
  const settling = vp
    .getAnimations({ subtree: true })
    .filter((a) => a.effect?.getTiming().iterations !== Infinity)
    .map((a) => a.finished.catch(() => {}))
  if (document.fonts?.status !== 'loaded') settling.push(document.fonts.ready.catch(() => {}))
  if (settling.length) Promise.all(settling).then(() => app.view === 'step' && placeSpot())
  else placeSpot()
  vp.addEventListener('click', onTap, true)
}

/**
 * 고객이 무엇을 내밀며 뭐라고 하는지 — 첫 단계에서 상황을 먼저 보여줍니다.
 * 어두워진 자리 위에 뜨고, 탭은 막지 않아 아래 버튼을 그대로 누를 수 있습니다.
 */
function scene({ held, say }) {
  return `<div class="scene"><div class="scene__in">
    <p class="scene__say">${say}</p>
    ${customerArt(held)}
  </div></div>`
}

/** 눌러야 할 곳에 파란 테두리와 손 모양을 올려둡니다. */
function placeSpot() {
  const step = currentStep()
  const vp = $('#vp')
  const el = vp.querySelector(step.target)
  if (!el) return

  vp.querySelectorAll('.spot, .hand, .tip').forEach((n) => n.remove())

  /* 화면이 낮으면 눌러야 할 곳이 접혀 있을 수 있습니다. 먼저 보이는 자리로 끌어옵니다. */
  el.scrollIntoView({ block: 'nearest', inline: 'nearest' })

  const box = el.getBoundingClientRect()
  const base = vp.getBoundingClientRect()
  const scale = box.width / el.offsetWidth || 1
  /* .spot은 vp 안에 absolute로 놓이므로, 스크롤한 만큼을 더해야 제자리에 붙습니다. */
  const x = (box.left - base.left) / scale + vp.scrollLeft
  const y = (box.top - base.top) / scale + vp.scrollTop
  const w = box.width / scale
  const h = box.height / scale

  const vw = base.width / scale
  const vh = base.height / scale

  vp.insertAdjacentHTML(
    'beforeend',
    `<div class="spot" style="left:${x - 3}px;top:${y - 3}px;width:${w + 6}px;height:${h + 6}px"></div>`,
  )

  /* 고객 그림은 어둠이 깔린 뒤에 떠오릅니다. 같이 나타나면 무엇이 바뀐 건지
   * 눈이 못 따라갑니다. */
  vp.querySelector('.scene')?.classList.add('is-in')

  /* 누르지 않고 설명만 하는 단계는 손 대신 말풍선을 띄우고 `다음`으로 넘어갑니다. */
  if (step.tip) {
    placeTip(vp, step.tip, { x, y, w, h, vw, vh })
    $('#tip-next').addEventListener('click', next)
    return
  }

  /* 누를 자리는 손 모양으로 알려줍니다 (배민 `연습하기`와 같은 방식).
   * 화면 밖으로 나가면 잘리므로 안쪽으로 당겨 둡니다. */
  const HAND = 46
  const hx = Math.min(x + w - 30, vw - HAND - 10)
  const hy = Math.min(y + h - 16, vh - HAND - 10)

  vp.insertAdjacentHTML(
    'beforeend',
    ICON.hand.replace('class="hand"', `class="hand" style="left:${hx}px;top:${hy}px"`),
  )
}

/** 강조한 자리를 가리키는 말풍선. 자리가 없으면 아래에 붙습니다. */
function placeTip(vp, tip, { x, y, w, h, vw, vh }) {
  const GAP = 14
  const width = Math.min(268, vw - 32)
  const above = y > 170

  const left = Math.min(Math.max(x + w / 2 - width / 2, 12), vw - width - 12)
  const pos = above ? `bottom:${vh - y + GAP}px` : `top:${y + h + GAP}px`
  // 삼각형은 강조한 자리의 가운데를 가리킵니다.
  const arrow = Math.min(Math.max(x + w / 2 - left - 8, 14), width - 30)

  vp.insertAdjacentHTML(
    'beforeend',
    `<div class="tip tip--${above ? 'above' : 'below'}" style="left:${left}px;width:${width}px;${pos}">
      <div class="tip__body">
        <p class="tip__title">${tip.title}</p>
        <p class="tip__desc">${tip.desc}</p>
      </div>
      <button class="tip__next" id="tip-next">다음</button>
      <span class="tip__arrow" style="left:${arrow}px"></span>
    </div>`,
  )
}

/* ── 탭 처리 ─────────────────────────────────────────────── */

function onTap(e) {
  const step = currentStep()
  const vp = $('#vp')

  if (step.type) {
    const key = e.target.closest('.keypad__key, .quick__btn')
    if (key) {
      e.stopPropagation()
      applyKey(key.id, step)
      return
    }
  }

  if (!step.tip && e.target.closest(step.target)) {
    e.stopPropagation()
    next()
    return
  }
  if (step.tip && e.target.closest('#tip-next')) return

  // 다른 곳을 누르면 넘어가지 않고 안내만 한 번 흔들어 줍니다.
  e.stopPropagation()
  const band = $('#band')
  band.classList.remove('is-nudge')
  void band.offsetWidth
  band.classList.add('is-nudge')
}

function applyKey(id, step) {
  const remain = step.state.remain ?? step.state.total
  if (id.startsWith('q-')) {
    app.typed = Math.min(app.typed + +id.slice(2), remain)
  } else if (id === 'k-back') {
    app.typed = Math.floor(app.typed / 10)
  } else {
    const digits = id.slice(2)
    const nextVal = +(String(app.typed) + digits)
    if (nextVal <= 99999999) app.typed = nextVal
  }

  if (app.typed === step.type.expect) {
    next()
    return
  }
  /* 화면을 통째로 다시 그리면 시트가 다시 올라오면서 깜빡이므로 입력한 곳만 고칩니다. */
  refreshSplit(step)
}

/** 분할 시트에서 금액 표시와 결제 버튼 상태만 갱신합니다. */
function refreshSplit(step) {
  const vp = $('#vp')
  const typed = app.typed
  const remain = step.state.remain ?? step.state.total
  const over = typed > remain

  const input = vp.querySelector('.split__input')
  if (!input) return
  input.classList.toggle('is-filled', typed > 0)
  input.innerHTML = typed ? won(typed) : '<i class="split__caret"></i>얼마를 결제할까요?'

  const err = vp.querySelector('.split__err')
  if (err) err.textContent = over ? '남은 금액보다 작게 입력하세요' : ''

  vp.querySelectorAll('.split__btn').forEach((b) => b.classList.toggle('is-on', typed > 0 && !over))
}

function next() {
  app.index += 1
  app.typed = 0
  if (app.index >= app.track.steps.length) {
    app.cleared.add(app.track.id)
    app.view = 'outro'
  }
  render()
}

function back_() {
  if (app.view === 'outro') {
    app.view = 'step'
    app.index = app.track.steps.length - 1
  } else if (app.index > 0) {
    app.index -= 1
  } else {
    app.view = 'cover'
  }
  app.typed = 0
  render()
}

/* ── 프레임 안 맨 위 컨트롤 ───────────────────────────────
 * 기사님이 폰으로 보기 때문에 프레임 밖에 두면 누르기 어렵습니다. */

function topbar() {
  return `<div class="topbar">
    <button class="topbar__btn" id="c-back">← 이전으로</button>
    <button class="topbar__btn" id="c-home">⌂ 처음으로</button>
  </div>`
}

/** topbar()를 넣은 화면에서 불러 버튼을 살립니다. */
function bindTopbar() {
  const back = $('#c-back')
  if (!back) return
  back.addEventListener('click', back_)
  $('#c-home').addEventListener('click', () => {
    clearTimeout(autoTimer)
    app.view = 'cover'
    app.typed = 0
    render()
  })
}

/* ── 그리기 ──────────────────────────────────────────────── */

function render() {
  clearTimeout(autoTimer)
  if (app.view === 'cover') renderCover()
  else if (app.view === 'ready') renderReady()
  else if (app.view === 'outro') renderOutro()
  else renderStep()
  bindTopbar()
}

/* 창 크기가 바뀌면 글자가 다시 흘러 버튼이 움직이므로 링도 다시 잡습니다. */
window.addEventListener('resize', () => {
  fit()
  if (app.view === 'step' && !currentStep().auto) placeSpot()
})

window.addEventListener('orientationchange', fit)
fit()
render()

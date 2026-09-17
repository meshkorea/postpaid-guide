/* src의 조각들을 한 장짜리 HTML로 합칩니다. 외부 요청이 없는 단일 파일이라
 * 파일만 열어도, 어디에 올려도 그대로 돕니다.
 *
 * 연습이 앞으로 늘어날 수 있어 갈래마다 폴더를 둡니다.
 * 안드로이드와 아이폰은 흐름이 아예 달라서 한쪽을 다른 쪽 안에 넣지 않습니다.
 *   docs/postpaid-android/index.html  후불결제 · 안드로이드
 *   docs/postpaid-ios/index.html      후불결제 · 아이폰
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(fileURLToPath(import.meta.url))
const read = (p) => readFileSync(join(root, p), 'utf8')

/* 지도는 실제 앱 캡처라 이미지가 필요합니다. 외부 요청 없이 한 파일로 두려고
 * data URI로 심어 넣습니다 (src/assets/map.jpg). */
const mapDataUri =
  'data:image/jpeg;base64,' + readFileSync(join(root, 'src/assets/map.jpg')).toString('base64')

const shell = read('src/shell.html')

function build({ out, css, js, title, desc }) {
  const bundle = js
    .map(read)
    .join('\n')
    .replace("'{{MAP}}'", () => JSON.stringify(mapDataUri))

  const html = shell
    .replace('/*{{CSS}}*/', () => css.map(read).join('\n'))
    .replace('/*{{JS}}*/', () => bundle)
    .replace('<title>후불결제 연습하기</title>', () => `<title>${title}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, () => `<meta name="description" content="${desc}"`)

  mkdirSync(join(root, dirname(out)), { recursive: true })
  writeFileSync(join(root, out), html)

  /* 갈아끼우기가 조용히 실패하면 화면이 엉뚱하게 나가므로 여기서 잡습니다. */
  if (!html.includes(`<title>${title}</title>`)) throw new Error(`제목이 안 바뀜: ${out}`)
  if (html.includes('{{MAP}}')) throw new Error(`지도가 안 심김: ${out}`)

  console.log(`${out} — ${(Buffer.byteLength(html) / 1024).toFixed(0)}KB`)
}

/* ── 안드로이드 ────────────────────────────────────────── */
build({
  out: 'docs/postpaid-android/index.html',
  css: ['src/base.css', 'src/screens.css'],
  js: ['src/icons.js', 'src/screens.js', 'src/steps.js', 'src/app.js'],
  title: '후불결제 연습하기',
  desc: '부릉플러스 기사앱 후불결제를 손으로 따라 해보는 연습 화면입니다. 현금·카드(KIS Pay·이지체크)·분할 결제와 현금영수증 발급을 단계별로 익힐 수 있어요.',
})

/* ── 아이폰 ────────────────────────────────────────────
 * icons·screens는 안드로이드 것을 먼저 읽고 그 위에 iOS 것을 얹습니다.
 * steps는 갈래가 아예 달라서 iOS 것만 씁니다. */
build({
  out: 'docs/postpaid-ios/index.html',
  css: ['src/base.css', 'src/screens.css', 'src-ios/screens.css'],
  js: [
    'src/icons.js',
    'src-ios/icons.js',
    'src/screens.js',
    'src-ios/screens.js',
    'src-ios/steps.js',
    'src/app.js',
  ],
  title: '후불결제 연습하기 (아이폰)',
  desc: '부릉플러스 기사앱 후불결제를 손으로 따라 해보는 연습 화면입니다(아이폰). 현금·카드(이지체크)·QR 간편·분할 결제를 단계별로 익힐 수 있어요.',
})

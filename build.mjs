/* src의 조각들을 dist/index.html 한 장으로 합칩니다. 외부 요청이 없는 단일 파일이라
 * 파일만 열어도, 어디에 올려도 그대로 돕니다. */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(fileURLToPath(import.meta.url))
const read = (p) => readFileSync(join(root, p), 'utf8')

const css = ['src/base.css', 'src/screens.css'].map(read).join('\n')

/* 지도는 실제 앱 캡처라 이미지가 필요합니다. 외부 요청 없이 한 파일로 두려고
 * data URI로 심어 넣습니다 (src/assets/map.jpg). */
const mapDataUri =
  'data:image/jpeg;base64,' + readFileSync(join(root, 'src/assets/map.jpg')).toString('base64')

const js = ['src/icons.js', 'src/screens.js', 'src/steps.js', 'src/app.js']
  .map(read)
  .join('\n')
  .replace("'{{MAP}}'", () => JSON.stringify(mapDataUri))

const html = read('src/shell.html')
  .replace('/*{{CSS}}*/', () => css)
  .replace('/*{{JS}}*/', () => js)

mkdirSync(join(root, 'dist'), { recursive: true })
writeFileSync(join(root, 'dist/index.html'), html)

console.log(`dist/index.html — ${(Buffer.byteLength(html) / 1024).toFixed(0)}KB`)

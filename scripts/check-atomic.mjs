// Проверка зависимостей атомарной структуры: компонент не может использовать компоненты более высокого уровня.
// Уровни: atoms (0) < molecules (1) < organisms (2) < templates (3). Запуск: bun run check:atomic
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, basename } from 'node:path'

const root = new URL('../app/components/', import.meta.url).pathname
const levels = ['atoms', 'molecules', 'organisms', 'templates']

function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f)
    return statSync(p).isDirectory() ? walk(p) : p.endsWith('.vue') ? [p] : []
  })
}

// имя компонента -> уровень
const levelOf = new Map()
const files = []
levels.forEach((level, i) => {
  let dir
  try { dir = walk(join(root, level)) } catch { return }
  for (const file of dir) {
    levelOf.set(basename(file, '.vue'), i)
    files.push({ file, level: i, name: basename(file, '.vue') })
  }
})

const errors = []
for (const { file, level, name } of files) {
  const src = readFileSync(file, 'utf8')
  const template = src.match(/<template[^>]*>([\s\S]*)<\/template>/)?.[1] ?? ''
  const used = new Set([...template.matchAll(/<([A-Z][A-Za-z0-9]+)[\s>/]/g)].map(m => m[1]))
  for (const u of used) {
    const l = levelOf.get(u)
    if (l !== undefined && l > level) {
      errors.push(`${levels[level]}/${name} использует ${u} (${levels[l]}): зависимость вверх запрещена`)
    }
  }
}

if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}
console.log(`Атомарная структура в порядке: ${files.length} компонентов проверено`)

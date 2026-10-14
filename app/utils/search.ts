export interface TextPart {
  text: string
  match: boolean
}

/** Делит текст на части, выделяя первое вхождение запроса без учёта регистра («Телевизоры», «Те» → «Те» + «левизоры») */
export function highlightParts(text: string, query: string): TextPart[] {
  const q = query.trim()
  const at = q ? text.toLowerCase().indexOf(q.toLowerCase()) : -1
  if (at < 0) return [{ text, match: false }]
  return [
    { text: text.slice(0, at), match: false },
    { text: text.slice(at, at + q.length), match: true },
    { text: text.slice(at + q.length), match: false }
  ].filter(p => p.text)
}

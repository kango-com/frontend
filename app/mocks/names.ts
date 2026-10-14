import { dictionary } from '~/utils/dict'

/** Все варианты названия (русский, английский, иврит) в нижнем регистре: поиск работает на любом языке интерфейса */
export function nameVariants(ru: string): string[] {
  const d = dictionary[ru]
  return [ru, d?.en, d?.he].filter((x): x is string => !!x).map(x => x.toLowerCase())
}

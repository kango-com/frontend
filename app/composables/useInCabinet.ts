import type { InjectionKey } from 'vue'

const KEY: InjectionKey<boolean> = Symbol('in-cabinet')

/** Оболочка кабинета сообщает вложенным блокам, что они внутри неё (свой заголовок, без второго контейнера) */
export const provideInCabinet = () => provide(KEY, true)
export const useInCabinet = () => inject(KEY, false)

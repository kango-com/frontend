import type { AdStatus, Price } from './ad'

/** Собеседник в диалоге */
export interface ChatPeer {
  id: string
  name: string
  avatarUrl?: string
  online: boolean
}

/** Объявление, по которому идёт диалог (краткие данные для шапки и списка) */
export interface ChatAdRef {
  id: string
  title: string
  image?: string
  price: Price
  status: AdStatus
}

export interface ChatMessage {
  id: string
  dialogId: string
  authorId: string
  text: string
  /** ISO-дата */
  createdAt: string
  /** Собеседник прочитал (для своих сообщений) */
  read: boolean
}

/** Диалог по объявлению между двумя пользователями: один на пару «пользователь - объявление» (Договор, Прил. 1, п. 7.2) */
export interface Dialog {
  id: string
  ad: ChatAdRef
  peer: ChatPeer
  /** Я автор объявления (мне пишут) или покупатель/соискатель (пишу я) */
  role: 'author' | 'client'
  lastMessage?: ChatMessage
  unread: number
  /** Я заблокировал собеседника */
  blockedByMe: boolean
  /** Собеседник заблокировал меня: писать нельзя */
  blockedMe: boolean
  updatedAt: string
}

export type MessageReportReason = 'spam' | 'fraud' | 'insult' | 'other'

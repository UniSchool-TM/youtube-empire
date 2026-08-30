import { GameState, Notification } from '../../types'
import { genId } from './videoSystem'

export function pushNotification(s: GameState, n: Omit<Notification, 'id' | 'time' | 'read'>): GameState {
  return {
    ...s,
    notifications: [...s.notifications.slice(-20), { ...n, id: genId('n'), time: Date.now(), read: false }],
    unreadNotifications: s.unreadNotifications + 1,
  }
}

export function pushError(s: GameState, title: string, message: string): GameState {
  return pushNotification(s, { type: 'error', title: title || 'ERROR', message })
}

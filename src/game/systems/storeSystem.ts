import { GameState, EquipmentCategory } from '../../types'
import { getEquip } from '../../data/equipment'

export function buyEquipment(s: GameState, category: EquipmentCategory, equipId: string): GameState {
  const equip = getEquip(equipId)
  if (!equip) return s
  if (s.money < equip.price) return pushError(s, 'NOT ENOUGH FUNDS')
  if (s.ownedEquipment.includes(equipId)) return s
  return {
    ...s,
    money: s.money - equip.price,
    ownedEquipment: [...s.ownedEquipment, equipId],
    equipment: { ...s.equipment, [category]: equipId },
  }
}

export function equipItem(s: GameState, category: EquipmentCategory, equipId: string): GameState {
  if (!s.ownedEquipment.includes(equipId)) return s
  return { ...s, equipment: { ...s.equipment, [category]: equipId } }
}

export function pushError(s: GameState, msg: string): GameState {
  return {
    ...s,
    notifications: [...s.notifications.slice(-20), {
      id: Math.random().toString(36).slice(2),
      type: 'error', title: 'INSUFFICIENT FUNDS', message: msg, time: Date.now(), read: false,
    }],
    unreadNotifications: s.unreadNotifications + 1,
  }
}

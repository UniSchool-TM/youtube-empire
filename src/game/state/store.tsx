import { createContext, useContext, useReducer } from 'react'
import { GameState, EquipmentCategory } from '../../types'
import { initialState } from './initialState'
import { genId } from '../systems/videoSystem'
import { getIdea } from '../../data/videoIdeas'
import { getEquip, EQUIPMENT } from '../../data/equipment'
import { getSubscription } from '../../data/subscriptions'
import { getSkill, SKILLS } from '../../data/skills'
import { ACHIEVEMENTS } from '../../data/achievements'
import { tick, startProduction, advanceProduction, publishVideo, applyMonetization, resolveEvent, hireEmployee, fireEmployee, openChannel } from '../systems/gameEngine'
import { buyEquipment, equipItem } from '../systems/storeSystem'
import { subscribe, unsubscribe } from '../systems/subscriptionSystem'
import { buySkill } from '../systems/skillSystem'

export type Action =
  | { type: 'TICK' }
  | { type: 'START_PRODUCTION'; ideaId: string }
  | { type: 'ADVANCE_PRODUCTION_TICK' }
  | { type: 'PUBLISH_VIDEO' }
  | { type: 'BUY_EQUIPMENT'; category: EquipmentCategory; equipId: string }
  | { type: 'EQUIP_ITEM'; category: EquipmentCategory; equipId: string }
  | { type: 'SUBSCRIBE'; subId: string }
  | { type: 'UNSUBSCRIBE'; subId: string }
  | { type: 'BUY_SKILL'; skillId: string }
  | { type: 'SELECT_IDEA'; ideaId: string | null }
  | { type: 'APPLY_MONETIZATION' }
  | { type: 'RESOLVE_EVENT'; eventId: string; choiceIndex: number }
  | { type: 'DISMISS_NOTIFICATION'; id: string }
  | { type: 'MARK_NOTIFICATIONS_READ' }
  | { type: 'SET_CHANNEL_NAME'; name: string }
  | { type: 'HIRE_EMPLOYEE'; role: string }
  | { type: 'FIRE_EMPLOYEE'; id: string }
  | { type: 'OPEN_CHANNEL' }
  | { type: 'NEXT_DAY' }
  | { type: 'LOAD'; state: GameState }
  | { type: 'TUTORIAL_STEP'; step: number }

const REDUCERS: Partial<Record<Action['type'], (s: GameState, a: any) => GameState>> = {
  LOAD: (s, a) => ({ ...a.state }),
  NEXT_DAY: (s) => ({ ...s, day: s.day + 1 }),
  SET_CHANNEL_NAME: (s, a) => ({ ...s, channelName: a.name }),
  TUTORIAL_STEP: (s, a) => ({ ...s, tutorialStep: a.step }),
}

export interface GameContextValue {
  state: GameState
  dispatch: React.Dispatch<Action>
}

export const GAME_CONTEXT = createContext<GameContextValue | null>(null)

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState)

  return (
    <GAME_CONTEXT.Provider value={{ state, dispatch }}>
      {children}
    </GAME_CONTEXT.Provider>
  )
}

export function reducer(state: GameState, action: Action): GameState {
  const handler = REDUCERS[action.type]
  if (handler) return handler(state, action)
  switch (action.type) {
    case 'TICK': return tick(state)
    case 'START_PRODUCTION': return startProduction(state, action.ideaId)
    case 'ADVANCE_PRODUCTION_TICK': return advanceProduction(state)
    case 'PUBLISH_VIDEO': return publishVideo(state)
    case 'BUY_EQUIPMENT': return buyEquipment(state, action.category, action.equipId)
    case 'EQUIP_ITEM': return equipItem(state, action.category, action.equipId)
    case 'SUBSCRIBE': return subscribe(state, action.subId)
    case 'UNSUBSCRIBE': return unsubscribe(state, action.subId)
    case 'BUY_SKILL': return buySkill(state, action.skillId)
    case 'SELECT_IDEA': return { ...state, selectedIdeaId: action.ideaId }
    case 'APPLY_MONETIZATION': return applyMonetization(state)
    case 'RESOLVE_EVENT': return resolveEvent(state, action.eventId, action.choiceIndex)
    case 'DISMISS_NOTIFICATION': return dismissNotification(state, action.id)
    case 'MARK_NOTIFICATIONS_READ': return { ...state, unreadNotifications: 0, notifications: state.notifications.map((n) => ({ ...n, read: true })) }
    case 'HIRE_EMPLOYEE': return hireEmployee(state, action.role)
    case 'FIRE_EMPLOYEE': return fireEmployee(state, action.id)
    case 'OPEN_CHANNEL': return openChannel(state)
    default: return state
  }
}

// ------------- helper -------------
function dismissNotification(s: GameState, id: string): GameState {
  return {
    ...s,
    notifications: s.notifications.filter((n) => n.id !== id),
    unreadNotifications: Math.max(0, s.unreadNotifications - (s.notifications.find((n) => n.id === id)?.read ? 0 : 1)),
  }
}

export function useGame(): GameContextValue {
  const ctx = useContext(GAME_CONTEXT)
  if (!ctx) throw new Error('useGame must be used within GameProvider')
  return ctx
}

export { pushNotification } from '../systems/notifications'

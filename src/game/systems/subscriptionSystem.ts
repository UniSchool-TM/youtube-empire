import { GameState } from '../../types'
import { getSubscription } from '../../data/subscriptions'

export function subscribe(s: GameState, subId: string): GameState {
  if (s.subscriptions.includes(subId)) return s
  return { ...s, subscriptions: [...s.subscriptions, subId] }
}

export function unsubscribe(s: GameState, subId: string): GameState {
  if (!s.subscriptions.includes(subId)) return s
  return { ...s, subscriptions: s.subscriptions.filter((x) => x !== subId) }
}

export function monthlySubscriptionCost(s: GameState): number {
  let cost = 0
  for (const id of s.subscriptions) cost += getSubscription(id)?.monthlyCost ?? 0
  return cost
}

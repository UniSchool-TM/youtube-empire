import { Era, GameEvent, GameState } from '../types'

export const ERAS: Era[] = [
  { id: 'early', name: 'EARLY VIDEO ERA', unlockedDay: 1, description: 'Video as we know it is new. Relates cook and experimental.' },
  { id: 'boom', name: 'CREATOR BOOM', unlockedDay: 30, description: 'Creators go mainstream. Competition heats up, views grow.' },
  { id: 'shortform', name: 'SHORT FORM ERA', unlockedDay: 90, description: 'Short-form content dominates attention.' },
  { id: 'ai', name: 'AI ERA', unlockedDay: 200, description: 'AI tools transform production speed.' },
  { id: 'future', name: 'FUTURE ERA', unlockedDay: 400, description: 'The platform reaches a new frontier.' },
]

export function getEra(day: number): Era {
  let current = ERAS[0]
  for (const e of ERAS) {
    if (day >= e.unlockedDay) current = e
  }
  return current
}

export const EVENTS: GameEvent[] = [
  {
    id: 'sponsor_offer', title: 'SPONSOR OFFER', weight: () => (5),
    description: 'A brand wants to sponsor your next video for ¥50,000.',
    choices: [
      { label: 'Accept the deal', hint: '+¥50,000, slightly scripted', effects: { money: 50000 } },
      { label: 'Negotiate higher', hint: '50% chance of ¥80,000', effects: { money: 0 } },
      { label: 'Decline', hint: 'Keeps creative freedom', effects: {} },
    ],
  },
  {
    id: 'algorithm', title: 'ALGORITHM UPDATE', weight: (s) => (s.videos.length ? 6 : 0),
    description: 'The platform changed how videos get recommended.',
    choices: [
      { label: 'Adapt content strategy', hint: 'Tailor to new algorithm', effects: { quality: 8 } },
      { label: 'Ride it out', hint: 'Risky but quick', effects: {} },
    ],
  },
  {
    id: 'copyright', title: 'COPYRIGHT CLAIM', weight: (s) => (s.videos.length ? 7 : 0),
    description: 'One of your videos got a copyright claim. Revenue on it is frozen.',
    choices: [
      { label: 'Dispute the claim', hint: '50% reclaimed revenue', effects: { reputation: 5 } },
      { label: 'Edit around it', hint: 'Spend time, keep video', effects: { quality: -5 } },
      { label: 'Let it go', hint: 'Accept the lost revenue', effects: {} },
    ],
  },
  {
    id: 'neg_publicity', title: 'NEGATIVE PUBLICITY', weight: (s) => (s.subscribers > 1000 ? 5 : 0),
    description: 'A controversy is spreading about a past video.',
    choices: [
      { label: 'Address it publicly', hint: '-Subscribers short-term, +reputation', effects: {} },
      { label: 'Stay quiet', hint: 'It may blow over', effects: { reputation: -5 } },
    ],
  },
  {
    id: 'equip_failure', title: 'EQUIPMENT FAILURE', weight: () => (6),
    description: 'Your equipment is acting up mid-production.',
    choices: [
      { label: 'Repair it now', hint: 'Spend ¥15,000', effects: { money: -15000 } },
      { label: 'Make do', hint: 'Lower quality this round', effects: { quality: -8 } },
    ],
  },
  {
    id: 'trend_change', title: 'TREND SHIFT', weight: (s) => (s.videos.length ? 5 : 0),
    description: 'A new trending topic is blowing up. Everyone is watching.',
    choices: [
      { label: 'Pivot to the trend', hint: 'Content adapts to trend', effects: { views: 4000 } },
      { label: 'Stay on strategy', hint: 'Maintain quality', effects: { quality: 5 } },
    ],
  },
  {
    id: 'team_problem', title: 'TEAM DISPUTE', weight: (s) => (s.employees.length ? 8 : 0),
    description: 'A staff member is unhappy with their workload.',
    choices: [
      { label: 'Give a bonus', hint: 'Spend ¥20,000, +morale', effects: { money: -20000 } },
      { label: 'Rally the team', hint: 'Free, morale boost', effects: {} },
      { label: 'Ignore it', hint: 'Risk of leaving', effects: { morale: -10 } },
    ],
  },
  {
    id: 'viral_chance', title: 'COLLAB OFFER', weight: (s) => (s.subscribers > 1000 ? 4 : 0),
    description: 'A bigger creator invites you to collaborate.',
    choices: [
      { label: 'Collab now', hint: '+Subscribers, takes time', effects: { subscribers: 500, quality: 3 } },
      { label: 'Decline', hint: 'Focus on your channel', effects: {} },
    ],
  },
]

export function eventWeight(e: GameEvent, s: GameState): number {
  try { return e.weight(s) } catch { return 0 }
}

import { GameState } from '../../types'
import { getSkill } from '../../data/skills'

export function buySkill(s: GameState, skillId: string): GameState {
  const skill = getSkill(skillId)
  if (!skill) return s
  const current = s.skills[skillId] ?? 0
  if (current >= skill.maxLevel) return s
  // need previous tree levels? simple: pay cost
  const cost = skill.cost(current)
  if (s.money < cost) return s
  // skill points gated by tree mastery - just buy with money for simplicity
  return {
    ...s,
    money: s.money - cost,
    skills: { ...s.skills, [skillId]: current + 1 },
  }
}

export function skillCost(s: GameState, skillId: string): number {
  const skill = getSkill(skillId)
  if (!skill) return 0
  const current = s.skills[skillId] ?? 0
  return skill.cost(current)
}

export function skillCurrent(s: GameState, skillId: string): number {
  return s.skills[skillId] ?? 0
}

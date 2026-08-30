import { GameState, Video, VideoIdea, GrowthCurve } from '../../types'
import { EQUIPMENT, equipById } from '../../data/equipment'
import { getSubscription } from '../../data/subscriptions'
import { getSkill } from '../../data/skills'
import { SKILLS } from '../../data/skills'
import { pickGrowthCurve } from '../../data/videoIdeas'

export interface ComputedStats {
  editingSpeed: number
  quality: number
  crashChance: number
  videoQuality: number
  audioQuality: number
  design: number
}

export function computeStats(s: GameState): ComputedStats {
  const base: ComputedStats = {
    editingSpeed: 100, quality: 0, crashChance: 100,
    videoQuality: 40, audioQuality: 40, design: 0,
  }
  // equipment
  for (const cat of Object.keys(s.equipment) as (keyof typeof s.equipment)[]) {
    const eq = equipById(s.equipment[cat])
    if (eq) applyStats(base, eq.stats)
  }
  // subscriptions
  for (const subId of s.subscriptions) {
    const sub = getSubscription(subId)
    if (sub) applyStats(base, sub.effects)
  }
  // skills
  for (const skill of SKILLS) {
    const lvl = s.skills[skill.id] ?? 0
    if (lvl <= 0) continue
    if (skill.id === 'cut_speed') base.editingSpeed += lvl * 10
    if (skill.id === 'advanced_editing') { base.editingSpeed += lvl * 15; base.quality += lvl * 4 }
    if (skill.id === 'effects') base.quality += lvl * 5
    if (skill.id === 'color') base.quality += lvl * 4
    if (skill.id === 'text') base.quality += lvl * 3
    if (skill.id === 'seo') base.quality += lvl * 2
  }
  // employees boost
  const editor = s.employees.find((e) => e.role === 'editor')
  const designer = s.employees.find((e) => e.role === 'designer')
  if (editor) {
    base.editingSpeed += editor.efficiency * 0.4
    base.quality += editor.quality * 0.25
  }
  if (designer) {
    base.design += designer.quality * 0.6
    base.quality += designer.quality * 0.15
  }
  return base
}

function applyStats(target: ComputedStats, stats: Record<string, unknown> | undefined) {
  if (!stats) return
  if (typeof stats.editingSpeed === 'number') target.editingSpeed = (target.editingSpeed * stats.editingSpeed) / 100
  if (typeof stats.quality === 'number') target.quality += stats.quality
  if (typeof stats.crashChance === 'number') target.crashChance = (target.crashChance * stats.crashChance) / 100
  if (typeof stats.videoQuality === 'number') target.videoQuality = Math.max(target.videoQuality, stats.videoQuality)
  if (typeof stats.audioQuality === 'number') target.audioQuality = Math.max(target.audioQuality, stats.audioQuality)
  if (typeof stats.design === 'number') target.design += stats.design
}

export function computeVideoQuality(s: GameState, idea: VideoIdea): number {
  const stats = computeStats(s)
  const base =
    stats.quality * 0.4 +
    (stats.videoQuality * 0.3) +
    (stats.audioQuality * 0.15) +
    (stats.design * 0.15)
  const ideaFactor = idea.interest * 2 + idea.potential * 2
  return Math.min(100, base * 0.5 + ideaFactor * 3 + 10)
}

export interface IdeaChoice {
  idea: VideoIdea
  quality: number
}

export function monthlyCosts(s: GameState): number {
  let cost = 0
  for (const subId of s.subscriptions) {
    cost += getSubscription(subId)?.monthlyCost ?? 0
  }
  for (const emp of s.employees) cost += emp.salary
  return cost
}

export function getActiveSubscriptions(s: GameState) {
  return s.subscriptions.map((id) => getSubscription(id)).filter(Boolean)
}

export function skillLevel(s: GameState, id: string): number {
  return s.skills[id] ?? 0
}

export function canPublish(s: GameState): boolean {
  return !!s.production && s.production.currentStage >= s.production.stages.length - 1
}

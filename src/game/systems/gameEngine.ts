import { GameState, Video, ProductionProcess, ProductionStage, Employee, EmployeeRole } from '../../types'
import { getIdea } from '../../data/videoIdeas'
import { computeStats } from './stats'
import { createVideo, tickVideoGrowth, genId } from './videoSystem'
import { pushNotification } from './notifications'
import { getSubscription } from '../../data/subscriptions'
import { ACHIEVEMENTS } from '../../data/achievements'
import { EVENTS, eventWeight } from '../../data/events'
import { getEra } from '../../data/events'

const STAGES: { id: ProductionStage; name: string }[] = [
  { id: 'IDEA', name: 'IDEA' },
  { id: 'RESEARCH', name: 'RESEARCH' },
  { id: 'SCRIPT', name: 'SCRIPT' },
  { id: 'RECORD', name: 'RECORD' },
  { id: 'EDIT', name: 'EDIT' },
  { id: 'THUMBNAIL', name: 'THUMBNAIL' },
  { id: 'PUBLISH', name: 'PUBLISH' },
]

export function startProduction(s: GameState, ideaId: string): GameState {
  const idea = getIdea(ideaId)
  if (!idea) return s
  if (s.production) return s
  const stats = computeStats(s)
  const baseTime = idea.productionTime
  return {
    ...s,
    selectedIdeaId: ideaId,
    production: {
      videoId: genId('prod'),
      ideaId: idea.id,
      title: idea.title,
      tag: idea.tag,
      stages: STAGES.map((st, i) => {
        const duration = stageDuration(st.id, baseTime, stats, s)
        return { id: st.id, name: st.name, progress: 0, done: false, durationTicks: duration }
      }),
      currentStage: 0,
      startedTick: s.day * 24 + s.hour,
    },
    tutorialStep: Math.max(s.tutorialStep, 1),
  }
}

function stageDuration(stage: ProductionStage, baseTime: number, stats: { editingSpeed: number }, s: GameState): number {
  const speedFactor = stats.editingSpeed / 100
  const baseFactor =
    stage === 'IDEA' ? 0.5 :
    stage === 'RESEARCH' ? 1.0 :
    stage === 'SCRIPT' ? 1.2 :
    stage === 'RECORD' ? 1.5 :
    stage === 'EDIT' ? 2.5 :
    stage === 'THUMBNAIL' ? 0.8 : 0.2
  return Math.max(1, Math.round((baseTime * baseFactor) / speedFactor * 2))
}

export function advanceProduction(s: GameState): GameState {
  if (!s.production) return s
  let p = s.production
  const stats = computeStats(s)
  const stages = p.stages.map((st, i) => {
    if (i < p.currentStage) return st
    if (i > p.currentStage) return st
    const progress = st.progress + workPerTick(st.id, stats)
    if (progress >= 100) {
      return { ...st, progress: 100, done: true }
    }
    return { ...st, progress }
  })

  const idx = p.currentStage
  let currentStage = p.currentStage
  if (stages[idx]?.done) {
    if (idx === stages.length - 1) {
      // ready to publish
      return { ...s, production: { ...p, stages } }
    }
    currentStage = idx + 1
  }
  return { ...s, production: { ...p, stages, currentStage } }
}

function workPerTick(stage: ProductionStage, stats: { editingSpeed: number }): number {
  const speed = stats.editingSpeed / 100
  return 6 * speed
}

export function publishVideo(s: GameState): GameState {
  if (!s.production) return s
  const prod = s.production
  if (prod.currentStage < prod.stages.length - 1 || !prod.stages[prod.stages.length - 1].done) return s
  const idea = getIdea(prod.ideaId)
  if (!idea) { return { ...s, production: null } }
  const video = createVideo(s, idea, prod.title)

  let nextState: GameState = {
    ...s,
    videos: [video, ...s.videos],
    stats: { ...s.stats, videosCreated: s.stats.videosCreated + 1 },
    production: null,
    selectedIdeaId: null,
    totalViews: s.totalViews,
  }
  nextState = checkAchievements(nextState)
  nextState = pushNotification(nextState, {
    type: 'success', title: 'VIDEO PUBLISHED', message: `"${video.title}" is now live.`,
  })
  if (video.growthCurve === 'viral') {
    nextState = pushNotification(nextState, {
      type: 'viral', title: 'VIRAL SIGNATURE', message: 'This video has viral potential.',
    })
  }
  if (nextState.stats.videosCreated === 1) {
    nextState = setTutorial(video.id as unknown as GameState, 2)
  }
  return nextState
}

function setTutorial(s: GameState, n: number): GameState {
  return { ...s, tutorialStep: Math.max(s.tutorialStep, n) }
}

export function tick(s: GameState): GameState {
  let ns: GameState = { ...s }
  const production = s.production
  if (production) {
    ns = advanceProduction({ ...s })
  }
  ns = applyVideoGrowth(ns)
  ns = advanceDay(ns)
  ns = maybeTriggerEvent(ns)
  ns = checkAchievements(ns)
  return ns
}

function applyVideoGrowth(s: GameState): GameState {
  if (s.videos.length === 0) return s
  let totalSubs = 0
  let totalRev = 0
  let viralHappened = false
  let viralName = ''
  const videos = s.videos.map((v) => {
    const res = tickVideoGrowth(s, v)
    totalSubs += res.subs
    totalRev += res.revenue
    if (res.viral) { viralHappened = true; viralName = v.title }
    return v
  })
  let ns: GameState = {
    ...s,
    videos,
    subscribers: s.subscribers + totalSubs,
    totalRevenue: s.totalRevenue + totalRev,
    money: s.money + totalRev,
    totalViews: videos.reduce((a, v) => a + v.views, 0),
  }

  if (viralHappened) {
    ns = pushNotification(ns, { type: 'viral', title: 'TRAFFIC SPIKE', message: `"${viralName}" is blowing up!` })
    ns = { ...ns, reputation: Math.min(100, ns.reputation + 2) }
  }
  return ns
}

function advanceDay(s: GameState): GameState {
  let hour = s.hour + 1
  let day = s.day
  let paid = false
  if (hour >= 24) {
    hour = 0
    day = s.day + 1
  }
  const isNewDay = day !== s.day
  let ns: GameState = { ...s, hour, day }
  if (isNewDay) {
    // monthly costs on same day of month
    if (day % 28 === 0) {
      const cost = monthlyCost(s)
      ns = { ...ns, money: ns.money - cost }
      if (cost > 0) ns = pushNotification(ns, { type: 'warning', title: 'MONTHLY COSTS', message: `Paid ¥${cost.toLocaleString()} for subscriptions & staff.` })
      paid = true
    }
    ns = { ...ns, eventCooldown: Math.max(0, ns.eventCooldown - 1) }
    ns.analytics = [...ns.analytics.slice(-120), { views: ns.totalViews, subscribers: ns.subscribers, revenue: ns.totalRevenue, balance: ns.money, watchTime: totalWatchTime(ns), newSubscribers: 0 }]
  }
  return ns
}

function totalWatchTime(s: GameState): number {
  return s.videos.reduce((a, v) => a + v.watchTime, 0)
}

function monthlyCost(s: GameState): number {
  let c = 0
  for (const id of s.subscriptions) c += getSubscription(id)?.monthlyCost ?? 0
  for (const emp of s.employees) c += emp.salary
  return c
}

function maybeTriggerEvent(s: GameState): GameState {
  if (s.videos.length === 0) return s
  if (!s.production && Math.random() < 0.12) {
    const pool = EVENTS.map((e) => ({ e, w: eventWeight(e, s) })).filter((x) => x.w > (s.subscribers > 1000 ? 0 : 2))
    if (Math.random() < 0.3 && pool.length) {
      const total = pool.reduce((a, x) => a + x.w, 0)
      let roll = Math.random() * total
      for (const item of pool) {
        roll -= item.w
        if (roll <= 0) {
          return { ...s, pendingEvent: item.e.id }
        }
      }
    }
  }
  return s
}

export function resolveEvent(s: GameState, eventId: string, choiceIndex: number): GameState {
  const ev = EVENTS.find((e) => e.id === eventId)
  if (!ev) return { ...s, pendingEvent: null }
  const choice = ev.choices[choiceIndex]
  if (!choice) return { ...s, pendingEvent: null }
  const e = choice.effects
  let ns: GameState = { ...s, pendingEvent: null }
  if (e.money) ns.money += e.money
  if (e.subscribers) {
    ns.subscribers += e.subscribers
    ns = pushNotification(ns, { type: 'success', title: 'SUBSCRIBERS', message: `+${e.subscribers} subscribers` })
  }
  if (e.quality) ns.trendScore = Math.min(100, Math.max(0, ns.trendScore + e.quality))
  if (e.reputation) ns.reputation = Math.min(100, Math.max(0, ns.reputation + e.reputation))
  if (e.views) {
    ns.totalViews += e.views
    if (ns.videos[0]) ns.videos = [{ ...ns.videos[0], views: ns.videos[0].views + e.views }, ...ns.videos.slice(1)]
  }
  if (e.money && e.money < 0) { /* already applied */ }
  // negotiation 50% chance
  if (eventId === 'sponsor_offer' && choiceIndex === 1 && Math.random() < 0.5) {
    ns.money += 30000
    ns = pushNotification(ns, { type: 'success', title: 'NEGOTIATED', message: '+¥30,000 more' })
  }
  return ns
}

export function applyMonetization(s: GameState): GameState {
  if (s.subscribers < 1000) {
    return pushNotification(s, { type: 'error', title: 'NOT ELIGIBLE', message: 'Need 1,000 subscribers.' })
  }
  if (s.monetization !== 'locked') return s
  let ns: GameState = { ...s, monetization: 'pending' }
  ns = pushNotification(ns, { type: 'info', title: 'APPLICATION SENT', message: 'Your channel is under review (reach 2,000 subs to auto-approve).' })
  return ns
}

export function hireEmployee(s: GameState, role: string): GameState {
  const def = EMPLOYEE_DEFS[role as EmployeeRole]
  if (!def) return s
  if (s.money < def.salary) return pushNotification(s, { type: 'error', title: 'INSUFFICIENT FUNDS', message: 'Cannot afford salary.' })
  if (s.employees.some((e) => e.role === role)) return s
  const emp: Employee = {
    id: genId('emp'),
    name: def.name(),
    role: role as EmployeeRole,
    salary: def.salary,
    skill: def.skill + Math.floor(Math.random() * 8),
    efficiency: def.efficiency + Math.floor(Math.random() * 8),
    quality: def.quality + Math.floor(Math.random() * 8),
    experience: 0,
    avatarHue: Math.floor(Math.random() * 360),
  }
  return { ...s, employees: [...s.employees, emp], money: s.money - def.salary }
}

export function fireEmployee(s: GameState, id: string): GameState {
  return { ...s, employees: s.employees.filter((e) => e.id !== id) }
}

export function openChannel(s: GameState): GameState {
  const unlocked = channelUnlockSubs(s)
  if (s.unlockedChannels >= 3 || s.subscribers < unlocked || s.money < 50000) {
    return pushNotification(s, { type: 'error', title: 'LOCKED', message: `Requires ${unlocked.toLocaleString()} subscribers and ¥50,000.` })
  }
  const n = s.unlockedChannels + 1
  return {
    ...s,
    unlockedChannels: n,
    channelNames: [...s.channelNames, `Channel ${n}`],
    money: s.money - 50000,
    activeChannel: n - 1,
  }
}

function channelUnlockSubs(s: GameState): number {
  return s.unlockedChannels === 1 ? 10000 : 50000
}

const EMPLOYEE_DEFS: Record<EmployeeRole, { salary: number; skill: number; efficiency: number; quality: number; name: () => string }> = {
  editor: { salary: 180000, skill: 60, efficiency: 55, quality: 60, name: () => randomName() },
  designer: { salary: 160000, skill: 58, efficiency: 55, quality: 62, name: () => randomName() },
  manager: { salary: 220000, skill: 65, efficiency: 60, quality: 55, name: () => randomName() },
  analyst: { salary: 190000, skill: 62, efficiency: 58, quality: 55, name: () => randomName() },
  researcher: { salary: 150000, skill: 55, efficiency: 60, quality: 50, name: () => randomName() },
}

const FIRST = ['Kenji', 'Aoi', 'Rin', 'Sora', 'Yuki', 'Haru', 'Mio', 'Ren', 'Nao', 'Kai', 'Luca', 'Mei']
const LAST = ['Tanaka', 'Sato', 'Kobayashi', 'Yamamoto', 'Watanabe', 'Nakamura', 'Hayashi', 'Ito']

function randomName(): string {
  return `${FIRST[Math.floor(Math.random() * FIRST.length)]} ${LAST[Math.floor(Math.random() * LAST.length)]}`
}

export function checkAchievements(s: GameState): GameState {
  let ns = s
  let changed = false
  for (const a of ACHIEVEMENTS) {
    if (!s.achievements.includes(a.id) && a.condition(s)) {
      ns = { ...ns, achievements: [...ns.achievements, a.id] }
      ns = pushNotification(ns, { type: 'unlock', title: 'ACHIEVEMENT UNLOCKED', message: `${a.name} — ${a.description}` })
      changed = true
    }
  }
  // monetization auto-approve
  if (ns.monetization === 'pending' && ns.subscribers >= 2000) {
    ns = { ...ns, monetization: 'enabled', monetizationAppliedDay: ns.day }
    ns = pushNotification(ns, { type: 'unlock', title: 'MONETIZATION ENABLED', message: 'Your channel now earns ad revenue.' })
  }
  // era
  const era = getEra(ns.day)
  if (era.id !== ns.era) {
    ns = { ...ns, era: era.id }
    ns = pushNotification(ns, { type: 'info', title: 'NEW ERA', message: `${era.name}: ${era.description}` })
  }
  return ns
}

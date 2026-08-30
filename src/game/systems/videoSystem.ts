import { GameState, Video, VideoIdea, GrowthCurve, VideoStatus } from '../../types'
import { computeVideoQuality, skillLevel, computeStats } from './stats'

let seq = 0
export function genId(prefix: string): string {
  seq += 1
  return `${prefix}_${Date.now().toString(36)}_${seq}_${Math.floor(Math.random() * 1000)}`
}

export function createVideo(s: GameState, idea: VideoIdea, title: string): Video {
  const quality = computeVideoQuality(s, idea)
  const trendBoost = skillLevel(s, 'trend_research') * 2
  const viralBoost = skillLevel(s, 'viral_content') * 3

  // Determine growth curve with skill boosts
  const r = Math.random()
  let curve: GrowthCurve = 'normal'
  const viralChance = 0.02 + (idea.potential * 0.02) + trendBoost * 0.004 + viralBoost * 0.006
  if (r < viralChance) curve = 'viral'
  else if (r < 0.22) curve = 'evergreen'
  else if (r < 0.55) curve = 'normal'
  else if (r < 0.78) curve = 'slowStart'
  else curve = 'dead'

  const thumbnailQuality = computeThumbnail(s)

  return {
    id: genId('vid'),
    title,
    ideaId: idea.id,
    ideaTitle: idea.title,
    ideaTag: idea.tag,
    quality,
    growthCurve: curve,
    publishedDay: s.day,
    publishedHour: s.hour,
    views: 0,
    likes: 0,
    comments: 0,
    subscribersGained: 0,
    revenue: 0,
    ctr: computeCTR(s, thumbnailQuality),
    retention: computeRetention(s, quality),
    watchTime: 0,
    thumbnailQuality,
    status: 'published',
    isViral: false,
    viralPeak: 1,
    viewHistory: [0],
  }
}

function computeThumbnail(s: GameState): number {
  const stats = computeStatsInternal(s)
  return Math.min(100, 40 + stats.design * 0.8)
}

function computeCTR(s: GameState, thumb: number): number {
  const seo = skillLevel(s, 'seo') * 0.3
  const base = 3.5 + thumb * 0.03 + seo
  return Math.min(14, +(base + (Math.random() * 2 - 1)).toFixed(2))
}

function computeRetention(s: GameState, quality: number): number {
  const series = skillLevel(s, 'series_planning') * 2
  const text = skillLevel(s, 'text') * 1.5
  const base = 30 + quality * 0.25 + series + text + (Math.random() * 6 - 3)
  return Math.min(90, Math.max(8, +base.toFixed(2)))
}

function computeStatsInternal(s: GameState) {
  return computeStats(s)
}

// tick for view growth per game hour
export function tickVideoGrowth(s: GameState, v: Video): { subs: number; revenue: number; viral: boolean } {
  let subs = 0
  let revenue = 0
  let viral = false
  const isMonetized = s.monetization === 'enabled'
  const ageHours = (s.day - v.publishedDay) * 24 + (s.hour - v.publishedHour)

  let growth = baseGrowth(s, v, ageHours)
  growth *= curveMultiplier(v.growthCurve, ageHours)
  // competitors: reduce over time
  growth *= Math.max(0.4, 1 - ageHours * 0.004)

  // viral handling: split growth across hours and allow viral event
  const viewsThisHour = Math.floor(growth)

  // subclass growth: 15% of views become subscribers
  const subRate = 0.02 + skillLevel(s, 'community') * 0.004 + skillLevel(s, 'branding') * 0.005
  const newSubs = Math.floor(viewsThisHour * subRate)
  subs += newSubs
  v.subscribersGained += newSubs

  // likes/comments
  v.likes += Math.floor(viewsThisHour * (0.03 + v.quality * 0.0005))
  v.comments += Math.floor(viewsThisHour * (0.002 + v.quality * 0.00005))

  // watch time
  const avgMin = 3 + v.retention * 0.12
  const watchHours = (viewsThisHour * avgMin) / 60
  v.watchTime += watchHours

  v.views += viewsThisHour

  // revenue (ads)
  if (isMonetized) {
    const rpm = 60 + v.quality * 0.5 + (s.era === 'ai' ? 5 : 0)
    const rev = (viewsThisHour / 1000) * rpm
    v.revenue += rev
    revenue += rev
  }

  // status updates
  if (v.isViral) {
    v.status = 'viral'
  } else if (viewsThisHour > 800 && ageHours > 0) {
    v.status = 'trending'
  } else if (ageHours > 48 && v.ctr < 3 && v.views < 1500) {
    v.status = 'underperforming'
  } else {
    v.status = 'published'
  }

  v.viewHistory.push(v.views)
  if (v.viewHistory.length > 200) v.viewHistory.shift()

  return { subs, revenue, viral }
}

function baseGrowth(s: GameState, v: Video, ageHours: number): number {
  // initial exposure based on subscriber base + sns + era
  const subBase = s.subscribers * 0.012
  const snsBoost = skillLevel(s, 'sns') * 2
  const channelPower = 40 + subBase * 0.6 + snsBoost
  // decay over time
  const decay = Math.exp(-ageHours / (90))
  const seed = channelPower * decay
  const base = seed + (Math.random() * 0.5 + 0.2) * seed * 0.3
  return base * (0.8 + v.quality * 0.004)
}

function curveMultiplier(curve: GrowthCurve, ageHours: number): number {
  switch (curve) {
    case 'viral': {
      const peak = Math.exp(-Math.pow((ageHours - 18) / 9, 2))
      return 3.5 + peak * 16
    }
    case 'evergreen': return 0.8 + 60 / (ageHours + 30)
    case 'slowStart': return 0.3 + Math.min(2, ageHours / 200)
    case 'dead': return 0.06
    default: return 0.9 + 20 / (ageHours + 40)
  }
}

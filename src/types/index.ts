export type PageId =
  | 'dashboard'
  | 'channel'
  | 'create'
  | 'analytics'
  | 'store'
  | 'setup'
  | 'team'
  | 'skills'
  | 'business'
  | 'trending'
  | 'achievements'
  | 'settings'

export interface NavItem {
  id: PageId
  label: string
  icon: string
  locked?: boolean
  unlockRequirement?: string
  unlocked?: (s: GameState) => boolean
}

export interface Equipment {
  id: string
  name: string
  category: EquipmentCategory
  price: number
  description: string
  stats: Partial<EquipStats>
  tier: number
}

export type EquipmentCategory =
  | 'COMPUTERS'
  | 'CAMERAS'
  | 'AUDIO'
  | 'SOFTWARE'
  | 'ACCESSORIES'
  | 'STUDIO'

export interface EquipStats {
  editingSpeed: number // percent multiplier
  quality: number // percent multiplier
  crashChance: number
  videoQuality: number
  audioQuality: number
  design: number
}

export interface Subscription {
  id: string
  name: string
  monthlyCost: number
  description: string
  effects: Partial<EquipStats>
  features: string[]
  unlockedAt?: number
}

export interface VideoIdea {
  id: string
  title: string
  trend: number // 0-5
  interest: number
  competition: number
  productionCost: number
  productionTime: number
  potential: number // 0-5
  tag: string
}

export type GrowthCurve =
  | 'normal'
  | 'slowStart'
  | 'viral'
  | 'evergreen'
  | 'dead'

export type VideoStatus = 'published' | 'underperforming' | 'trending' | 'viral'

export interface Video {
  id: string
  title: string
  ideaId: string
  ideaTitle: string
  ideaTag: string
  quality: number // 0-100
  growthCurve: GrowthCurve
  publishedDay: number
  publishedHour: number
  views: number
  likes: number
  comments: number
  subscribersGained: number
  revenue: number
  ctr: number // percent
  retention: number // percent
  watchTime: number // hours
  thumbnailQuality: number
  status: VideoStatus
  isViral: boolean
  viralPeak: number // multiplier
  // history for chart
  viewHistory: number[]
}

export interface Employee {
  id: string
  name: string
  role: EmployeeRole
  salary: number
  skill: number // 0-100
  efficiency: number // 0-100
  quality: number // 0-100
  experience: number
  avatarHue: number
}

export type EmployeeRole =
  | 'editor'
  | 'designer'
  | 'manager'
  | 'analyst'
  | 'researcher'

export interface BusinessStage {
  id: 'solo' | 'creatorTeam' | 'studio' | 'company' | 'mediaEmpire'
  name: string
  requirementSubs: number | null
  requirementRevenue: number | null
}

export interface Skill {
  id: string
  name: string
  tree: 'CONTENT' | 'EDITING' | 'MARKETING' | 'BUSINESS'
  maxLevel: number
  level: number
  cost: (level: number) => number
  description: string
}

export interface Achievement {
  id: string
  name: string
  description: string
  condition: (s: GameState) => boolean
  unlocked: boolean
}

export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'viral' | 'unlock' | 'error'
  title: string
  message: string
  time: number
  read: boolean
}

export interface GameEventChoice {
  label: string
  effects: Partial<EventEffects>
  hint: string
}

export interface EventEffects {
  money: number
  subscribers: number
  quality: number
  reputation: number
  views: number
  morale: number
}

export interface GameEvent {
  id: string
  title: string
  description: string
  choices: GameEventChoice[]
  weight: (s: GameState) => number
}

export interface AnalyticsSnapshot {
  views: number
  subscribers: number
  revenue: number
  balance: number
  watchTime: number
  newSubscribers: number
}

export interface GameState {
  version: number
  day: number
  hour: number
  money: number
  subscribers: number
  totalViews: number
  totalRevenue: number
  videos: Video[]
  equipment: Record<EquipmentCategory, string> // holds equipment id equipped
  ownedEquipment: string[]
  subscriptions: string[] // active sub ids
  skills: Record<string, number> // skill id -> level
  employees: Employee[] // empty = none
  channelName: string
  channelNames: string[] // multiple channels
  activeChannel: number
  unlockedChannels: number
  monetization: 'locked' | 'pending' | 'enabled'
  monetizationAppliedDay: number | null
  revenueStreams: string[]
  businessStage: BusinessStage['id']
  trendScore: number // overall channel health 0-100
  reputation: number
  notifications: Notification[]
  achievements: string[]
  stats: {
    videosCreated: number
    totalWatchTime: number
    totalLikes: number
  }
  lastSave: number
  startedDay: number
  selectedIdeaId: string | null
  production: ProductionProcess | null
  nextVideoId: number
  eventCooldown: number
  nextEventDay: number
  equippedChannelBrand: string | null
  unreadNotifications: number
  analytics: AnalyticsSnapshot[]
  era: EraId
  tutorialStep: number
  pendingEvent: string | null
}

export interface ProductionProcess {
  videoId: string
  ideaId: string
  title: string
  tag: string
  stages: {
    id: ProductionStage
    name: string
    progress: number // 0-100
    done: boolean
    durationTicks: number
  }[]
  currentStage: number
  startedTick: number
}

export type ProductionStage =
  | 'IDEA'
  | 'RESEARCH'
  | 'SCRIPT'
  | 'RECORD'
  | 'EDIT'
  | 'THUMBNAIL'
  | 'PUBLISH'

export type EraId =
  | 'early'
  | 'boom'
  | 'shortform'
  | 'ai'
  | 'future'

export interface Era {
  id: EraId
  name: string
  unlockedDay: number
  description: string
}

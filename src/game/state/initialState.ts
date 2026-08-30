import { GameState } from '../../types'

export function initialState(): GameState {
  return {
    version: 1,
    day: 1,
    hour: 9,
    money: 5000,
    subscribers: 0,
    totalViews: 0,
    totalRevenue: 0,
    videos: [],
    equipment: {
      COMPUTERS: 'old_laptop',
      CAMERAS: 'phone_camera',
      AUDIO: 'builtin_mic',
      SOFTWARE: 'free_editor',
      ACCESSORIES: 'none_acc',
      STUDIO: 'none_studio',
    },
    ownedEquipment: ['old_laptop', 'phone_camera', 'builtin_mic', 'free_editor', 'none_acc', 'none_studio'],
    subscriptions: [],
    skills: {},
    employees: [],
    channelName: 'My Channel',
    channelNames: ['My Channel'],
    activeChannel: 0,
    unlockedChannels: 1,
    monetization: 'locked',
    monetizationAppliedDay: null,
    revenueStreams: ['Ads'],
    businessStage: 'solo',
    trendScore: 30,
    reputation: 50,
    notifications: [],
    achievements: [],
    stats: { videosCreated: 0, totalWatchTime: 0, totalLikes: 0 },
    lastSave: Date.now(),
    startedDay: 1,
    selectedIdeaId: null,
    production: null,
    nextVideoId: 1,
    eventCooldown: 0,
    nextEventDay: 3,
    equippedChannelBrand: 'Cyan',
    unreadNotifications: 0,
    analytics: [],
    era: 'early',
    tutorialStep: 0,
    pendingEvent: null,
  }
}

export function defaultState(): GameState {
  return initialState()
}

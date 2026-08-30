import { Achievement, GameState } from '../types'

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_video', name: 'FIRST VIDEO', description: 'Publish your very first video.',
    condition: (s) => s.stats.videosCreated >= 1, unlocked: false },
  { id: 'thousand_views', name: 'FIRST 1K VIEWS', description: 'Reach 1,000 total channel views.',
    condition: (s) => s.totalViews >= 1000, unlocked: false },
  { id: 'first100', name: 'FIRST 100 SUBS', description: 'Reach 100 subscribers.',
    condition: (s) => s.subscribers >= 100, unlocked: false },
  { id: 'first1000sb', name: 'FIRST 1K SUBS', description: 'Reach 1,000 subscribers.',
    condition: (s) => s.subscribers >= 1000, unlocked: false },
  { id: 'monetized', name: 'MONETIZED', description: 'Get your channel monetized.',
    condition: (s) => s.monetization === 'enabled', unlocked: false },
  { id: 'first_viral', name: 'FIRST VIRAL VIDEO', description: 'Have a video go viral.',
    condition: (s) => s.videos.some((v) => v.isViral), unlocked: false },
  { id: 'hundredk', name: 'FIRST ¥100K', description: 'Earn a total of ¥100,000 in revenue.',
    condition: (s) => s.totalRevenue >= 100000, unlocked: false },
  { id: 'first_employee', name: 'FIRST EMPLOYEE', description: 'Hire your first team member.',
    condition: (s) => s.employees.length >= 1, unlocked: false },
  { id: 'creator_studio', name: 'CREATOR STUDIO', description: 'Reach the STUDIO business stage.',
    condition: (s) => ['studio', 'company', 'mediaEmpire'].includes(s.businessStage), unlocked: false },
  { id: 'media_company', name: 'MEDIA COMPANY', description: 'Reach the COMPANY business stage.',
    condition: (s) => ['company', 'mediaEmpire'].includes(s.businessStage), unlocked: false },
  { id: 'tenk_subs', name: '10K SUBSCRIBERS', description: 'Reach 10,000 subscribers.',
    condition: (s) => s.subscribers >= 10000, unlocked: false },
  { id: 'hundredk_subs', name: '100K SUBSCRIBERS', description: 'Reach 100,000 subscribers.',
    condition: (s) => s.subscribers >= 100000, unlocked: false },
  { id: 'million_views', name: '1M VIEWS', description: 'Reach 1,000,000 total views.',
    condition: (s) => s.totalViews >= 1000000, unlocked: false },
  { id: 'empire', name: 'MEDIA EMPIRE', description: 'Reach the MEDIA EMPIRE business stage.',
    condition: (s) => s.businessStage === 'mediaEmpire', unlocked: false },
]

export function countUnlocked(s: GameState): number {
  return ACHIEVEMENTS.filter((a) => a.condition(s)).length
}

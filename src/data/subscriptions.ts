import { Subscription } from '../types'

export const SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'pro_editor_sub',
    name: 'PRO EDITOR',
    monthlyCost: 3280,
    description: 'Premium video editor subscription with advanced effects and faster exports.',
    effects: { editingSpeed: 140, quality: 15 },
    features: ['Editing Speed +40%', 'Editing Quality +15%', 'Advanced Effects'],
  },
  {
    id: 'design_pro',
    name: 'DESIGN PRO',
    monthlyCost: 1980,
    description: 'Professional design platform for thumbnails and channel art.',
    effects: { design: 50 },
    features: ['Thumbnail Design +50', 'Brand Kits', 'Templates'],
  },
  {
    id: 'music_library',
    name: 'MUSIC LIBRARY',
    monthlyCost: 1480,
    description: 'Royalty-free music and sound effects licensed for monetized videos.',
    effects: { quality: 8, videoQuality: 5 },
    features: ['Royalty-Free Music', 'Sound Effects', 'Licensed for Monetization'],
  },
  {
    id: 'ai_assistant',
    name: 'AI ASSISTANT',
    monthlyCost: 3980,
    description: 'AI helps with scripts, tags, titles, and editing automation.',
    effects: { editingSpeed: 120, quality: 10 },
    features: ['Script Assistance', 'SEO Tags', 'Editing Automation'],
  },
  {
    id: 'cloud_storage',
    name: 'CLOUD STORAGE',
    monthlyCost: 980,
    description: 'Backup and sync for your project files across devices.',
    effects: { editingSpeed: 108, crashChance: 60 },
    features: ['Auto Backup', 'Sync Projects', 'Crash Protection'],
  },
]

export function getSubscription(id: string): Subscription | undefined {
  return SUBSCRIPTIONS.find((s) => s.id === id)
}

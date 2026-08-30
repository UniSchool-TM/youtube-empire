import { Equipment, EquipmentCategory } from '../types'

export const EMPTY_EQUIPMENT: Record<EquipmentCategory, string> = {
  COMPUTERS: 'old_laptop',
  CAMERAS: 'phone_camera',
  AUDIO: 'builtin_mic',
  SOFTWARE: 'free_editor',
  ACCESSORIES: 'none_acc',
  STUDIO: 'none_studio',
}

export const EQUIPMENT: Equipment[] = [
  // COMPUTERS
  {
    id: 'old_laptop', name: 'OLD LAPTOP', category: 'COMPUTERS', price: 0,
    description: 'A sluggish hand-me-down laptop. Fans roar at any task.',
    stats: { editingSpeed: 100, quality: 0, crashChance: 100 }, tier: 0,
  },
  {
    id: 'creator_laptop', name: 'CREATOR LAPTOP', category: 'COMPUTERS', price: 180000,
    description: 'A dedicated creator laptop with a fast SSD and dedicated GPU.',
    stats: { editingSpeed: 170, quality: 10, crashChance: 20 }, tier: 1,
  },
  {
    id: 'performance_pc', name: 'PERFORMANCE PC', category: 'COMPUTERS', price: 420000,
    description: 'A tower workstation that renders 4K in seconds.',
    stats: { editingSpeed: 260, quality: 20, crashChance: 5 }, tier: 2,
  },
  {
    id: 'render_farm_rig', name: 'RENDER RIG', category: 'COMPUTERS', price: 980000,
    description: 'Multiple GPUs in parallel. Editing becomes effortless.',
    stats: { editingSpeed: 400, quality: 30, crashChance: 1 }, tier: 3,
  },
  // CAMERAS
  {
    id: 'phone_camera', name: 'PHONE CAMERA', category: 'CAMERAS', price: 0,
    description: 'Your trusty phone. Works, but footage is phone-grade.',
    stats: { videoQuality: 40 }, tier: 0,
  },
  {
    id: 'webcam_pro', name: 'PRO WEBCAM', category: 'CAMERAS', price: 45000,
    description: 'Sharp 1080p webcam for talking-head content.',
    stats: { videoQuality: 60 }, tier: 1,
  },
  {
    id: 'dslr_camera', name: 'MIRRORLESS CAMERA', category: 'CAMERAS', price: 260000,
    description: 'Interchangeable-lens camera with beautiful depth of field.',
    stats: { videoQuality: 80 }, tier: 2,
  },
  {
    id: 'cinema_camera', name: 'CINEMA CAMERA', category: 'CAMERAS', price: 850000,
    description: 'Professional cinema rig. Filmic color science.',
    stats: { videoQuality: 95 }, tier: 3,
  },
  // AUDIO
  {
    id: 'builtin_mic', name: 'BUILT-IN MIC', category: 'AUDIO', price: 0,
    description: 'Laptop microphone. Picks up everything except clarity.',
    stats: { audioQuality: 30 }, tier: 0,
  },
  {
    id: 'usb_mic', name: 'USB MICROPHONE', category: 'AUDIO', price: 15000,
    description: 'Crisp condenser mic. Huge upgrade over built-in.',
    stats: { audioQuality: 65 }, tier: 1,
  },
  {
    id: 'studio_mic', name: 'STUDIO MICROPHONE', category: 'AUDIO', price: 60000,
    description: 'XLR studio mic with audio interface for broadcast-grade sound.',
    stats: { audioQuality: 85 }, tier: 2,
  },
  {
    id: 'broadcast_audio', name: 'BROADCAST RIG', category: 'AUDIO', price: 190000,
    description: 'Multi-mic broadcast setup with noise isolation booth.',
    stats: { audioQuality: 98 }, tier: 3,
  },
  // SOFTWARE (one-time purchases, subscriptions separate)
  {
    id: 'free_editor', name: 'FREE EDITOR', category: 'SOFTWARE', price: 0,
    description: 'Basic free editor with watermark-less limitations.',
    stats: { editingSpeed: 100, quality: 0 }, tier: 0,
  },
  {
    id: 'pro_editor_owned', name: 'PRO EDITOR', category: 'SOFTWARE', price: 98000,
    description: 'Full-featured editor with advanced effects and proxies.',
    stats: { editingSpeed: 140, quality: 15 }, tier: 1,
  },
  {
    id: 'design_suite_owned', name: 'DESIGN SUITE', category: 'SOFTWARE', price: 46000,
    description: 'Professional design apps for thumbnails and branding.',
    stats: { design: 50 }, tier: 1,
  },
  {
    id: 'ai_creative_owned', name: 'AI CREATIVE SUITE', category: 'SOFTWARE', price: 240000,
    description: 'AI-assisted scripting, effects, and color grading.',
    stats: { editingSpeed: 200, quality: 25, design: 60 }, tier: 2,
  },
  // ACCESSORIES
  {
    id: 'none_acc', name: 'BARE SETUP', category: 'ACCESSORIES', price: 0,
    description: 'No accessories. You make do.',
    stats: { editingSpeed: 100 }, tier: 0,
  },
  {
    id: 'dual_monitor', name: 'DUAL MONITOR', category: 'ACCESSORIES', price: 52000,
    description: 'Second monitor for timelines and reference material.',
    stats: { editingSpeed: 125, quality: 5 }, tier: 1,
  },
  {
    id: 'drawing_tablet', name: 'DRAWING TABLET', category: 'ACCESSORIES', price: 34000,
    description: 'Draw overlays and accurate thumbnail callouts.',
    stats: { design: 35, quality: 8 }, tier: 1,
  },
  {
    id: 'elgato_setup', name: 'STREAMDECK RIG', category: 'ACCESSORIES', price: 88000,
    description: 'A control deck that automates your entire workflow.',
    stats: { editingSpeed: 150, quality: 10 }, tier: 2,
  },
  // STUDIO
  {
    id: 'none_studio', name: 'BEDROOM', category: 'STUDIO', price: 0,
    description: 'Your bedroom doubling as a studio.',
    stats: { videoQuality: 45, audioQuality: 40 }, tier: 0,
  },
  {
    id: 'desk_studio', name: 'HOME STUDIO', category: 'STUDIO', price: 120000,
    description: 'Dedicated desk with lighting and acoustic foam.',
    stats: { videoQuality: 70, audioQuality: 75 }, tier: 1,
  },
  {
    id: 'studio_space', name: 'STUDIO SPACE', category: 'STUDIO', price: 600000,
    description: 'Rented studio with professional lighting rigs and sets.',
    stats: { videoQuality: 88, audioQuality: 88 }, tier: 2,
  },
  {
    id: 'production_studio', name: 'PRODUCTION STUDIO', category: 'STUDIO', price: 2400000,
    description: 'Full production studio with green screen, sets and booth.',
    stats: { videoQuality: 98, audioQuality: 95, quality: 15 }, tier: 3,
  },
]

export function getEquip(id: string): Equipment {
  return EQUIPMENT.find((e) => e.id === id) ?? EQUIPMENT[0]
}

export function equipById(id: string): Equipment | undefined {
  return EQUIPMENT.find((e) => e.id === id)
}

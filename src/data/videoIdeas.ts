import { VideoIdea, GrowthCurve } from '../types'

export const VIDEO_IDEAS: VideoIdea[] = [
  {
    id: 'dino',
    title: '恐竜が本当に絶滅した理由',
    trend: 4, interest: 4, competition: 3,
    productionCost: 4, productionTime: 5, potential: 4,
    tag: 'MYSTERY',
  },
  {
    id: 'deepsea',
    title: '深海でしか生きられない謎の生物',
    trend: 4, interest: 4, competition: 3,
    productionCost: 3, productionTime: 4, potential: 4,
    tag: 'SCIENCE',
  },
  {
    id: 'space',
    title: '宇宙の果てまで行くと何があるのか',
    trend: 5, interest: 5, competition: 4,
    productionCost: 4, productionTime: 6, potential: 4,
    tag: 'SPACE',
  },
  {
    id: 'darkweb',
    title: 'ダークウェブの最深部を調査してみた',
    trend: 3, interest: 5, competition: 4,
    productionCost: 2, productionTime: 3, potential: 4,
    tag: 'EXPLORE',
  },
  {
    id: 'gadget',
    title: '100万円のガジェットを全部買って試した',
    trend: 4, interest: 4, competition: 3,
    productionCost: 8, productionTime: 4, potential: 3,
    tag: 'TECH',
  },
  {
    id: 'mystery',
    title: '警察も解決できなかった未解決事件',
    trend: 3, interest: 5, competition: 3,
    productionCost: 3, productionTime: 5, potential: 5,
    tag: 'MYSTERY',
  },
  {
    id: 'ranking',
    title: '世界で最も危険な場所ランキングTOP10',
    trend: 5, interest: 4, competition: 5,
    productionCost: 2, productionTime: 3, potential: 3,
    tag: 'LIST',
  },
  {
    id: 'daily',
    title: '部屋を1週間掃除しないとどうなるか',
    trend: 2, interest: 3, competition: 2,
    productionCost: 1, productionTime: 2, potential: 2,
    tag: 'EXPERIMENT',
  },
  {
    id: 'myth',
    title: '身体に悪いと言われてる習慣の真実',
    trend: 3, interest: 4, competition: 3,
    productionCost: 3, productionTime: 4, potential: 3,
    tag: 'HEALTH',
  },
  {
    id: 'ai',
    title: 'AIに1年の仕事を任せたらこうなった',
    trend: 5, interest: 4, competition: 4,
    productionCost: 3, productionTime: 4, potential: 4,
    tag: 'TECH',
  },
  {
    id: 'money',
    title: '貧乏から大富豪になった人がやめた5つのこと',
    trend: 4, interest: 5, competition: 5,
    productionCost: 1, productionTime: 3, potential: 3,
    tag: 'MONEY',
  },
  {
    id: 'history',
    title: '教科書に載らない世界史の裏話',
    trend: 3, interest: 4, competition: 2,
    productionCost: 3, productionTime: 5, potential: 3,
    tag: 'HISTORY',
  },
  {
    id: 'scary',
    title: '録音された悲鳴の真相を分析してみた',
    trend: 4, interest: 5, competition: 4,
    productionCost: 2, productionTime: 3, potential: 4,
    tag: 'MYSTERY',
  },
  {
    id: 'solo',
    title: '無人島で1週間生活してみた',
    trend: 3, interest: 5, competition: 3,
    productionCost: 6, productionTime: 6, potential: 4,
    tag: 'SURVIVAL',
  },
]

export function getIdea(id: string): VideoIdea | undefined {
  return VIDEO_IDEAS.find((i) => i.id === id)
}

export function pickGrowthCurve(idea: VideoIdea): GrowthCurve {
  const r = Math.random()
  const potential = idea.potential
  if (potential >= 5 && r < 0.18) return 'viral'
  if (potential >= 4 && r < 0.3) return 'evergreen'
  if (r < 0.35) return 'normal'
  if (r < 0.55) return 'slowStart'
  if (r < 0.72) return 'dead'
  return 'normal'
}

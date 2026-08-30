import { motion } from 'framer-motion'
import { PageId, GameState, NavItem } from '../../types'
import { useGame } from '../../game/state/store'

const ICONS: Record<string, string> = {
  dashboard: '◫', channel: '▤', create: '＋', analytics: '📈', store: '🛒',
  setup: '⚙', team: '👥', skills: '✦', business: '🏢', trending: '🔥',
  achievements: '🏆', settings: '⚙',
}

interface RawNav { id: PageId; label: string; locked?: boolean; req?: string; unlockAt?: string }

const BASE_NAV: RawNav[] = [
  { id: 'dashboard', label: 'DASHBOARD' },
  { id: 'channel', label: 'CHANNEL' },
  { id: 'create', label: 'CREATE' },
  { id: 'analytics', label: 'ANALYTICS' },
]

const LOCKED_NAV: RawNav[] = [
  { id: 'store', label: 'STORE', unlockAt: '1,000 subscribers' },
  { id: 'setup', label: 'SETUP', unlockAt: '1,000 subscribers' },
  { id: 'skills', label: 'SKILLS', unlockAt: '500 subscribers' },
  { id: 'team', label: 'TEAM', unlockAt: '10,000 subscribers' },
  { id: 'business', label: 'BUSINESS', unlockAt: '5,000 subscribers' },
  { id: 'trending', label: 'TRENDING', unlockAt: 'Reach 1,000 subscribers' },
  { id: 'achievements', label: 'ACHIEVEMENTS' },
]

export function Sidebar({ current, onNavigate }: { current: PageId; onNavigate: (p: PageId) => void }) {
  const { state, dispatch } = useGame()

  const nav: NavItem[] = buildNav(state)

  const handle = (item: NavItem) => {
    if (item.locked) {
      dispatch({ type: 'SELECT_IDEA', ideaId: item.unlockRequirement || null })
      return
    }
    onNavigate(item.id)
  }

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="mark">Z</div>
        <div className="name">CREATOR OS</div>
      </div>
      <nav className="nav">
        <div className="nav-group-label">STUDIO</div>
        {nav.slice(0, 4).map((item) => (
          <NavButton key={item.id} item={item} current={current} onClick={() => handle(item)} />
        ))}
        <div className="nav-group-label">GROWTH</div>
        {nav.slice(4, 6).map((item) => (
          <NavButton key={item.id} item={item} current={current} onClick={() => handle(item)} />
        ))}
        <div className="nav-group-label">EMPIRE</div>
        {nav.slice(6, 8).map((item) => (
          <NavButton key={item.id} item={item} current={current} onClick={() => handle(item)} />
        ))}
        <div className="nav-group-label">PROGRESS</div>
        {nav.slice(8).map((item) => (
          <NavButton key={item.id} item={item} current={current} onClick={() => handle(item)} />
        ))}
      </nav>
      <UnlockHint state={state} />
    </div>
  )
}

function NavButton({ item, current, onClick }: { item: NavItem; current: PageId; onClick: () => void }) {
  return (
    <motion.button
      className={`nav-item ${item.locked ? 'locked' : ''} ${current === item.id ? 'active' : ''}`}
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      title={item.locked ? `Locked — ${item.unlockRequirement}` : undefined}
    >
      <span className="icon">{item.locked ? '🔒' : (ICONS[item.id] || '•')}</span>
      <span>{item.label}</span>
      {item.locked && item.unlockRequirement && <span className="nav-badge">{item.unlockRequirement}</span>}
    </motion.button>
  )
}

function UnlockHint({ state }: { state: GameState }) {
  if (state.notifications.length === 0) return null
  const lockedCount = buildNav(state).filter((n) => n.locked).length
  if (lockedCount === 0) return null
  return (
    <div style={{ marginTop: 'auto', padding: '12px', fontSize: 10, color: 'var(--text-3)' }}>
      🔒 Grow your channel to unlock tools
    </div>
  )
}

function buildNav(state: GameState): NavItem[] {
  const base: NavItem[] = BASE_NAV.map((n) => ({ id: n.id, label: n.label, icon: ICONS[n.id] }))
  const rest: NavItem[] = LOCKED_NAV.map((n) => {
    const unlocked = isUnlocked(n, state)
    return {
      id: n.id, label: n.label, icon: ICONS[n.id],
      locked: !unlocked, unlockRequirement: n.unlockAt,
    }
  })
  return [...base, ...rest]
}

function isUnlocked(n: RawNav, s: GameState): boolean {
  switch (n.id) {
    case 'store': return s.subscribers >= 1000
    case 'setup': return s.subscribers >= 1000
    case 'skills': return s.subscribers >= 500
    case 'team': return s.subscribers >= 10000
    case 'business': return s.subscribers >= 5000
    case 'trending': return s.subscribers >= 1000
    case 'achievements': return true
    default: return true
  }
}

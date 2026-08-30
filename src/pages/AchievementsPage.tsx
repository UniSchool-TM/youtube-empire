import { useGame } from '../game/state/store'
import { Card, Badge } from '../components/ui'
import { ACHIEVEMENTS } from '../data/achievements'

const EMOJI: Record<string, string> = {
  first_video: '🎬', thousand_views: '👁', first100: '🥉', first1000sb: '🥈',
  monetized: '💸', first_viral: '⚡', hundredk: '💰', first_employee: '👥',
  creator_studio: '🎥', media_company: '🏢', tenk_subs: '🔟', hundredk_subs: '💯',
  million_views: '🚀', empire: '👑',
}

export function AchievementsPage() {
  const { state } = useGame()
  const unlocked = ACHIEVEMENTS.filter((a) => state.achievements.includes(a.id))
  const locked = ACHIEVEMENTS.filter((a) => !state.achievements.includes(a.id))

  return (
    <>
      <div className="page-header">
        <div className="page-title">ACHIEVEMENTS</div>
        <div className="page-sub">
          {unlocked.length} / {ACHIEVEMENTS.length} unlocked
        </div>
      </div>

      <div className="section">
        <div className="section-head"><h2>UNLOCKED</h2></div>
        <div className="grid cols-3">
          {unlocked.map((a) => (
            <Card key={a.id} className="hoverable" style={{ borderColor: 'var(--accent)', boxShadow: 'var(--shadow-glow)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ fontSize: 32 }}>{EMOJI[a.id] || '🏆'}</div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-0)' }}>{a.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-2)' }}>{a.description}</div>
                </div>
                <Badge tone="accent" style={{ marginLeft: 'auto' }}>DONE</Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="section-head"><h2>LOCKED</h2></div>
        <div className="grid cols-3">
          {locked.map((a) => {
            const ready = a.condition(state)
            return (
              <Card key={a.id} style={{ opacity: 0.7 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ fontSize: 32, filter: 'grayscale(1)', opacity: 0.5 }}>{EMOJI[a.id] || '🏆'}</div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-2)' }}>{a.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{a.description}</div>
                  </div>
                  {ready && <Badge tone="warning" style={{ marginLeft: 'auto' }}>READY!</Badge>}
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </>
  )
}

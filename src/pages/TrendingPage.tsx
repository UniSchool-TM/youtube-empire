import { useGame } from '../game/state/store'
import { Card, Badge } from '../components/ui'
import { formatViews } from '../utils/format'

export function TrendingPage() {
  const { state } = useGame()
  const hot = [...state.videos]
    .filter((v) => v.views > 500)
    .sort((a, b) => b.views - a.views)
    .slice(0, 8)

  return (
    <>
      <div className="page-header">
        <div className="page-title">TRENDING</div>
        <div className="page-sub">Your videos catching fire right now.</div>
      </div>

      {hot.length === 0 ? (
        <Card>
          <div className="empty-state">
            <div className="big">🔥</div>
            <div>Nothing trending yet.</div>
            <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 6 }}>Keep publishing — your breakout is coming.</div>
          </div>
        </Card>
      ) : (
        <div className="grid cols-2">
          {hot.map((v, i) => (
            <Card key={v.id} className={`hoverable ${v.isViral ? 'viral-glow' : ''}`}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 30, color: i < 3 ? 'var(--warning)' : 'var(--text-3)' }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-0)', fontSize: 14 }}>{v.title}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                    <span className="mono" style={{ fontSize: 13, color: 'var(--text-1)' }}>{formatViews(v.views)} views</span>
                    {v.isViral && <Badge tone="warning">VIRAL</Badge>}
                    {v.status === 'trending' && <Badge tone="success">TRENDING</Badge>}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.08em' }}>GROWTH</div>
                  <div className="mono" style={{ color: 'var(--accent-2)', fontWeight: 700, fontSize: 13 }}>
                    +{(v.viewHistory[v.viewHistory.length - 1] - (v.viewHistory[v.viewHistory.length - 2] ?? 0)) >= 0 ? '+' : ''}
                    {formatViews(v.viewHistory[v.viewHistory.length - 1] - (v.viewHistory[v.viewHistory.length - 2] ?? 0))}/hr
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="section" style={{ marginTop: 28 }}>
        <div className="section-head"><h2>CONTENT TAGS</h2></div>
        <Card>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {['MYSTERY', 'SCIENCE', 'SPACE', 'TECH', 'LIST', 'HISTORY', 'MONEY', 'SURVIVAL', 'EXPERIMENT'].map((t) => {
              const count = state.videos.filter((v) => v.ideaTag === t).length
              return (
                <Badge key={t} tone={count > 0 ? 'accent' : 'neutral'}>
                  #{t} <span className="mono">({count})</span>
                </Badge>
              )
            })}
          </div>
        </Card>
      </div>
    </>
  )
}

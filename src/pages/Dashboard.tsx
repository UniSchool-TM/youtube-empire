import { useState } from 'react'
import { useGame } from '../game/state/store'
import { StatCard, Card, Segmented, Badge, EmptyState } from '../components/ui'
import { AreaChart } from '../components/ui/Chart'
import { formatViews, formatMoney, formatPercent, formatCompact } from '../utils/format'
import { getIdea } from '../data/videoIdeas'

export function Dashboard({ onNavigate }: { onNavigate: (p: string) => void }) {
  const { state } = useGame()
  const [range, setRange] = useState('7d')

  const activeVideos = state.videos.slice(0, 6)
  const growthData = buildGrowthData(state, range)

  const subsToday = state.analytics.length > 1 ? state.analytics[state.analytics.length - 1].subscribers - state.analytics[state.analytics.length - 2].subscribers : 0

  return (
    <>
      <div className="page-header">
        <div className="page-title">DASHBOARD</div>
        <div className="page-sub">{state.channelName} — overview of your creator empire.</div>
      </div>

      <div className="grid cols-4" style={{ marginBottom: 20 }}>
        <StatCard label="Subscribers" value={state.subscribers} format="compact" sub={`${subsToday >= 0 ? '+' : ''}${subsToday} today`} tone="accent" />
        <StatCard label="Total Views" value={state.totalViews} format="compact" />
        <StatCard label="Total Revenue" value={state.totalRevenue} format="money" tone="green" />
        <StatCard label="Balance" value={state.money} format="money" />
      </div>

      <div className="section">
        <div className="section-head">
          <h2>CHANNEL GROWTH</h2>
          <Segmented
            options={[{ label: '7 DAYS', value: '7d' }, { label: '30 DAYS', value: '30d' }, { label: 'ALL', value: 'all' }]}
            value={range}
            onChange={setRange}
          />
        </div>
        <Card>
          {growthData.length >= 2 ? (
            <AreaChart data={growthData} height={180} />
          ) : (
            <EmptyState emoji="📈" text="Publish a video to see growth data." />
          )}
        </Card>
      </div>

      <div className="section">
        <div className="section-head">
          <h2>RECENT VIDEOS</h2>
          <button className="btn ghost sm" onClick={() => onNavigate('create')}>CREATE VIDEO +</button>
        </div>
        {activeVideos.length === 0 ? (
          <Card><EmptyState emoji="🎬" text="No videos yet — create your first video." /></Card>
        ) : (
          <div className="grid cols-3">
            {activeVideos.map((v) => (
              <div className="video-card" key={v.id} onClick={() => onNavigate('analytics')}>
                <div className="video-thumb">
                  <span className="tag badge neutral">{v.ideaTag}</span>
                  <span className="play">▶</span>
                  {v.isViral && <span className="tag" style={{ top: 8, right: 8, background: 'var(--warning)', color: '#000' }}>VIRAL</span>}
                </div>
                <div className="v-title">{v.title}</div>
                <div className="v-meta">
                  <span>{formatViews(v.views)} views</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className={`status-dot ${v.status}`} /> {v.status.toUpperCase()}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 8, fontSize: 11, color: 'var(--text-2)', fontFamily: 'var(--font-mono)' }}>
                  <span>CTR {formatPercent(v.ctr)}</span>
                  <span>RET {formatPercent(v.retention)}</span>
                  <span>¥{Math.floor(v.revenue)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {state.monetization === 'locked' && state.subscribers >= 400 && (
        <Card style={{ borderColor: 'var(--accent)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ fontSize: 28 }}>💸</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: 'var(--text-0)' }}>MONETIZATION AVAILABLE</div>
              <div style={{ fontSize: 12, color: 'var(--text-2)' }}>Reach 1,000 subscribers to apply for ad revenue.</div>
            </div>
            <button className="btn primary" onClick={() => onNavigate('channel')}>APPLY</button>
          </div>
        </Card>
      )}
    </>
  )
}

function buildGrowthData(state: any, range: string): number[] {
  const analytics = state.analytics
  if (analytics.length < 2) return []
  let slice = analytics
  if (range === '7d') slice = analytics.slice(-24 * 7)
  else if (range === '30d') slice = analytics.slice(-24 * 30)
  return slice.map((a: any) => a.subscribers)
}

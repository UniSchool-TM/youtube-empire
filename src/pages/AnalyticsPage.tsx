import { useState } from 'react'
import { useGame } from '../game/state/store'
import { Card, Bar, Badge, EmptyState } from '../components/ui'
import { AreaChart, BarChart } from '../components/ui/Chart'
import { formatViews, formatPercent, formatMoney, formatCompact } from '../utils/format'

export function AnalyticsPage() {
  const { state } = useGame()
  const [selectedId, setSelectedId] = useState<string | null>(state.videos[0]?.id ?? null)

  if (state.videos.length === 0) {
    return (
      <>
        <div className="page-header">
          <div className="page-title">ANALYTICS</div>
          <div className="page-sub">Deep-dive into your video performance.</div>
        </div>
        <Card><EmptyState emoji="📊" text="No videos to analyze yet." /></Card>
      </>
    )
  }

  const videos = state.videos
  const selected = videos.find((v) => v.id === selectedId) ?? videos[0]

  const viewData = selected.viewHistory.length > 1 ? selected.viewHistory :
    Array.from({ length: 30 }, (_, i) => Math.floor(selected.views * (i / 30)))

  const retentionBins = buildRetentionBins(selected.retention)

  return (
    <>
      <div className="page-header">
        <div className="page-title">ANALYTICS</div>
        <div className="page-sub">Analyze performance and improve your next video.</div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        {videos.slice(0, 8).map((v) => (
          <button key={v.id} className={`btn sm ${selected.id === v.id ? 'primary' : 'ghost'}`} onClick={() => setSelectedId(v.id)}>
            {formatViews(v.views)}
          </button>
        ))}
      </div>

      <div className="section">
        <div className="section-head">
          <h2>{selected.title}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Badge tone={selected.status === 'viral' ? 'warning' : selected.status === 'trending' ? 'success' : selected.status === 'underperforming' ? 'danger' : 'neutral'}>
              {selected.status?.toUpperCase()}
            </Badge>
            <span className="badge neutral mono">CURVE: {selected.growthCurve.toUpperCase()}</span>
          </div>
        </div>

        <div className="grid cols-6" style={{ marginBottom: 16 }}>
          <MiniStat label="VIEWS" value={formatViews(selected.views)} />
          <MiniStat label="WATCH TIME" value={formatCompact(Math.floor(selected.watchTime)) + 'h'} />
          <MiniStat label="CTR" value={formatPercent(selected.ctr)} />
          <MiniStat label="RETENTION" value={formatPercent(selected.retention)} />
          <MiniStat label="LIKES" value={formatCompact(selected.likes)} />
          <MiniStat label="REVENUE" value={formatMoney(selected.revenue)} />
        </div>

        <div className="grid cols-2">
          <Card title="VIEW GROWTH">
            <AreaChart data={viewData} height={150} color="var(--accent-2)" />
          </Card>
          <Card title="AUDIENCE RETENTION">
            <BarChart data={retentionBins} height={150} color="var(--accent)" />
            <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 6 }}>Retention curve across the video.</div>
          </Card>
        </div>
      </div>

      <div className="section">
        <div className="section-head"><h2>PERFORMANCE DIAGNOSIS</h2></div>
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Diagnostic
              label="Thumbnail / CTR"
              value={selected.ctr}
              good={4.5} bad={3}
              hint="A higher CTR means your thumbnail and title hook viewers."
            />
            <Diagnostic
              label="Audience Retention"
              value={selected.retention}
              good={50} bad={35}
              hint="Keep viewers engaged with pacing, cuts, and clear structure."
            />
            <Diagnostic
              label="Views vs Channel"
              value={state.subscribers > 0 ? (selected.views / state.subscribers) * 100 : 0}
              good={100} bad={30}
              hint="Views relative to your subscriber base."
              suffix="%"
            />
          </div>
          <div style={{ marginTop: 16, fontSize: 12, color: 'var(--text-3)' }}>
            💡 Not every underperforming video can be explained. Sometimes the algorithm is just fickle.
          </div>
        </Card>
      </div>
    </>
  )
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat-card" style={{ padding: 14 }}>
      <div className="stat-label">{label}</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-0)', fontSize: 18, marginTop: 6 }}>{value}</div>
    </div>
  )
}

function Diagnostic({ label, value, good, bad, hint, suffix = '%' }: { label: string; value: number; good: number; bad: number; hint: string; suffix?: string }) {
  const status = value >= good ? 'good' : value >= bad ? 'mid' : 'poor'
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }}>
        <span style={{ fontWeight: 600, color: 'var(--text-1)' }}>{label}</span>
        <span className="mono" style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: status === 'poor' ? 'var(--danger)' : status === 'good' ? 'var(--accent-2)' : 'var(--warning)' }}>
          {value.toFixed(1)}{suffix}
        </span>
      </div>
      <Bar value={Math.min(100, (value / (good * 1.3)) * 100)} tone={status === 'poor' ? 'danger' : undefined} />
      <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>{hint}</div>
    </div>
  )
}

function buildRetentionBins(base: number): number[] {
  const bins: number[] = []
  let v = base * 1.35
  for (let i = 0; i < 12; i++) {
    bins.push(Math.max(5, v))
    v *= 0.93
  }
  return bins
}

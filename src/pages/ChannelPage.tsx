import { useGame } from '../game/state/store'
import { StatCard, Card, Badge, Bar, Modal } from '../components/ui'
import { useState } from 'react'
import { formatCompact, formatMoney } from '../utils/format'

const REVENUE_STREAMS = [
  { id: 'ads', name: 'Ads', requirement: 0, desc: 'Ad revenue from monetized videos' },
  { id: 'membership', name: 'Membership', requirement: 5000, desc: 'Monthly fan membership' },
  { id: 'superchat', name: 'Channel Support', requirement: 10000, desc: 'Fans tip during premieres' },
  { id: 'sponsorship', name: 'Sponsorships', requirement: 20000, desc: 'Brand deals per video' },
  { id: 'affiliate', name: 'Affiliate', requirement: 10000, desc: 'Commissions on product links' },
  { id: 'merch', name: 'Merchandise', requirement: 50000, desc: 'Own product line' },
]

export function ChannelPage() {
  const { state, dispatch } = useGame()
  const [showMonetize, setShowMonetize] = useState(false)

  const unlockedStreams = REVENUE_STREAMS.filter((s) => state.subscribers >= s.requirement)

  return (
    <>
      <div className="page-header">
        <div className="page-title">CHANNEL</div>
        <div className="page-sub">{state.channelName} — brand, monetization, and channels.</div>
      </div>

      <div className="grid cols-4" style={{ marginBottom: 20 }}>
        <StatCard label="Subscribers" value={state.subscribers} format="compact" tone="accent" />
        <StatCard label="Total Views" value={state.totalViews} format="compact" />
        <StatCard label="Watch Time" value={Math.floor(state.videos.reduce((a, v) => a + v.watchTime, 0))} format="compact" />
        <StatCard label="Total Revenue" value={state.totalRevenue} format="money" tone="green" />
      </div>

      <div className="section">
        <div className="section-head"><h2>MONETIZATION</h2></div>
        <Card>
          {state.monetization === 'enabled' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Badge tone="success">MONETIZATION ENABLED</Badge>
              <span style={{ fontSize: 13, color: 'var(--text-2)' }}>Ad revenue 💸 flowing since day {state.monetizationAppliedDay}</span>
              <div className="spacer" style={{ flex: 1 }} />
              <span className="badge success" style={{ fontSize: 12 }}>${state.revenueStreams.join(', ')}</span>
            </div>
          ) : state.monetization === 'pending' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Badge tone="warning">APPLICATION UNDER REVIEW</Badge>
              <span style={{ fontSize: 13, color: 'var(--text-2)' }}>Auto-approved at 2,000 subscribers.</span>
              <div className="spacer" style={{ flex: 1 }} />
              <Bar value={Math.min(100, (state.subscribers / 2000) * 100)} />
              <span className="mono">{formatCompact(state.subscribers)}/2K</span>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <Badge tone="neutral">MONETIZATION LOCKED</Badge>
              <span style={{ fontSize: 13, color: 'var(--text-2)' }}>Requires 1,000 subscribers.</span>
              <div className="spacer" style={{ flex: 1 }} />
              <Bar value={Math.min(100, (state.subscribers / 1000) * 100)} />
              <span className="mono">{formatCompact(state.subscribers)}/1K</span>
              <button className="btn primary" disabled={state.subscribers < 1000} onClick={() => setShowMonetize(true)}>APPLY</button>
            </div>
          )}
        </Card>
      </div>

      <div className="section">
        <div className="section-head"><h2>REVENUE STREAMS</h2></div>
        <div className="grid cols-3">
          {REVENUE_STREAMS.map((s) => {
            const unlocked = state.subscribers >= s.requirement
            return (
              <Card key={s.id} className="hoverable" style={{ opacity: unlocked ? 1 : 0.55 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-0)' }}>{s.name}</div>
                  {unlocked ? <Badge tone="success">ACTIVE</Badge> : <Badge tone="neutral">🔒 {formatCompact(s.requirement)} SUBS</Badge>}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 8 }}>{s.desc}</div>
              </Card>
            )
          })}
        </div>
      </div>

      <Modal open={showMonetize} onClose={() => setShowMonetize(false)} title="APPLY FOR MONETIZATION">
        <p style={{ color: 'var(--text-2)', marginBottom: 16 }}>Your channel meets the requirements. Submit for review?</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn ghost" style={{ flex: 1 }} onClick={() => setShowMonetize(false)}>CANCEL</button>
          <button className="btn primary" style={{ flex: 1 }} onClick={() => { dispatch({ type: 'APPLY_MONETIZATION' }); setShowMonetize(false) }}>APPLY</button>
        </div>
      </Modal>
    </>
  )
}

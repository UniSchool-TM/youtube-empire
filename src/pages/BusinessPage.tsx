import { useState } from 'react'
import { useGame } from '../game/state/store'
import { Card, Badge, Modal } from '../components/ui'
import { formatCompact, formatMoney } from '../utils/format'

const STAGES = [
  { id: 'solo', name: 'SOLO CREATOR', reqSubs: 0, reqRev: 0, desc: 'Just you and your channel.' },
  { id: 'creatorTeam', name: 'CREATOR TEAM', reqSubs: 10000, reqRev: 300000, desc: 'Hire staff to scale output.' },
  { id: 'studio', name: 'STUDIO', reqSubs: 50000, reqRev: 2000000, desc: 'A dedicated studio with a team.' },
  { id: 'company', name: 'COMPANY', reqSubs: 200000, reqRev: 15000000, desc: 'A media company operation.' },
  { id: 'mediaEmpire', name: 'MEDIA EMPIRE', reqSubs: 1000000, reqRev: 100000000, desc: 'A sprawling multi-channel empire.' },
]

export function BusinessPage() {
  const { state, dispatch } = useGame()
  const [openChannelModal, setOpenChannelModal] = useState(false)

  const stageIdx = STAGES.findIndex((s) => s.id === state.businessStage)
  const next = STAGES[stageIdx + 1]

  return (
    <>
      <div className="page-header">
        <div className="page-title">BUSINESS</div>
        <div className="page-sub">Scale from a solo creator into a media empire.</div>
      </div>

      <div className="section">
        <div className="section-head"><h2>COMPANY STAGE</h2></div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          {STAGES.map((s, i) => {
            const reached = i <= stageIdx
            return (
              <div key={s.id} style={{ flex: 1, minWidth: 140, padding: '12px 14px', borderRadius: 12, background: reached ? 'var(--accent-soft)' : 'var(--bg-2)', border: `1px solid ${reached ? 'var(--accent)' : 'var(--border)'}`, opacity: i <= stageIdx + 1 ? 1 : 0.5 }}>
                <div style={{ fontSize: 10, letterSpacing: '0.1em', color: reached ? 'var(--accent)' : 'var(--text-3)' }}>{reached ? '\u2713' : 'lock'}</div>
                <div style={{ fontWeight: 700, color: 'var(--text-0)', fontSize: 13, marginTop: 6 }}>{s.name}</div>
                <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 4 }}>{s.desc}</div>
              </div>
            )
          })}
        </div>

        {next && (
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: 'var(--text-0)' }}>NEXT: {next.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 4 }}>
                  Requires {formatCompact(next.reqSubs)} subscribers & {formatMoney(next.reqRev)} total revenue.
                </div>
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                <ProgressBar label="SUBS" cur={state.subscribers} req={next.reqSubs} />
                <ProgressBar label="REVENUE" cur={state.totalRevenue} req={next.reqRev} money />
              </div>
            </div>
          </Card>
        )}
      </div>

      <div className="section">
        <div className="section-head"><h2>CHANNELS</h2></div>
        <div className="grid cols-3">
          {Array.from({ length: state.unlockedChannels }).map((_, i) => (
            <Card key={i} style={i === state.activeChannel ? { borderColor: 'var(--accent)' } : undefined} className="hoverable">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: `linear-gradient(135deg, hsl(${i * 90}, 60%, 45%), hsl(${i * 90 + 40}, 60%, 30%))`, display: 'grid', placeItems: 'center', fontSize: 15 }}>▤</div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-0)', fontSize: 13 }}>{state.channelNames[i] || `Channel ${i + 1}`}</div>
                  <div className="mono" style={{ fontSize: 11, color: 'var(--text-2)' }}>{formatCompact(state.subscribers)} subs</div>
                </div>
                {i === state.activeChannel && <Badge tone="accent" style={{ marginLeft: 'auto' }}>ACTIVE</Badge>}
              </div>
            </Card>
          ))}

          {state.unlockedChannels < 3 && (
            <Card className="hoverable" style={{ borderStyle: 'dashed' }}>
              <button style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'var(--text-2)' }} onClick={() => setOpenChannelModal(true)}>
                <div style={{ fontSize: 28 }}>＋</div>
                <div style={{ fontWeight: 700, fontSize: 12 }}>OPEN NEW CHANNEL</div>
                <div style={{ fontSize: 10, color: 'var(--text-3)' }}>
                  {state.unlockedChannels === 1 ? '10K subs' : '50K subs'} + ¥50,000
                </div>
              </button>
            </Card>
          )}
        </div>
      </div>

      <Modal open={openChannelModal} onClose={() => setOpenChannelModal(false)} title="OPEN NEW CHANNEL">
        <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 16 }}>
          Expand your reach with a second channel. Costs ¥50,000 to set up.
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn ghost" style={{ flex: 1 }} onClick={() => setOpenChannelModal(false)}>CANCEL</button>
          <button className="btn primary" style={{ flex: 1 }} onClick={() => { dispatch({ type: 'OPEN_CHANNEL' }); setOpenChannelModal(false) }}>OPEN</button>
        </div>
      </Modal>
    </>
  )
}

function ProgressBar({ label, cur, req, money }: { label: string; cur: number; req: number; money?: boolean }) {
  const pct = Math.min(100, (cur / req) * 100)
  return (
    <div style={{ minWidth: 140 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'var(--text-3)', marginBottom: 4 }}>
        <span>{label}</span>
        <span className="mono">{money ? formatCompact(cur) : formatCompact(cur)}/{formatCompact(req)}</span>
      </div>
      <div className="bar"><div className="fill" style={{ width: `${pct}%` }} /></div>
    </div>
  )
}

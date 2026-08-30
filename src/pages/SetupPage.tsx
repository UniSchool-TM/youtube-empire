import { useGame } from '../game/state/store'
import { Card, Badge } from '../components/ui'
import { EQUIPMENT } from '../data/equipment'
import { computeStats } from '../game/systems/stats'
import { getSubscription } from '../data/subscriptions'
import { SUBSCRIPTIONS } from '../data/subscriptions'
import { GameState, EquipmentCategory } from '../types'
import { formatMoney } from '../utils/format'

const SLOTS: { cat: EquipmentCategory; label: string; emoji: string; x: number; y: number }[] = [
  { cat: 'COMPUTERS', label: 'COMPUTER', emoji: '🖥', x: 18, y: 34 },
  { cat: 'CAMERAS', label: 'CAMERA', emoji: '📷', x: 78, y: 20 },
  { cat: 'AUDIO', label: 'AUDIO', emoji: '🎙', x: 78, y: 62 },
  { cat: 'SOFTWARE', label: 'SOFTWARE', emoji: '🖥', x: 42, y: 70 },
  { cat: 'ACCESSORIES', label: 'ACCESSORIES', emoji: '🖱', x: 10, y: 64 },
  { cat: 'STUDIO', label: 'STUDIO', emoji: '💡', x: 90, y: 82 },
]

export function SetupPage() {
  const { state, dispatch } = useGame()
  const stats = computeStats(state)

  return (
    <>
      <div className="page-header">
        <div className="page-title">CREATOR SETUP</div>
        <div className="page-sub">Your production environment — watch it grow from a bare bedroom into a studio.</div>
      </div>

      <div className="grid cols-2" style={{ marginBottom: 16 }}>
        <Card title="YOUR WORKSPACE">
          <div style={{ position: 'relative', height: 240, background: 'var(--bg-0)', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }} className="fade-in">
            {SLOTS.map((slot) => {
              const equip = EQUIPMENT.find((e) => e.id === state.equipment[slot.cat])
              const isBasic = equip?.tier === 0
              return (
                <div key={slot.cat} style={{ position: 'absolute', left: `${slot.x}%`, top: `${slot.y}%`, textAlign: 'center', transform: 'translate(-50%, -50%)' }}>
                  <div style={{ fontSize: isBasic ? 20 : 30, filter: isBasic ? 'grayscale(0.4) opacity(0.75)' : 'none', transition: 'all 0.3s' }}>{slot.emoji}</div>
                  <div style={{ fontSize: 9, color: isBasic ? 'var(--text-3)' : 'var(--text-0)', fontWeight: 600, marginTop: 2, whiteSpace: 'nowrap' }}>{equip?.name}</div>
                </div>
              )
            })}
            <div style={{ position: 'absolute', bottom: 8, left: 0, right: 0, textAlign: 'center', fontSize: 10, color: 'var(--text-3)' }}>YOUR SETUP — TIER {currentTier(state)}</div>
          </div>
        </Card>

        <Card title="SYSTEM HEALTH">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <HealthBar label="EDITING SPEED" value={stats.editingSpeed} max={400} unit="%" accent />
            <HealthBar label="QUALITY" value={stats.quality} max={100} accent />
            <HealthBar label="VIDEO" value={stats.videoQuality} max={100} base />
            <HealthBar label="AUDIO" value={stats.audioQuality} max={100} base />
            <HealthBar label="DESIGN" value={stats.design} max={100} base />
            <HealthBar label="CRASH RISK" value={stats.crashChance} max={100} inverse danger />
          </div>
        </Card>
      </div>

      <div className="section">
        <div className="section-head"><h2>EQUIPPED GEAR</h2></div>
        <div className="grid cols-3">
          {SLOTS.map((slot) => {
            const equip = EQUIPMENT.find((e) => e.id === state.equipment[slot.cat])
            return (
              <Card key={slot.cat} className="hoverable">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 10, letterSpacing: '0.1em', color: 'var(--text-3)' }}>{slot.label}</span>
                  <Badge tone={equip?.tier === 0 ? 'neutral' : equip?.tier === 1 ? 'info' : equip?.tier === 2 ? 'success' : 'accent'}>T{equip?.tier}</Badge>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-0)', marginTop: 6 }}>{equip?.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>{equip?.price === 0 ? 'Starter' : formatMoney(equip!.price)}</div>
              </Card>
            )
          })}
        </div>
      </div>

      <div className="section">
        <div className="section-head"><h2>SUBSCRIPTIONS</h2></div>
        <div style={{ marginBottom: 12, fontSize: 12, color: 'var(--text-3)' }}>
          Monthly fixed cost: <b style={{ color: state.subscriptions.length ? 'var(--warning)' : 'var(--text-2)' }}>{formatMoney(monthlyTotal(state))}</b>
        </div>
        <div className="grid cols-3">
          {SUBSCRIPTIONS.map((sub) => {
            const active = state.subscriptions.includes(sub.id)
            const canAfford = state.money >= sub.monthlyCost
            return (
              <Card key={sub.id} className="hoverable" style={active ? { borderColor: 'var(--accent-2)', boxShadow: 'var(--shadow-1)' } : undefined}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-0)' }}>{sub.name}</div>
                  {active ? <Badge tone="success">ACTIVE</Badge> : <Badge tone="neutral">INACTIVE</Badge>}
                </div>
                <div className="mono" style={{ fontSize: 13, color: 'var(--accent-2)', marginTop: 6 }}>{formatMoney(sub.monthlyCost)}/mo</div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4, minHeight: 32 }}>{sub.description}</div>
                <ul style={{ fontSize: 11, color: 'var(--text-2)', margin: '8px 0 0', paddingLeft: 16 }}>
                  {sub.features.map((f) => <li key={f}>{f}</li>)}
                </ul>
                <div style={{ marginTop: 12 }}>
                  {active ? (
                    <button className="btn sm ghost" style={{ width: '100%' }} onClick={() => dispatch({ type: 'UNSUBSCRIBE', subId: sub.id })}>CANCEL SUBSCRIPTION</button>
                  ) : (
                    <button className="btn sm primary" style={{ width: '100%' }} disabled={!canAfford} onClick={() => dispatch({ type: 'SUBSCRIBE', subId: sub.id })}>
                      {canAfford ? 'SUBSCRIBE' : 'NEED ¥' + formatMoney(sub.monthlyCost)}
                    </button>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </>
  )

  function monthlyTotal(s: GameState): number {
    return s.subscriptions.reduce((a, id) => a + (getSubscription(id)?.monthlyCost ?? 0), 0)
  }
}

function HealthBar({ label, value, max, unit, accent, base, inverse, danger }: {
  label: string; value: number; max: number; unit?: string; accent?: boolean; base?: boolean; inverse?: boolean; danger?: boolean
}) {
  const pct = Math.min(100, (value / max) * 100)
  const shown = inverse ? 100 - pct : pct
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
        <span style={{ color: 'var(--text-2)', fontSize: 10, letterSpacing: '0.08em' }}>{label}</span>
        <span className="mono" style={{ color: 'var(--text-0)', fontWeight: 700, fontSize: 11 }}>{Math.round(value)}{unit || ''}</span>
      </div>
      <div className="bar">
        <div className={`fill ${danger ? 'danger' : ''}`} style={{ width: `${shown}%`, background: accent ? 'linear-gradient(90deg, var(--accent), var(--accent-2))' : undefined }} />
      </div>
    </div>
  )
}

function currentTier(state: any): number {
  const tiers = Object.values(state.equipment).map((id: any) => EQUIPMENT.find((e) => e.id === id)?.tier ?? 0)
  return Math.max(...tiers)
}

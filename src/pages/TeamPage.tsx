import { useState } from 'react'
import { useGame } from '../game/state/store'
import { Card, Badge, Modal } from '../components/ui'
import { formatMoney } from '../utils/format'

const ROLES = [
  { role: 'editor', name: 'VIDEO EDITOR', icon: '✂', desc: 'Cuts and assembles your footage.', salary: 180000 },
  { role: 'designer', name: 'THUMBNAIL DESIGNER', icon: '🎨', desc: 'Crafts click-worthy thumbnails.', salary: 160000 },
  { role: 'manager', name: 'MANAGER', icon: '🗂', desc: 'Handles schedules and ops.', salary: 220000 },
  { role: 'analyst', name: 'ANALYST', icon: '📊', desc: 'Reads performance and strategy.', salary: 190000 },
  { role: 'researcher', name: 'RESEARCHER', icon: '🔍', desc: 'Finds trends and topics.', salary: 150000 },
]

export function TeamPage() {
  const { state, dispatch } = useGame()
  const [hireRole, setHireRole] = useState<string | null>(null)

  if (state.subscribers < 10000 && state.employees.length === 0) {
    return (
      <>
        <div className="page-header"><div className="page-title">TEAM</div><div className="page-sub">Assemble your crew.</div></div>
        <Card>
          <div className="empty-state">
            <div className="big">🔒</div>
            <div>TEAM unlocks at <b>10,000 subscribers</b></div>
            <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 6 }}>You're at {state.subscribers.toLocaleString()} — keep growing.</div>
          </div>
        </Card>
      </>
    )
  }

  return (
    <>
      <div className="page-header">
        <div className="page-title">YOUR TEAM</div>
        <div className="page-sub">Staff boost your efficiency and quality — but every salary is a fixed cost.</div>
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
        <Badge tone="warning">MONTHLY STAFF COST: {formatMoney(state.employees.reduce((a, e) => a + e.salary, 0))}</Badge>
      </div>

      {state.employees.length > 0 && (
        <div className="grid cols-3" style={{ marginBottom: 24 }}>
          {state.employees.map((emp) => {
            const def = ROLES.find((r) => r.role === emp.role)
            return (
              <Card key={emp.id} className="hoverable">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: `hsl(${emp.avatarHue}, 60%, 22%)`, display: 'grid', placeItems: 'center', fontSize: 20 }}>
                    {def?.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-0)' }}>{emp.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--accent)' }}>{def?.name}</div>
                  </div>
                  <div style={{ marginLeft: 'auto' }}>
                    <button className="btn danger sm" onClick={() => dispatch({ type: 'FIRE_EMPLOYEE', id: emp.id })}>FIRE</button>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 12, fontSize: 11 }}>
                  <Mini skill="SKILL" v={emp.skill} />
                  <Mini skill="EFF" v={emp.efficiency} />
                  <Mini skill="QLTY" v={emp.quality} />
                </div>
                <div className="mono" style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 10 }}>{formatMoney(emp.salary)}/mo</div>
              </Card>
            )
          })}
        </div>
      )}

      <div className="section">
        <div className="section-head"><h2>HIRE</h2></div>
        <div className="grid cols-3">
          {ROLES.map((r) => {
            const already = state.employees.some((e) => e.role === r.role)
            return (
              <Card key={r.role} className="hoverable">
                <div style={{ fontSize: 28 }}>{r.icon}</div>
                <div style={{ fontWeight: 700, color: 'var(--text-0)', marginTop: 8 }}>{r.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 4 }}>{r.desc}</div>
                <div className="mono" style={{ fontSize: 13, color: 'var(--text-1)', marginTop: 10 }}>{formatMoney(r.salary)}/mo</div>
                <div style={{ marginTop: 12 }}>
                  {already
                    ? <button className="btn sm ghost" disabled>HIRED</button>
                    : <button className="btn sm primary" disabled={state.money < r.salary} onClick={() => setHireRole(r.role)}>{state.money < r.salary ? 'NEED FUNDS' : 'HIRE'}</button>}
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      <Modal open={!!hireRole} onClose={() => setHireRole(null)} title="CONFIRM HIRE">
        {hireRole && (() => {
          const r = ROLES.find((x) => x.role === hireRole)!
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-0)' }}>Hire a {r.name}?</div>
              <div style={{ fontSize: 13, color: 'var(--text-2)' }}>{r.desc} — {formatMoney(r.salary)}/mo salary.</div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn ghost" style={{ flex: 1 }} onClick={() => setHireRole(null)}>CANCEL</button>
                <button className="btn primary" style={{ flex: 1 }} onClick={() => { dispatch({ type: 'HIRE_EMPLOYEE', role: r.role }); setHireRole(null) }}>HIRE</button>
              </div>
            </div>
          )
        })()}
      </Modal>
    </>
  )
}

function Mini({ skill, v }: { skill: string; v: number }) {
  return (
    <div style={{ background: 'var(--bg-3)', borderRadius: 6, padding: '6px 8px', flex: 1 }}>
      <div style={{ fontSize: 8, color: 'var(--text-3)', letterSpacing: '0.08em' }}>{skill}</div>
      <div className="mono" style={{ color: 'var(--text-0)', fontWeight: 700, fontSize: 13 }}>{v}</div>
    </div>
  )
}

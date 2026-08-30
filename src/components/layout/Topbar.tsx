import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../../game/state/store'
import { CountUp } from '../ui'

const N_ICON: Record<string, string> = { success: '\u2713', info: 'i', warning: '!', error: '✕', viral: '⚡', unlock: '🏆' }

export function Topbar({ onOpenSettings }: { onOpenSettings: () => void }) {
  const { state, dispatch } = useGame()
  const [open, setOpen] = useState(false)

  return (
    <div className="topbar">
      <div className="day-pill">
        <span className="label">DAY</span>
        <span className="value">{state.day}</span>
      </div>
      <div style={{ width: 1, height: 28, background: 'var(--border)' }} />
      <TopStat label="BALANCE" value={state.money} format="money" />
      <TopStat label="SUBSCRIBERS" value={state.subscribers} format="compact" color="var(--accent-2)" />
      <TopStat label="TOTAL VIEWS" value={state.totalViews} format="compact" />

      <div className="spacer" />

      <div style={{ position: 'relative' }}>
        <button className="topbar-btn" onClick={() => { setOpen((o) => !o); if (!open) dispatch({ type: 'MARK_NOTIFICATIONS_READ' as never }) }}>
          <span>🔔</span>
          {state.unreadNotifications > 0 && !open && <span className="dot" />}
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              className="notif-panel"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <div style={{ padding: '6px 10px 10px', fontSize: 12, fontWeight: 700, color: 'var(--text-0)' }}>
                NOTIFICATIONS
              </div>
              {state.notifications.length === 0 && (
                <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-3)', fontSize: 12 }}>No notifications</div>
              )}
              {[...state.notifications].reverse().map((n) => (
                <div key={n.id} className="notif-item" onClick={() => dispatch({ type: 'DISMISS_NOTIFICATION', id: n.id })}>
                  <div className={`badge ${n.type === 'error' ? 'danger' : n.type === 'success' || n.type === 'unlock' ? 'success' : n.type === 'viral' ? 'warning' : 'info'}`} style={{ minWidth: 24, display: 'grid', placeItems: 'center', padding: 0, height: 24 }}>
                    {N_ICON[n.type] || '•'}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 12, color: 'var(--text-0)' }}>{n.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-2)' }}>{n.message}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button className="topbar-btn" onClick={onOpenSettings} title="Settings">⚙</button>
    </div>
  )
}

function TopStat({ label, value, format, color }: { label: string; value: number; format: 'money' | 'compact'; color?: string }) {
  return (
    <div className="top-stat">
      <span className="label">{label}</span>
      <span className="value" style={color ? { color } : undefined}>
        <CountUp value={value} format={format} />
      </span>
    </div>
  )
}

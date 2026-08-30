import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../../game/state/store'
import { EVENTS } from '../../data/events'

export function EventModal() {
  const { state, dispatch } = useGame()
  const ev = state.pendingEvent ? EVENTS.find((e) => e.id === state.pendingEvent) : null

  if (!ev) return null

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="modal"
          initial={{ scale: 0.9, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          style={{ borderColor: 'var(--warning)', width: 'min(480px, 92vw)' }}
        >
          <div className="badge warning" style={{ marginBottom: 10 }}>⚡ EVENT</div>
          <div className="card-title" style={{ fontSize: 22, marginBottom: 8 }}>{ev.title}</div>
          <p style={{ color: 'var(--text-1)', fontSize: 14, marginBottom: 20 }}>{ev.description}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {ev.choices.map((c, i) => (
              <motion.button
                key={i}
                className="btn ghost"
                style={{ width: '100%', justifyContent: 'space-between', textAlign: 'left', padding: '13px 16px', height: 'auto' }}
                whileHover={{ x: 4 }}
                onClick={() => dispatch({ type: 'RESOLVE_EVENT', eventId: ev.id, choiceIndex: i })}
              >
                <span style={{ fontWeight: 700, color: 'var(--text-0)' }}>{c.label}</span>
                <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{c.hint}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

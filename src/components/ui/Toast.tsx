import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../../game/state/store'

const ICONS: Record<string, string> = {
  success: '\u2713',
  info: 'i',
  warning: '!',
  error: '✕',
  viral: '⚡',
  unlock: '🏆',
}

export function ToastStack() {
  const { state } = useGame()
  const recent = state.notifications.slice(-5)

  return (
    <div className="toast-stack">
      <AnimatePresence>
        {recent.map((n) => (
          <motion.div
            key={n.id}
            className={`toast ${n.type}`}
            initial={{ opacity: 0, x: 60, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          >
            <div className="t-title">
              <span style={{ fontSize: 15 }}>{ICONS[n.type] || '•'}</span>
              {n.title}
            </div>
            <div className="t-msg">{n.message}</div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

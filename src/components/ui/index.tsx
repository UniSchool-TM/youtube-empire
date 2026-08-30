import { motion, AnimatePresence } from 'framer-motion'
import { useCountUp } from '../../hooks/useCountUp'
import { formatNumber, formatMoney, formatCompact } from '../../utils/format'

export function CountUp({ value, format = 'number' }: { value: number; format?: 'number' | 'money' | 'compact' }) {
  const v = useCountUp(value)
  const str = format === 'money' ? formatMoney(v) : format === 'compact' ? formatCompact(v) : formatNumber(v)
  return <span className="mono">{str}</span>
}

export function StatCard({
  label, value, format = 'number', sub, tone = 'default', delay = 0,
}: {
  label: string
  value: number
  format?: 'number' | 'money' | 'compact'
  sub?: string
  tone?: 'default' | 'accent' | 'green'
  delay?: number
}) {
  return (
    <motion.div
      className={`stat-card ${tone !== 'default' ? tone : ''} fade-in`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="stat-label">{label}</div>
      <div className="stat-value">
        <CountUp value={value} format={format} />
      </div>
      {sub && <div className="stat-sub">{sub}</div>}
    </motion.div>
  )
}

export function Card({ title, chip, children, className = '', style }: {
  title?: React.ReactNode; chip?: string; children: React.ReactNode; className?: string; style?: React.CSSProperties
}) {
  return (
    <div className={`card ${className}`} style={style}>
      {(title || chip) && (
        <div className="card-title">
          {title}
          {chip && <span className="chip">{chip}</span>}
        </div>
      )}
      {children}
    </div>
  )
}

export function Bar({ value, max = 100, tone }: { value: number; max?: number; tone?: 'danger' }) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div className="bar">
      <div className={`fill ${tone || ''}`} style={{ width: `${pct}%` }} />
    </div>
  )
}

export function Segmented({ options, value, onChange }: {
  options: { label: string; value: string }[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="seg">
      {options.map((o) => (
        <button key={o.value} className={o.value === value ? 'active' : ''} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function Rating({ value }: { value: number }) {
  const full = Math.floor(value)
  const half = value - full >= 0.5
  const dim = 5 - full - (half ? 1 : 0)
  return (
    <span className="rating">
      {'★'.repeat(full)}
      {half ? '★' : ''}
      <span className="dim">{'★'.repeat(dim)}</span>
    </span>
  )
}

export function Badge({ children, tone = 'neutral', style }: { children: React.ReactNode; tone?: string; style?: React.CSSProperties }) {
  return <span className={`badge ${tone}`} style={style}>{children}</span>
}

export function Modal({ open, onClose, title, children, width }: {
  open: boolean; onClose: () => void; title?: React.ReactNode; children: React.ReactNode; width?: number
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="modal"
            style={width ? { width: `min(${width}px, 92vw)` } : undefined}
            initial={{ scale: 0.92, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 8 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            {title && <div className="card-title" style={{ fontSize: 18 }}>{title}</div>}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function Spinner({ size = 16 }: { size?: number }) {
  return (
    <span className="mono" style={{ fontSize: size, display: 'inline-block', animation: 'spin 0.8s linear infinite' }}>
      ◌
    </span>
  )
}

export function EmptyState({ emoji, text }: { emoji: string; text: string }) {
  return (
    <div className="empty-state fade-in">
      <div className="big">{emoji}</div>
      <div>{text}</div>
    </div>
  )
}

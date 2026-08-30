import { useMemo } from 'react'
import { motion } from 'framer-motion'

interface P { x: number; y: number }

export function AreaChart({
  data, height = 160, color = 'var(--accent)'
}: {
  data: number[] | { x: number; y: number }[]
  height?: number
  color?: string
}) {
  const { path, areaPath } = useMemo(() => {
    const arr: P[] = Array.isArray(data) && data.length && typeof data[0] === 'number'
      ? (data as number[]).map((y, i) => ({ x: i, y }))
      : (data as P[])
    if (arr.length < 2) {
      return { path: '', areaPath: '' }
    }
    const w = 600
    const h = 180
    const max = Math.max(...arr.map((p) => p.y), 1)
    const min = Math.min(...arr.map((p) => p.y), 0)
    const span = max - min || 1
    const px = (i: number) => (i / (arr.length - 1)) * w
    const py = (y: number) => h - ((y - min) / span) * (h - 14) - 7
    const pts = arr.map((p, i) => `${px(i).toFixed(1)},${py(p.y).toFixed(1)}`)
    let path = `M${pts[0]}`
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1].split(',').map(Number)
      const cur = pts[i].split(',').map(Number)
      const mx = (prev[0] + cur[0]) / 2
      path += ` C ${mx},${prev[1]} ${mx},${cur[1]} ${cur[0]},${cur[1]}`
    }
    const area = `${path} L ${w},${h} L 0,${h} Z`
    return { path, areaPath: area }
  }, [data])

  if (data.length < 2) {
    return <div style={{ height, display: 'grid', placeItems: 'center', color: 'var(--text-3)', fontSize: 12 }}>Not enough data</div>
  }

  return (
    <svg viewBox="0 0 600 180" style={{ width: '100%', height: 'auto' }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`grad-${color.replace(/[^a-zA-Z]/g, '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={areaPath}
        fill={`url(#grad-${color.replace(/[^a-zA-Z]/g, '')})`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      />
      <motion.path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={2.5}
        strokeLinejoin="round"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: 'easeInOut' }}
      />
    </svg>
  )
}

export function BarChart({ data, height = 130, color = 'var(--accent)' }: {
  data: number[]; height?: number; color?: string
}) {
  const max = Math.max(...data, 1)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height }}>
      {data.map((d, i) => (
        <motion.div
          key={i}
          style={{
            flex: 1, background: color, borderRadius: '3px 3px 0 0', minHeight: 2,
            opacity: 0.9,
          }}
          initial={{ height: 0 }}
          animate={{ height: `${(d / max) * 100}%` }}
          transition={{ duration: 0.5, delay: i * 0.02, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
    </div>
  )
}

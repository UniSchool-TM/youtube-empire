import { useEffect, useRef, useState } from 'react'

export function useCountUp(target: number, duration = 700): number {
  const [value, setValue] = useState(target)
  const prevRef = useRef(target)

  useEffect(() => {
    const from = prevRef.current
    const to = target
    if (from === to) return
    prevRef.current = to

    const start = performance.now()
    let raf = 0
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

    const step = (now: number) => {
      const elapsed = now - start
      const t = Math.min(1, elapsed / duration)
      const val = from + (to - from) * easeOutCubic(t)
      setValue(val)
      if (t < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])

  return value
}

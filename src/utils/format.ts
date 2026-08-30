export function formatNumber(n: number): string {
  return Math.floor(n).toLocaleString('en-US')
}

export function formatMoney(n: number): string {
  const abs = Math.abs(n)
  const sign = n < 0 ? '-' : ''
  if (abs >= 100000000) return `${sign}¥${(abs / 100000000).toFixed(1)}億`
  if (abs >= 10000) return `${sign}¥${(abs / 10000).toFixed(1)}万`
  return `${sign}¥${Math.floor(abs).toLocaleString('en-US')}`
}

export function formatCompact(n: number): string {
  const abs = Math.abs(n)
  if (abs >= 1000000000) return `${(n / 1000000000).toFixed(1)}B`
  if (abs >= 1000000) return `${(n / 1000000).toFixed(2)}M`
  if (abs >= 1000) return `${(n / 1000).toFixed(1)}K`
  return `${Math.floor(n)}`
}

export function formatViews(n: number): string {
  const abs = Math.floor(Math.abs(n))
  if (abs >= 1000000000) return `${(n / 1000000000).toFixed(1)}B`
  if (abs >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (abs >= 1000) return `${(n / 1000).toFixed(1)}K`
  return `${Math.floor(n).toLocaleString('en-US')}`
}

export function formatPercent(n: number): string {
  return `${n.toFixed(1)}%`
}

export function formatDuration(hours: number): string {
  if (hours < 1) return `${Math.floor(hours * 60)}m`
  if (hours < 24) return `${hours.toFixed(1)}h`
  return `${(hours / 24).toFixed(1)}d`
}

export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n))
}

export function stars(n: number): string {
  const full = '★'.repeat(Math.floor(n))
  const empty = '☆'.repeat(5 - Math.floor(n))
  return full + empty
}

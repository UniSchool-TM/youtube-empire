import { useEffect, useRef } from 'react'
import { GameState } from '../../types'

const SAVE_KEY = 'youtube_empire_save_v1'

export function loadSave(): GameState | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (!data || typeof data.day !== 'number') return null
    return data as GameState
  } catch {
    return null
  }
}

export function persistSave(s: GameState) {
  try {
    const toSave = { ...s, lastSave: Date.now() }
    localStorage.setItem(SAVE_KEY, JSON.stringify(toSave))
  } catch {
    // ignore quota errors
  }
}

export function clearSave() {
  try {
    localStorage.removeItem(SAVE_KEY)
  } catch {
    // ignore
  }
}

export function exportSave(s: GameState): string {
  return JSON.stringify({ ...s, lastSave: Date.now() })
}

export function importSave(json: string): GameState | null {
  try {
    const data = JSON.parse(json)
    if (!data || typeof data.day !== 'number') return null
    return data as GameState
  } catch {
    return null
  }
}

export function useAutosave(s: GameState) {
  const ref = useRef(s)
  ref.current = s
  useEffect(() => {
    const id = setInterval(() => {
      persistSave(ref.current)
    }, 5000)
    return () => clearInterval(id)
  }, [])
}

// save on visibility change / beforeunload
export function useSaveOnExit(s: GameState) {
  const ref = useRef(s)
  ref.current = s
  useEffect(() => {
    const handler = () => persistSave(ref.current)
    window.addEventListener('beforeunload', handler)
    document.addEventListener('visibilitychange', handler)
    return () => {
      window.removeEventListener('beforeunload', handler)
      document.removeEventListener('visibilitychange', handler)
    }
  }, [])
}

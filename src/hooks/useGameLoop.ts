import { useEffect } from 'react'
import { useGame } from '../game/state/store'

// Ticks the game every `intervalMs` milliseconds. Each tick = 1 in-game hour.
export function useGameLoop(intervalMs = 4000) {
  const { dispatch } = useGame()
  useEffect(() => {
    const id = setInterval(() => {
      dispatch({ type: 'TICK' })
    }, intervalMs)
    return () => clearInterval(id)
  }, [dispatch, intervalMs])
}

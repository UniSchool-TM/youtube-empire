import { useState, useEffect } from 'react'
import { GameProvider, useGame } from './game/state/store'
import { useGameLoop } from './hooks/useGameLoop'
import { useAutosave, useSaveOnExit, loadSave } from './game/state/save'
import { Layout } from './components/layout/Layout'
import { EventModal } from './components/ui/EventModal'
import { PageId } from './types'
import { Dashboard } from './pages/Dashboard'
import { ChannelPage } from './pages/ChannelPage'
import { CreatePage } from './pages/CreatePage'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { StorePage } from './pages/StorePage'
import { SetupPage } from './pages/SetupPage'
import { TeamPage } from './pages/TeamPage'
import { SkillsPage } from './pages/SkillsPage'
import { BusinessPage } from './pages/BusinessPage'
import { TrendingPage } from './pages/TrendingPage'
import { AchievementsPage } from './pages/AchievementsPage'

function AppInner() {
  const { state, dispatch } = useGame()
  const [page, setPage] = useState<PageId>('dashboard')
  useGameLoop(4000)
  useAutosave(state)
  useSaveOnExit(state)

  // apply saved state on mount
  useEffect(() => {
    const saved = loadSave()
    if (saved) dispatch({ type: 'LOAD', state: saved })
  }, [dispatch])

  return (
    <Layout page={page} onNavigate={(p) => setPage(p as PageId)}>
      <EventModal />
      {page === 'dashboard' && <Dashboard onNavigate={(p) => setPage(p as PageId)} />}
      {page === 'channel' && <ChannelPage />}
      {page === 'create' && <CreatePage />}
      {page === 'analytics' && <AnalyticsPage />}
      {page === 'store' && <StorePage />}
      {page === 'setup' && <SetupPage />}
      {page === 'team' && <TeamPage />}
      {page === 'skills' && <SkillsPage />}
      {page === 'business' && <BusinessPage />}
      {page === 'trending' && <TrendingPage />}
      {page === 'achievements' && <AchievementsPage />}
    </Layout>
  )
}

export default function App() {
  return (
    <GameProvider>
      <AppInner />
    </GameProvider>
  )
}

import { useState } from 'react'
import { PageId } from '../../types'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { ToastStack } from '../ui/Toast'
import { SettingsModal } from '../settings/SettingsModal'

export function Layout({ page, onNavigate, children }: {
  page: PageId
  onNavigate: (p: PageId) => void
  children: React.ReactNode
}) {
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <div className="app">
      <Sidebar current={page} onNavigate={onNavigate} />
      <main className="main">
        <Topbar onOpenSettings={() => setSettingsOpen(true)} />
        <div className="content" key={page}>
          {children}
        </div>
      </main>
      <ToastStack />
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}

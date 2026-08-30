import { useState } from 'react'
import { Modal } from '../ui'
import { useGame } from '../../game/state/store'
import { exportSave, importSave, clearSave, persistSave } from '../../game/state/save'

export function SettingsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state, dispatch } = useGame()
  const [tab, setTab] = useState<'general' | 'data'>('general')
  const [channelName, setChannelName] = useState(state.channelName)

  const handleExport = () => {
    const json = exportSave(state)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'youtube-empire-save.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      const data = importSave(String(reader.result))
      if (data) dispatch({ type: 'LOAD', state: data })
    }
    reader.readAsText(file)
  }

  const handleNewGame = () => {
    if (confirm('Start a new game? Current progress will be lost.')) {
      clearSave()
      localStorage.removeItem('youtube_empire_save_v1')
      window.location.reload()
    }
  }

  const saveName = () => {
    dispatch({ type: 'SET_CHANNEL_NAME', name: channelName })
    persistSave({ ...state, channelName })
  }

  return (
    <Modal open={open} onClose={onClose} title="SETTINGS" width={460}>
      <div className="seg" style={{ marginBottom: 18 }}>
        <button className={tab === 'general' ? 'active' : ''} onClick={() => setTab('general')}>GENERAL</button>
        <button className={tab === 'data' ? 'active' : ''} onClick={() => setTab('data')}>DATA</button>
      </div>

      {tab === 'general' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 6 }}>CHANNEL NAME</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                style={{ flex: 1, padding: '9px 12px', background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-0)' }}
              />
              <button className="btn primary sm" onClick={saveName}>Save</button>
            </div>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-2)' }}>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>About</div>
            ZERO TO YOUTUBE EMPIRE — a creator business simulator.
          </div>
        </div>
      )}

      {tab === 'data' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button className="btn ghost" onClick={handleExport}>Export Save (JSON)</button>
          <label className="btn ghost" style={{ display: 'flex' }}>
            Import Save
            <input type="file" accept="application/json" style={{ display: 'none' }} onChange={(e) => e.target.files?.[0] && handleImport(e.target.files[0])} />
          </label>
          <button className="btn danger" onClick={handleNewGame}>New Game</button>
        </div>
      )}
    </Modal>
  )
}

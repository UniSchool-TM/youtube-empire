import { useState } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '../game/state/store'
import { Card, Rating, Badge, Bar, Modal, EmptyState } from '../components/ui'
import { VIDEO_IDEAS, getIdea } from '../data/videoIdeas'
import { computeVideoQuality, computeStats } from '../game/systems/stats'
import { ProductionView } from './ProductionView'

export function CreatePage() {
  const { state, dispatch } = useGame()
  const prod = state.production
  const [confirmIdea, setConfirmIdea] = useState<string | null>(null)

  const startProduction = (ideaId: string) => {
    setConfirmIdea(null)
    dispatch({ type: 'START_PRODUCTION', ideaId })
  }

  if (prod) {
    return <ProductionView />
  }

  const stats = computeStats(state)

  return (
    <>
      <div className="page-header">
        <div className="page-title">CREATE VIDEO</div>
        <div className="page-sub">Pick an idea and take it through the production pipeline: IDEA → RESEARCH → SCRIPT → RECORD → EDIT → THUMBNAIL → PUBLISH.</div>
      </div>

      <div className="section-head" style={{ alignItems: 'center' }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-0)', fontFamily: 'var(--font-display)' }}>CONTENT IDEAS</h2>
        <Badge tone="accent">EDIT SPEED ×{stats.editingSpeed / 100}</Badge>
      </div>

      <div className="grid cols-3">
        {VIDEO_IDEAS.map((idea) => (
          <motion.div key={idea.id} whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
            <Card className="hoverable" style={{ height: '100%', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Badge tone="neutral">{idea.tag}</Badge>
                <span style={{ display: 'none' }} />
              </div>
              <div style={{ fontWeight: 600, color: 'var(--text-0)', fontSize: 14, lineHeight: 1.35, minHeight: 40 }}>{idea.title}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: 11, color: 'var(--text-2)' }}>
                <div><div style={{ fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.08em' }}>TREND</div><Rating value={idea.trend} /></div>
                <div><div style={{ fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.08em' }}>POTENTIAL</div><Rating value={idea.potential} /></div>
                <div><div style={{ fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.08em' }}>COMPETITION</div><Rating value={idea.competition} /></div>
                <div><div style={{ fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.08em' }}>COST</div>{'\u25cf'.repeat(idea.productionCost) + '\u25cb'.repeat(8 - idea.productionCost)}</div>
              </div>
              <div style={{ marginTop: 'auto' }}>
                <button className="btn primary" style={{ width: '100%' }} onClick={() => setConfirmIdea(idea.id)}>SELECT IDEA</button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Modal open={!!confirmIdea} onClose={() => setConfirmIdea(null)} title="CONFIRM PRODUCTION">
        {confirmIdea && (() => {
          const idea = getIdea(confirmIdea)!
          const quality = computeVideoQuality(state, idea)
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-0)' }}>{idea.title}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <Stat label="Trend" value={`${idea.trend}/5`} />
                <Stat label="Potential" value={`${idea.potential}/5`} />
                <Stat label="Production Time" value={`${Math.ceil(idea.productionTime * 2 / (stats.editingSpeed / 100))}h`} />
                <Stat label="Estimated Quality" value={`${Math.round(quality)}`} />
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-2)' }}>
                High potential does not guarantee success — but it helps.
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn ghost" style={{ flex: 1 }} onClick={() => setConfirmIdea(null)}>BACK</button>
                <button className="btn primary" style={{ flex: 1 }} onClick={() => startProduction(idea.id)}>START PRODUCTION</button>
              </div>
            </div>
          )
        })()}
      </Modal>
    </>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: 'var(--bg-3)', borderRadius: 8, padding: '10px 12px' }}>
      <div style={{ fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.1em' }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-0)', fontFamily: 'var(--font-mono)' }}>{value}</div>
    </div>
  )
}

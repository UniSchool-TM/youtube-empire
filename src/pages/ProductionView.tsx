import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '../game/state/store'
import { Card, Badge, Bar } from '../components/ui'
import { computeStats } from '../game/systems/stats'

const STAGE_NAMES = ['IDEA', 'RESEARCH', 'SCRIPT', 'RECORD', 'EDIT', 'THUMBNAIL', 'PUBLISH']

export function ProductionView() {
  const { state, dispatch } = useGame()
  const prod = state.production!
  const canPublish = prod.currentStage === prod.stages.length - 1 && prod.stages[prod.stages.length - 1].done

  return (
    <>
      <div className="page-header">
        <div className="page-title">IN PRODUCTION</div>
        <div className="page-sub">"{prod.title}" — working through the pipeline.</div>
      </div>

      <Card>
        <div className="progress-steps">
          {prod.stages.map((st, i) => (
            <div key={st.id} className={`step ${i < prod.currentStage || st.done ? 'done' : ''} ${i === prod.currentStage ? 'active' : ''}`}>
              <div className="circle">{i < prod.currentStage || st.done ? '\u2713' : i + 1}</div>
              <div className="s-label">{st.name}</div>
            </div>
          ))}
        </div>
      </Card>

      <div style={{ marginTop: 20 }}>
        <Card>
          <div className="card-title">{prod.stages[prod.currentStage].name}</div>
          <div className="progress-label">
            <span>{prod.stages[prod.currentStage].name} — working</span>
            <span>{Math.floor(prod.stages[prod.currentStage].progress)}%</span>
          </div>
          <Bar value={prod.stages[prod.currentStage].progress} />
          <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 8 }}>
            Production continues automatically as time passes in-game.
          </div>
        </Card>
      </div>

      {canPublish ? (
        <Card style={{ marginTop: 16, borderColor: 'var(--accent)', boxShadow: 'var(--shadow-glow)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ fontSize: 32, animation: 'pulse 1.6s infinite' }}>📤</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: 'var(--text-0)', fontSize: 16 }}>READY TO PUBLISH</div>
              <div style={{ fontSize: 12, color: 'var(--text-2)' }}>Your video is complete and rendered. Publish it to the world?</div>
            </div>
            <button className="btn green lg" onClick={() => dispatch({ type: 'PUBLISH_VIDEO' })}>PUBLISH VIDEO</button>
          </div>
        </Card>
      ) : (
        <Card style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-3)', fontSize: 12 }}>
            <span className="pulse">●</span> Production running — next: {prod.stages[Math.min(prod.currentStage + 1, prod.stages.length - 1)].name}
          </div>
        </Card>
      )}
    </>
  )
}

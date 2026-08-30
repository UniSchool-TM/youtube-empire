import { useState } from 'react'
import { useGame } from '../game/state/store'
import { Card, Badge, Modal } from '../components/ui'
import { EQUIPMENT } from '../data/equipment'
import { Equipment, EquipmentCategory, EquipStats } from '../types'
import { formatMoney } from '../utils/format'

const CATEGORIES: EquipmentCategory[] = ['COMPUTERS', 'CAMERAS', 'AUDIO', 'SOFTWARE', 'ACCESSORIES', 'STUDIO']

export function StorePage() {
  const { state, dispatch } = useGame()
  const [cat, setCat] = useState<EquipmentCategory>('COMPUTERS')
  const [buyItem, setBuyItem] = useState<Equipment | null>(null)

  const items = EQUIPMENT.filter((e) => e.category === cat)
  const currentId = state.equipment[cat]
  const current = EQUIPMENT.find((e) => e.id === currentId)

  return (
    <>
      <div className="page-header">
        <div className="page-title">CREATOR STORE</div>
        <div className="page-sub">Upgrade your equipment and software to boost quality and speed.</div>
      </div>

      <div className="seg" style={{ marginBottom: 20, flexWrap: 'wrap' }}>
        {CATEGORIES.map((c) => (
          <button key={c} className={cat === c ? 'active' : ''} onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>

      <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 12 }}>
        CURRENTLY EQUIPPED: <span style={{ color: 'var(--text-0)', fontWeight: 600 }}>{current?.name}</span>
      </div>

      <div className="grid cols-3">
        {items.map((item) => {
          const owned = state.ownedEquipment.includes(item.id)
          const equipped = state.equipment[cat] === item.id
          const affordable = state.money >= item.price
          return (
            <Card key={item.id} className={equipped ? '' : 'hoverable'} style={equipped ? { borderColor: 'var(--accent)', boxShadow: 'var(--shadow-glow)' } : {}}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <div className="card-title" style={{ marginBottom: 0 }}>{item.name}</div>
                {equipped && <Badge tone="accent">EQUIPPED</Badge>}
                {owned && !equipped && <Badge tone="success">OWNED</Badge>}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-2)', minHeight: 36, marginBottom: 10 }}>{item.description}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }}>
                <StatDelta current={current} next={item} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="mono" style={{ fontWeight: 700, color: item.price === 0 ? 'var(--accent-2)' : 'var(--text-0)', fontSize: 15 }}>
                  {item.price === 0 ? 'FREE' : formatMoney(item.price)}
                </span>
                {!owned && (
                  <button className={`btn ${affordable ? 'primary' : 'ghost'}`} onClick={() => setBuyItem(item)}>
                    {affordable ? 'BUY' : 'INSUFFICIENT'}
                  </button>
                )}
                {owned && !equipped && (
                  <button className="btn ghost" onClick={() => dispatch({ type: 'EQUIP_ITEM', category: cat, equipId: item.id })}>EQUIP</button>
                )}
                {equipped && <button className="btn ghost" disabled>EQUIPPED</button>}
              </div>
            </Card>
          )
        })}
      </div>

      <Modal open={!!buyItem} onClose={() => setBuyItem(null)} title="CONFIRM PURCHASE">
        {buyItem && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-0)' }}>{buyItem.name}</div>
            <div style={{ fontSize: 13, color: 'var(--text-2)' }}>{buyItem.description}</div>
            <div style={{ background: 'var(--bg-3)', borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.1em', marginBottom: 8 }}>EFFECTS</div>
              <StatDelta current={current} next={buyItem} showAll />
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: state.money >= buyItem.price ? 'var(--text-0)' : 'var(--danger)' }} className="mono">
              {formatMoney(buyItem.price)} {state.money < buyItem.price && '— INSUFFICIENT FUNDS'}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn ghost" style={{ flex: 1 }} onClick={() => setBuyItem(null)}>CANCEL</button>
              <button className="btn primary" style={{ flex: 1 }} disabled={state.money < buyItem.price}
                onClick={() => { dispatch({ type: 'BUY_EQUIPMENT', category: cat, equipId: buyItem.id }); setBuyItem(null) }}>
                PURCHASE
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}

function StatDelta({ current, next, showAll = false }: { current?: Equipment; next: Equipment; showAll?: boolean }) {
  if (!current) return null
  const keys: (keyof EquipStats)[] = ['editingSpeed', 'quality', 'videoQuality', 'audioQuality', 'design', 'crashChance']
  const show = showAll ? keys : keys.filter((k) => (next.stats[k] ?? 0) !== 0)
  return (
    <div className="compare">
      {show.map((k) => {
        if (k === 'crashChance') return null
        const cur = current.stats[k] ?? 0
        const nx = next.stats[k] ?? 0
        if (nx === 0 && !showAll) return null
        const delta = nx - cur
        return (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="mono" style={{ textTransform: 'uppercase', fontSize: 10, color: 'var(--text-3)' }}>{k}</span>
            <span>
              <span style={{ color: 'var(--text-2)' }}>{k === 'editingSpeed' ? `${cur}%` : k === 'videoQuality' || k === 'audioQuality' || k === 'design' ? cur : showAll ? cur : ''} </span>
              {delta !== 0 && (
                <span className={delta > 0 ? 'up' : 'down'} style={{ fontWeight: 700 }}>
                  {k === 'editingSpeed' && next.id !== 'free_editor' ? `→ ×${(nx / 100).toFixed(2)}` : delta > 0 ? `+${delta}` : `${delta}`}
                </span>
              )}
            </span>
          </div>
        )
      })}
    </div>
  )
}

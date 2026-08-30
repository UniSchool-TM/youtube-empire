import { useGame } from '../game/state/store'
import { Card, Badge } from '../components/ui'
import { SKILLS, getSkill } from '../data/skills'
import { skillCost, skillCurrent } from '../game/systems/skillSystem'
import { formatMoney } from '../utils/format'

const TREES = ['CONTENT', 'EDITING', 'MARKETING', 'BUSINESS']

export function SkillsPage() {
  const { state, dispatch } = useGame()

  return (
    <>
      <div className="page-header">
        <div className="page-title">CREATOR SKILLS</div>
        <div className="page-sub">Invest in yourself. Skills compound into better content and business.</div>
      </div>

      {TREES.map((tree) => {
        const skills = SKILLS.filter((s) => s.tree === tree)
        return (
          <div className="section" key={tree}>
            <div className="section-head">
              <h2>{tree}</h2>
              <Badge tone="accent">{skills.filter((s) => skillCurrent(state, s.id) > 0).length}/{skills.length} LEARNED</Badge>
            </div>
            <div className="grid cols-2">
              {skills.map((skill) => {
                const level = skillCurrent(state, skill.id)
                const cost = skillCost(state, skill.id)
                const maxed = level >= skill.maxLevel
                const affordable = state.money >= cost
                return (
                  <Card key={skill.id} className="hoverable">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-0)', fontSize: 14 }}>{skill.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 4 }}>{skill.description}</div>
                      </div>
                      <Badge tone={maxed ? 'success' : level > 0 ? 'accent' : 'neutral'}>
                        {level}/{skill.maxLevel}
                      </Badge>
                    </div>
                    <div className="bar" style={{ marginTop: 12 }}>
                      <div className="fill" style={{ width: `${(level / skill.maxLevel) * 100}%` }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                      <span className="mono" style={{ fontSize: 12, color: 'var(--text-2)' }}>{formatMoney(cost)}</span>
                      <button
                        className="btn sm primary"
                        disabled={maxed || !affordable}
                        onClick={() => dispatch({ type: 'BUY_SKILL', skillId: skill.id })}
                      >
                        {maxed ? 'MAXED' : affordable ? 'LEVEL UP' : 'NEED FUNDS'}
                      </button>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        )
      })}
    </>
  )
}

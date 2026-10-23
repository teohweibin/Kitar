import { useCallback, useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { BadgeCheck, Coins, Inbox, Trophy } from 'lucide-react'
import TopBar from '../../components/TopBar.jsx'
import CategoryIcon from '../../components/CategoryIcon.jsx'
import Chip from '../../components/Chip.jsx'
import PointsHero from '../../components/PointsHero.jsx'
import { EmptyState, ErrorState, SkeletonList } from '../../components/StateViews.jsx'
import { listMyCollections } from '../../lib/api.js'
import { useResidentRewards } from '../../lib/useResidentRewards.js'
import './Rewards.css'

const TABS = [
  { id: 'history', label: 'History' },
  { id: 'leaderboard', label: 'Leaderboard' },
]

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-MY', { weekday: 'short', day: 'numeric', month: 'short' })
}

function History() {
  const [state, setState] = useState({ status: 'loading', rows: [], error: null })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false
    listMyCollections()
      .then((rows) => !cancelled && setState({ status: 'ready', rows, error: null }))
      .catch((error) => !cancelled && setState({ status: 'error', rows: [], error }))
    return () => {
      cancelled = true
    }
  }, [attempt])

  const retry = useCallback(() => {
    setState({ status: 'loading', rows: [], error: null })
    setAttempt((n) => n + 1)
  }, [])

  if (state.status === 'loading') return <SkeletonList count={5} height={96} />
  if (state.status === 'error') return <ErrorState message={state.error.message} onRetry={retry} />
  if (state.rows.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title="No collections yet"
        action={<Link to="/resident/bag" className="btn btn--primary">Show my QR</Link>}
      >
        Drop your first bag at the recycling point.
      </EmptyState>
    )
  }

  return (
    <ul className="history">
      {state.rows.map((row) => (
        <li key={row.id} className="history__card">
          <div className="history__top">
            <CategoryIcon categoryId={row.category_id} />
            <div className="history__text">
              <p className="history__title">
                {row.waste_categories?.name_en ?? row.category_id} · <span className="num">{row.weight_kg} kg</span>
              </p>
              <p className="muted history__ms">{row.waste_categories?.name_ms}</p>
            </div>
            <p className="history__date num">{formatDate(row.collected_at)}</p>
          </div>
          <div className="history__bottom">
            <p className="history__points num">
              <Coins size={16} aria-hidden="true" /> {row.points} points
            </p>
            <Chip tone="success" icon={<BadgeCheck />}>Verified</Chip>
          </div>
        </li>
      ))}
    </ul>
  )
}

function currentMonthLabel() {
  return new Date().toLocaleDateString('en-MY', { month: 'long', year: 'numeric' })
}

function Leaderboard({ rows, myTownshipId }) {
  const month = currentMonthLabel()
  if (rows.every((row) => row.participating_units === 0)) {
    return (
      <EmptyState icon={Trophy} title="No collections this month yet">
        The ranking starts with the first weighed bag of {month}.
      </EmptyState>
    )
  }
  return (
    <>
      <p className="muted leaderboard__caption">
        {month} · ranked by kg per taking-part unit, so big and small townships compare fairly
      </p>
      <ol className="leaderboard">
        {rows.map((row, index) => {
          const mine = row.township_id === myTownshipId
          return (
            <li key={row.township_id} className={`leaderboard__row${mine ? ' is-mine' : ''}`}>
              <span className="leaderboard__rank num">#{index + 1}</span>
              <div className="leaderboard__text">
                <p className="leaderboard__name">
                  {row.township_name}
                  {mine && <span className="leaderboard__tag">Your township</span>}
                </p>
                <p className="muted leaderboard__meta num">
                  {row.participation_pct}% of units taking part · {row.total_kg} kg total
                </p>
              </div>
              <p className="leaderboard__value num">
                {row.kg_per_participating_unit}
                <span className="muted"> kg/unit</span>
              </p>
            </li>
          )
        })}
      </ol>
    </>
  )
}

export default function Rewards() {
  const [params, setParams] = useSearchParams()
  const tab = params.get('tab') === 'leaderboard' ? 'leaderboard' : 'history'
  const rewards = useResidentRewards()

  return (
    <>
      <TopBar title="Rewards" />
      <main className="screen">
        {rewards.status === 'loading' && <div className="skeleton" style={{ height: 200 }} aria-busy="true" />}
        {rewards.status === 'error' && <ErrorState message={rewards.error.message} onRetry={rewards.retry} />}
        {rewards.status === 'ready' && (
          <PointsHero
            points={rewards.points.points}
            rank={rewards.rank}
            townshipCount={rewards.leaderboard.length}
            showProgress
          />
        )}

        <div className="tabs" role="tablist" aria-label="Rewards">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              className={`tabs__tab${tab === t.id ? ' is-active' : ''}`}
              onClick={() => setParams(t.id === 'history' ? {} : { tab: t.id }, { replace: true })}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div role="tabpanel">
          {tab === 'history' ? (
            <History />
          ) : rewards.status === 'ready' ? (
            <Leaderboard rows={rewards.leaderboard} myTownshipId={rewards.unit?.township_id} />
          ) : (
            <SkeletonList count={3} />
          )}
        </div>
      </main>
    </>
  )
}

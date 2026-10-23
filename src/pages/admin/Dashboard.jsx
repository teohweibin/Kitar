import { useCallback, useEffect, useMemo, useState } from 'react'
import { Leaf, Package, Scale, Users } from 'lucide-react'
import TopBar from '../../components/TopBar.jsx'
import SignOutButton from '../../components/SignOutButton.jsx'
import GlassCard from '../../components/GlassCard.jsx'
import StatCard from '../../components/StatCard.jsx'
import { ErrorState, SkeletonList } from '../../components/StateViews.jsx'
import { KgBarListChart, KgByMonthChart, KgColumnChart } from '../../components/charts.jsx'
import { getAdminData, listCategories } from '../../lib/api.js'
import { availableMonths, buildDashboard, monthLabel } from '../../lib/dashboard.js'
import './Dashboard.css'

function formatDateTime(iso) {
  return new Date(iso).toLocaleString('en-MY', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })
}

export default function Dashboard() {
  const [state, setState] = useState({ status: 'loading', data: null, error: null })
  const [attempt, setAttempt] = useState(0)
  const [month, setMonth] = useState('all')
  const [township, setTownship] = useState('all')

  useEffect(() => {
    let cancelled = false
    Promise.all([getAdminData(), listCategories()])
      .then(([admin, categories]) => !cancelled && setState({ status: 'ready', data: { ...admin, categories }, error: null }))
      .catch((error) => !cancelled && setState({ status: 'error', data: null, error }))
    return () => {
      cancelled = true
    }
  }, [attempt])

  const retry = useCallback(() => {
    setState({ status: 'loading', data: null, error: null })
    setAttempt((n) => n + 1)
  }, [])

  const months = useMemo(() => (state.data ? availableMonths(state.data.collections) : []), [state.data])
  const townships = useMemo(() => {
    const seen = new Map()
    state.data?.units.forEach((u) => seen.set(u.township_id, u.township_name))
    return [...seen.entries()].sort((a, b) => a[1].localeCompare(b[1]))
  }, [state.data])
  const view = useMemo(
    () => (state.data ? buildDashboard(state.data, { month, township }) : null),
    [state.data, month, township],
  )

  const periodLabel = month === 'all' ? 'all time' : monthLabel(month, 'long')

  return (
    <>
      <TopBar title="Sustainability dashboard" right={<SignOutButton />} />
      <main className="screen dashboard">
        <div className="dashboard__filters">
          <label className="dashboard__filter">
            <span className="field__label">Month</span>
            <select className="dashboard__select" value={month} onChange={(e) => setMonth(e.target.value)}>
              <option value="all">All time</option>
              {months.map((key) => (
                <option key={key} value={key}>{monthLabel(key, 'long')}</option>
              ))}
            </select>
          </label>
          <label className="dashboard__filter">
            <span className="field__label">Township</span>
            <select className="dashboard__select" value={township} onChange={(e) => setTownship(e.target.value)}>
              <option value="all">All townships</option>
              {townships.map(([id, name]) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>
          </label>
          <p className="muted dashboard__note">All figures come from sample data.</p>
        </div>

        {state.status === 'loading' && <SkeletonList count={4} height={110} />}
        {state.status === 'error' && <ErrorState message={state.error.message} onRetry={retry} />}

        {view && (
          <>
            <section className="dashboard__stats" aria-label="Summary">
              <StatCard icon={Scale} label="Total recycled" value={view.totalKg.toLocaleString('en-MY')} unit="kg" note={`Weighed and verified, ${periodLabel}`} />
              <StatCard
                icon={Users}
                label="Units taking part"
                value={`${view.participationPct}%`}
                note={`${view.activeUnits} of ${view.unitCount} units, ${periodLabel}`}
              />
              <StatCard icon={Package} label="Collections" value={view.collectionsCount.toLocaleString('en-MY')} note={`Bags weighed, ${periodLabel}`} />
              {view.co2e == null ? (
                <StatCard icon={Leaf} label="CO2e avoided (estimate)" value="–" note="Add a cited emission factor per category to show this." />
              ) : (
                <StatCard
                  icon={Leaf}
                  label="CO2e avoided (estimate)"
                  value={view.co2e.toLocaleString('en-MY')}
                  unit="kg"
                  note="Estimate from cited factors. Hover for sources."
                  title={view.co2eSources.join('\n')}
                />
              )}
            </section>

            <section className="dashboard__charts">
              <GlassCard className="dashboard__chart dashboard__chart--wide">
                <h2 className="dashboard__chart-title">Kilograms recycled per month</h2>
                <KgByMonthChart data={view.perMonth} />
              </GlassCard>
              <GlassCard className="dashboard__chart">
                <h2 className="dashboard__chart-title">Kilograms per township · {periodLabel}</h2>
                <KgColumnChart data={view.perTownship} />
              </GlassCard>
              <GlassCard className="dashboard__chart">
                <h2 className="dashboard__chart-title">Kilograms per category · {periodLabel}</h2>
                <KgBarListChart data={view.perCategory} />
              </GlassCard>
            </section>

            <GlassCard className="dashboard__table-card">
              <h2 className="dashboard__chart-title">Latest collections</h2>
              {view.latest.length === 0 ? (
                <p className="muted">No collections for this filter.</p>
              ) : (
                <div className="dashboard__table-wrap">
                  <table className="dashboard__table">
                    <thead>
                      <tr>
                        <th scope="col">Date</th>
                        <th scope="col">Unit</th>
                        <th scope="col">Township</th>
                        <th scope="col">Category</th>
                        <th scope="col" className="is-num">kg</th>
                        <th scope="col">Collector</th>
                      </tr>
                    </thead>
                    <tbody>
                      {view.latest.map((row) => (
                        <tr key={row.id}>
                          <td className="num">{formatDateTime(row.date)}</td>
                          <td className="mono">{row.unitCode}</td>
                          <td>{row.township}</td>
                          <td>{row.category}</td>
                          <td className="num is-num">{row.kg}</td>
                          <td className="mono muted">{row.collector}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </GlassCard>
          </>
        )}
      </main>
    </>
  )
}

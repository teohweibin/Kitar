import { useCallback, useEffect, useState } from 'react'
import { Printer, Sun } from 'lucide-react'
import TopBar from '../../components/TopBar.jsx'
import GlassCard from '../../components/GlassCard.jsx'
import QrCard from '../../components/QrCard.jsx'
import { ErrorState } from '../../components/StateViews.jsx'
import { getMyUnit } from '../../lib/api.js'
import './Bag.css'

export default function Bag() {
  const [state, setState] = useState({ status: 'loading', unit: null, error: null })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false
    getMyUnit()
      .then((unit) =>
        !cancelled &&
        setState(unit ? { status: 'ready', unit, error: null } : { status: 'error', unit: null, error: new Error('No unit is linked to this account.') }),
      )
      .catch((error) => !cancelled && setState({ status: 'error', unit: null, error }))
    return () => {
      cancelled = true
    }
  }, [attempt])

  const retry = useCallback(() => {
    setState({ status: 'loading', unit: null, error: null })
    setAttempt((n) => n + 1)
  }, [])

  return (
    <>
      <TopBar title="My Bag" />
      <main className="screen bag">
        {state.status === 'loading' && <div className="skeleton bag__skeleton" aria-busy="true" />}
        {state.status === 'error' && <ErrorState message={state.error.message} onRetry={retry} />}

        {state.status === 'ready' && (
          <>
            <QrCard token={state.unit.qr_token} unitCode={state.unit.unit_code} townshipName={state.unit.township_name} />

            <p className="bag__instruction">
              Show this to the collector, or stick the printed label on your recycling bag.
            </p>

            <button type="button" className="btn btn--primary btn--block" onClick={() => window.print()}>
              <Printer size={20} aria-hidden="true" /> Print label
            </button>

            <GlassCard className="bag__tip">
              <Sun size={20} className="bag__tip-icon" aria-hidden="true" />
              <p className="muted">Turn your screen brightness up so the collector&apos;s camera can read the code.</p>
            </GlassCard>
          </>
        )}
      </main>
    </>
  )
}

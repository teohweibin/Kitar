import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { BarChart3, CircleAlert, ClipboardList, Home as HomeIcon } from 'lucide-react'
import { useAuth, homeFor } from '../lib/authContext.js'
import { supabaseConfigError } from '../lib/supabase.js'
import TopBar from '../components/TopBar.jsx'
import LoadingScreen from '../components/LoadingScreen.jsx'
import NoProfileScreen from '../components/NoProfileScreen.jsx'
import './Login.css'

// One-tap, password-free demo for judges: an anonymous session with a demo role.
const QUICK_DEMO = [
  { role: 'resident', label: 'Resident', note: 'Scan, sort and earn points', icon: HomeIcon },
  { role: 'collector', label: 'Collector', note: 'Scan bags and weigh them', icon: ClipboardList },
  { role: 'admin', label: 'Admin', note: 'See the dashboard', icon: BarChart3 },
]

export default function Login() {
  const { session, profile, loading, startDemo } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(supabaseConfigError)

  if (loading && !submitting) return <LoadingScreen />
  if (session && profile) return <Navigate to={homeFor(profile.role)} replace />
  if (session && !loading && !submitting) return <NoProfileScreen />

  async function quickSignIn(account) {
    setError(null)
    setSubmitting(account.role)
    try {
      await startDemo(account.role)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="app-shell">
      <TopBar title="" backTo="/" />
      <main className="screen login">
        <header className="login__brand">
          <p className="login__name">
            Kitar<span aria-hidden="true">.</span>
          </p>
          <p className="login__tagline">Recycle, verified.</p>
        </header>

        <section className="login__quick" aria-labelledby="quick-title">
          <h1 id="quick-title" className="login__title">Try the demo</h1>
          <p className="muted login__quick-hint">One tap, no account or password needed.</p>
          <div className="login__quick-list">
            {QUICK_DEMO.map((account) => {
              const Icon = account.icon
              return (
                <button
                  key={account.role}
                  type="button"
                  className="login__quick-item"
                  onClick={() => quickSignIn(account)}
                  disabled={Boolean(submitting) || Boolean(supabaseConfigError)}
                >
                  <span className="login__quick-icon" aria-hidden="true"><Icon size={22} /></span>
                  <span className="login__quick-text">
                    <span className="login__quick-label">
                      {submitting === account.role ? 'Opening…' : `Try as ${account.label}`}
                    </span>
                    <span className="muted login__quick-note">{account.note}</span>
                  </span>
                </button>
              )
            })}
          </div>
          {error && (
            <div className="alert" role="alert">
              <CircleAlert size={18} aria-hidden="true" />
              <p>{error}</p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

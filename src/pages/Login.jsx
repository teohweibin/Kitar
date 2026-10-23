import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { BarChart3, CircleAlert, ClipboardList, Home as HomeIcon, Lock, Mail } from 'lucide-react'
import { useAuth, homeFor } from '../lib/authContext.js'
import { supabaseConfigError } from '../lib/supabase.js'
import TopBar from '../components/TopBar.jsx'
import GlassCard from '../components/GlassCard.jsx'
import LoadingScreen from '../components/LoadingScreen.jsx'
import NoProfileScreen from '../components/NoProfileScreen.jsx'
import './Login.css'

// One-tap, password-free demo for judges: an anonymous session with a demo role.
const QUICK_DEMO = [
  { role: 'resident', label: 'Resident', note: 'Scan, sort and earn points', icon: HomeIcon },
  { role: 'collector', label: 'Collector', note: 'Scan bags and weigh them', icon: ClipboardList },
  { role: 'admin', label: 'Admin', note: 'See the dashboard', icon: BarChart3 },
]

// Seeded demo accounts. Emails only: passwords are set in Supabase and never shown here.
const DEMO_ACCOUNTS = [
  { email: 'resident1@demo.test', role: 'Resident · SAMPLE-A-0101' },
  { email: 'resident2@demo.test', role: 'Resident · SAMPLE-B-0101' },
  { email: 'collector1@demo.test', role: 'Collector' },
  { email: 'admin@demo.test', role: 'Admin' },
]

export default function Login() {
  const { session, profile, loading, signIn, startDemo } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await signIn(email.trim(), password)
    } catch (err) {
      setError(err.message === 'Invalid login credentials' ? 'Wrong email or password. Please try again.' : err.message)
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

        <GlassCard hero>
          <form className="login__form" onSubmit={handleSubmit} noValidate>
            <h2 className="login__title login__title--small">Or sign in with email</h2>

            <label className="field">
              <span className="field__label">Email</span>
              <span className="field__control">
                <Mail size={18} className="field__icon" aria-hidden="true" />
                <input
                  className="input"
                  type="email"
                  autoComplete="username"
                  placeholder="you@demo.test"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </span>
            </label>

            <label className="field">
              <span className="field__label">Password</span>
              <span className="field__control">
                <Lock size={18} className="field__icon" aria-hidden="true" />
                <input
                  className="input"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </span>
            </label>

            <button
              type="submit"
              className="btn btn--primary btn--block"
              disabled={submitting || !email || !password || Boolean(supabaseConfigError)}
            >
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </GlassCard>

        <section className="login__demo" aria-labelledby="demo-title">
          <h2 id="demo-title" className="login__demo-title">Presenter accounts</h2>
          <p className="muted login__demo-hint">Tap one to fill the email. Passwords are shared by the presenter.</p>
          <ul className="login__demo-list">
            {DEMO_ACCOUNTS.map((account) => (
              <li key={account.email}>
                <button type="button" className="login__demo-item" onClick={() => setEmail(account.email)}>
                  <span className="mono">{account.email}</span>
                  <span className="muted">{account.role}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  )
}

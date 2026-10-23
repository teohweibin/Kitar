import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, MapPin, Search } from 'lucide-react'
import TopBar from '../../components/TopBar.jsx'
import GlassCard from '../../components/GlassCard.jsx'
import SignOutButton from '../../components/SignOutButton.jsx'
import PointsHero from '../../components/PointsHero.jsx'
import { ErrorState } from '../../components/StateViews.jsx'
import { useResidentRewards } from '../../lib/useResidentRewards.js'
import './Home.css'

// Sample schedule: collections happen every Saturday morning.
function nextSaturday(from = new Date()) {
  const date = new Date(from)
  date.setDate(date.getDate() + ((6 - date.getDay() + 7) % 7 || 7))
  return date
}

export default function Home() {
  const navigate = useNavigate()
  const { status, unit, points, rank, leaderboard, error, retry } = useResidentRewards()
  const [query, setQuery] = useState('')
  const collectionDay = nextSaturday()

  function handleSearch(event) {
    event.preventDefault()
    const q = query.trim()
    navigate(q ? `/resident/guide?q=${encodeURIComponent(q)}` : '/resident/guide')
  }

  return (
    <>
      <TopBar title="" right={<SignOutButton />} />
      <main className="screen home">
        <header className="home__greeting">
          <p className="home__hello">
            Selamat datang <span className="home__accent">Start recycling today!</span>
          </p>
          <p className="muted">
            {unit ? (
              <>
                <span className="mono">{unit.unit_code}</span>
                {unit.township_name && ` · ${unit.township_name}`}
              </>
            ) : status === 'loading' ? (
              'Loading your unit…'
            ) : null}
          </p>
        </header>

        {status === 'loading' && <div className="skeleton" style={{ height: 132 }} aria-busy="true" />}
        {status === 'error' && <ErrorState message={error.message} onRetry={retry} />}
        {status === 'ready' && (
          <PointsHero points={points.points} rank={rank} townshipCount={leaderboard.length} link />
        )}

        <form className="home__search" onSubmit={handleSearch} role="search">
          <label className="field__control">
            <span className="visually-hidden">What do you want to throw away?</span>
            <Search size={18} className="field__icon" aria-hidden="true" />
            <input
              className="input"
              type="search"
              placeholder="What do you want to throw away?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              enterKeyHint="search"
            />
          </label>
        </form>

        <GlassCard className="home__next">
          <div className="home__next-row">
            <CalendarDays size={22} className="home__next-icon" aria-hidden="true" />
            <div>
              <p className="home__next-title">Next collection</p>
              <p className="muted">Bring your QR bag to the recycling point</p>
            </div>
          </div>
          <div className="home__next-meta">
            <span className="num">
              {collectionDay.toLocaleDateString('en-MY', { weekday: 'short', day: 'numeric', month: 'short' })} · 9:00 AM
            </span>
            <span className="muted home__place">
              <MapPin size={14} aria-hidden="true" /> Township recycling point (sample)
            </span>
          </div>
        </GlassCard>
      </main>
    </>
  )
}

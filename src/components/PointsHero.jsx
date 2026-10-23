import { Link } from 'react-router-dom'
import { Coins } from 'lucide-react'
import GlassCard from './GlassCard.jsx'
import { tierProgress } from '../lib/tiers.js'
import './PointsHero.css'

// Hero card from design.md: points balance, township rank and progress to the next sample tier.
export default function PointsHero({ points, rank, townshipCount, showProgress = false, link = false }) {
  const { current, next, progress } = tierProgress(points)

  return (
    <GlassCard hero className="points-hero">
      <div className="points-hero__row">
        <div>
          <p className="muted points-hero__label">Your points</p>
          <p className="points-hero__balance num">
            <Coins size={26} className="points-hero__coin" aria-hidden="true" />
            {points.toLocaleString('en-MY')}
          </p>
        </div>
        {rank && (
          <span className="points-hero__rank num">
            #{rank} of {townshipCount} this month
          </span>
        )}
      </div>

      {showProgress && (
        <div className="points-hero__progress">
          <div className="points-hero__progress-head">
            <span>{current.name}</span>
            <span className="num">
              {next ? `${Math.floor(progress * 100)}% to ${next.name}` : 'Top tier reached'}
            </span>
          </div>
          <div
            className="points-hero__track"
            role="progressbar"
            aria-label={next ? `Progress to ${next.name}` : 'Top tier reached'}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.floor(progress * 100)}
          >
            <span className="points-hero__fill" style={{ width: `${progress * 100}%` }} />
          </div>
          <p className="muted points-hero__note">Rewards are sample values in this prototype.</p>
        </div>
      )}

      {link && (
        <Link to="/resident/rewards" className="points-hero__link">View rewards</Link>
      )}
    </GlassCard>
  )
}

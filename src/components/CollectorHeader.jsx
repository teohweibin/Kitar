import { useEffect, useState } from 'react'
import { Package } from 'lucide-react'
import TopBar from './TopBar.jsx'
import SignOutButton from './SignOutButton.jsx'
import { countMyCollectionsToday } from '../lib/api.js'
import './CollectorHeader.css'

const STEPS = ['Scan', 'Weigh', 'Done']

// Top bar + Scan → Weigh → Done step indicator + today's bag count.
export default function CollectorHeader({ step, backTo }) {
  const [today, setToday] = useState(null)

  useEffect(() => {
    countMyCollectionsToday().then(setToday).catch(() => setToday(null))
  }, [])

  return (
    <>
      <TopBar title="Collector" backTo={backTo} right={<SignOutButton />} />
      <div className="collector-head">
        <ol className="collector-steps" aria-label="Progress">
          {STEPS.map((label, index) => (
            <li
              key={label}
              className={`collector-steps__step${index === step ? ' is-current' : ''}${index < step ? ' is-done' : ''}`}
              aria-current={index === step ? 'step' : undefined}
            >
              <span className="collector-steps__dot">{index + 1}</span>
              {label}
            </li>
          ))}
        </ol>
        <p className="collector-head__today num">
          <Package size={16} aria-hidden="true" /> Today: {today ?? '–'} {today === 1 ? 'bag' : 'bags'}
        </p>
      </div>
    </>
  )
}

import { useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Building2,
  Camera,
  ClipboardList,
  Coins,
  Home as HomeIcon,
  QrCode,
  Recycle,
  Scale,
  Smartphone,
  Trophy,
} from 'lucide-react'
import LandingPhone from '../components/LandingPhone.jsx'
import { homeFor, useAuth } from '../lib/authContext.js'
import { useActiveStep, useReveal, useScrollVars } from '../lib/useLandingMotion.js'
import './Landing.css'

const PROBLEMS = [
  { title: 'Campaign-based', body: 'Recycling drives start and stop. When a campaign ends, so does the habit.' },
  { title: 'Unmeasured', body: 'Manual collection means nobody knows how much each household or township recycles.' },
  { title: 'Confusing', body: 'Residents want to help but aren’t sure what goes where, so good recyclables end up in the bin.' },
]

const STEPS = [
  { icon: Camera, title: 'Scan an item', body: 'Point the camera at a can, carton or bottle. On-device AI shows which bin it goes in and how to prepare it, in English and Malay.' },
  { icon: QrCode, title: 'Drop it in your QR bag', body: 'Every unit has its own QR code. Print it as a bag label or show it on the phone. No names, just a random code.' },
  { icon: Scale, title: 'The collector weighs it', body: 'At the township recycling point, the collector scans the bag, picks the category and enters the weight on a big keypad.' },
  { icon: Trophy, title: 'Points and rank update', body: 'Verified kilograms become points for the household and push the township up the monthly leaderboard.' },
  { icon: BarChart3, title: 'SDP sees the numbers', body: 'The sustainability dashboard shows kilograms by township, category and month, ready for Zero Waste 2030 tracking.' },
]

const AUDIENCES = [
  { icon: HomeIcon, title: 'Residents', body: 'Know what to recycle, see every bag counted, and earn points that their whole township competes on.' },
  { icon: ClipboardList, title: 'Collectors', body: 'Scan, tap, weigh, save. A one-handed flow built for outdoor use with large keys and clear confirmations.' },
  { icon: Building2, title: 'SDP sustainability team', body: 'Verified data per township instead of campaign estimates, to track Zero Waste 2030 and support Scope 3 reporting.' },
]

const IMPACT = [
  { icon: BadgeCheck, title: 'Verified, not self-reported', body: 'Points come only from bags a collector weighed and scanned. Photos teach; scales count.' },
  { icon: BarChart3, title: 'Measurable by design', body: 'Every kilogram is tied to a unit, a category and a date, so progress is visible month by month.' },
  { icon: Trophy, title: 'A habit, not a campaign', body: 'Monthly township rankings and points give residents a reason to keep going after launch day.' },
  { icon: Coins, title: 'Low cost to run', body: 'Runs in the phone browser, uses phones and scales collectors already have, and the bag tag is a printed label.' },
]

const ROLLOUT = [
  { when: 'Month 0', title: 'Set up', body: 'Print QR bag labels, choose one strata township, onboard its collectors.' },
  { when: 'Months 1–3', title: 'Pilot', body: 'Measure kilograms per unit and participation every month on the dashboard.' },
  { when: 'Month 4', title: 'Reward', body: 'Link points to the existing maintenance-offset pilot for that township.' },
  { when: 'Then', title: 'Roll out', body: 'Add more townships and bring Kitar into SDP’s owner app.' },
]

export default function Landing() {
  const { session, profile } = useAuth()
  const rootRef = useRef(null)
  const stepRefs = useRef([])
  useReveal(rootRef)
  useScrollVars(rootRef)
  const activeStep = useActiveStep(stepRefs)

  const signedIn = Boolean(session && profile)
  const primary = signedIn
    ? { to: homeFor(profile.role), label: 'Open my Kitar' }
    : { to: '/login', label: 'Try the demo' }

  return (
    <div className="landing" ref={rootRef}>
      <div className="landing__progress" aria-hidden="true" />

      <nav className="landing-nav" aria-label="Landing">
        <Link to="/" className="landing-nav__brand">
          Kitar<span aria-hidden="true">.</span>
        </Link>
        <div className="landing-nav__links">
          <a href="#how-it-works">How it works</a>
          <a href="#impact">Impact</a>
          <a href="#rollout">Rollout</a>
        </div>
        <div className="landing-nav__actions">
          {!signedIn && <Link to="/login" className="landing-nav__login">Log in</Link>}
          <Link to={primary.to} className="landing-pill">{primary.label}</Link>
        </div>
      </nav>

      {/* Hero */}
      <header className="landing-hero">
        <div className="landing-hero__copy">
          <h1 className="landing-hero__title" data-reveal>
            Recycling, <span>verified.</span>
          </h1>
          <p className="landing-hero__lead" data-reveal>
            Kitar turns township recycling into a measured habit. Residents learn what goes where, every bag is weighed
            and recorded, and Sime Darby Property sees real numbers for Zero Waste 2030.
          </p>
          <div className="landing-hero__actions" data-reveal>
            <Link to={primary.to} className="landing-pill landing-pill--large">
              {primary.label} <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <a href="#how-it-works" className="landing-hero__secondary">See how it works</a>
          </div>
        </div>

        <div className="landing-hero__visual" aria-hidden="true">
          <div className="landing-orb">
            <span className="landing-orb__core" />
            <span className="landing-orb__ring" />
            <Recycle className="landing-orb__icon" size={72} strokeWidth={1.25} />
          </div>
          <div className="landing-float landing-float--a">
            <p className="landing-float__label">Latest collection</p>
            <p className="landing-float__value">Plastic · 2.4 kg</p>
            <span className="landing-float__ok"><BadgeCheck size={14} /> Verified</span>
          </div>
          <div className="landing-float landing-float--b">
            <p className="landing-float__label">This month</p>
            <p className="landing-float__value">#1 of 3 townships</p>
            <span className="landing-float__bar"><span /></span>
          </div>
          <div className="landing-float landing-float--c">
            <Coins size={16} /> +24 points
          </div>
        </div>
      </header>

      {/* Problem */}
      <section className="landing-section landing-problem" aria-labelledby="problem-title">
        <p className="landing-eyebrow" data-reveal>The problem</p>
        <h2 id="problem-title" className="landing-statement" data-reveal>
          SDP has pledged <em>Zero Waste by 2030</em>. But today, community recycling can&apos;t be measured household by
          household.
        </h2>
        <div className="landing-problem__grid">
          {PROBLEMS.map((p, i) => (
            <article key={p.title} className="landing-tile" data-reveal style={{ '--delay': `${i * 90}ms` }}>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* How it works: sticky phone, steps scroll past */}
      <section id="how-it-works" className="landing-section landing-how" aria-labelledby="how-title">
        <div className="landing-how__intro">
          <p className="landing-eyebrow" data-reveal>How it works</p>
          <h2 id="how-title" className="landing-heading" data-reveal>From the bin to the dashboard in five steps</h2>
        </div>
        <div className="landing-how__body">
          <div className="landing-how__sticky">
            <LandingPhone active={activeStep} />
            <ol className="landing-how__dots" aria-hidden="true">
              {STEPS.map((s, i) => (
                <li key={s.title} className={i === activeStep ? 'is-active' : ''} />
              ))}
            </ol>
          </div>
          <ol className="landing-how__steps">
            {STEPS.map(({ icon: Icon, title, body }, i) => (
              <li
                key={title}
                ref={(el) => {
                  stepRefs.current[i] = el
                }}
                data-step={i}
                className={`landing-step${i === activeStep ? ' is-active' : ''}`}
              >
                <span className="landing-step__number">{String(i + 1).padStart(2, '0')}</span>
                <span className="landing-step__icon" aria-hidden="true"><Icon size={22} /></span>
                <h3>{title}</h3>
                <p>{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Who it's for */}
      <section className="landing-section" aria-labelledby="who-title">
        <p className="landing-eyebrow" data-reveal>Who it&apos;s for</p>
        <h2 id="who-title" className="landing-heading" data-reveal>One loop, three people</h2>
        <div className="landing-cards">
          {AUDIENCES.map(({ icon: Icon, title, body }, i) => (
            <article key={title} className="landing-card" data-reveal style={{ '--delay': `${i * 90}ms` }}>
              <span className="landing-card__icon" aria-hidden="true"><Icon size={22} /></span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Impact */}
      <section id="impact" className="landing-section" aria-labelledby="impact-title">
        <p className="landing-eyebrow" data-reveal>Impact</p>
        <h2 id="impact-title" className="landing-heading" data-reveal>What changes when every bag is counted</h2>
        <div className="landing-impact">
          {IMPACT.map(({ icon: Icon, title, body }, i) => (
            <article key={title} className="landing-impact__item" data-reveal style={{ '--delay': `${i * 80}ms` }}>
              <Icon size={22} aria-hidden="true" />
              <div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Rollout */}
      <section id="rollout" className="landing-section" aria-labelledby="rollout-title">
        <p className="landing-eyebrow" data-reveal>Feasibility &amp; rollout</p>
        <h2 id="rollout-title" className="landing-heading" data-reveal>Start with one township</h2>
        <ol className="landing-timeline">
          {ROLLOUT.map((r, i) => (
            <li key={r.title} className="landing-timeline__item" data-reveal style={{ '--delay': `${i * 120}ms` }}>
              <span className="landing-timeline__when">{r.when}</span>
              <h3>{r.title}</h3>
              <p>{r.body}</p>
            </li>
          ))}
        </ol>
        <p className="landing-note" data-reveal>
          <Smartphone size={16} aria-hidden="true" /> Works in any phone browser and installs like an app. No app store,
          no special hardware.
        </p>
      </section>

      {/* Call to action */}
      <section className="landing-cta" data-reveal>
        <h2>See it working</h2>
        <p>Try it as a resident, a collector or the SDP team. Demo accounts are on the next screen.</p>
        <Link to={primary.to} className="landing-pill landing-pill--large">
          {primary.label} <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </section>
    </div>
  )
}

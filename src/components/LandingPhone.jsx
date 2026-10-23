import { BadgeCheck, CupSoda, QrCode, ScanLine, Trophy } from 'lucide-react'
import './LandingPhone.css'

// A simplified phone that shows one app screen per "How it works" step.
// Drawn in HTML/CSS, not screenshots.
const SCREENS = [
  function ScanScreen() {
    return (
      <div className="phone-screen phone-scan">
        <div className="phone-scan__frame">
          <span className="phone-corner phone-corner--tl" />
          <span className="phone-corner phone-corner--tr" />
          <span className="phone-corner phone-corner--bl" />
          <span className="phone-corner phone-corner--br" />
          <CupSoda size={64} strokeWidth={1.5} />
        </div>
        <div className="phone-card">
          <p className="phone-card__title">Aluminium drink can</p>
          <p className="phone-card__muted">Tin minuman aluminium</p>
          <span className="phone-chip"><span className="phone-dot phone-dot--orange" /> Orange bin</span>
        </div>
      </div>
    )
  },
  function BagScreen() {
    return (
      <div className="phone-screen phone-bag">
        <div className="phone-bag__qr">
          <QrCode size={110} strokeWidth={1.25} />
          <p className="phone-bag__code">SAMPLE-A-0101</p>
        </div>
        <p className="phone-card__muted">Show this to the collector</p>
      </div>
    )
  },
  function WeighScreen() {
    return (
      <div className="phone-screen phone-weigh">
        <p className="phone-weigh__unit">SAMPLE-A-0101</p>
        <div className="phone-weigh__tiles">
          <span>Paper</span>
          <span className="is-selected">Plastic</span>
          <span>Metal</span>
          <span>Glass</span>
        </div>
        <p className="phone-weigh__kg">2.4<small> kg</small></p>
        <span className="phone-button">Save collection</span>
      </div>
    )
  },
  function PointsScreen() {
    return (
      <div className="phone-screen phone-points">
        <div className="phone-card phone-card--hero">
          <p className="phone-card__muted">Your points</p>
          <p className="phone-points__value">+24</p>
          <span className="phone-chip phone-chip--accent"><Trophy size={12} /> #1 of 3 this month</span>
        </div>
        <div className="phone-card phone-row">
          <span>Plastic · 2.4 kg</span>
          <span className="phone-chip phone-chip--ok"><BadgeCheck size={12} /> Verified</span>
        </div>
      </div>
    )
  },
  function DashboardScreen() {
    return (
      <div className="phone-screen phone-dash">
        <p className="phone-card__muted">Kilograms per township</p>
        <div className="phone-dash__bars">
          <span style={{ height: '88%' }} />
          <span style={{ height: '62%' }} />
          <span style={{ height: '45%' }} />
        </div>
        <div className="phone-dash__labels">
          <span>Hijau</span>
          <span>Damai</span>
          <span>Indah</span>
        </div>
      </div>
    )
  },
]

export const PHONE_SCREEN_COUNT = SCREENS.length

export default function LandingPhone({ active }) {
  return (
    <div className="phone" aria-hidden="true">
      <div className="phone__notch" />
      <div className="phone__top">
        <ScanLine size={14} /> Kitar
      </div>
      <div className="phone__viewport">
        {SCREENS.map((Screen, index) => (
          <div key={index} className={`phone__layer${index === active ? ' is-active' : ''}`}>
            <Screen />
          </div>
        ))}
      </div>
    </div>
  )
}

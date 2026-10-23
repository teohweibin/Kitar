import GlassCard from './GlassCard.jsx'
import './StatCard.css'

// Dashboard stat tile: label, big value, one supporting line.
export default function StatCard({ icon: Icon, label, value, unit, note, title }) {
  return (
    <GlassCard className="stat-card" title={title}>
      <p className="stat-card__label">
        {Icon && <Icon size={16} aria-hidden="true" />}
        {label}
      </p>
      <p className="stat-card__value num">
        {value}
        {unit && <span className="stat-card__unit">{unit}</span>}
      </p>
      {note && <p className="muted stat-card__note">{note}</p>}
    </GlassCard>
  )
}

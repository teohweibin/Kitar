import { CircleAlert, Inbox } from 'lucide-react'
import GlassCard from './GlassCard.jsx'
import './StateViews.css'

export function EmptyState({ icon: Icon = Inbox, title, children, action }) {
  return (
    <GlassCard className="state-view">
      <Icon size={28} className="state-view__icon" aria-hidden="true" />
      <p className="state-view__title">{title}</p>
      {children && <p className="muted state-view__body">{children}</p>}
      {action}
    </GlassCard>
  )
}

export function ErrorState({ message, onRetry }) {
  return (
    <GlassCard className="state-view" role="alert">
      <CircleAlert size={28} className="state-view__icon state-view__icon--danger" aria-hidden="true" />
      <p className="state-view__title">Something went wrong</p>
      <p className="muted state-view__body">{message}</p>
      {onRetry && (
        <button type="button" className="btn btn--secondary" onClick={onRetry}>
          Try again
        </button>
      )}
    </GlassCard>
  )
}

export function SkeletonList({ count = 4, height = 76 }) {
  return (
    <div className="skeleton-list" aria-busy="true">
      <span className="visually-hidden">Loading…</span>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="skeleton" style={{ height }} />
      ))}
    </div>
  )
}

import { Link, Navigate, useLocation } from 'react-router-dom'
import { Check, Coins, ScanLine } from 'lucide-react'
import CollectorHeader from '../../components/CollectorHeader.jsx'
import './Collector.css'

export default function Done() {
  const saved = useLocation().state
  if (!saved) return <Navigate to="/collector/scan" replace />

  return (
    <>
      <CollectorHeader step={2} />
      <main className="screen collector-screen done">
        <div className="done__check" aria-hidden="true">
          <Check size={56} strokeWidth={3} />
        </div>
        <h2 className="done__title" role="status">Saved</h2>
        <p className="done__summary">
          <span className="mono">{saved.unitCode}</span> · {saved.categoryName} ·{' '}
          <span className="num">{saved.weightKg} kg</span>
        </p>
        <p className="done__points num">
          <Coins size={20} aria-hidden="true" /> +{saved.points} points for this unit
        </p>
        <Link to="/collector/scan" className="btn btn--primary btn--block done__next">
          <ScanLine size={20} aria-hidden="true" /> Scan next bag
        </Link>
      </main>
    </>
  )
}

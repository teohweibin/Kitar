import { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Save } from 'lucide-react'
import CollectorHeader from '../../components/CollectorHeader.jsx'
import CategoryIcon from '../../components/CategoryIcon.jsx'
import Keypad from '../../components/Keypad.jsx'
import BottomSheet from '../../components/BottomSheet.jsx'
import { ErrorState, SkeletonList } from '../../components/StateViews.jsx'
import { insertCollection, listCategories } from '../../lib/api.js'
import { isValidWeight, pressKey } from '../../lib/weight.js'
import './Collector.css'

export default function Weigh() {
  const navigate = useNavigate()
  const unit = useLocation().state?.unit
  const [categories, setCategories] = useState({ status: 'loading', list: [], error: null })
  const [categoryId, setCategoryId] = useState(null)
  const [weight, setWeight] = useState('')
  const [confirming, setConfirming] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  useEffect(() => {
    listCategories()
      .then((list) => setCategories({ status: 'ready', list, error: null }))
      .catch((error) => setCategories({ status: 'error', list: [], error }))
  }, [])

  // Reached without scanning a bag first (e.g. a refresh): start again.
  if (!unit) return <Navigate to="/collector/scan" replace />

  const category = categories.list.find((c) => c.id === categoryId)
  const canSave = Boolean(category) && isValidWeight(weight)
  const kg = Number(weight)
  const points = category ? Math.round(kg * category.points_per_kg) : 0

  async function save() {
    if (saving) return
    setSaving(true)
    setSaveError(null)
    try {
      await insertCollection({ unitId: unit.id, categoryId, weightKg: kg })
      navigate('/collector/done', {
        replace: true,
        state: { unitCode: unit.unit_code, categoryName: category.name_en, weightKg: kg, points },
      })
    } catch (error) {
      setSaveError(error.message)
      setSaving(false)
      setConfirming(false)
    }
  }

  return (
    <>
      <CollectorHeader step={1} backTo="/collector/scan" />
      <main className="screen collector-screen">
        <header className="weigh__unit">
          <p className="weigh__unit-code mono">{unit.unit_code}</p>
          {unit.township_name && <p className="muted">{unit.township_name}</p>}
        </header>

        <section aria-labelledby="category-title">
          <h2 id="category-title" className="weigh__label">Category</h2>
          {categories.status === 'loading' && <SkeletonList count={2} height={64} />}
          {categories.status === 'error' && <ErrorState message={categories.error.message} />}
          {categories.status === 'ready' && (
            <div className="weigh__categories" role="radiogroup" aria-label="Category">
              {categories.list.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  role="radio"
                  aria-checked={categoryId === c.id}
                  aria-label={c.name_en}
                  className={`weigh__category${categoryId === c.id ? ' is-selected' : ''}`}
                  onClick={() => setCategoryId(c.id)}
                >
                  <CategoryIcon categoryId={c.id} size={36} />
                  <span>{c.name_en}</span>
                </button>
              ))}
            </div>
          )}
        </section>

        <section aria-labelledby="weight-title">
          <h2 id="weight-title" className="weigh__label">Weight</h2>
          <p className="weigh__display num" aria-live="polite">
            {weight || '0'}
            <span className="weigh__unit-kg">kg</span>
          </p>
          <Keypad onKey={(key) => setWeight((value) => pressKey(value, key))} disabled={saving} />
        </section>

        {saveError && <ErrorState message={`Not saved: ${saveError}`} />}

        <div className="weigh__footer">
          <button type="button" className="btn btn--primary btn--block weigh__save" disabled={!canSave} onClick={() => setConfirming(true)}>
            <Save size={20} aria-hidden="true" /> Save collection
          </button>
        </div>
      </main>

      {confirming && (
        <BottomSheet title="Save this bag?" onClose={() => !saving && setConfirming(false)}>
          <p className="weigh__confirm">
            Save <strong className="num">{kg} kg</strong> {category.name_en} for{' '}
            <strong className="mono">{unit.unit_code}</strong>?
          </p>
          <p className="muted weigh__confirm-note">Saved collections can&apos;t be edited.</p>
          <div className="weigh__confirm-actions">
            <button type="button" className="btn btn--secondary" onClick={() => setConfirming(false)} disabled={saving}>
              Change
            </button>
            <button type="button" className="btn btn--primary" onClick={save} disabled={saving}>
              {saving ? 'Saving…' : 'Confirm'}
            </button>
          </div>
        </BottomSheet>
      )}
    </>
  )
}

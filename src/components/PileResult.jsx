import { useId } from 'react'
import { Link } from 'react-router-dom'
import { Ban, Plus, X } from 'lucide-react'
import { binLabel } from '../lib/guide.js'
import GlassCard from './GlassCard.jsx'
import CategoryIcon from './CategoryIcon.jsx'
import { BinDot } from './Chip.jsx'
import './PileResult.css'

const BIN_ORDER = ['blue', 'orange', 'brown', 'qr-bag', 'drop-off']
const NOT_RECYCLABLE = 'none'

// Pile-scan result: found items grouped by where they go. Residents can remove wrong
// guesses and add items the scan missed.
export default function PileResult({ found, allItems, categoriesById, onRemove, onAdd }) {
  const addId = useId()

  const groups = new Map()
  for (const item of found) {
    const bin = categoriesById[item.category_id]?.bin_colour ?? NOT_RECYCLABLE
    if (!groups.has(bin)) groups.set(bin, [])
    groups.get(bin).push(item)
  }
  const orderedBins = [...BIN_ORDER, NOT_RECYCLABLE].filter((bin) => groups.has(bin))
  const addable = allItems.filter((item) => !found.some((f) => f.id === item.id))

  return (
    <GlassCard hero className="pile">
      <div className="pile__head">
        <p className="pile__title">
          Found {found.length} {found.length === 1 ? 'item' : 'items'}
        </p>
        <p className="muted pile__hint">Remove anything that&apos;s wrong, and add what we missed.</p>
      </div>

      {found.length === 0 && (
        <p className="muted">
          We couldn&apos;t spot any items. Spread them out so each one is visible, or add them below.
        </p>
      )}

      {orderedBins.map((bin) => (
        <section key={bin} className="pile__group" aria-label={bin === NOT_RECYCLABLE ? 'Not recyclable' : binLabel(bin)}>
          <h3 className="pile__group-title">
            {bin === NOT_RECYCLABLE ? (
              <>
                <Ban size={14} className="pile__ban" aria-hidden="true" /> Not recyclable here
              </>
            ) : (
              <>
                <BinDot binColour={bin} /> {binLabel(bin)}
              </>
            )}
          </h3>
          <ul className="pile__list">
            {groups.get(bin).map((item) => (
              <li key={item.id} className="pile__item">
                <CategoryIcon categoryId={item.category_id} size={40} />
                <Link to={`/resident/guide?item=${item.id}`} className="pile__name">
                  {item.name_en}
                  <span className="muted pile__ms">{item.name_ms}</span>
                </Link>
                <button
                  type="button"
                  className="pile__remove"
                  aria-label={`Remove ${item.name_en}`}
                  onClick={() => onRemove(item.id)}
                >
                  <X size={18} />
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <label className="pile__add" htmlFor={addId}>
        <Plus size={18} aria-hidden="true" />
        <span className="visually-hidden">Add an item the scan missed</span>
        <select
          id={addId}
          className="pile__select"
          value=""
          onChange={(e) => e.target.value && onAdd(e.target.value)}
        >
          <option value="">Add an item we missed…</option>
          {addable.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name_en} · {item.name_ms}
            </option>
          ))}
        </select>
      </label>
    </GlassCard>
  )
}

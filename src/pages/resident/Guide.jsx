import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Ban, ChevronRight, Search, SearchX, WifiOff } from 'lucide-react'
import TopBar from '../../components/TopBar.jsx'
import CategoryIcon from '../../components/CategoryIcon.jsx'
import Chip, { BinDot } from '../../components/Chip.jsx'
import BottomSheet from '../../components/BottomSheet.jsx'
import ItemDetail from '../../components/ItemDetail.jsx'
import { EmptyState, ErrorState, SkeletonList } from '../../components/StateViews.jsx'
import { useGuide } from '../../lib/useGuide.js'
import { binLabel, searchItems } from '../../lib/guide.js'
import './Guide.css'

export default function Guide() {
  const { status, guide, error, categoriesById, retry } = useGuide()
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const categoryFilter = params.get('cat') ?? 'all'
  const openItemId = params.get('item')

  // Keep search, filter and open item in the URL so Home and Scan can link straight here.
  const updateParam = useCallback(
    (key, value) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          if (value) next.set(key, value)
          else next.delete(key)
          return next
        },
        { replace: true },
      )
    },
    [setParams],
  )

  const results = useMemo(
    () => (guide ? searchItems(guide.items, categoriesById, query, categoryFilter) : []),
    [guide, categoriesById, query, categoryFilter],
  )
  const openItem = guide?.items.find((item) => item.id === openItemId)
  const closeSheet = useCallback(() => updateParam('item', null), [updateParam])

  const chips = [
    { id: 'all', label: 'All' },
    ...(guide?.categories ?? []).map((c) => ({ id: c.id, label: c.name_en })),
    { id: 'none', label: 'Not recyclable' },
  ]

  return (
    <>
      <TopBar title="Guide" />
      <main className="screen guide">
        <label className="field__control">
          <span className="visually-hidden">Search the sorting guide</span>
          <Search size={18} className="field__icon" aria-hidden="true" />
          <input
            className="input"
            type="search"
            placeholder="Search in English or Malay"
            value={query}
            onChange={(e) => updateParam('q', e.target.value)}
          />
        </label>

        <div className="guide__chips" role="group" aria-label="Filter by category">
          {chips.map((chip) => (
            <button
              key={chip.id}
              type="button"
              className={`guide__chip${categoryFilter === chip.id ? ' is-active' : ''}`}
              aria-pressed={categoryFilter === chip.id}
              onClick={() => updateParam('cat', chip.id === 'all' ? null : chip.id)}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {guide?.fromCache && (
          <p className="guide__offline">
            <WifiOff size={16} aria-hidden="true" /> You&apos;re offline. Showing the saved guide.
          </p>
        )}

        {status === 'loading' && <SkeletonList />}
        {status === 'error' && <ErrorState message={error.message} onRetry={retry} />}

        {status === 'ready' && results.length === 0 && (
          <EmptyState icon={SearchX} title="No match">
            Try another word, or ask your collector.
          </EmptyState>
        )}

        {status === 'ready' && results.length > 0 && (
          <ul className="guide__list" aria-live="polite">
            {results.map((item) => {
              const category = categoriesById[item.category_id]
              return (
                <li key={item.id}>
                  <button type="button" className="guide__item" onClick={() => updateParam('item', item.id)}>
                    <CategoryIcon categoryId={item.category_id} />
                    <span className="guide__item-text">
                      <span className="guide__item-name">{item.name_en}</span>
                      <span className="guide__item-ms">{item.name_ms}</span>
                      {category ? (
                        <Chip tone="bin" icon={<BinDot binColour={category.bin_colour} />}>
                          {binLabel(category.bin_colour)}
                        </Chip>
                      ) : (
                        <Chip tone="danger" icon={<Ban />}>Not recyclable here</Chip>
                      )}
                    </span>
                    <ChevronRight size={20} className="guide__chevron" aria-hidden="true" />
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </main>

      {openItem && (
        <BottomSheet title={openItem.name_en} onClose={closeSheet}>
          <ItemDetail item={openItem} category={categoriesById[openItem.category_id]} />
        </BottomSheet>
      )}
    </>
  )
}

// Sorting-guide helpers shared by Guide, Scan and Home.

const BIN_LABELS = {
  blue: 'Blue bin',
  orange: 'Orange bin',
  brown: 'Brown bin',
  'qr-bag': 'QR bag (collector sorts)',
  'drop-off': 'Hand to collector',
}

export function binLabel(binColour) {
  return BIN_LABELS[binColour] ?? binColour
}

function normalise(text) {
  return text.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').trim()
}

// Every word of the query must appear in the item's names, keywords or category names (EN or BM).
export function searchItems(items, categoriesById, query, categoryId = 'all') {
  const terms = normalise(query).split(/\s+/).filter(Boolean)
  return items.filter((item) => {
    if (categoryId === 'none' ? item.category_id !== null : categoryId !== 'all' && item.category_id !== categoryId) {
      return false
    }
    if (terms.length === 0) return true
    const category = categoriesById[item.category_id]
    const haystack = normalise(
      [item.name_en, item.name_ms, ...item.keywords, category?.name_en ?? '', category?.name_ms ?? ''].join(' '),
    )
    return terms.every((term) => haystack.includes(term))
  })
}

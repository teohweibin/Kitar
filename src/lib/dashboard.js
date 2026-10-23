// Pure aggregation for the admin dashboard. Inputs come from getAdminData() + listCategories().

export function monthKey(iso) {
  const d = new Date(iso)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export function monthLabel(key, style = 'short') {
  const [year, month] = key.split('-').map(Number)
  return new Date(year, month - 1, 1).toLocaleDateString('en-MY', { month: style, year: 'numeric' })
}

const round1 = (n) => Math.round(n * 10) / 10

// filters: { month: 'all' | 'YYYY-MM', township: 'all' | township id }
export function buildDashboard({ collections, units, categories }, filters) {
  const unitById = Object.fromEntries(units.map((u) => [u.id, u]))
  const categoryById = Object.fromEntries(categories.map((c) => [c.id, c]))
  const inTownship = (c) => filters.township === 'all' || unitById[c.unit_id]?.township_id === filters.township
  const inMonth = (c) => filters.month === 'all' || monthKey(c.collected_at) === filters.month

  const scoped = collections.filter((c) => inTownship(c) && inMonth(c))
  const scopedUnits = units.filter((u) => filters.township === 'all' || u.township_id === filters.township)
  const totalKg = scoped.reduce((sum, c) => sum + c.weight_kg, 0)
  const activeUnits = new Set(scoped.map((c) => c.unit_id)).size

  // CO2e only for categories with a cited factor (none in the sample seed).
  const factorCategories = categories.filter((c) => c.co2e_kg_per_kg != null)
  const co2e = factorCategories.length
    ? scoped.reduce((sum, c) => sum + c.weight_kg * Number(categoryById[c.category_id]?.co2e_kg_per_kg ?? 0), 0)
    : null

  // Month trend ignores the month filter so the line always shows the whole period.
  const byMonth = new Map()
  for (const c of collections.filter(inTownship)) {
    const key = monthKey(c.collected_at)
    byMonth.set(key, (byMonth.get(key) ?? 0) + c.weight_kg)
  }
  // The current month is still running, so its dip is labelled rather than looking like a decline.
  const thisMonth = monthKey(new Date().toISOString())
  const perMonth = [...byMonth.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, kg]) => ({ key, label: key === thisMonth ? `${monthLabel(key)} (so far)` : monthLabel(key), kg: round1(kg) }))

  const townshipNames = new Map(units.map((u) => [u.township_id, u.township_name]))
  const byTownship = new Map([...townshipNames.keys()].map((id) => [id, 0]))
  for (const c of collections.filter(inMonth)) {
    const id = unitById[c.unit_id]?.township_id
    if (id) byTownship.set(id, byTownship.get(id) + c.weight_kg)
  }
  const perTownship = [...byTownship.entries()]
    .map(([id, kg]) => ({ id, label: townshipNames.get(id), kg: round1(kg) }))
    .sort((a, b) => b.kg - a.kg)

  const byCategory = new Map(categories.map((c) => [c.id, 0]))
  for (const c of scoped) byCategory.set(c.category_id, (byCategory.get(c.category_id) ?? 0) + c.weight_kg)
  const perCategory = categories
    .map((c) => ({ id: c.id, label: c.name_en, kg: round1(byCategory.get(c.id) ?? 0) }))
    .sort((a, b) => b.kg - a.kg)

  const latest = scoped.slice(0, 20).map((c) => ({
    id: c.id,
    date: c.collected_at,
    unitCode: unitById[c.unit_id]?.unit_code ?? '–',
    township: unitById[c.unit_id]?.township_name ?? '–',
    category: categoryById[c.category_id]?.name_en ?? c.category_id,
    kg: c.weight_kg,
    collector: `COL-${c.collector_id.slice(0, 4).toUpperCase()}`,
  }))

  return {
    totalKg: round1(totalKg),
    collectionsCount: scoped.length,
    activeUnits,
    unitCount: scopedUnits.length,
    participationPct: scopedUnits.length ? Math.round((activeUnits / scopedUnits.length) * 100) : 0,
    co2e: co2e == null ? null : round1(co2e),
    co2eSources: factorCategories.map((c) => `${c.name_en}: ${c.co2e_source}`),
    perMonth,
    perTownship,
    perCategory,
    latest,
  }
}

export function availableMonths(collections) {
  return [...new Set(collections.map((c) => monthKey(c.collected_at)))].sort().reverse()
}

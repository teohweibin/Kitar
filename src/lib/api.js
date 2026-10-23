import { supabase, supabaseConfigError } from './supabase.js'

function client() {
  if (supabaseConfigError) throw new Error(supabaseConfigError)
  return supabase
}

export async function getMyProfile(userId) {
  const { data, error } = await client()
    .from('profiles')
    .select('id, role, unit_id, display_name')
    .eq('id', userId)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function getMyUnit() {
  const { data, error } = await client()
    .from('units')
    .select('id, unit_code, qr_token, township_id, townships (name)')
    .maybeSingle()
  if (error) throw error
  return data && { ...data, township_name: data.townships?.name ?? null }
}

// The signed-in resident's collections, newest first (RLS limits them to the resident's unit).
export async function listMyCollections(limit = 50) {
  const { data, error } = await client()
    .from('collections')
    .select('id, weight_kg, collected_at, category_id, waste_categories (name_en, name_ms, points_per_kg)')
    .order('collected_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data.map((row) => ({
    ...row,
    weight_kg: Number(row.weight_kg),
    points: Math.round(Number(row.weight_kg) * (row.waste_categories?.points_per_kg ?? 0)),
  }))
}

// --- Rewards ---

// The resident's points and kg so far (0 when the unit has no collections yet).
export async function getMyPoints() {
  const { data, error } = await client().from('unit_points').select('points, total_kg, collections').maybeSingle()
  if (error) throw error
  return { points: data?.points ?? 0, totalKg: Number(data?.total_kg ?? 0), collections: data?.collections ?? 0 }
}

function monthStart(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function isoDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// Township totals for one calendar month (township-level aggregates only).
export async function getLeaderboard(month = new Date()) {
  const { data, error } = await client().rpc('get_township_leaderboard', { p_month: isoDate(monthStart(month)) })
  if (error) throw error
  return data.map((row) => ({
    ...row,
    total_kg: Number(row.total_kg),
    kg_per_participating_unit: Number(row.kg_per_participating_unit),
    participation_pct: Number(row.participation_pct),
  }))
}

// --- Admin ---

// Everything the dashboard needs in two reads; RLS only lets admins see all rows.
export async function getAdminData() {
  const db = client()
  const [collections, units] = await Promise.all([
    db
      .from('collections')
      .select('id, weight_kg, collected_at, category_id, collector_id, unit_id')
      .order('collected_at', { ascending: false })
      .limit(10000),
    db.from('units').select('id, unit_code, township_id, townships (name)'),
  ])
  if (collections.error) throw collections.error
  if (units.error) throw units.error
  return {
    collections: collections.data.map((c) => ({ ...c, weight_kg: Number(c.weight_kg) })),
    units: units.data.map((u) => ({ id: u.id, unit_code: u.unit_code, township_id: u.township_id, township_name: u.townships?.name ?? '' })),
  }
}

// --- Collector ---

function withTownship(unit) {
  return unit && { id: unit.id, unit_code: unit.unit_code, township_name: unit.townships?.name ?? null }
}

export async function findUnitByToken(token) {
  const { data, error } = await client()
    .from('units')
    .select('id, unit_code, townships (name)')
    .eq('qr_token', token.trim())
    .maybeSingle()
  if (error) throw error
  return withTownship(data)
}

export async function findUnitByCode(code) {
  const { data, error } = await client()
    .from('units')
    .select('id, unit_code, townships (name)')
    .eq('unit_code', code.trim().toUpperCase())
    .maybeSingle()
  if (error) throw error
  return withTownship(data)
}

export async function listCategories() {
  const { data, error } = await client().from('waste_categories').select('*').order('sort_order')
  if (error) throw error
  return data
}

// Saves one weighed bag as the signed-in collector. RLS rejects anyone else.
export async function insertCollection({ unitId, categoryId, weightKg }) {
  const db = client()
  const { data: auth } = await db.auth.getUser()
  const { data, error } = await db
    .from('collections')
    .insert({ unit_id: unitId, category_id: categoryId, weight_kg: weightKg, collector_id: auth.user?.id })
    .select('id, weight_kg, collected_at')
    .single()
  if (error) throw error
  return data
}

export async function countMyCollectionsToday() {
  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)
  const { count, error } = await client()
    .from('collections')
    .select('id', { count: 'exact', head: true })
    .gte('collected_at', startOfDay.toISOString())
  if (error) throw error
  return count ?? 0
}

const GUIDE_CACHE_KEY = 'kitar.guide.v2'

function readGuideCache() {
  try {
    const cached = JSON.parse(localStorage.getItem(GUIDE_CACHE_KEY))
    return cached?.categories && cached?.items ? cached : null
  } catch {
    return null
  }
}

// Categories + guide items. Falls back to the last saved copy when offline.
export async function listGuide() {
  try {
    const db = client()
    const [categories, items] = await Promise.all([
      db.from('waste_categories').select('*').order('sort_order'),
      db.from('waste_items').select('*').order('name_en'),
    ])
    if (categories.error) throw categories.error
    if (items.error) throw items.error
    const guide = { categories: categories.data, items: items.data, savedAt: new Date().toISOString() }
    try {
      localStorage.setItem(GUIDE_CACHE_KEY, JSON.stringify(guide))
    } catch {
      // Storage full or blocked: the guide still works for this visit.
    }
    return { ...guide, fromCache: false }
  } catch (error) {
    const cached = readGuideCache()
    if (cached) return { ...cached, fromCache: true }
    throw error
  }
}

export async function listTownships() {
  const { data, error } = await client().from('townships').select('id, name, is_sample').order('name')
  if (error) throw error
  return data
}

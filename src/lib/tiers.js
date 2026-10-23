// Sample reward tiers for the prototype. Not a real offer.
export const TIERS = [
  { name: 'Bronze', min: 0 },
  { name: 'Silver', min: 500 },
  { name: 'Gold', min: 1500 },
]

// Current tier, next tier and progress (0–1) towards it; next is null at the top tier.
export function tierProgress(points) {
  let index = 0
  TIERS.forEach((tier, i) => {
    if (points >= tier.min) index = i
  })
  const current = TIERS[index]
  const next = TIERS[index + 1] ?? null
  const progress = next ? (points - current.min) / (next.min - current.min) : 1
  return { current, next, progress: Math.min(1, Math.max(0, progress)) }
}

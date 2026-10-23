// Keypad rules for the weight entry: digits and one ".", at most 2 decimals, at most 50 kg.
export const MAX_WEIGHT_KG = 50

export function pressKey(value, key) {
  if (key === 'back') return value.slice(0, -1)
  if (key === '.') {
    if (value.includes('.')) return value
    return value === '' ? '0.' : `${value}.`
  }
  const [, decimals = null] = value.split('.')
  if (decimals !== null && decimals.length >= 2) return value
  const next = value === '0' ? key : value + key
  return Number(next) > MAX_WEIGHT_KG ? value : next
}

export function isValidWeight(value) {
  const kg = Number(value)
  return value !== '' && !value.endsWith('.') && kg > 0 && kg <= MAX_WEIGHT_KG
}

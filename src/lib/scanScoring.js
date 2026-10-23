// Turns a MobileCLIP image embedding into guide-item scores using the precomputed
// prompt embeddings in src/data/scanEmbeddings.json. Pure functions: also used by tests.

const LOGIT_SCALE = 100

// Below this, the best item is not trusted and the scan shows "couldn't recognise".
export const MIN_CONFIDENCE = 0.35

function dot(a, b) {
  let sum = 0
  for (let i = 0; i < a.length; i++) sum += a[i] * b[i]
  return sum
}

function normalise(vector) {
  const length = Math.sqrt(dot(vector, vector)) || 1
  return vector.map((v) => v / length)
}

// Returns [{ item, probability }] sorted high → low; item null = "not a waste item".
// Each item's probability is the sum over its prompts after a softmax across all prompts.
export function scoreItems(imageEmbedding, prompts) {
  const image = normalise(Array.from(imageEmbedding))
  const logits = prompts.map((p) => LOGIT_SCALE * dot(image, p.embedding))
  const max = Math.max(...logits)
  const exps = logits.map((l) => Math.exp(l - max))
  const total = exps.reduce((a, b) => a + b, 0)

  const byItem = new Map()
  prompts.forEach((p, i) => {
    byItem.set(p.item, (byItem.get(p.item) ?? 0) + exps[i] / total)
  })
  return [...byItem.entries()]
    .map(([item, probability]) => ({ item, probability }))
    .sort((a, b) => b.probability - a.probability)
}

// Pile mode: a crop only counts when its best item is this sure (stricter than one-item mode,
// because each crop sees only part of the pile).
export const PILE_MIN_CONFIDENCE = 0.5

// 3x3 grid of overlapping half-size crops (stride = a quarter of the photo).
export function gridCrops(width, height) {
  const cropWidth = Math.floor(width / 2)
  const cropHeight = Math.floor(height / 2)
  const crops = []
  for (const fy of [0, 0.25, 0.5]) {
    for (const fx of [0, 0.25, 0.5]) {
      crops.push({ x: Math.floor(fx * width), y: Math.floor(fy * height), width: cropWidth, height: cropHeight })
    }
  }
  return crops
}

// Takes scoreItems() results for the whole photo and each crop; returns each confidently
// found item once, with its best probability: [{ item, probability }], best first.
export function mergePileScores(scoreLists) {
  const found = new Map()
  for (const scores of scoreLists) {
    const best = scores[0]
    if (best?.item && best.probability >= PILE_MIN_CONFIDENCE) {
      found.set(best.item, Math.max(found.get(best.item) ?? 0, best.probability))
    }
  }
  return [...found.entries()]
    .map(([item, probability]) => ({ item, probability }))
    .sort((a, b) => b.probability - a.probability)
}

// Average brightness 0–255 of RGBA pixel data, sampling every 16th pixel.
export function averageBrightness(rgba) {
  let sum = 0
  let count = 0
  for (let i = 0; i < rgba.length; i += 64) {
    sum += 0.299 * rgba[i] + 0.587 * rgba[i + 1] + 0.114 * rgba[i + 2]
    count++
  }
  return count ? sum / count : 0
}

export const DARK_PHOTO_THRESHOLD = 25

// Photo scan with MobileCLIP (Hugging Face, via transformers.js), in the browser.
// Only the vision model is downloaded (fp16, about 23 MB, cached by the browser after the
// first time). Text embeddings for the guide items are precomputed in
// src/data/scanEmbeddings.json by scripts/build-scan-embeddings.mjs.
import { gridCrops, mergePileScores, scoreItems } from './scanScoring.js'

const MODEL_ID = 'Xenova/mobileclip_s0'
// q8 gives wrong answers for this model; fp16 matches fp32 accuracy at half the size.
const VISION_DTYPE = 'fp16'

let modelPromise = null
const progressListeners = new Set()

// onProgress(fraction 0–1) is called while the model files download.
export function loadModel(onProgress) {
  if (onProgress) progressListeners.add(onProgress)
  if (!modelPromise) {
    const fileProgress = {}
    const reportProgress = (event) => {
      if (event.status !== 'progress' || !event.total) return
      fileProgress[event.file] = { loaded: event.loaded, total: event.total }
      const files = Object.values(fileProgress)
      const fraction = files.reduce((a, f) => a + f.loaded, 0) / files.reduce((a, f) => a + f.total, 0)
      progressListeners.forEach((listener) => listener(fraction))
    }

    modelPromise = (async () => {
      const [{ AutoProcessor, CLIPVisionModelWithProjection, RawImage, env }, embeddings] = await Promise.all([
        import('@huggingface/transformers'),
        import('../data/scanEmbeddings.json'),
      ])
      env.allowLocalModels = false
      const [processor, vision] = await Promise.all([
        AutoProcessor.from_pretrained(MODEL_ID),
        CLIPVisionModelWithProjection.from_pretrained(MODEL_ID, {
          dtype: VISION_DTYPE,
          progress_callback: reportProgress,
        }),
      ])
      return { processor, vision, RawImage, prompts: embeddings.default.prompts }
    })().catch((error) => {
      modelPromise = null
      throw error
    })
  }
  return modelPromise
}

export function stopListening(onProgress) {
  progressListeners.delete(onProgress)
}

// Returns [{ item: name_en | null, probability }], best first.
export async function classifyImage(blob) {
  const { processor, vision, RawImage, prompts } = await loadModel()
  const image = await RawImage.fromBlob(blob)
  const { image_embeds } = await vision(await processor(image))
  return scoreItems(image_embeds.data, prompts)
}

function canvasToBlob(canvas) {
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.9))
}

// Pile mode: scores the whole photo plus 9 overlapping crops, then merges what was found.
// onStep(done, total) reports progress. Returns [{ item, probability }].
export async function classifyPile(canvas, onStep) {
  const crops = gridCrops(canvas.width, canvas.height)
  const total = crops.length + 1
  const scoreLists = []

  onStep?.(0, total)
  scoreLists.push(await classifyImage(await canvasToBlob(canvas)))
  onStep?.(1, total)

  const cropCanvas = document.createElement('canvas')
  const ctx = cropCanvas.getContext('2d')
  for (const [index, crop] of crops.entries()) {
    cropCanvas.width = crop.width
    cropCanvas.height = crop.height
    ctx.drawImage(canvas, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height)
    scoreLists.push(await classifyImage(await canvasToBlob(cropCanvas)))
    onStep?.(index + 2, total)
  }
  return mergePileScores(scoreLists)
}

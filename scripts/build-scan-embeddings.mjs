// Precomputes MobileCLIP text embeddings for the photo-scan prompts, so phones only
// download the small vision model. Run after editing src/data/scanLabels.json:
//   npm run build:scan-embeddings
import { readFileSync, writeFileSync } from 'node:fs'
import { AutoTokenizer, CLIPTextModelWithProjection } from '@huggingface/transformers'

export const MODEL_ID = 'Xenova/mobileclip_s0'
const TEXT_DTYPE = 'fp32'

const source = new URL('../src/data/scanLabels.json', import.meta.url)
const target = new URL('../src/data/scanEmbeddings.json', import.meta.url)
const { labels } = JSON.parse(readFileSync(source, 'utf8'))

const prompts = labels.flatMap(({ item, prompts: list }) =>
  list.map((text) => ({ item, text: `a photo of ${text}` })),
)

const tokenizer = await AutoTokenizer.from_pretrained(MODEL_ID)
const textModel = await CLIPTextModelWithProjection.from_pretrained(MODEL_ID, { dtype: TEXT_DTYPE })
const inputs = tokenizer(prompts.map((p) => p.text), { padding: 'max_length', truncation: true })
const { text_embeds } = await textModel(inputs)
const vectors = text_embeds.normalize().tolist()

const output = {
  model: MODEL_ID,
  dim: vectors[0].length,
  generatedAt: new Date().toISOString(),
  prompts: prompts.map((p, i) => ({
    item: p.item,
    text: p.text,
    embedding: vectors[i].map((v) => Math.round(v * 1e5) / 1e5),
  })),
}

writeFileSync(target, JSON.stringify(output))
console.log(`Wrote ${prompts.length} prompt embeddings (${output.dim} dims) to src/data/scanEmbeddings.json`)

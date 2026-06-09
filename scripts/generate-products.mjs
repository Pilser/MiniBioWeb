import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import yaml from 'js-yaml'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

function loadEnv() {
  const env = {}
  try {
    const raw = readFileSync(resolve(root, '.env'), 'utf-8')
    for (const line of raw.split('\n')) {
      const t = line.trim()
      if (!t || t.startsWith('#')) continue
      const eq = t.indexOf('=')
      if (eq === -1) continue
      let val = t.slice(eq + 1).trim()
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))
        val = val.slice(1, -1)
      env[t.slice(0, eq).trim()] = val
    }
  } catch {}
  return env
}

function getBasePath() {
  const siteUrl = process.env.SITE_URL || loadEnv().SITE_URL
  if (!siteUrl || siteUrl.includes('localhost')) return ''
  try {
    const p = new URL(siteUrl).pathname.replace(/\/+$/, '') || ''
    return p
  } catch {
    return ''
  }
}

const base = getBasePath()

const yamlPath = resolve(root, 'products.yaml')
const outPath = resolve(root, 'src/data/products.json')

let raw
try {
  raw = readFileSync(yamlPath, 'utf-8')
} catch {
  console.error('⚠  products.yaml not found at', yamlPath)
  process.exit(1)
}

const products = yaml.load(raw)

if (!Array.isArray(products)) {
  console.error('⚠  products.yaml must contain an array at the root level')
  process.exit(1)
}

// Prepend base path to all image paths
const prefixed = products.map(p => {
  const product = { ...p }
  if (product.image && product.image.startsWith('/')) {
    product.image = base + product.image
  }
  if (product.images && Array.isArray(product.images)) {
    product.images = product.images.map(img =>
      img && img.startsWith('/') ? base + img : img
    )
  }
  return product
})

writeFileSync(outPath, JSON.stringify(prefixed, null, 2) + '\n')
console.log(`✓ products.json generated from products.yaml (${products.length} products)`)
if (base) console.log(`  (image paths prefixed with "${base}")`)

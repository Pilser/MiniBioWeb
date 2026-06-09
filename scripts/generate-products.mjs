import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import yaml from 'js-yaml'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

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

writeFileSync(outPath, JSON.stringify(products, null, 2) + '\n')
console.log(`✓ products.json generated from products.yaml (${products.length} products)`)

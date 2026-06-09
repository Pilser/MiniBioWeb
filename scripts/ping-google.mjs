import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

function loadEnv() {
  const envPath = resolve(root, '.env')
  let raw
  try {
    raw = readFileSync(envPath, 'utf-8')
  } catch {
    return {}
  }

  const env = {}
  for (const line of raw.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    let val = trimmed.slice(eq + 1).trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    env[trimmed.slice(0, eq).trim()] = val
  }
  return env
}

const env = loadEnv()
const siteUrl = env.SITE_URL

if (!siteUrl) {
  console.log('⚠  SITE_URL not set in .env, skipping Google ping.')
  process.exit(0)
}

const sitemapUrl = `${siteUrl.replace(/\/+$/, '')}/sitemap-index.xml`

fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`)
  .then(() => console.log(`✓ Google pinged with sitemap: ${sitemapUrl}`))
  .catch(err => {
    console.log('⚠  Google ping failed (offline?):', err.message)
    process.exit(0)
  })

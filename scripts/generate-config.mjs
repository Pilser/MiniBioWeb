import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

function loadEnv() {
  const envPath = resolve(root, '.env')
  const examplePath = resolve(root, '.env.example')
  let raw
  try {
    raw = readFileSync(envPath, 'utf-8')
  } catch {
    try {
      raw = readFileSync(examplePath, 'utf-8')
      writeFileSync(envPath, raw)
      console.log('⚠  .env not found — created from .env.example with default values')
    } catch {
      console.error('⚠  Neither .env nor .env.example found.')
      process.exit(1)
    }
  }

  const env = {}
  for (const line of raw.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    let val = trimmed.slice(eq + 1).trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    val = val.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\\\/g, '\\')
    env[key] = val
  }
  return env
}

function commaSplit(val) {
  return val.split(',').map(s => s.trim()).filter(Boolean)
}

function getBasePath() {
  const siteUrl = process.env.SITE_URL || loadEnv().SITE_URL
  if (!siteUrl || siteUrl.includes('localhost')) return ''
  try {
    return new URL(siteUrl).pathname.replace(/\/+$/, '') || ''
  } catch {
    return ''
  }
}

function parseLinks(val) {
  try {
    return JSON.parse(val)
  } catch {
    return []
  }
}

function parseSocial(env) {
  const social = {}
  for (const [key, val] of Object.entries(env)) {
    if (key.startsWith('SOCIAL_') && val) {
      const platform = key.slice(7).toLowerCase()
      social[platform] = val
    }
  }
  return social
}

function prefixAsset(path, base) {
  return path && path.startsWith('/') ? base + path : path
}

const env = loadEnv()
const base = getBasePath()

const config = {
  name: env.SITE_NAME || 'MiniBio Chemical Supply',
  shortName: env.SITE_SHORT_NAME || 'MiniBio',
  description: env.SITE_DESCRIPTION || '',
  url: env.SITE_URL || 'https://minibioweb.com',
  basePath: base || '/',
  logo: prefixAsset(env.SITE_LOGO || '/favicon.svg', base),
  banner: prefixAsset(env.SITE_BANNER || '', base),
  avatar: prefixAsset(env.SITE_AVATAR || '', base),
  favicon: prefixAsset(env.SITE_FAVICON || '/favicon.svg', base),
  contactEmail: env.CONTACT_EMAIL || '',
  contactPhone: env.CONTACT_PHONE || '',
  whatsappNumber: env.WHATSAPP_NUMBER || '',
  whatsappMessage: env.WHATSAPP_MESSAGE || 'Found this product from your site.',
  whatsappOrderTemplate: env.WHATSAPP_ORDER_TEMPLATE || '',
  address: {
    text: env.ADDRESS_TEXT || '',
    url: env.ADDRESS_URL || '',
  },
  categories: [ 'All', ...commaSplit(env.CATEGORIES || '').filter(c => c !== 'All') ],
  social: parseSocial(env),
  links: parseLinks(env.LINKS || '[]'),
  gaMeasurementId: env.GA_MEASUREMENT_ID || '',
  gscVerification: env.GSC_VERIFICATION || '',
}

const outPath = resolve(root, 'src/data/site-config.json')
writeFileSync(outPath, JSON.stringify(config, null, 2) + '\n')
console.log('✓ site-config.json generated from .env')

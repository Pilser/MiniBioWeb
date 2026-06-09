import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readFileSync } from 'fs';

function loadSiteUrl() {
  try {
    const raw = readFileSync('.env', 'utf-8');
    for (const line of raw.split('\n')) {
      const t = line.trim();
      if (t.startsWith('SITE_URL=')) {
        let val = t.slice(9).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))
          val = val.slice(1, -1);
        return val;
      }
    }
  } catch {}
  return process.env.SITE_URL || 'http://localhost:4321';
}

const fullUrl = loadSiteUrl();
let site, base;
if (fullUrl.includes('localhost')) {
  site = fullUrl;
  base = '/';
} else {
  const u = new URL(fullUrl);
  site = u.origin;
  base = u.pathname.replace(/\/+$/, '') || '/';
}

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404/'),
      changefreq: 'weekly',
      priority: 0.7,
      serialize(item) {
        item.lastmod = new Date().toISOString();
        if (item.url === fullUrl + '/') {
          item.priority = 1.0;
        } else if (item.url.includes('/product/')) {
          item.priority = 0.8;
        }
        return item;
      },
    }),
  ],
});

# Google SEO Submission & Indexing Guide

## Prerequisites

- Site deployed to your domain (e.g. `https://minibioweb.com`)
- `bun run build` completed successfully — generates `dist/` with sitemap at `/sitemap-index.xml`
- Sitemap contains all product pages (32 URLs including 30 products)

---

## 1. Google Search Console — Account & Verification

### Step 1: Add your site

1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Sign in with your Google account
3. Click **"Add property"** → enter your domain (e.g. `minibioweb.com`) → **Continue**

### Step 2: Verify ownership

Choose one of these methods:

#### Option A: DNS record (recommended — works permanently)

1. Copy the TXT record value Google gives you
2. Add it as a TXT record to your domain's DNS settings (via your domain registrar or DNS host)
3. Click **Verify**

#### Option B: HTML meta tag

1. Copy the verification code Google gives you (looks like `1234567890abcdef`)
2. Open `.env` and set:

   ```
   GSC_VERIFICATION=1234567890abcdef
   ```

3. Rebuild: `bun run build`
4. Deploy the updated `dist/`
5. Click **Verify** in GSC

> HTML meta tag will be placed in the `<head>` of every page.

---

## 2. Submit Your Sitemap

1. In Google Search Console, go to **Sitemaps** (sidebar)
2. Paste: `sitemap-index.xml`
3. Click **Submit**

Google will crawl the sitemap and discover all 32 pages. This may take hours to days.

---

## 3. Request Indexing (Individual Pages)

For faster indexing of specific product pages:

1. In GSC, use the **URL Inspection** search bar (top)
2. Paste a product URL, e.g. `https://minibioweb.com/product/sodium-hydroxide/`
3. Press Enter
4. Click **"Request Indexing"**

Repeat for each product. GSC accepts a limited number per day.

> **Bulk alternative:** submit the sitemap (step 2) and wait — Google will crawl everything eventually.

---

## 4. Reindexing After Changes

Every time you rebuild and deploy, two things happen:

Your sitemap automatically gets:
- Updated `<lastmod>` timestamps (set to build date)
- Corrected priority values (`homepage=1.0`, `products=0.8`)

The `postbuild` script (`scripts/ping-google.mjs`) notifies Google:

```
https://www.google.com/ping?sitemap=https://minibioweb.com/sitemap-index.xml
```

This tells Google the sitemap changed. Google decides when to recrawl.

### Manual reindexing

After major updates (new products, changed content):

1. Rebuild: `bun run build`
2. Deploy `dist/`
3. (Ping happens automatically)
4. Optionally, use GSC **URL Inspection** to manually request indexing for changed pages

---

## 5. Monitor Performance

In Google Search Console:

- **Performance** — see clicks, impressions, average position
- **Indexing** — see which pages are indexed, any errors
- **Sitemaps** — confirm sitemap was processed, see submitted vs indexed counts

---

## 6. Bing Webmaster Tools (Bonus)

Same process works for Bing:

1. Go to [bing.com/webmasters](https://www.bing.com/webmasters/)
2. Add your site
3. Verify (same meta tag or DNS record)
4. Submit same sitemap: `sitemap-index.xml`

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Sitemap shows 0 URLs discovered | Wait 24–48h, check sitemap is accessible at `https://yourdomain.com/sitemap-index.xml` |
| Page not indexed | Check page returns `200`, isn't blocked by `robots.txt`, has `<meta name="robots" content="index">` |
| Verification keeps failing | DNS method is most reliable; meta tag must be in `<head>` on the exact page GSC fetches |
| Ping fails ("Could not resolve host") | Only happens in offline/sandbox environments; works fine on a real server with internet |

---

## Quick Reference

```bash
# Build + ping Google (automatic)
bun run build

# Build only (no ping)
SITE_URL="" bun run build

# Regenerate config from .env only
bun run generate-config
```

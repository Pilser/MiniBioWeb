# MiniBioWeb

Zero-backend product catalog platform built with Astro.

## Package Manager

This project uses **bun** (not npm). Available at `/home/pilser/.bun/bin/bun`.

- `bun install` — install dependencies
- `bun run dev` — start dev server
- `bun run build` — build for production
- `bun run preview` — preview production build
- `bun run astro` — run astro CLI

## Project Structure

- `src/data/theme.json` — Full visual theme (colors, fonts, radii, shadows, layout). Edit this to change the entire site look.
- `src/data/products.json` — Product catalog data (edit this to add/update products)
- `src/data/site-config.ts` — Site configuration (company info, categories, WhatsApp number)
- `src/data/products.ts` — Product TypeScript interface
- `src/pages/index.astro` — Homepage with catalog app
- `src/pages/product/[slug].astro` — Individual product pages (for SEO)
- `src/components/CatalogApp.astro` — Client-side catalog with infinite scroll, search, filtering
- `src/layouts/BaseLayout.astro` — Base HTML layout with SEO
- `src/styles/global.css` — CSS reset and utility classes (no design tokens — those come from theme.json)

## Deployment

Build output goes to `dist/`. Deploy to any static host:
- GitHub Pages
- Cloudflare Pages
- Netlify
- cPanel / Hostinger / Namecheap (upload `dist/` contents)
- Any static web server

## Adding Products

Edit `src/data/products.json`. Each product needs:
- id, name, slug, category, description, summary
- price, unit, image, tags, available
- specifications (optional)

Products automatically get:
- Individual SEO-friendly pages at `/product/[slug]/`
- Catalog listing with search and category filtering
- WhatsApp ordering
- JSON-LD structured data

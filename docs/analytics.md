# Google Analytics 4 — Setup & Events

## Prerequisites

- A Google Analytics 4 account (free, at [analytics.google.com](https://analytics.google.com))
- Site built and deployed to your domain

---

## Setup

### 1. Create a GA4 property

1. Go to [analytics.google.com](https://analytics.google.com)
2. Click **Admin** (gear icon, bottom-left) → **Create Property**
3. Enter property name (e.g. "MiniBio"), select reporting time zone & currency
4. Skip business details, select **Web** as platform
5. Enter your site URL (e.g. `https://minibioweb.com`) and name
6. Finish setup — copy the **Measurement ID** (starts with `G-`)

### 2. Add Measurement ID to .env

```
GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 3. Rebuild & deploy

```bash
bun run build
```

The GA4 snippet is conditionally injected into `<head>` only when `GA_MEASUREMENT_ID` is set. If the value is empty, no analytics code runs.

---

## Tracked Events

The site automatically tracks these events:

### Page Views (automatic via GA4)

Every page load is reported as a `page_view` event. No extra code needed — GA4 handles this automatically once the snippet is installed.

### Product View

Fires when a product detail page (`/product/[slug]/`) loads.

| Parameter | Value |
|---|---|
| Event name | `product_view` |
| `product_name` | Product name |
| `product_id` | Product ID |
| `product_category` | Product category |
| `product_price` | Product price (or empty if null) |

### WhatsApp Click

Fires when any WhatsApp button or link is clicked:

- WhatsApp button in catalog product cards
- "Inquire on WhatsApp" button in the modal slide-in
- "Inquire on WhatsApp" button on product detail pages
- WhatsApp link icon in the header

| Parameter | Value |
|---|---|
| Event name | `whatsapp_click` |
| `event_label` | Product name |
| `event_id` | Product ID |

### Header Link Click

Fires when clicking any header link button (WhatsApp, Phone, Email, Store).

| Parameter | Value |
|---|---|
| Event name | `header_link_click` |
| `event_label` | Link label (e.g. "Contact via WhatsApp") |

### Share (Native)

Fires when the **Share** button is clicked in the product modal. Opens the system share sheet (WhatsApp, Telegram, Email, etc.).

| Parameter | Value |
|---|---|
| Event name | `share_native` |
| `event_label` | Product name |

### Copy Link

Fires when the **Copy Link** button is clicked in the product modal. Copies the product URL to clipboard.

| Parameter | Value |
|---|---|
| Event name | `share_copy` |
| `event_label` | Product name |

### Search

Fires when a search is performed (after 200ms debounce).

| Parameter | Value |
|---|---|
| Event name | `search` |
| `search_term` | The search query |

### Category Filter

Fires when a category filter button is clicked.

| Parameter | Value |
|---|---|
| Event name | `category_filter` |
| `category` | Selected category name (or "All") |

---

## Viewing Reports

### Real-time

1. In GA4, go to **Reports** → **Realtime**
2. See events as they happen (useful for verifying tracking works)

### Custom reports

1. Go to **Explore** (left sidebar)
2. Create a **Free Form** report
3. Add dimensions like `event_name`, `product_name`
4. Add metrics like `event count`

### Key questions to answer

| Question | How |
|---|---|
| Which products are viewed most? | Filter by `product_view` event, segment by `product_name` |
| Which products get WhatsApp inquiries? | Filter by `whatsapp_click` event, segment by `event_label` |
| What do people search for? | Filter by `search` event, look at `search_term` |
| Which category is most popular? | Filter by `category_filter` event, see which category is selected |
| Where do users come from? | Check **Acquisition** → **Traffic acquisition** in Reports |

---

## Disabling Analytics

To remove all Google Analytics tracking from the site:

1. Open `.env`
2. Set `GA_MEASUREMENT_ID=` (empty)
3. Rebuild: `bun run build`
4. Deploy

No analytics code will be present on any page.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| No data in Realtime report | Verify `GA_MEASUREMENT_ID` is correct and not empty, rebuild, redeploy, visit a page |
| gtag is not defined error | GA4 snippet uses the dataLayer shim (`function gtag(){...}`) — gtag is always available even before the remote script loads |
| Duplicate page_view events | GA4 sends a `page_view` automatically. Custom `product_view` is a separate event and won't double-count |
| Events not showing in reports | GA4 reports can take 24–48 hours for non-realtime data. Use **Realtime** report for immediate verification |

---

## Quick Reference

```bash
# Build with GA4 (requires GA_MEASUREMENT_ID in .env)
bun run build

# Disable GA4 (set measurement ID to empty, rebuild)
# Edit .env → GA_MEASUREMENT_ID= → bun run build
```

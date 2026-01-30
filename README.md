## Overview

Professional ecommerce dropshipping setup using a custom backend (no Shopify subscriptions), a Next.js storefront, and a semi-automated product/import pipeline that merges TD SYNNEX (InTouch) feeds with Open Icecat content.

Key requirements covered:
- Distributor feed → local DB (products + stock)
- Open Icecat for images/descriptions (free OpenIcecat access supported)
- Manual order placement in TD SYNNEX InTouch (no auto-ordering)
- Storefront reads from a local DB and uses internal checkout

Sample brand inspiration: Nomad, Logitech, Anker, Satechi.

## Architecture

- Custom backend: Products, pricing, inventory, orders, checkout
- Next.js (frontend): Product listing/detail, SEO-friendly pages, internal checkout
- Data pipeline (scripts/):
	- Merge distributor CSV → normalized products
	- Enrich with Open Icecat content (images + descriptions)
	- Output Shopify product CSV and inventory CSV

Folders:
- `app/` – Next.js App Router pages (`/products`, product detail, home)
- `scripts/` – Data pipeline TypeScript scripts
- `data/raw/` – Place distributor CSVs here (see below)
- `data/output/` – Generated Shopify CSV files

## Prerequisites

1) Open Icecat access (optional) – use username `OpenIcecat` or your own account.
2) Distributor CSVs (TD SYNNEX InTouch exports) for products and optional stock.

Copy `.env.example` → `.env` and fill values:

```env
ICECAT_USERNAME=OpenIcecat
ICECAT_LANGUAGE=en
# Optional: override column names if distributor headers differ
DISTRIBUTOR_COL_SKU=sku
DISTRIBUTOR_COL_EAN=ean
DISTRIBUTOR_COL_BRAND=brand
DISTRIBUTOR_COL_MPN=mpn
DISTRIBUTOR_COL_NAME=name
DISTRIBUTOR_COL_CATEGORY=category
DISTRIBUTOR_COL_PRICE=price
DISTRIBUTOR_COL_STOCK=stock
```

## Data Pipeline (Distributor → Shopify)

1) Place CSVs:
- `data/raw/products.csv` – Main catalog with headers at least: `sku, name, brand, mpn, ean, category, price, stock`
- `data/raw/stock.csv` – Optional stock feed with `sku, stock` (otherwise `products.csv` stock is used)

2) Generate Shopify CSVs:

```bash
npm run pipeline:products   # builds data/output/products_shopify.csv
npm run pipeline:inventory  # builds data/output/inventory_update.csv
```

What it does:
- Normalizes distributor catalog
- Calls Open Icecat by `ean` (GTIN) or `brand + mpn` to fetch images and descriptions
- Produces Shopify product CSV with one variant per product and image URLs
- Produces a minimal inventory CSV (SKU, Quantity) suitable for Stock Sync mapping

Notes:
- If your distributor column names differ, override via environment variables shown above.
- If Open Icecat doesn’t have content for some products, they still import with placeholders.

## Data Setup

1) Import Products
- Use scripts to transform distributor CSVs and write into the local DB (future script `scripts/import-distributor.ts`).

2) Inventory Sync (semi-automated)
- Periodically update stock in the local DB by re-importing distributor stock CSV.

## Manual Fulfillment SOP

Until credit line and official dropship access are granted:
1) Customer orders → Shopify creates order
2) Team member logs into TD SYNNEX InTouch and manually places the corresponding order
3) Enter customer shipping details or ship-to reference as required
4) Update Shopify order with tracking once available; notify customer

Later: switch to TD SYNNEX WebShop (official dropship) when credit is approved.

## Running the Headless Storefront

```bash
npm run dev
```

Pages:
- `/` – Landing page (hero + featured categories)
- `/products` – Product grid (local DB)
- `/products/[handle]` – Product detail with Add to Cart and JSON‑LD
- `/cart` – Cart page (local DB; internal checkout link)
- `/search` – Simple search across titles/vendors
- `/collections` – Curated category links
- `/about`, `/contact`
- `/policies/shipping`, `/policies/returns`, `/policies/privacy`, `/policies/terms`

## Cart & Checkout

- Cart is persisted via a cookie and stored in the local DB.
- Checkout collects customer details and creates an order in the local DB.
- The header shows a live cart item count.

## Admin/Operations (Next)

- Add an admin view for orders and inventory adjustments.
- Optional email confirmations via `nodemailer`.

## Roadmap / Enhancements

- Collections and navigation fed from Shopify
- Filters (brand/category) based on product tags
- Rich reviews/Q&A
- Pricing rules/margins from distributor feeds
- Error monitoring and audit logs for pipeline runs

## Troubleshooting

- Icecat not returning content: ensure `ean` is present or brand+mpn are correct; some brands are not in Open Icecat free catalog.
- Shopify CSV import errors: check required columns or simplify to the provided headers.
- Storefront API failures: verify domain/token in `.env` and that the app has read access to products.

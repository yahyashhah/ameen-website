import 'dotenv/config';
import fetch from 'node-fetch';
import path from 'node:path';
import fs from 'node:fs';
import { readCsvFile, readEnv, slugify, toInt, toNumber } from './utils';
import { enrichWithIcecat } from './fetch-icecat';
import { getDB } from '@/lib/db';

/**
 * TD SYNNEX (InTouch) API Fetch + Import
 *
 * This script pulls products and inventory from a distributor API (TD SYNNEX-like),
 * maps them to our internal format, enriches with Icecat, and imports into the store.
 *
 * Configuration via env:
 * - DISTRIBUTOR_API_URL
 * - DISTRIBUTOR_API_KEY (or)
 * - DISTRIBUTOR_USERNAME / DISTRIBUTOR_PASSWORD
 * - BACKEND_URL (defaults http://localhost:5000)
 * - IMPORT_TARGET: 'backend' | 'direct' (default 'backend')
 * - DISTRIBUTOR_PRODUCTS_CSV (optional fallback file if API not available)
 * - DISTRIBUTOR_COL_* envs for CSV mapping (see .env)
 */

const API_URL = readEnv('DISTRIBUTOR_API_URL', '');
const API_KEY = readEnv('DISTRIBUTOR_API_KEY', '');
const API_USER = readEnv('DISTRIBUTOR_USERNAME', '');
const API_PASS = readEnv('DISTRIBUTOR_PASSWORD', '');
const BACKEND_URL = readEnv('BACKEND_URL', 'http://localhost:5000');
const IMPORT_TARGET = (readEnv('IMPORT_TARGET', 'backend') || 'backend').toLowerCase();

// Column mapping for CSV fallback
const COL_SKU = readEnv('DISTRIBUTOR_COL_SKU', 'sku')!;
const COL_EAN = readEnv('DISTRIBUTOR_COL_EAN', 'ean')!;
const COL_BRAND = readEnv('DISTRIBUTOR_COL_BRAND', 'brand')!;
const COL_MPN = readEnv('DISTRIBUTOR_COL_MPN', 'mpn')!;
const COL_NAME = readEnv('DISTRIBUTOR_COL_NAME', 'name')!;
const COL_CATEGORY = readEnv('DISTRIBUTOR_COL_CATEGORY', 'category')!;
const COL_PRICE = readEnv('DISTRIBUTOR_COL_PRICE', 'price')!;
const COL_STOCK = readEnv('DISTRIBUTOR_COL_STOCK', 'stock')!;

async function authHeaders() {
  // Adjust to the real TD SYNNEX authentication once credentials are provided.
  // Many endpoints use API keys in headers; some use OAuth2.
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (API_KEY) headers['Authorization'] = `Bearer ${API_KEY}`;
  // If username/password required, you can implement a token fetch here and cache it.
  return headers;
}

async function fetchDistributorProducts(): Promise<any[]> {
  if (!API_URL) return [];
  try {
    const headers = await authHeaders();
    // Placeholder endpoint; replace with TD SYNNEX catalog endpoint when known.
    const res = await fetch(`${API_URL}/catalog/products`, { headers });
    if (!res.ok) throw new Error(`Distributor API error: ${res.status}`);
    const data = await res.json();
    // Expecting data.items: adapt as needed when spec is available
    return Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
  } catch (e) {
    console.warn('Distributor API not reachable, will try CSV fallback:', (e as Error).message);
    return [];
  }
}

async function csvFallback(): Promise<any[]> {
  const rawDir = path.resolve(process.cwd(), 'data', 'raw');
  const source = readEnv('DISTRIBUTOR_PRODUCTS_CSV') || path.join(rawDir, 'products.csv');
  if (!fs.existsSync(source)) {
    console.warn(`CSV fallback not found at ${source}`);
    return [];
  }
  const rows = await readCsvFile(source);
  return rows;
}

function mapToInternal(records: any[]) {
  return records.map((r) => {
    const sku = (r[COL_SKU] ?? r.sku ?? '').toString().trim();
    const brand = (r[COL_BRAND] ?? r.brand ?? '').toString().trim();
    const mpn = (r[COL_MPN] ?? r.mpn ?? '').toString().trim();
    const titleRaw = (r[COL_NAME] ?? r.name ?? '').toString().trim();
    const title = titleRaw || `${brand} ${mpn}`.trim() || sku;
    return {
      sku,
      handle: slugify(title),
      title,
      vendor: brand || 'Distributor',
      type: (r[COL_CATEGORY] ?? r.category ?? '').toString().trim() || undefined,
      price: toNumber(r[COL_PRICE] ?? r.price) ?? undefined,
      barcode: (r[COL_EAN] ?? r.ean ?? '').toString().trim() || undefined,
      mpn: mpn || undefined,
      stock: toInt(r[COL_STOCK] ?? r.stock) ?? 0,
      images: r.images || [],
      descriptionHtml: r.descriptionHtml || '',
    };
  }).filter((p) => p.sku);
}

async function importViaBackend(products: any[]) {
  const url = `${BACKEND_URL}/api/distributor/import-products`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ products }),
  });
  if (!res.ok) throw new Error(`Backend import failed: ${res.status}`);
  const data = await res.json();
  console.log('Backend import summary:', data);
}

async function importDirect(products: any[]) {
  const db = await getDB();
  for (const p of products) {
    const id = `prod-${p.sku}`;
    const vid = `var-${p.sku}`;
    const existing = db.data!.products.find((x) => x.id === id);
    const images = (p.images || []).map((i: any) => ({ url: i.url || i, altText: i.alt || p.title }));
    if (existing) {
      existing.handle = p.handle;
      existing.title = p.title;
      existing.vendor = p.vendor;
      existing.descriptionHtml = p.descriptionHtml || existing.descriptionHtml;
      existing.type = p.type || existing.type;
      existing.barcode = p.barcode || existing.barcode;
      existing.price = p.price ?? existing.price;
      existing.images = images.length ? images : existing.images;
    } else {
      db.data!.products.push({ id, handle: p.handle, title: p.title, vendor: p.vendor, descriptionHtml: p.descriptionHtml || '', type: p.type, barcode: p.barcode, price: p.price, images });
    }
    const vExisting = db.data!.variants.find((v) => v.id === vid);
    if (vExisting) {
      vExisting.title = 'Default';
      vExisting.sku = p.sku;
      vExisting.price = p.price ?? vExisting.price;
    } else {
      db.data!.variants.push({ id: vid, productId: id, title: 'Default', sku: p.sku, price: p.price ?? 0 });
    }
    const inv = db.data!.inventory.find((i) => i.productId === id);
    if (inv) inv.quantity = p.stock ?? inv.quantity;
    else db.data!.inventory.push({ productId: id, quantity: p.stock ?? 0 });
  }
  await db.write();
  console.log(`Imported ${products.length} products into local DB.`);
}

async function main() {
  // 1) Fetch from API; if empty, fallback to CSV file
  const apiRecords = await fetchDistributorProducts();
  const rawRecords = apiRecords.length ? apiRecords : await csvFallback();
  if (!rawRecords.length) throw new Error('No distributor records available from API or CSV fallback');

  // 2) Map to internal shape
  const mapped = mapToInternal(rawRecords);

  // 3) Enrich with Icecat content (titles, images, descriptions)
  const enriched = await enrichWithIcecat(mapped as any);

  // 4) Import
  if (IMPORT_TARGET === 'direct') await importDirect(enriched);
  else await importViaBackend(enriched);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

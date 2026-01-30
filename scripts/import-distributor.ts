import 'dotenv/config';
import path from 'node:path';
import fs from 'node:fs';
import { readCsvFile, readEnv, slugify, toInt, toNumber } from './utils';
import { enrichWithIcecat } from './fetch-icecat';
import { getDB } from '@/lib/db';

async function main() {
  const rawDir = path.resolve(process.cwd(), 'data', 'raw');
  const source = readEnv('DISTRIBUTOR_PRODUCTS_CSV') || path.join(rawDir, 'products.csv');
  if (!fs.existsSync(source)) throw new Error(`Missing products CSV at ${source}`);
  const rows = await readCsvFile(source);
  const col = (n: string, def: string) => readEnv(n, def)!;
  const COL_SKU = col('DISTRIBUTOR_COL_SKU', 'sku');
  const COL_EAN = col('DISTRIBUTOR_COL_EAN', 'ean');
  const COL_BRAND = col('DISTRIBUTOR_COL_BRAND', 'brand');
  const COL_MPN = col('DISTRIBUTOR_COL_MPN', 'mpn');
  const COL_NAME = col('DISTRIBUTOR_COL_NAME', 'name');
  const COL_CATEGORY = col('DISTRIBUTOR_COL_CATEGORY', 'category');
  const COL_PRICE = col('DISTRIBUTOR_COL_PRICE', 'price');
  const COL_STOCK = col('DISTRIBUTOR_COL_STOCK', 'stock');

  const products = rows.map((r) => {
    const sku = (r[COL_SKU] ?? '').trim();
    const title = (r[COL_NAME] ?? '').trim() || `${(r[COL_BRAND] ?? '').trim()} ${(r[COL_MPN] ?? '').trim()}`.trim() || sku;
    return {
      sku,
      handle: slugify(title),
      title,
      vendor: (r[COL_BRAND] ?? '').trim() || 'Distributor',
      type: (r[COL_CATEGORY] ?? '').trim() || undefined,
      price: toNumber(r[COL_PRICE]) ?? undefined,
      barcode: (r[COL_EAN] ?? '').trim() || undefined,
      mpn: (r[COL_MPN] ?? '').trim() || undefined,
      stock: toInt(r[COL_STOCK]) ?? 0,
    };
  }).filter((p) => p.sku);

  const enriched = await enrichWithIcecat(products as any);

  const db = await getDB();
  for (const p of enriched) {
    const id = `prod-${p.sku}`;
    const vid = `var-${p.sku}`;
    const existing = db.data!.products.find((x) => x.id === id);
    const images = (p.images || []).map((i) => ({ url: i.url, altText: i.alt || p.title }));
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
  console.log(`Imported ${enriched.length} products into local DB.`);
}

main().catch((e) => { console.error(e); process.exit(1); });

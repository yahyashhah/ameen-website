import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { DATA_DIR, OUT_DIR, RAW_DIR, DistributorRow, ProductRecord, readCsvFile, readEnv, slugify, toInt, toNumber, writeCsvFile } from './utils';
import { enrichWithIcecat } from './fetch-icecat';

function getCol(name: string, def: string) {
  return readEnv(name, def)!;
}

async function loadDistributorProducts(): Promise<DistributorRow[]> {
  const source = readEnv('DISTRIBUTOR_PRODUCTS_CSV');
  let filePath: string | undefined = undefined;
  if (source && /^https?:\/\//i.test(source)) {
    // allow user to download externally; keeping simple: ask to place in data/raw
    throw new Error('Remote URLs are not supported in this simple runner. Please download the CSV into data/raw/products.csv or set DISTRIBUTOR_PRODUCTS_CSV to a local path.');
  } else if (source && fs.existsSync(source)) {
    filePath = source;
  } else if (fs.existsSync(path.join(RAW_DIR, 'products.csv'))) {
    filePath = path.join(RAW_DIR, 'products.csv');
  } else {
    throw new Error('No distributor products CSV found. Place one at data/raw/products.csv or set DISTRIBUTOR_PRODUCTS_CSV.');
  }
  const rows = await readCsvFile(filePath);
  const COL_SKU = getCol('DISTRIBUTOR_COL_SKU', 'sku');
  const COL_EAN = getCol('DISTRIBUTOR_COL_EAN', 'ean');
  const COL_BRAND = getCol('DISTRIBUTOR_COL_BRAND', 'brand');
  const COL_MPN = getCol('DISTRIBUTOR_COL_MPN', 'mpn');
  const COL_NAME = getCol('DISTRIBUTOR_COL_NAME', 'name');
  const COL_CATEGORY = getCol('DISTRIBUTOR_COL_CATEGORY', 'category');
  const COL_PRICE = getCol('DISTRIBUTOR_COL_PRICE', 'price');
  const COL_STOCK = getCol('DISTRIBUTOR_COL_STOCK', 'stock');

  return rows
    .map((r) => ({
      sku: (r[COL_SKU] ?? '').trim(),
      ean: (r[COL_EAN] ?? '').trim() || undefined,
      brand: (r[COL_BRAND] ?? '').trim() || undefined,
      mpn: (r[COL_MPN] ?? '').trim() || undefined,
      name: (r[COL_NAME] ?? '').trim() || undefined,
      category: (r[COL_CATEGORY] ?? '').trim() || undefined,
      price: r[COL_PRICE],
      stock: r[COL_STOCK],
    }))
    .filter((r) => r.sku);
}

function mapToProducts(rows: DistributorRow[]): ProductRecord[] {
  return rows.map((r) => {
    const title = r.name || `${r.brand ?? ''} ${r.mpn ?? r.sku}`.trim();
    return {
      sku: r.sku,
      handle: slugify(title || r.sku),
      title,
      vendor: r.brand || 'Distributor',
      type: r.category,
      tags: r.category ? [r.category] : [],
      price: toNumber(r.price),
      barcode: r.ean,
      stock: toInt(r.stock),
      mpn: r.mpn,
    } satisfies ProductRecord;
  });
}

function toShopifyCsvRows(records: ProductRecord[]) {
  const rows: Record<string, any>[] = [];
  for (const p of records) {
    const base = {
      Handle: p.handle,
      Title: p.title,
      'Body (HTML)': p.descriptionHtml ?? '',
      Vendor: p.vendor,
      'Standard Product Type': '',
      'Custom Product Type': p.type ?? '',
      Tags: (p.tags ?? []).join(', '),
      Published: 'TRUE',
      'Option1 Name': 'Default Title',
      'Option1 Value': 'Default Title',
      'Variant SKU': p.sku,
      'Variant Inventory Tracker': 'shopify',
      'Variant Inventory Qty': p.stock ?? 0,
      'Variant Inventory Policy': 'deny',
      'Variant Fulfillment Service': 'manual',
      'Variant Price': p.price ?? 0,
      'Variant Compare At Price': '',
      'Variant Requires Shipping': 'TRUE',
      'Variant Taxable': 'TRUE',
      'Variant Barcode': p.barcode ?? '',
      'Image Src': p.images?.[0]?.url ?? '',
      'Image Position': p.images?.length ? 1 : '',
      'Image Alt Text': p.images?.[0]?.alt ?? '',
      'Gift Card': 'FALSE',
      'SEO Title': p.title,
      'SEO Description': p.title,
    } as Record<string, any>;

    rows.push(base);

    if ((p.images?.length ?? 0) > 1) {
      for (let i = 1; i < (p.images?.length ?? 0); i++) {
        rows.push({
          Handle: p.handle,
          'Image Src': p.images![i].url,
          'Image Position': i + 1,
          'Image Alt Text': p.images![i].alt ?? p.title,
        });
      }
    }
  }
  return rows;
}

async function main() {
  const distributor = await loadDistributorProducts();
  const products = mapToProducts(distributor);
  const enriched = await enrichWithIcecat(products);
  const shopifyRows = toShopifyCsvRows(enriched);

  if (!fs.existsSync(OUT_DIR)) await fs.promises.mkdir(OUT_DIR, { recursive: true });
  const outfile = path.join(OUT_DIR, 'products_shopify.csv');
  await writeCsvFile(outfile, shopifyRows);
  console.log(`Wrote: ${path.relative(DATA_DIR, outfile)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

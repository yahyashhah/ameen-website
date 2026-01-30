import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { DATA_DIR, OUT_DIR, RAW_DIR, readCsvFile, readEnv, toInt, writeCsvFile } from './utils';

function getCol(name: string, def: string) {
  return readEnv(name, def)!;
}

async function loadDistributorStock(): Promise<{ sku: string; stock: number }[]> {
  const source = readEnv('DISTRIBUTOR_STOCK_CSV');
  let filePath: string | undefined = undefined;
  if (source && /^https?:\/\//i.test(source)) {
    throw new Error('Remote URLs are not supported in this simple runner. Please download the CSV into data/raw/stock.csv or set DISTRIBUTOR_STOCK_CSV to a local path.');
  } else if (source && fs.existsSync(source)) {
    filePath = source;
  } else if (fs.existsSync(path.join(RAW_DIR, 'stock.csv'))) {
    filePath = path.join(RAW_DIR, 'stock.csv');
  } else if (fs.existsSync(path.join(RAW_DIR, 'products.csv'))) {
    // fall back to products.csv stock column
    filePath = path.join(RAW_DIR, 'products.csv');
  } else {
    throw new Error('No distributor stock CSV found. Place one at data/raw/stock.csv or set DISTRIBUTOR_STOCK_CSV.');
  }
  const rows = await readCsvFile(filePath);
  const COL_SKU = getCol('DISTRIBUTOR_COL_SKU', 'sku');
  const COL_STOCK = getCol('DISTRIBUTOR_COL_STOCK', 'stock');

  return rows
    .map((r) => ({
      sku: (r[COL_SKU] ?? '').trim(),
      stock: toInt(r[COL_STOCK]) ?? 0,
    }))
    .filter((r) => r.sku);
}

async function main() {
  const stockRows = await loadDistributorStock();
  if (!stockRows.length) {
    console.log('No stock rows found.');
    return;
  }
  if (!fs.existsSync(OUT_DIR)) await fs.promises.mkdir(OUT_DIR, { recursive: true });
  const outfile = path.join(OUT_DIR, 'inventory_update.csv');
  // Minimal inventory CSV for Stock Sync mapping: SKU,Quantity
  await writeCsvFile(outfile, stockRows.map((r) => ({ SKU: r.sku, Quantity: r.stock })));
  console.log(`Wrote: ${path.relative(DATA_DIR, outfile)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

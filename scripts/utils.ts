import fs from 'node:fs';
import path from 'node:path';
import { parse as parseCsv } from 'papaparse';

export type DistributorRow = {
  sku: string;
  ean?: string;
  brand?: string;
  mpn?: string;
  name?: string;
  category?: string;
  price?: string | number;
  stock?: string | number;
};

export type ProductRecord = {
  sku: string;
  handle: string;
  title: string;
  vendor: string;
  type?: string;
  tags?: string[];
  price?: number;
  barcode?: string;
  stock?: number;
  mpn?: string;
  images?: { url: string; alt?: string }[];
  descriptionHtml?: string;
};

export const ROOT = path.resolve(__dirname, '..');
export const DATA_DIR = path.resolve(ROOT, 'data');
export const RAW_DIR = path.resolve(DATA_DIR, 'raw');
export const OUT_DIR = path.resolve(DATA_DIR, 'output');

export function readEnv(name: string, fallback?: string) {
  return process.env[name] ?? fallback;
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export async function readCsvFile(filePath: string): Promise<Record<string, string>[]> {
  const text = await fs.promises.readFile(filePath, 'utf8');
  return new Promise((resolve, reject) => {
    parseCsv(text, {
      header: true,
      transformHeader: (h: string) => h.trim(),
      skipEmptyLines: true,
      complete: ({ data }: { data: Record<string, string>[] }) => resolve(data),
      error: (err: any) => reject(err),
    });
  });
}

export function toNumber(val: any): number | undefined {
  if (val === undefined || val === null || val === '') return undefined;
  const n = Number(String(val).replace(/[^0-9.\-]/g, ''));
  return Number.isFinite(n) ? n : undefined;
}

export function toInt(val: any): number | undefined {
  if (val === undefined || val === null || val === '') return undefined;
  const n = parseInt(String(val).replace(/[^0-9\-]/g, ''), 10);
  return Number.isFinite(n) ? n : undefined;
}

export async function writeCsvFile(filePath: string, rows: Record<string, any>[]) {
  const headers = Object.keys(rows[0] ?? {});
  const escape = (v: any) => {
    if (v === undefined || v === null) return '';
    const s = String(v);
    if (s.includes('"') || s.includes(',') || s.includes('\n')) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  };
  const lines = [headers.join(',')].concat(
    rows.map((r) => headers.map((h) => escape(r[h])).join(','))
  );
  await fs.promises.writeFile(filePath, lines.join('\n'), 'utf8');
}

import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'node:path';
import fs from 'node:fs';
import { v4 as uuid } from 'uuid';

export type Variant = { id: string; productId: string; title: string; sku?: string; price: number };
export type Product = { id: string; handle: string; title: string; vendor: string; descriptionHtml?: string; type?: string; barcode?: string; price?: number; images: { url: string; altText?: string }[] };
export type Inventory = { productId: string; quantity: number };
export type Cart = { id: string; lines: { id: string; variantId: string; quantity: number }[]; checkoutUrl?: string };
export type Order = { id: string; createdAt: number; status: 'pending'|'paid'|'fulfilled'|'cancelled'; customerName: string; customerEmail: string; shippingAddress: any; items: { variantId: string; quantity: number; price: number }[]; total: number };

export type User = { id: string; email: string; name?: string; passwordHash: string; role: 'user'|'admin' };

export type DBSchema = {
  products: Product[];
  variants: Variant[];
  inventory: Inventory[];
  carts: Cart[];
  orders: Order[];
  users: User[];
};

const dataDir = path.resolve(process.cwd(), 'data');
const dbFile = path.join(dataDir, 'store.json');

export async function getDB() {
  if (!fs.existsSync(dataDir)) await fs.promises.mkdir(dataDir, { recursive: true });
  const adapter = new JSONFile<DBSchema>(dbFile);
  const db = new Low<DBSchema>(adapter, { products: [], variants: [], inventory: [], carts: [], orders: [], users: [] });
  await db.read();
  db.data ||= { products: [], variants: [], inventory: [], carts: [], orders: [], users: [] };
  return db;
}

export async function seedIfEmpty(products: Product[], variants: Variant[], inventory: Inventory[]) {
  const db = await getDB();
  if (!db.data!.products.length) {
    db.data!.products = products;
    db.data!.variants = variants;
    db.data!.inventory = inventory;
    await db.write();
  }
}

export function newId() { return uuid(); }

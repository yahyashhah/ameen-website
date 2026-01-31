import { cookies } from 'next/headers';
import { getDB, newId } from './db';

const CART_COOKIE = 'cartId';

export async function getOrCreateCart() {
  // Read-only in Server Components: only read cookie and return cart if present
  const store = await cookies();
  const id = store.get(CART_COOKIE)?.value;
  if (!id) return null as any;
  const db = await getDB();
  const cart = db.data!.carts.find((c) => c.id === id) || null;
  return cart as any;
}

export async function addToCart(variantId: string, quantity = 1) {
  const db = await getDB();
  const store = await cookies();
  let id = store.get(CART_COOKIE)?.value;
  let cart = id ? db.data!.carts.find((c) => c.id === id) : null;
  if (!id || !cart) {
    id = id || newId();
    cart = { id, lines: [] };
    // Ensure unique push if cart not already present
    if (!db.data!.carts.find((c) => c.id === id)) {
      db.data!.carts.push(cart);
    }
    await db.write();
    // Allowed in Server Actions/Route Handlers
    store.set(CART_COOKIE, id, { httpOnly: true, path: '/', sameSite: 'lax' });
  }
  const existing = cart.lines.find((l) => l.variantId === variantId);
  if (existing) existing.quantity += quantity;
  else cart.lines.push({ id: newId(), variantId, quantity });
  await db.write();
  return cart;
}

export async function updateLine(lineId: string, quantity: number) {
  const db = await getDB();
  const store = await cookies();
  const id = store.get(CART_COOKIE)?.value;
  if (!id) return null as any;
  const cart = db.data!.carts.find((c) => c.id === id);
  if (!cart) return null as any;
  const line = cart.lines.find((l) => l.id === lineId);
  if (line) line.quantity = Math.max(1, quantity);
  await db.write();
  return cart as any;
}

export async function removeLine(lineId: string) {
  const db = await getDB();
  const store = await cookies();
  const id = store.get(CART_COOKIE)?.value;
  if (!id) return null as any;
  const cart = db.data!.carts.find((c) => c.id === id);
  if (!cart) return null as any;
  cart.lines = cart.lines.filter((l) => l.id !== lineId);
  await db.write();
  return cart as any;
}

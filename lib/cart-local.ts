import { cookies } from 'next/headers';
import { getDB, newId } from './db';

const CART_COOKIE = 'cartId';

export async function getOrCreateCart() {
  const store = cookies();
  let id = store.get(CART_COOKIE)?.value;
  const db = await getDB();
  if (!id) {
    id = newId();
    db.data!.carts.push({ id, lines: [] });
    await db.write();
    store.set(CART_COOKIE, id, { httpOnly: true, path: '/', sameSite: 'lax' });
  }
  const cart = db.data!.carts.find((c) => c.id === id)!;
  return cart;
}

export async function addToCart(variantId: string, quantity = 1) {
  const db = await getDB();
  const cart = await getOrCreateCart();
  const line = cart.lines.find((l) => l.variantId === variantId);
  if (line) {
    line.quantity += quantity;
  } else {
    cart.lines.push({ id: newId(), variantId, quantity });
  }
  await db.write();
  return cart;
}

export async function updateLine(lineId: string, quantity: number) {
  const db = await getDB();
  const cart = await getOrCreateCart();
  const line = cart.lines.find((l) => l.id === lineId);
  if (line) line.quantity = Math.max(1, quantity);
  await db.write();
  return cart;
}

export async function removeLine(lineId: string) {
  const db = await getDB();
  const cart = await getOrCreateCart();
  cart.lines = cart.lines.filter((l) => l.id !== lineId);
  await db.write();
  return cart;
}

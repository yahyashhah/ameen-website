import { cookies } from 'next/headers';
import { cartCreateEmpty, cartLinesAdd, cartLinesRemove, cartLinesUpdate, getCart } from './shopify';

const CART_COOKIE = 'cartId';

export async function getOrCreateCart() {
  const store = await cookies();
  const id = store.get(CART_COOKIE)?.value;
  if (!id) return null as any;
  try {
    return await getCart(id);
  } catch {
    return null as any;
  }
}

export async function addToCart(variantId: string, quantity = 1) {
  const store = await cookies();
  let id = store.get(CART_COOKIE)?.value;
  if (!id) {
    const cart = await cartCreateEmpty();
    id = cart.id;
    store.set(CART_COOKIE, id, { httpOnly: true, path: '/', sameSite: 'lax' });
  }
  await cartLinesAdd(id!, [{ merchandiseId: variantId, quantity }]);
  return await getCart(id!);
}

export async function updateLine(lineId: string, quantity: number) {
  const id = (await cookies()).get(CART_COOKIE)?.value;
  if (!id) return null as any;
  await cartLinesUpdate(id, [{ id: lineId, quantity }]);
  return await getCart(id);
}

export async function removeLine(lineId: string) {
  const id = (await cookies()).get(CART_COOKIE)?.value;
  if (!id) return null as any;
  await cartLinesRemove(id, [lineId]);
  return await getCart(id);
}

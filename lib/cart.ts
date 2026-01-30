import { cookies } from 'next/headers';
import { cartCreateEmpty, cartLinesAdd, cartLinesRemove, cartLinesUpdate, getCart } from './shopify';

const CART_COOKIE = 'cartId';

export async function getOrCreateCart() {
  const store = cookies();
  let id = store.get(CART_COOKIE)?.value;
  if (!id) {
    const cart = await cartCreateEmpty();
    id = cart.id;
    store.set(CART_COOKIE, id, { httpOnly: true, path: '/', sameSite: 'lax' });
    return await getCart(id);
  }
  try {
    return await getCart(id);
  } catch {
    const cart = await cartCreateEmpty();
    id = cart.id;
    store.set(CART_COOKIE, id, { httpOnly: true, path: '/', sameSite: 'lax' });
    return await getCart(id);
  }
}

export async function addToCart(variantId: string, quantity = 1) {
  const store = cookies();
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
  const id = cookies().get(CART_COOKIE)?.value;
  if (!id) return null;
  await cartLinesUpdate(id, [{ id: lineId, quantity }]);
  return await getCart(id);
}

export async function removeLine(lineId: string) {
  const id = cookies().get(CART_COOKIE)?.value;
  if (!id) return null;
  await cartLinesRemove(id, [lineId]);
  return await getCart(id);
}

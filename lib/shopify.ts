const domain = process.env.SHOPIFY_STORE_DOMAIN;
const apiVersion = process.env.SHOPIFY_STOREFRONT_API_VERSION || '2024-10';
const token = process.env.SHOPIFY_STOREFRONT_API_TOKEN;

if (!domain) {
  console.warn('SHOPIFY_STORE_DOMAIN not set. Storefront pages will not work until configured.');
}

async function shopifyFetch<T>(query: string, variables?: Record<string, any>): Promise<T> {
  if (!domain || !token) throw new Error('Shopify environment not configured');
  const res = await fetch(`https://${domain}/api/${apiVersion}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`Shopify error: ${res.status}`);
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data as T;
}

export type ProductCard = {
  id: string;
  handle: string;
  title: string;
  vendor: string;
  featuredImage?: { url: string; altText?: string } | null;
  price?: { amount: string; currencyCode: string } | null;
};

export async function listProducts(limit = 12): Promise<ProductCard[]> {
  const query = `#graphql
    query Products($limit: Int!) {
      products(first: $limit) {
        edges { node {
          id
          handle
          title
          vendor
          featuredImage { url altText }
          priceRange { minVariantPrice { amount currencyCode } }
        }}
      }
    }
  `;
  type Resp = { products: { edges: { node: any }[] } };
  const data = await shopifyFetch<Resp>(query, { limit });
  return data.products.edges.map(({ node }) => ({
    id: node.id,
    handle: node.handle,
    title: node.title,
    vendor: node.vendor,
    featuredImage: node.featuredImage,
    price: node.priceRange?.minVariantPrice ?? null,
  }));
}

export type ProductDetail = {
  id: string;
  handle: string;
  title: string;
  descriptionHtml: string;
  vendor: string;
  images: { url: string; altText?: string }[];
  variants: { id: string; title: string; sku?: string | null; price: { amount: string; currencyCode: string } }[];
};

export async function getProductByHandle(handle: string): Promise<ProductDetail | null> {
  const query = `#graphql
    query Product($handle: String!) {
      product(handle: $handle) {
        id
        handle
        title
        descriptionHtml
        vendor
        images(first: 10) { edges { node { url altText } } }
        variants(first: 10) { edges { node { id title sku price { amount currencyCode } } } }
      }
    }
  `;
  type Resp = { product: any | null };
  const data = await shopifyFetch<Resp>(query, { handle });
  if (!data.product) return null;
  const p = data.product;
  return {
    id: p.id,
    handle: p.handle,
    title: p.title,
    descriptionHtml: p.descriptionHtml,
    vendor: p.vendor,
    images: p.images.edges.map((e: any) => e.node),
    variants: p.variants.edges.map((e: any) => e.node),
  };
}

export async function createCart(variantId: string, quantity = 1): Promise<{ checkoutUrl: string }> {
  const mutation = `#graphql
    mutation CartCreate($lines: [CartLineInput!]!) {
      cartCreate(input: { lines: $lines }) { cart { checkoutUrl } }
    }
  `;
  type Resp = { cartCreate: { cart: { checkoutUrl: string } } };
  const data = await shopifyFetch<Resp>(mutation, { lines: [{ merchandiseId: variantId, quantity }] });
  return { checkoutUrl: data.cartCreate.cart.checkoutUrl };
}

export async function getCart(cartId: string): Promise<any> {
  const query = `#graphql
    query Cart($id: ID!) {
      cart(id: $id) {
        id
        checkoutUrl
        lines(first: 50) {
          edges { node {
            id
            quantity
            merchandise { ... on ProductVariant { id title sku price { amount currencyCode } product { handle title vendor featuredImage { url altText } } } }
          } }
        }
      }
    }
  `;
  type Resp = { cart: any };
  const data = await shopifyFetch<Resp>(query, { id: cartId });
  return data.cart;
}

export async function cartCreateEmpty(): Promise<{ id: string; checkoutUrl: string }> {
  const mutation = `#graphql
    mutation CartCreateEmpty { cartCreate { cart { id checkoutUrl } } }
  `;
  type Resp = { cartCreate: { cart: { id: string; checkoutUrl: string } } };
  const data = await shopifyFetch<Resp>(mutation);
  return data.cartCreate.cart;
}

export async function cartLinesAdd(cartId: string, lines: { merchandiseId: string; quantity: number }[]): Promise<any> {
  const mutation = `#graphql
    mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) { cart { id checkoutUrl } }
    }
  `;
  type Resp = { cartLinesAdd: { cart: any } };
  const data = await shopifyFetch<Resp>(mutation, { cartId, lines });
  return data.cartLinesAdd.cart;
}

export async function cartLinesUpdate(cartId: string, lines: { id: string; quantity: number }[]): Promise<any> {
  const mutation = `#graphql
    mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { id checkoutUrl } }
    }
  `;
  type Resp = { cartLinesUpdate: { cart: any } };
  const data = await shopifyFetch<Resp>(mutation, { cartId, lines });
  return data.cartLinesUpdate.cart;
}

export async function cartLinesRemove(cartId: string, lineIds: string[]): Promise<any> {
  const mutation = `#graphql
    mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { id checkoutUrl } }
    }
  `;
  type Resp = { cartLinesRemove: { cart: any } };
  const data = await shopifyFetch<Resp>(mutation, { cartId, lineIds });
  return data.cartLinesRemove.cart;
}

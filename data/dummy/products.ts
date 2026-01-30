export type DummyProduct = {
  id: string;
  handle: string;
  title: string;
  vendor: string;
  featuredImage: { url: string; altText?: string };
  images: { url: string; altText?: string }[];
  price: { amount: string; currencyCode: string };
};

export const dummyProducts: DummyProduct[] = [
  {
    id: 'dummy-1',
    handle: 'powercore-10000-portable-charger',
    title: 'PowerCore 10000 Portable Charger',
    vendor: 'Anker',
    featuredImage: { url: 'https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=1200&q=80', altText: 'Portable charger on desk' },
    images: [
      { url: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=1200&q=80' },
      { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80' },
    ],
    price: { amount: '29.99', currencyCode: 'USD' },
  },
  {
    id: 'dummy-2',
    handle: 'mx-master-3s-wireless-mouse',
    title: 'MX Master 3S Wireless Mouse',
    vendor: 'Logitech',
    featuredImage: { url: 'https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?auto=format&fit=crop&w=1200&q=80', altText: 'Wireless mouse on workspace' },
    images: [
      { url: 'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?auto=format&fit=crop&w=1200&q=80' },
    ],
    price: { amount: '99.99', currencyCode: 'USD' },
  },
  {
    id: 'dummy-3',
    handle: 'base-one-magsafe-charger',
    title: 'Base One MagSafe Charger',
    vendor: 'Nomad',
    featuredImage: { url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80', altText: 'MagSafe charger on table' },
    images: [
      { url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80' },
    ],
    price: { amount: '119.00', currencyCode: 'USD' },
  },
  {
    id: 'dummy-4',
    handle: 'usb-c-hub-pro-7in1',
    title: 'USB‑C Hub Pro (7‑in‑1)',
    vendor: 'Satechi',
    featuredImage: { url: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1200&q=80', altText: 'USB-C hub with cables' },
    images: [
      { url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80' },
    ],
    price: { amount: '59.99', currencyCode: 'USD' },
  },
  {
    id: 'dummy-5',
    handle: 'mechanical-keyboard-tkl',
    title: 'Mechanical Keyboard TKL',
    vendor: 'Keychron',
    featuredImage: { url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80', altText: 'Mechanical keyboard on desk' },
    images: [
      { url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80' },
    ],
    price: { amount: '89.00', currencyCode: 'USD' },
  },
  {
    id: 'dummy-6',
    handle: 'noise-cancelling-headphones-pro',
    title: 'Noise‑Cancelling Headphones Pro',
    vendor: 'Sony',
    featuredImage: { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80', altText: 'Headphones close up' },
    images: [
      { url: 'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?auto=format&fit=crop&w=1200&q=80' },
    ],
    price: { amount: '279.99', currencyCode: 'USD' },
  },
  {
    id: 'dummy-7',
    handle: 'aluminum-laptop-stand',
    title: 'Aluminum Laptop Stand',
    vendor: 'Rain Design',
    featuredImage: { url: 'https://images.unsplash.com/photo-1484417894907-623942c8ee29?auto=format&fit=crop&w=1200&q=80', altText: 'Laptop stand on desk' },
    images: [
      { url: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1200&q=80' },
    ],
    price: { amount: '39.99', currencyCode: 'USD' },
  },
  {
    id: 'dummy-8',
    handle: 'premium-usb-c-cable',
    title: 'Premium USB‑C Cable (2m)',
    vendor: 'Nomad',
    featuredImage: { url: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1200&q=80', altText: 'USB-C cable on table' },
    images: [
      { url: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=1200&q=80' },
    ],
    price: { amount: '24.00', currencyCode: 'USD' },
  },
];

export function getDummyProducts(limit = 12) {
  return dummyProducts.slice(0, limit);
}

export function getDummyByHandle(handle: string) {
  return dummyProducts.find((p) => p.handle === handle) || null;
}

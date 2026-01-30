import CartCount from '@/components/CartCount';

export default function Header() {
  const brand = process.env.NEXT_PUBLIC_BRAND_NAME || 'Storefront';
  return (
    <header className="border-b">
      <div className="max-w-6xl mx-auto p-4 flex items-center justify-between">
        <a href="/" className="font-semibold">{brand}</a>
        <nav className="space-x-4 text-sm flex items-center">
          <a href="/products" className="hover:underline">Products</a>
          <a href="/collections" className="hover:underline">Collections</a>
          <a href="/about" className="hover:underline">About</a>
          <a href="/contact" className="hover:underline">Contact</a>
          {/* @ts-expect-error Async Server Component */}
          <CartCount />
        </nav>
      </div>
    </header>
  );
}

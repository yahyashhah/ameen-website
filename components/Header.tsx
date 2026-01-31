import CartCount from '@/components/CartCount';

export default function Header() {
  const brand = process.env.NEXT_PUBLIC_BRAND_NAME || 'Storefront';
  return (
    <header className="border-b sticky top-0 bg-white z-50">
      <div className="max-w-6xl mx-auto p-4 flex items-center justify-between">
        <a href="/" className="font-semibold text-lg">{brand}</a>
        <nav className="hidden md:flex space-x-6 text-sm items-center">
          <a href="/products" className="hover:underline">Products</a>
          <a href="/collections" className="hover:underline">Collections</a>
          <a href="/blog" className="hover:underline">Blog</a>
          <a href="/support" className="hover:underline">Support</a>
          <a href="/about" className="hover:underline">About</a>
          <a href="/contact" className="hover:underline">Contact</a>
          <CartCount />
        </nav>
        <button className="md:hidden">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
}

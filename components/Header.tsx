import Link from 'next/link';
import CartCount from '@/components/CartCount';

export default function Header() {
  const brand = process.env.NEXT_PUBLIC_BRAND_NAME || 'Storefront';
  return (
    <header className="border-b sticky top-0 bg-white z-50">
      <div className="max-w-6xl mx-auto p-4 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg">{brand}</Link>
        <nav className="hidden md:flex space-x-6 text-sm items-center">
          <Link href="/products" className="hover:underline">Products</Link>
          <Link href="/collections" className="hover:underline">Collections</Link>
          <Link href="/blog" className="hover:underline">Blog</Link>
          <Link href="/support" className="hover:underline">Support</Link>
          <Link href="/about" className="hover:underline">About</Link>
          <Link href="/contact" className="hover:underline">Contact</Link>
          <CartCount />
        </nav>
        <button className="md:hidden" aria-label="Menu">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
}

import Link from 'next/link';

export default function Footer() {
  const brand = process.env.NEXT_PUBLIC_BRAND_NAME || 'Storefront';
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white font-semibold mb-4">{brand}</h3>
            <p className="text-sm mb-4">
              Premium tech accessories for modern professionals.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition" aria-label="Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                </svg>
              </a>
              <a href="#" className="hover:text-white transition" aria-label="Twitter">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                </svg>
              </a>
              <a href="#" className="hover:text-white transition" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"/>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-white transition">All Products</Link></li>
              <li><Link href="/collections" className="hover:text-white transition">Collections</Link></li>
              <li><Link href="/products?featured=true" className="hover:text-white transition">Featured</Link></li>
              <li><Link href="/products?sort=newest" className="hover:text-white transition">New Arrivals</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/support" className="hover:text-white transition">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact Us</Link></li>
              <li><Link href="/policies/shipping" className="hover:text-white transition">Shipping</Link></li>
              <li><Link href="/policies/returns" className="hover:text-white transition">Returns</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
              <li><Link href="/policies/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="/policies/terms" className="hover:text-white transition">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-sm text-center">
          <p>&copy; {currentYear} {brand}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();
  const brand = process.env.NEXT_PUBLIC_BRAND_NAME || 'Storefront';
  return (
    <footer className="border-t mt-16">
      <div className="max-w-6xl mx-auto p-4 text-sm text-gray-500 flex items-center justify-between">
        <div>© {year} {brand}</div>
        <nav className="space-x-4">
          <a href="/policies/shipping" className="hover:underline">Shipping</a>
          <a href="/policies/returns" className="hover:underline">Returns</a>
          <a href="/policies/privacy" className="hover:underline">Privacy</a>
          <a href="/policies/terms" className="hover:underline">Terms</a>
        </nav>
      </div>
    </footer>
  );
}

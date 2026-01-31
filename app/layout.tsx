import type { Metadata } from "next";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';

const brand = process.env.NEXT_PUBLIC_BRAND_NAME || 'Storefront';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
export const metadata: Metadata = {
  title: `${brand} — Premium Tech Accessories`,
  description: `${brand} offers curated productivity gear and accessories.`,
  metadataBase: new URL(siteUrl),
  alternates: { canonical: '/' },
  openGraph: {
    title: `${brand} — Premium Tech Accessories`,
    description: `${brand} offers curated productivity gear and accessories.`,
    url: siteUrl,
    siteName: brand,
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Header />
        <main className="min-h-[70vh]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

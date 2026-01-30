import Link from 'next/link';
import Image from 'next/image';

export const dynamic = 'force-static';

const collections = [
  { title: 'Charging', href: '/search?q=charging', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80' },
  { title: 'Workspace', href: '/search?q=workspace', img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80' },
  { title: 'Audio', href: '/search?q=audio', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80' },
];

export default function CollectionsPage() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Collections</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {collections.map((c) => (
          <Link key={c.title} href={c.href} className="group block">
            <div className="relative aspect-[3/2] rounded-lg overflow-hidden">
              <Image src={c.img} alt={c.title} fill className="object-cover transition-transform group-hover:scale-105" />
            </div>
            <div className="mt-2 font-medium">{c.title}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

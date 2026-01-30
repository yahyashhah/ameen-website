import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl font-semibold mb-4 leading-tight">Elevate Your Everyday Setup</h1>
            <p className="text-gray-600 mb-6">Shop a curated selection of premium accessories engineered for productivity and performance.</p>
            <div className="space-x-3">
              <Link href="/products" className="bg-black text-white px-4 py-2 rounded">Shop Now</Link>
              <Link href="/about" className="px-4 py-2 border rounded">Learn More</Link>
            </div>
          </div>
          <div className="relative aspect-[4/3]">
            <Image src="https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1600&q=80" alt="Modern workspace with accessories" fill className="object-cover rounded-lg" />
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-xl font-semibold mb-4">Featured Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Charging', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80' },
            { title: 'Workspace', img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80' },
            { title: 'Audio', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80' },
          ].map((c) => (
            <Link key={c.title} href="/products" className="group block">
              <div className="relative aspect-[3/2] rounded-lg overflow-hidden">
                <Image src={c.img} alt={c.title} fill className="object-cover transition-transform group-hover:scale-105" />
              </div>
              <div className="mt-2 font-medium">{c.title}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

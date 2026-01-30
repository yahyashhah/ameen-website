import Link from "next/link";
import Image from "next/image";
import Newsletter from "@/components/Newsletter";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-5xl font-bold mb-4 leading-tight">Elevate Your Everyday Setup</h1>
            <p className="text-gray-600 text-lg mb-8">Shop a curated selection of premium accessories engineered for productivity and performance.</p>
            <div className="flex gap-4">
              <Link href="/products" className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition font-medium">
                Shop Now
              </Link>
              <Link href="/about" className="px-6 py-3 border-2 border-black rounded-lg hover:bg-black hover:text-white transition font-medium">
                Learn More
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/3]">
            <Image 
              src="https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1600&q=80" 
              alt="Modern workspace with accessories" 
              fill 
              className="object-cover rounded-2xl shadow-2xl" 
              priority
            />
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Shop by Category</h2>
          <p className="text-gray-600">Discover our carefully curated collections</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              title: 'Charging', 
              img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
              description: 'Fast & reliable power solutions'
            },
            { 
              title: 'Workspace', 
              img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80',
              description: 'Organize your perfect setup'
            },
            { 
              title: 'Audio', 
              img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
              description: 'Premium sound experience'
            },
          ].map((c) => (
            <Link key={c.title} href="/products" className="group block">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4">
                <Image 
                  src={c.img} 
                  alt={c.title} 
                  fill 
                  className="object-cover transition-transform group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-2xl font-bold mb-1">{c.title}</h3>
                  <p className="text-sm text-gray-200">{c.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: '📦', title: 'Free Shipping', desc: 'On orders over $50' },
              { icon: '🔒', title: 'Secure Payment', desc: 'SSL encrypted checkout' },
              { icon: '↩️', title: 'Easy Returns', desc: '30-day return policy' },
              { icon: '💬', title: '24/7 Support', desc: 'Expert assistance' }
            ].map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <Newsletter />
    </div>
  );
}

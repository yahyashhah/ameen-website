import Image from 'next/image';

export const metadata = {
  title: 'About Us',
  description: 'Learn about our mission to deliver premium tech accessories'
};

export default function AboutPage() {
  const brand = process.env.NEXT_PUBLIC_BRAND_NAME || 'Our Store';
  
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">About {brand}</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          We're passionate about delivering premium tech accessories that enhance your daily workflow
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
          <Image 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80" 
            alt="Modern workspace" 
            fill 
            className="object-cover" 
          />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-4">
            We're a team of product enthusiasts dedicated to building better everyday setups. Our catalog focuses on thoughtfully designed, durable accessories from trusted brands—tested for reliability in real workflows.
          </p>
          <p className="text-gray-700">
            From charging solutions to workspace essentials, everything is curated to help you do your best work. We partner with leading manufacturers and authorized distributors to ensure authenticity and quality.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="text-center">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="font-semibold mb-2">Authentic Products</h3>
          <p className="text-gray-600 text-sm">Only genuine products from authorized distributors</p>
        </div>
        <div className="text-center">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-semibold mb-2">Fast Shipping</h3>
          <p className="text-gray-600 text-sm">Quick and reliable delivery to your doorstep</p>
        </div>
        <div className="text-center">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h3 className="font-semibold mb-2">Expert Support</h3>
          <p className="text-gray-600 text-sm">Dedicated team ready to help you</p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Join Our Community</h2>
        <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
          New products arrive regularly. Subscribe to our newsletter to stay updated on the latest releases, exclusive deals, and productivity tips.
        </p>
        <a href="/contact" className="inline-block bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition">
          Get in Touch
        </a>
      </div>
    </div>
  );
}

import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Blog - Latest News & Updates',
  description: 'Stay updated with the latest news, product launches, and tech tips'
};

// Mock blog posts - in production, fetch from CMS or database
const blogPosts = [
  {
    slug: 'top-10-workspace-accessories-2024',
    title: 'Top 10 Workspace Accessories for 2024',
    excerpt: 'Discover the must-have accessories to elevate your home office setup this year.',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1200&q=80',
    category: 'Guides',
    date: '2024-01-15',
    author: 'Sarah Johnson'
  },
  {
    slug: 'choosing-right-charging-solution',
    title: 'How to Choose the Right Charging Solution',
    excerpt: 'A comprehensive guide to selecting the perfect charger for your devices.',
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1200&q=80',
    category: 'Tech Tips',
    date: '2024-01-10',
    author: 'Mike Chen'
  },
  {
    slug: 'cable-management-tips',
    title: '5 Cable Management Tips for Clean Desk',
    excerpt: 'Keep your workspace organized with these simple cable management solutions.',
    image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=1200&q=80',
    category: 'Organization',
    date: '2024-01-05',
    author: 'Emily Rodriguez'
  },
  {
    slug: 'ergonomic-setup-guide',
    title: 'The Complete Ergonomic Setup Guide',
    excerpt: 'Learn how to create a comfortable and healthy workspace environment.',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80',
    category: 'Health',
    date: '2023-12-28',
    author: 'David Park'
  },
  {
    slug: 'wireless-vs-wired',
    title: 'Wireless vs Wired: Which is Better?',
    excerpt: 'Compare the pros and cons of wireless and wired accessories for your setup.',
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=1200&q=80',
    category: 'Comparisons',
    date: '2023-12-20',
    author: 'Sarah Johnson'
  },
  {
    slug: 'usb-c-revolution',
    title: 'The USB-C Revolution: Everything You Need to Know',
    excerpt: 'Understanding the benefits and capabilities of USB-C technology.',
    image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?auto=format&fit=crop&w=1200&q=80',
    category: 'Tech Tips',
    date: '2023-12-15',
    author: 'Mike Chen'
  }
];

export default function BlogPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-gray-600 text-lg">Latest news, updates, and tech tips</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <article key={post.slug} className="group">
            <Link href={`/blog/${post.slug}`}>
              <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-4">
                <Image 
                  src={post.image} 
                  alt={post.title} 
                  fill 
                  className="object-cover transition-transform group-hover:scale-105" 
                />
                <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded text-sm font-medium">
                  {post.category}
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2 group-hover:underline">{post.title}</h2>
                <p className="text-gray-600 mb-3">{post.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{post.author}</span>
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

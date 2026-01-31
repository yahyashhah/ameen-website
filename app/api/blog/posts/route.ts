import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const posts = [
      {
        id: 'post-1',
        slug: 'optimize-your-workspace-2026',
        title: 'Optimize Your Workspace in 2026',
        excerpt: 'Practical tips to declutter and speed up your daily workflow.',
        content: '',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
        category: 'Guides',
        tags: ['workspace', 'productivity', 'setup'],
        author: 'Ameen Tech',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
        publishedAt: new Date().toISOString(),
        readTime: '6 min',
        views: 1284,
        featured: true,
      },
      {
        id: 'post-2',
        slug: 'charging-essentials',
        title: 'Charging Essentials: What to Buy',
        excerpt: 'Cables, chargers, and safety best practices.',
        content: '',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
        category: 'Reviews',
        tags: ['charging', 'cables', 'power'],
        author: 'Ameen Tech',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
        publishedAt: new Date().toISOString(),
        readTime: '4 min',
        views: 845,
        featured: false,
      },
    ];
    return NextResponse.json({ posts });
  } catch (err) {
    console.error('Blog posts API error:', err);
    return NextResponse.json({ error: 'Failed to load posts' }, { status: 500 });
  }
}

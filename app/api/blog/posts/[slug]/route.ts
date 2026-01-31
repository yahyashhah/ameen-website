import { NextResponse } from 'next/server';

export async function GET(_: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params;
    const base = {
      id: 'post-1',
      slug: 'optimize-your-workspace-2026',
      title: 'Optimize Your Workspace in 2026',
      excerpt: 'Practical tips to declutter and speed up your daily workflow.',
      content: '<p>From cable management to ergonomics, we cover essentials.</p>',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      category: 'Guides',
      tags: ['workspace', 'productivity', 'setup'],
      author: 'Ameen Tech',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
      authorBio: 'Designer and productivity enthusiast.',
      authorRole: 'Editor',
      publishedAt: new Date().toISOString(),
      readTime: '6 min',
      views: 1284,
      likes: 32,
      featured: true,
      relatedPosts: [
        { id: 'post-2', slug: 'charging-essentials', title: 'Charging Essentials', excerpt: 'Fast charge safely.', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80', category: 'Reviews' },
        { id: 'post-3', slug: 'mouse-mastery', title: 'Mouse Mastery', excerpt: 'Precision and comfort.', image: 'https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?auto=format&fit=crop&w=600&q=80', category: 'Guides' }
      ],
      comments: [
        { id: 'c1', author: 'Jane', authorAvatar: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=128&q=80', content: 'Great tips, thanks!', createdAt: new Date().toISOString(), likes: 2 }
      ]
    };

    if (slug === base.slug) return NextResponse.json(base);
    if (slug === 'charging-essentials') {
      return NextResponse.json({
        id: 'post-2',
        slug: 'charging-essentials',
        title: 'Charging Essentials: What to Buy',
        excerpt: 'Cables, chargers, and safety best practices.',
        content: '<p>Choose certified accessories to protect devices and ensure optimal speed.</p>',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
        category: 'Reviews',
        tags: ['charging', 'cables', 'power'],
        author: 'Ameen Tech',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
        publishedAt: new Date().toISOString(),
        readTime: '4 min',
        views: 845,
        likes: 21,
        featured: false,
        relatedPosts: [],
        comments: [],
      });
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  } catch (err) {
    console.error('Blog post API error:', err);
    return NextResponse.json({ error: 'Failed to load post' }, { status: 500 });
  }
}

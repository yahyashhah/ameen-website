export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  tags: string[];
  author: string;
  authorAvatar: string;
  authorBio?: string;
  authorRole?: string;
  publishedAt: string;
  readTime: string;
  views: number;
  likes: number;
  featured: boolean;
  relatedPosts?: Array<{
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    image: string;
    category: string;
  }>;
  comments?: Array<{
    id: string;
    author: string;
    authorAvatar: string;
    content: string;
    createdAt: string;
    likes: number;
  }>;
};

const posts: BlogPost[] = [
  {
    id: 'post-1',
    slug: 'optimize-your-workspace-2026',
    title: 'Optimize Your Workspace in 2026',
    excerpt: 'Practical tips to declutter and speed up your daily workflow.',
    content: '<p>From cable management to ergonomics, we cover the essentials that make your workspace more productive.</p><p>Pair with fast chargers and quality peripherals for tangible improvements.</p>',
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
  },
  {
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
    featured: false
  },
  {
    id: 'post-3',
    slug: 'mouse-mastery',
    title: 'Mouse Mastery: Precision and Comfort',
    excerpt: 'How to pick a mouse for long hours and accuracy.',
    content: '<p>Consider sensor quality, ergonomics, and battery life.</p>',
    image: 'https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?auto=format&fit=crop&w=1200&q=80',
    category: 'Guides',
    tags: ['mouse', 'workflow'],
    author: 'Ameen Tech',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
    publishedAt: new Date().toISOString(),
    readTime: '5 min',
    views: 623,
    likes: 14,
    featured: false
  },
  {
    id: 'post-4',
    slug: 'audio-upgrades',
    title: 'Audio Upgrades for Focus',
    excerpt: 'Noise cancellation and comfort for deep work.',
    content: '<p>Pick headphones with ANC and balanced sound profiles.</p>',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
    category: 'Tech Tips',
    tags: ['audio', 'focus'],
    author: 'Ameen Tech',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
    publishedAt: new Date().toISOString(),
    readTime: '3 min',
    views: 402,
    likes: 7,
    featured: false
  }
];

export async function listBlogPosts() {
  return posts.map(({ comments, relatedPosts, ...p }) => p);
}

export async function getBlogPostBySlug(slug: string) {
  return posts.find((p) => p.slug === slug) || null;
}

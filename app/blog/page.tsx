'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  Calendar,
  User,
  Tag,
  Search,
  Filter,
  Clock,
  TrendingUp,
  BookOpen,
  ArrowRight,
  Star,
  Eye,
} from 'lucide-react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  TextField,
  Skeleton,
  ToggleButton,
  ToggleButtonGroup,
  Pagination,
} from '@mui/material';

interface BlogPost {
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
  publishedAt: string;
  readTime: string;
  views: number;
  featured: boolean;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [page, setPage] = useState(1);
  const postsPerPage = 9;

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/blog/posts');
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Failed to fetch blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'All',
    'Guides',
    'Tech Tips',
    'Reviews',
    'News',
    'How-To',
    'Industry',
  ];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      post.content.toLowerCase().includes(search.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === 'latest') {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    } else if (sortBy === 'popular') {
      return b.views - a.views;
    } else if (sortBy === 'featured') {
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    }
    return 0;
  });

  const paginatedPosts = sortedPosts.slice(
    (page - 1) * postsPerPage,
    page * postsPerPage
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Skeleton variant="text" width={300} height={60} className="mb-12 mx-auto" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Skeleton variant="text" />
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" width="60%" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-gray-900 to-black text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-grid-white/[0.02]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Chip
              label="Blog & Resources"
              className="bg-linear-to-r from-purple-600 to-pink-500 text-white mb-6 px-4 py-1"
              icon={<BookOpen className="w-4 h-4 text-white"/>}
            />
            
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Tech Insights &{' '}
              <span className="bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Guides
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Stay updated with the latest tech trends, product reviews, and expert guides 
              to enhance your workspace and productivity.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <TextField
                fullWidth
                placeholder="Search articles, guides, tips..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-white backdrop-blur-sm rounded-md"
                InputProps={{
                  startAdornment: <Search className="w-5 h-5 text-gray-400 mr-3" />,
                  className: "text-white rounded-xl border-white/20",
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255,255,255,0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255,255,255,0.3)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'rgba(168,85,247,0.5)',
                    },
                  },
                }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Post */}
        {posts.filter(p => p.featured).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold mb-8">Featured Article</h2>
            {posts
              .filter(p => p.featured)
              .slice(0, 1)
              .map((featuredPost) => (
                <Link key={featuredPost.id} href={`/blog/${featuredPost.slug}`}>
                  <Card className="rounded-2xl overflow-hidden hover:shadow-2xl transition-shadow">
                    <div className="grid lg:grid-cols-2">
                      <div className="relative h-64 lg:h-auto">
                        <Image
                          src={featuredPost.image}
                          alt={featuredPost.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-4 left-4">
                          <Chip
                            label="Featured"
                            className="bg-linear-to-r from-purple-600 to-pink-500 text-white"
                          />
                        </div>
                      </div>
                      
                      <CardContent className="p-8 lg:p-12 flex flex-col justify-center">
                        <div className="flex items-center gap-4 mb-4">
                          <Chip
                            label={featuredPost.category}
                            size="small"
                            variant="outlined"
                          />
                          <div className="flex items-center gap-1 text-gray-600 text-sm">
                            <Calendar className="w-4 h-4" />
                            {new Date(featuredPost.publishedAt).toLocaleDateString('en-US')}
                          </div>
                        </div>
                        
                        <h3 className="text-3xl font-bold mb-4 hover:text-purple-600 transition-colors">
                          {featuredPost.title}
                        </h3>
                        
                        <p className="text-gray-600 mb-6">
                          {featuredPost.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                              {featuredPost.authorAvatar && (
                                <Image
                                  src={featuredPost.authorAvatar}
                                  alt={featuredPost.author}
                                  width={40}
                                  height={40}
                                  className="object-cover"
                                />
                              )}
                            </div>
                            <div>
                              <Typography variant="subtitle2" className="font-bold">
                                {featuredPost.author}
                              </Typography>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Clock className="w-4 h-4" />
                                {featuredPost.readTime}
                              </div>
                            </div>
                          </div>
                          
                          <Button
                            endIcon={<ArrowRight className="w-4 h-4" />}
                            className="text-purple-600 hover:text-purple-700"
                          >
                            Read Article
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </Link>
              ))}
          </motion.div>
        )}

        {/* Filters */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={categoryFilter === category.toLowerCase() ? 'contained' : 'outlined'}
                  className={`rounded-full px-4 py-2 ${
                    categoryFilter === category.toLowerCase()
                      ? 'bg-purple-600 text-white'
                      : 'border-gray-300 text-gray-700 hover:border-purple-300'
                  }`}
                  onClick={() => setCategoryFilter(category.toLowerCase())}
                  size="small"
                >
                  {category}
                </Button>
              ))}
            </div>
            
            <div className="flex items-center gap-4">
              <Typography variant="body2" color="textSecondary" className="whitespace-nowrap">
                Sort by:
              </Typography>
              <ToggleButtonGroup
                value={sortBy}
                exclusive
                onChange={(_, newValue) => newValue && setSortBy(newValue)}
                size="small"
              >
                <ToggleButton value="latest">
                  <Calendar className="w-4 h-4 mr-2" />
                  Latest
                </ToggleButton>
                <ToggleButton value="popular">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Popular
                </ToggleButton>
                <ToggleButton value="featured">
                  <Star className="w-4 h-4 mr-2" />
                  Featured
                </ToggleButton>
              </ToggleButtonGroup>
            </div>
          </div>
          
          <Typography variant="body2" color="textSecondary" className="mb-4">
            {filteredPosts.length} articles found
          </Typography>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {paginatedPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/blog/${post.slug}`}>
                <Card className="group h-full rounded-2xl overflow-hidden hover:shadow-xl transition-shadow">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {post.featured && (
                      <div className="absolute top-3 left-3">
                        <Chip
                          label="Featured"
                          size="small"
                          className="bg-linear-to-r from-purple-600 to-pink-500 text-white"
                        />
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-6">
                    {/* Meta Info */}
                    <div className="flex items-center gap-3 mb-4">
                      <Chip
                        label={post.category}
                        size="small"
                        variant="outlined"
                      />
                      <div className="flex items-center gap-1 text-gray-600 text-sm">
                        <Clock className="w-4 h-4" />
                        {post.readTime}
                      </div>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-xl font-bold mb-3 group-hover:text-purple-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    
                    {/* Excerpt */}
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    {/* Author & Views */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                          {post.authorAvatar && (
                            <Image
                              src={post.authorAvatar}
                              alt={post.author}
                              width={32}
                              height={32}
                              className="object-cover"
                            />
                          )}
                        </div>
                        <Typography variant="caption" className="font-medium">
                          {post.author}
                        </Typography>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Eye className="w-4 h-4" />
                        {post.views.toLocaleString()} views
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        {filteredPosts.length > postsPerPage && (
          <div className="flex justify-center">
            <Pagination
              count={Math.ceil(filteredPosts.length / postsPerPage)}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
            />
          </div>
        )}

        {/* Newsletter CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-20"
        >
          <Card className="bg-linear-to-r from-purple-50 to-pink-50 rounded-2xl overflow-hidden border-0">
            <div className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Subscribe to our newsletter to receive the latest tech tips, 
                product updates, and exclusive content directly in your inbox.
              </p>
              
              <div className="max-w-md mx-auto">
                <div className="flex gap-4">
                  <TextField
                    fullWidth
                    placeholder="Enter your email"
                    className="bg-white"
                  />
                  <Button
                    variant="contained"
                    className="bg-linear-to-r from-purple-600 to-pink-500 px-8 py-3"
                  >
                    Subscribe
                  </Button>
                </div>
                <Typography variant="caption" color="textSecondary" className="mt-3 block">
                  By subscribing, you agree to our Privacy Policy
                </Typography>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
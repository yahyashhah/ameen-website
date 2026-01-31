'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import {
  Calendar,
  User,
  Clock,
  Tag,
  Share2,
  Bookmark,
  ThumbsUp,
  MessageCircle,
  ArrowLeft,
  Eye,
  TrendingUp,
} from 'lucide-react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  IconButton,
  TextField,
  Avatar,
  Divider,
  Alert,
  Skeleton,
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
  authorBio: string;
  authorRole: string;
  publishedAt: string;
  readTime: string;
  views: number;
  likes: number;
  featured: boolean;
  relatedPosts: Array<{
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    image: string;
    category: string;
  }>;
  comments: Array<{
    id: string;
    author: string;
    authorAvatar: string;
    content: string;
    createdAt: string;
    likes: number;
  }>;
}

interface CommentForm {
  name: string;
  email: string;
  content: string;
}

export default function BlogDetailPage() {
  const { slug } = useParams() as { slug: string };
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(true);
  const [commentForm, setCommentForm] = useState<CommentForm>({
    name: '',
    email: '',
    content: '',
  });
  const [submittingComment, setSubmittingComment] = useState(false);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    fetchBlogPost();
  }, [slug]);

  const fetchBlogPost = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/blog/posts/${slug}`);
      if (!response.ok) {
        throw new Error('Post not found');
      }
      const data = await response.json();
      setPost(data);
    } catch (error) {
      console.error('Failed to fetch blog post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!post) return;
    
    try {
      const response = await fetch(`/api/blog/posts/${post.id}/like`, {
        method: 'POST',
      });

      if (response.ok) {
        setLiked(!liked);
        setPost({
          ...post,
          likes: liked ? post.likes - 1 : post.likes + 1,
        });
      }
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleBookmark = async () => {
    setBookmarked(!bookmarked);
    // In a real app, you would save this to the user's account
  };

  const handleShare = () => {
    if (navigator.share && post) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    } else {
      // Fallback to copying the URL
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) return;

    setSubmittingComment(true);
    try {
      const response = await fetch(`/api/blog/posts/${post.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentForm),
      });

      if (response.ok) {
        const newComment = await response.json();
        setPost({
          ...post,
          comments: [...post.comments, newComment],
        });
        setCommentForm({ name: '', email: '', content: '' });
      }
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Skeleton variant="text" width={200} height={40} className="mb-6" />
          <Skeleton variant="rectangular" height={400} className="mb-8 rounded-2xl" />
          <Skeleton variant="text" width="80%" height={60} className="mb-4" />
          <Skeleton variant="text" width="60%" className="mb-2" />
          <Skeleton variant="text" width="70%" className="mb-2" />
          <Skeleton variant="text" width="65%" className="mb-2" />
        </div>
      </div>
    );
  }

  if (!post) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link href="/blog">
            <Button
              startIcon={<ArrowLeft className="w-4 h-4" />}
              variant="text"
              className="mb-8"
            >
              Back to Blog
            </Button>
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Hero Image */}
              <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-8">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
                {post.featured && (
                  <div className="absolute top-4 left-4">
                    <Chip
                      label="Featured"
                      className="bg-linear-to-r from-purple-600 to-pink-500 text-white"
                    />
                  </div>
                )}
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <Chip
                  label={post.category}
                  size="small"
                  variant="outlined"
                  className="border-purple-300 text-purple-700"
                />
                
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(post.publishedAt).toLocaleDateString('en-US')}</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime} read</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-600">
                  <Eye className="w-4 h-4" />
                  <span>{post.views.toLocaleString()} views</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                {post.title}
              </h1>

              {/* Author */}
              <div className="flex items-center gap-4 mb-8 p-4 bg-gray-50 rounded-2xl">
                <Avatar
                  className="w-12 h-12"
                  src={post.authorAvatar}
                  alt={post.author}
                >
                  {post.author[0]}
                </Avatar>
                <div>
                  <Typography variant="subtitle1" className="font-bold">
                    {post.author}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {post.authorRole}
                  </Typography>
                </div>
              </div>

              {/* Content */}
              <div className="prose prose-lg max-w-none mb-12">
                <p className="text-xl text-gray-600 mb-8">
                  {post.excerpt}
                </p>
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>

              {/* Tags */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-5 h-5 text-gray-600" />
                  <Typography variant="subtitle2" className="font-bold">
                    Tags
                  </Typography>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Link key={tag} href={`/blog/tag/${tag}`}>
                      <Chip
                        label={tag}
                        className="hover:bg-gray-100 cursor-pointer"
                        size="small"
                      />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl mb-12">
                <div className="flex items-center gap-4">
                  <Button
                    variant={liked ? 'contained' : 'outlined'}
                    startIcon={<ThumbsUp className="w-5 h-5" />}
                    onClick={handleLike}
                    className={liked ? 'bg-purple-600' : ''}
                  >
                    {post.likes} {post.likes === 1 ? 'Like' : 'Likes'}
                  </Button>
                  
                  <IconButton onClick={handleBookmark} title="Bookmark">
                    <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-purple-600 text-purple-600' : ''}`} />
                  </IconButton>
                  
                  <IconButton onClick={handleShare} title="Share">
                    <Share2 className="w-5 h-5" />
                  </IconButton>
                </div>
                
                <div className="flex items-center gap-2 text-gray-600">
                  <TrendingUp className="w-4 h-4" />
                  <Typography variant="caption">
                    Trending in {post.category}
                  </Typography>
                </div>
              </div>

              {/* Author Bio */}
              <Card className="rounded-2xl mb-12">
                <CardContent className="p-6">
                  <Typography variant="h6" className="font-bold mb-4">
                    About the Author
                  </Typography>
                  <div className="flex flex-col md:flex-row gap-6">
                    <Avatar
                      className="w-20 h-20"
                      src={post.authorAvatar}
                      alt={post.author}
                    >
                      {post.author[0]}
                    </Avatar>
                    <div>
                      <Typography variant="subtitle1" className="font-bold mb-2">
                        {post.author}
                      </Typography>
                      <Typography variant="body2" className="text-gray-600 mb-3">
                        {post.authorBio}
                      </Typography>
                      <Typography variant="body2" className="text-gray-600">
                        {post.authorRole}
                      </Typography>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Comments */}
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                  <MessageCircle className="w-5 h-5 text-gray-600" />
                  <Typography variant="h6" className="font-bold">
                    Comments ({post.comments.length})
                  </Typography>
                </div>

                {/* Comment Form */}
                <Card className="rounded-2xl mb-8">
                  <CardContent className="p-6">
                    <form onSubmit={handleCommentSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <TextField
                          label="Name"
                          value={commentForm.name}
                          onChange={(e) => setCommentForm({
                            ...commentForm,
                            name: e.target.value,
                          })}
                          fullWidth
                          required
                        />
                        <TextField
                          label="Email"
                          type="email"
                          value={commentForm.email}
                          onChange={(e) => setCommentForm({
                            ...commentForm,
                            email: e.target.value,
                          })}
                          fullWidth
                          required
                        />
                      </div>
                      <TextField
                        label="Comment"
                        value={commentForm.content}
                        onChange={(e) => setCommentForm({
                          ...commentForm,
                          content: e.target.value,
                        })}
                        fullWidth
                        multiline
                        rows={4}
                        required
                        className="mb-4"
                      />
                      <Button
                        type="submit"
                        variant="contained"
                        className="bg-linear-to-r from-purple-600 to-pink-500"
                        disabled={submittingComment}
                      >
                        {submittingComment ? 'Posting...' : 'Post Comment'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Comments List */}
                <div className="space-y-6">
                  {post.comments.map((comment) => (
                    <Card key={comment.id} className="rounded-2xl">
                      <CardContent className="p-6">
                        <div className="flex gap-4 mb-4">
                          <Avatar
                            src={comment.authorAvatar}
                            alt={comment.author}
                          >
                            {comment.author[0]}
                          </Avatar>
                          <div className="flex-1">
                            <Typography variant="subtitle2" className="font-bold">
                              {comment.author}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {new Date(comment.createdAt).toLocaleDateString('en-US')}
                            </Typography>
                          </div>
                        </div>
                        <Typography variant="body1">
                          {comment.content}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </motion.article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              {/* Popular Posts */}
              <Card className="rounded-2xl">
                <CardContent className="p-6">
                  <Typography variant="h6" className="font-bold mb-6">
                    Popular Posts
                  </Typography>
                  <div className="space-y-4">
                    {post.relatedPosts.slice(0, 3).map((relatedPost) => (
                      <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                        <div className="flex gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                            <Image
                              src={relatedPost.image}
                              alt={relatedPost.title}
                              width={64}
                              height={64}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <div>
                            <Typography variant="body2" className="font-bold mb-1 line-clamp-2">
                              {relatedPost.title}
                            </Typography>
                            <Chip
                              label={relatedPost.category}
                              size="small"
                              className="text-xs"
                            />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Newsletter */}
              <Card className="rounded-2xl bg-linear-to-br from-purple-50 to-pink-50">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="w-6 h-6 text-purple-600" />
                    </div>
                    <Typography variant="h6" className="font-bold mb-2">
                      Stay Updated
                    </Typography>
                    <Typography variant="body2" color="textSecondary" className="mb-4">
                      Get the latest articles delivered to your inbox
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="Your email"
                      className="mb-4 bg-white"
                      size="small"
                    />
                    <Button
                      fullWidth
                      variant="contained"
                      className="bg-linear-to-r from-purple-600 to-pink-500"
                    >
                      Subscribe
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Categories */}
              <Card className="rounded-2xl">
                <CardContent className="p-6">
                  <Typography variant="h6" className="font-bold mb-6">
                    Categories
                  </Typography>
                  <div className="space-y-2">
                    {[
                      'Guides',
                      'Tech Tips',
                      'Reviews',
                      'News',
                      'How-To',
                      'Industry',
                    ].map((category) => (
                      <Link key={category} href={`/blog/category/${category.toLowerCase()}`}>
                        <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                          <Typography variant="body2">{category}</Typography>
                          <Chip label="12" size="small" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Social Share */}
              <Card className="rounded-2xl">
                <CardContent className="p-6">
                  <Typography variant="h6" className="font-bold mb-4">
                    Share This Article
                  </Typography>
                  <div className="flex gap-2">
                    {[
                      { icon: 'F', label: 'Facebook', color: 'blue-600' },
                      { icon: 'T', label: 'Twitter', color: 'sky-500' },
                      { icon: 'L', label: 'LinkedIn', color: 'blue-700' },
                      { icon: '📋', label: 'Copy Link', color: 'gray-600' },
                    ].map((social) => (
                      <IconButton
                        key={social.label}
                        className={`w-12 h-12 bg-${social.color} text-white hover:bg-${social.color.replace('6', '7')}`}
                        onClick={handleShare}
                        title={`Share on ${social.label}`}
                      >
                        {social.icon}
                      </IconButton>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.aside>
          </div>
        </div>
      </div>
    </div>
  );
}
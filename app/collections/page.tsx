'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Sparkles, 
  Star, 
  TrendingUp, 
  Clock, 
  Filter,
  ChevronRight,
  Grid,
  List
} from 'lucide-react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Skeleton,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';

interface Collection {
  id: string;
  title: string;
  handle: string;
  description: string;
  image: string;
  productCount: number;
  featured: boolean;
  products: Array<{
    id: string;
    title: string;
    price: number;
    compareAtPrice?: number;
    images: string[];
    rating: number;
    reviewCount: number;
  }>;
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/collections');
      const data = await response.json();
      setCollections(data.collections || []);
    } catch (error) {
      console.error('Failed to fetch collections:', error);
    } finally {
      setLoading(false);
    }
  };

  const filters = [
    { id: 'all', label: 'All Collections' },
    { id: 'featured', label: 'Featured' },
    { id: 'new', label: 'New Arrivals' },
    { id: 'popular', label: 'Most Popular' },
  ];

  const filteredCollections = collections.filter(collection => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'featured') return collection.featured;
    if (activeFilter === 'new') return true; // Add your logic
    if (activeFilter === 'popular') return collection.productCount > 10;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Skeleton variant="text" width={200} height={40} className="mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Skeleton variant="text" />
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
      <section className="relative overflow-hidden bg-linear-to-br from-purple-50 to-pink-50">
        <div className="absolute inset-0 bg-grid-slate-100 mask-[linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium">Curated Collections</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              Explore Our{' '}
              <span className="bg-linear-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                Collections
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Discover carefully curated collections of premium tech accessories, 
              organized to help you find exactly what you need for your perfect setup.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters & Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <Button
                key={filter.id}
                variant={activeFilter === filter.id ? 'contained' : 'outlined'}
                className={`rounded-full px-4 py-2 ${
                  activeFilter === filter.id
                    ? 'bg-purple-600 text-white'
                    : 'border-gray-300 text-gray-700'
                }`}
                onClick={() => setActiveFilter(filter.id)}
                size="small"
              >
                {filter.label}
              </Button>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(_, newValue) => newValue && setViewMode(newValue)}
              size="small"
            >
              <ToggleButton value="grid">
                <Grid className="w-4 h-4" />
              </ToggleButton>
              <ToggleButton value="list">
                <List className="w-4 h-4" />
              </ToggleButton>
            </ToggleButtonGroup>
            
            <Typography variant="body2" color="textSecondary">
              {filteredCollections.length} collections
            </Typography>
          </div>
        </div>

        {/* Collections Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCollections.map((collection, index) => (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <CollectionCard collection={collection} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredCollections.map((collection, index) => (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <CollectionListCard collection={collection} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Featured Products Section */}
        {filteredCollections.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
              <p className="text-gray-600">Popular items across all collections</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {collections
                .flatMap(c => c.products)
                .slice(0, 4)
                .map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="rounded-2xl overflow-hidden hover:shadow-xl transition-shadow">
                      <div className="relative h-48 bg-gray-100">
                        {product.images[0] && (
                          <Image
                            src={product.images[0]}
                            alt={product.title}
                            fill
                            className="object-cover"
                          />
                        )}
                        {product.compareAtPrice && (
                          <Chip
                            label={`Save ${Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%`}
                            className="absolute top-3 right-3 bg-red-500 text-white"
                            size="small"
                          />
                        )}
                      </div>
                      
                      <CardContent className="p-4">
                        <Typography variant="subtitle2" className="font-bold mb-1 truncate">
                          {product.title}
                        </Typography>
                        
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.rating)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'fill-gray-200 text-gray-200'
                              }`}
                            />
                          ))}
                          <span className="text-sm text-gray-600 ml-1">
                            ({product.reviewCount})
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Typography variant="h6" className="font-bold">
                              ${product.price.toFixed(2)}
                            </Typography>
                            {product.compareAtPrice && (
                              <Typography
                                variant="caption"
                                color="textSecondary"
                                className="line-through"
                              >
                                ${product.compareAtPrice.toFixed(2)}
                              </Typography>
                            )}
                          </div>
                          
                          <Button
                            size="small"
                            variant="contained"
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            View
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-20 text-center"
        >
          <Card className="bg-linear-to-r from-purple-600 to-pink-500 rounded-2xl overflow-hidden">
            <div className="p-12 text-white">
              <h2 className="text-3xl font-bold mb-4">Can't Find What You're Looking For?</h2>
              <p className="text-xl mb-8 opacity-90">
                Browse our entire product catalog or contact our support team for personalized recommendations.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="contained"
                  className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 rounded-xl text-lg font-bold"
                  href="/products"
                >
                  Browse All Products
                </Button>
                
                <Button
                  variant="outlined"
                  className="border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-xl text-lg font-bold"
                  href="/contact"
                >
                  Contact Support
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function CollectionCard({ collection }: { collection: Collection }) {
  return (
    <Link href={`/collections/${collection.handle}`}>
      <Card className="group rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300">
        <div className="relative h-64 overflow-hidden">
          <Image
            src={collection.image}
            alt={collection.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
          
          {collection.featured && (
            <div className="absolute top-4 left-4">
              <Chip
                label="Featured"
                className="bg-purple-600 text-white"
                size="small"
                icon={<Sparkles className="w-3 h-3" />}
              />
            </div>
          )}
        </div>
        
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <Typography variant="h5" className="font-bold mb-1 group-hover:text-purple-600 transition-colors">
                {collection.title}
              </Typography>
              <Typography variant="body2" color="textSecondary" className="mb-4">
                {collection.description}
              </Typography>
            </div>
            
            <div className="flex flex-col items-end">
              <div className="text-2xl font-bold text-purple-600">
                {collection.productCount}
              </div>
              <Typography variant="caption" color="textSecondary">
                Products
              </Typography>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="text"
                endIcon={<ChevronRight className="w-4 h-4" />}
                className="text-purple-600 hover:text-purple-700"
              >
                View Collection
              </Button>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <TrendingUp className="w-4 h-4" />
              <span>Popular</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function CollectionListCard({ collection }: { collection: Collection }) {
  return (
    <Link href={`/collections/${collection.handle}`}>
      <Card className="group hover:shadow-xl transition-shadow">
        <div className="flex flex-col md:flex-row">
          <div className="relative h-48 md:h-auto md:w-64 shrink-0">
            <Image
              src={collection.image}
              alt={collection.title}
              fill
              className="object-cover"
            />
            {collection.featured && (
              <div className="absolute top-3 left-3">
                <Chip
                  label="Featured"
                  className="bg-purple-600 text-white"
                  size="small"
                />
              </div>
            )}
          </div>
          
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <Typography variant="h5" className="font-bold mb-2 group-hover:text-purple-600 transition-colors">
                  {collection.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" className="mb-4">
                  {collection.description}
                </Typography>
              </div>
              
              <Chip
                label={`${collection.productCount} products`}
                variant="outlined"
                size="small"
              />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {collection.products.slice(0, 4).map((product) => (
                <div key={product.id} className="text-center">
                  <div className="relative h-20 bg-gray-100 rounded-lg overflow-hidden mb-2">
                    {product.images[0] && (
                      <Image
                        src={product.images[0]}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <Typography variant="caption" className="font-medium truncate block">
                    {product.title}
                  </Typography>
                  <Typography variant="caption" className="text-gray-600">
                    ${product.price.toFixed(2)}
                  </Typography>
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <Typography variant="caption" className="font-medium">
                    4.8
                  </Typography>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <Typography variant="caption" className="font-medium">
                    Top Seller
                  </Typography>
                </div>
              </div>
              
              <Button
                variant="contained"
                endIcon={<ChevronRight className="w-4 h-4" />}
                className="bg-linear-to-r from-purple-600 to-pink-500"
              >
                Browse Collection
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
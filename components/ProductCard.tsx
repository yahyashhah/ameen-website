'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: {
    id: string;
    handle: string;
    title: string;
    vendor: string;
    price: {
      amount: string;
      currencyCode: string;
    };
    featuredImage?: {
      url: string;
      altText?: string;
    };
    images?: Array<{
      url: string;
      altText?: string;
    }>;
    rating?: number;
    reviewCount?: number;
    tags?: string[];
  };
  viewMode?: 'grid' | 'list';
}

export default function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  const { addToCart } = useCart();
  
  const price = parseFloat(product.price.amount);
  const imageUrl = product.featuredImage?.url || product.images?.[0]?.url || '/placeholder.jpg';
  const rating = product.rating || 4.5;
  const reviewCount = product.reviewCount || 128;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart({
      productId: product.id,
      title: product.title,
      price,
      image: imageUrl,
      variantTitle: 'Default',
      quantity: 1,
    });
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.01 }}
        className="group"
      >
        <Link href={`/products/${product.handle}`}>
          <div className="flex gap-6 p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300">
            {/* Image */}
            <div className="relative w-48 h-48 rounded-xl overflow-hidden shrink-0">
              <Image
                src={imageUrl}
                alt={product.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 bg-white rounded-full shadow-md hover:shadow-lg">
                  <Heart className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-purple-600 transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-gray-600 mb-3">By {product.vendor}</p>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'fill-gray-200 text-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {rating} ({reviewCount} reviews)
                    </span>
                  </div>

                  {/* Tags */}
                  {product.tags && product.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {product.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-gray-700 line-clamp-2">
                    Premium quality product designed for modern professionals
                  </p>
                </div>

                {/* Price & Actions */}
                <div className="text-right">
                  <div className="text-2xl font-bold mb-6">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: product.price.currencyCode,
                    }).format(price)}
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddToCart}
                      className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                    <Link
                      href={`/products/${product.handle}`}
                      className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:border-purple-600 hover:text-purple-600 transition-colors flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  // Grid View
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <Link href={`/products/${product.handle}`}>
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100">
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-gray-50">
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              className="object-contain p-8 group-hover:scale-110 transition-transform duration-500"
            />
            
            {/* Hover Actions */}
            <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="absolute top-4 right-4 space-y-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="p-2 bg-white rounded-full shadow-md hover:shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
              >
                <Heart className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={handleAddToCart}
                className="p-2 bg-white rounded-full shadow-md hover:shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 delay-75"
              >
                <ShoppingCart className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Quick View */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <button className="px-6 py-2 bg-white rounded-full font-medium shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                Quick View
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-6">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg group-hover:text-purple-600 transition-colors line-clamp-1">
                {product.title}
              </h3>
              {product.tags?.includes('new') && (
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  New
                </span>
              )}
            </div>
            
            <p className="text-sm text-gray-600 mb-3">{product.vendor}</p>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-200 text-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">({reviewCount})</span>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: product.price.currencyCode,
                }).format(price)}
              </div>
              <button
                onClick={handleAddToCart}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors opacity-0 group-hover:opacity-100"
              >
                <ShoppingCart className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
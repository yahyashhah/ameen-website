'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  RotateCcw,
  Shield,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useQuery } from '@tanstack/react-query';
import { Tab, Tabs, Box, Skeleton, Alert, Snackbar } from '@mui/material';

interface Product {
  id: string;
  handle: string;
  title: string;
  vendor: string;
  description: string;
  descriptionHtml?: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  compareAtPrice?: {
    amount: string;
    currencyCode: string;
  };
  featuredImage?: {
    url: string;
    altText?: string;
  };
  images: Array<{
    url: string;
    altText?: string;
  }>;
  variants: Array<{
    id: string;
    title: string;
    price: {
      amount: string;
      currencyCode: string;
    };
    sku?: string;
    available: boolean;
  }>;
  tags?: string[];
  rating?: number;
  reviewCount?: number;
  specifications?: Record<string, string>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export default function ProductDetail() {
  const { handle } = useParams() as { handle: string };
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
  
  const { addToCart } = useCart();

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ['product', handle],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/products/${handle}`);
      if (!response.ok) throw new Error('Product not found');
      return response.json();
    },
  });

  useEffect(() => {
    if (product?.variants?.[0]) {
      setSelectedVariant(product.variants[0].id);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;

    addToCart({
      productId: product.id,
      title: product.title,
      price: parseFloat(product.price.amount),
      image: product.featuredImage?.url || product.images[0]?.url,
      variantTitle: product.variants.find(v => v.id === selectedVariant)?.title || '',
      quantity,
    });

    setSnackbar({
      open: true,
      message: 'Added to cart successfully!',
      severity: 'success',
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // Redirect to checkout
    window.location.href = '/checkout';
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Skeleton */}
          <div>
            <Skeleton variant="rectangular" height={500} className="rounded-2xl" />
            <div className="flex gap-4 mt-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} variant="rectangular" height={100} width={100} className="rounded-lg" />
              ))}
            </div>
          </div>
          
          {/* Info Skeleton */}
          <div className="space-y-4">
            <Skeleton variant="text" height={40} width="80%" />
            <Skeleton variant="text" height={20} width="60%" />
            <Skeleton variant="text" height={30} width="40%" />
            <Skeleton variant="rectangular" height={100} />
            <Skeleton variant="rectangular" height={50} width="60%" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return notFound();
  }

  const price = parseFloat(product.price.amount);
  const comparePrice = product.compareAtPrice ? parseFloat(product.compareAtPrice.amount) : null;
  const discount = comparePrice ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0;
  const selectedVariantData = product.variants.find(v => v.id === selectedVariant);

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          {/* Product Images */}
          <div>
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-xl">
              <Image
                src={product.images[selectedImage]?.url || '/placeholder.jpg'}
                alt={product.images[selectedImage]?.altText || product.title}
                fill
                className="object-contain p-8"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold">
                  -{discount}%
                </div>
              )}
              
              <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow">
                <Heart className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Thumbnail Images */}
            <div className="flex gap-4 mt-6 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`shrink-0 relative w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? 'border-purple-600 shadow-lg scale-105'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={image.altText || `${product.title} thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <span>Products</span>
              <ChevronRight className="w-4 h-4" />
              <span className="capitalize">{product.tags?.[0] || 'Accessories'}</span>
              <ChevronRight className="w-4 h-4" />
              <span className="font-medium text-gray-900">{product.title}</span>
            </div>

            {/* Title & Vendor */}
            <h1 className="text-4xl font-bold mb-2">{product.title}</h1>
            <p className="text-gray-600 mb-6">By {product.vendor}</p>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating || 4.5)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-200 text-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating || 4.5} ({product.reviewCount || 128} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mb-8">
              <div className="flex items-center gap-3">
                <span className="text-4xl font-bold text-gray-900">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: product.price.currencyCode,
                  }).format(price)}
                </span>
                
                {comparePrice && (
                  <>
                    <span className="text-2xl text-gray-400 line-through">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: product.price.currencyCode,
                      }).format(comparePrice)}
                    </span>
                    <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full font-medium">
                      Save {discount}%
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Variants */}
            {product.variants.length > 1 && (
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">Select Option</h3>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant.id)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        selectedVariant === variant.id
                          ? 'border-purple-600 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-gray-300'
                      } ${!variant.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={!variant.available}
                    >
                      {variant.title}
                      {!variant.available && ' (Out of Stock)'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 hover:bg-gray-50"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-3 border-x">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-3 hover:bg-gray-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex gap-3 flex-1">
                  <button
                    onClick={handleAddToCart}
                    disabled={!selectedVariantData?.available}
                    className="flex-1 px-8 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>
                  
                  <button
                    onClick={handleBuyNow}
                    disabled={!selectedVariantData?.available}
                    className="flex-1 px-8 py-3 border-2 border-purple-600 text-purple-600 rounded-lg font-medium hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
              
              {!selectedVariantData?.available && (
                <Alert severity="warning" className="mb-4">
                  This variant is currently out of stock
                </Alert>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { icon: Truck, label: 'Free Shipping', desc: 'On orders over $50' },
                { icon: RotateCcw, label: 'Easy Returns', desc: '30-day policy' },
                { icon: Shield, label: '2-Year Warranty', desc: 'Quality guarantee' },
                { icon: '📦', label: 'In Stock', desc: 'Ready to ship' },
              ].map((feature, index) => (
                <div key={index} className="text-center p-4 bg-gray-50 rounded-xl">
                  {typeof feature.icon === 'string' ? (
                    <div className="text-2xl mb-2">{feature.icon}</div>
                  ) : (
                    <feature.icon className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  )}
                  <div className="font-medium">{feature.label}</div>
                  <div className="text-sm text-gray-600">{feature.desc}</div>
                </div>
              ))}
            </div>

            {/* Share */}
            <div className="flex items-center gap-4">
              <span className="text-gray-600">Share:</span>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs
            value={activeTab}
            onChange={(_: React.SyntheticEvent, newValue: number) => setActiveTab(newValue)}
            className="border-b"
          >
            <Tab label="Description" />
            <Tab label="Specifications" />
            <Tab label={`Reviews (${product.reviewCount || 128})`} />
            <Tab label="Shipping & Returns" />
          </Tabs>

          <Box className="py-8">
            {activeTab === 0 && (
              <div className="prose max-w-none">
                {product.descriptionHtml ? (
                  <div dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
                ) : (
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                )}
              </div>
            )}
            
            {activeTab === 1 && product.specifications && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="border-b py-4">
                    <div className="text-sm text-gray-500 uppercase tracking-wider">
                      {key}
                    </div>
                    <div className="font-medium">{value}</div>
                  </div>
                ))}
              </div>
            )}
            
            {activeTab === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <div className="text-5xl font-bold">{product.rating || 4.5}</div>
                    <div className="flex justify-center mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(product.rating || 4.5)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'fill-gray-200 text-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Based on {product.reviewCount || 128} reviews
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 3 && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium mb-2">Shipping</h4>
                  <p className="text-gray-600">
                    Free standard shipping on orders over $50. Express shipping available at checkout.
                    Most orders ship within 1-2 business days.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-medium mb-2">Returns</h4>
                  <p className="text-gray-600">
                    Easy 30-day return policy. Items must be in original condition with all packaging.
                    Return shipping is free for defective items.
                  </p>
                </div>
              </div>
            )}
          </Box>
        </div>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
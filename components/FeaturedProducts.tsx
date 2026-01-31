'use client';

import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import ProductCard from './ProductCard';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@mui/material';

interface Product {
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
  tags?: string[];
  rating?: number;
}

const fetchFeaturedProducts = async (): Promise<Product[]> => {
  const response = await fetch('/api/products/featured');
  if (!response.ok) throw new Error('Failed to fetch featured products');
  return response.json();
};

export default function FeaturedProducts() {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['featured-products'],
    queryFn: fetchFeaturedProducts,
  });

  if (error) {
    return (
          <section className="py-16 bg-linear-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">Failed to load featured products</div>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
      <section className="py-16 bg-linear-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-center md:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full mb-4">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Featured Collection</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">Best Sellers</h2>
            <p className="text-gray-600 max-w-2xl">
              Discover our most popular products, loved by thousands of customers
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mt-6 md:mt-0"
          >
            <Link
              href="/products?sort=bestseller"
              className="group inline-flex items-center gap-2 px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-xl font-medium hover:bg-purple-600 hover:text-white transition-all duration-300"
            >
              View All Products
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <Skeleton variant="rectangular" height={300} className="rounded-t-2xl" />
                <div className="p-6">
                  <Skeleton variant="text" height={24} />
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="40%" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products?.slice(0, 4).map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}

        {/* View More Button (Mobile) */}
        <div className="mt-12 text-center md:hidden">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors"
          >
            View All Products
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
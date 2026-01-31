'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight,
  Truck,
  Shield,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Alert,
  Snackbar,
  Skeleton,
} from '@mui/material';

interface CartItem {
  lineId: string;
  quantity: number;
  variant: {
    id: string;
    title: string;
    price: number;
  };
  product: {
    id: string;
    title: string;
    images?: Array<{ url: string; altText?: string }>;
  };
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/cart');
      const data = await response.json();
      setCartItems(data.items || []);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load cart items',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (lineId: string, quantity: number) => {
    try {
      const response = await fetch('/api/cart/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lineId, quantity }),
      });

      if (response.ok) {
        const data = await response.json();
        setCartItems(data.items);
        setSnackbar({
          open: true,
          message: 'Cart updated successfully',
          severity: 'success',
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to update cart',
        severity: 'error',
      });
    }
  };

  const removeItem = async (lineId: string) => {
    try {
      const response = await fetch('/api/cart/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lineId }),
      });

      if (response.ok) {
        const data = await response.json();
        setCartItems(data.items);
        setSnackbar({
          open: true,
          message: 'Item removed from cart',
          severity: 'success',
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to remove item',
        severity: 'error',
      });
    }
  };

  const subtotal = cartItems.reduce((sum, item) => 
    sum + (item.variant.price * item.quantity), 0
  );
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Skeleton variant="text" width={200} height={40} className="mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="p-6">
                  <div className="flex gap-6">
                    <Skeleton variant="rectangular" width={80} height={80} />
                    <div className="flex-1 space-y-2">
                      <Skeleton variant="text" width="60%" />
                      <Skeleton variant="text" width="40%" />
                      <Skeleton variant="text" width="30%" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <Skeleton variant="rectangular" height={400} />
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-purple-600" />
            </div>
            
            <h1 className="text-4xl font-bold mb-4">Your cart is empty</h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any products to your cart yet.
            </p>
            
            <Link href="/products">
              <Button
                variant="contained"
                className="bg-linear-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 px-8 py-3 rounded-xl text-lg"
                size="large"
              >
                Start Shopping
              </Button>
            </Link>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              {[
                {
                  icon: Truck,
                  title: 'Free Shipping',
                  description: 'On orders over $50',
                },
                {
                  icon: Shield,
                  title: 'Secure Checkout',
                  description: 'SSL encrypted payment',
                },
                {
                  icon: RefreshCw,
                  title: 'Easy Returns',
                  description: '30-day return policy',
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-6"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold mb-2">Shopping Cart</h1>
          <p className="text-gray-600 mb-8">
            {totalItems} item{totalItems !== 1 ? 's' : ''} in your cart
          </p>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <AnimatePresence>
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.lineId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    layout
                  >
                    <Card className="p-6 rounded-2xl shadow-sm mb-4 hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Image */}
                        <div className="w-32 h-32 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                          {item.product.images?.[0]?.url ? (
                            <Image
                              src={item.product.images[0].url}
                              alt={item.product.images[0].altText || item.product.title}
                              width={128}
                              height={128}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <ShoppingBag className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <Link href={`/products/${item.product.id}`}>
                                <h3 className="text-lg font-bold mb-1 hover:text-purple-600 transition-colors">
                                  {item.product.title}
                                </h3>
                              </Link>
                              <p className="text-gray-600 text-sm">{item.variant.title}</p>
                            </div>
                            
                            <IconButton
                              onClick={() => removeItem(item.lineId)}
                              size="small"
                            >
                              <Trash2 className="w-5 h-5 text-gray-500 hover:text-red-500" />
                            </IconButton>
                          </div>

                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-4">
                              <div className="flex items-center border rounded-lg">
                                <button
                                  onClick={() => updateQuantity(item.lineId, Math.max(1, item.quantity - 1))}
                                  className="px-3 py-2 hover:bg-gray-50 rounded-l-lg transition-colors"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="px-4 py-2 border-x">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
                                  className="px-3 py-2 hover:bg-gray-50 rounded-r-lg transition-colors"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <Typography variant="h6" className="font-bold">
                                ${(item.variant.price * item.quantity).toFixed(2)}
                              </Typography>
                              {item.quantity > 1 && (
                                <Typography variant="body2" color="textSecondary">
                                  ${item.variant.price.toFixed(2)} each
                                </Typography>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Actions */}
              <div className="flex justify-between mt-8">
                <Link href="/products">
                  <Button
                    startIcon={<ArrowRight className="w-5 h-5 rotate-180" />}
                    variant="outlined"
                  >
                    Continue Shopping
                  </Button>
                </Link>
                
                <Button
                  onClick={() => {
                    // Clear cart functionality
                    setCartItems([]);
                    setSnackbar({
                      open: true,
                      message: 'Cart cleared',
                      severity: 'success',
                    });
                  }}
                  variant="text"
                  color="error"
                >
                  Clear Cart
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="rounded-2xl shadow-sm sticky top-24">
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">
                        {shipping === 0 ? (
                          <span className="text-green-600">FREE</span>
                        ) : (
                          `$${shipping.toFixed(2)}`
                        )}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {subtotal < 50 && (
                    <Alert severity="info" className="mt-6 rounded-xl">
                      Add ${(50 - subtotal).toFixed(2)} more to get free shipping!
                    </Alert>
                  )}

                  <div className="space-y-4 mt-8">
                    <Link href="/checkout">
                      <Button
                        fullWidth
                        variant="contained"
                        className="bg-linear-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 py-3 rounded-xl text-lg"
                        size="large"
                      >
                        Proceed to Checkout
                      </Button>
                    </Link>
                    
                    <Button
                      fullWidth
                      variant="outlined"
                      className="py-3 rounded-xl"
                      size="large"
                      onClick={() => {
                        // Save for later functionality
                        setSnackbar({
                          open: true,
                          message: 'Cart saved for later',
                          severity: 'success',
                        });
                      }}
                    >
                      Save for Later
                    </Button>
                  </div>

                  <div className="mt-8 space-y-4">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-green-600" />
                      <span className="text-sm text-gray-600">Secure checkout</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Truck className="w-5 h-5 text-blue-600" />
                      <span className="text-sm text-gray-600">Free shipping on $50+</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <RefreshCw className="w-5 h-5 text-orange-600" />
                      <span className="text-sm text-gray-600">30-day returns</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          className="rounded-xl"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
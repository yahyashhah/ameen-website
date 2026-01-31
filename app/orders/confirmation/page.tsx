'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import {
  CheckCircle,
  Package,
  Truck,
  Home,
  ShoppingBag,
  Download,
  Share2,
  Mail,
  Clock,
  CreditCard,
  MapPin,
} from 'lucide-react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  Grid,
} from '@mui/material';

interface OrderItem {
  id: string;
  title: string;
  quantity: number;
  price: number;
  image?: string;
  variant?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  payment: {
    method: string;
    transactionId: string;
    amount: number;
    currency: string;
  };
  shipping: {
    method: string;
    cost: number;
    estimatedDelivery: string;
  };
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  createdAt: string;
}

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confettiFired, setConfettiFired] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  useEffect(() => {
    // Launch confetti animation when order is loaded
    if (order && !confettiFired) {
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        const particleCount = 50 * (timeLeft / duration);

        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        });
      }, 250);

      setConfettiFired(true);
    }
  }, [order, confettiFired]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/orders/${orderId}`);
      
      if (!response.ok) {
        throw new Error('Order not found');
      }
      
      const data = await response.json();
      setOrder(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load order');
      console.error('Failed to fetch order:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = () => {
    // In a real app, this would generate and download a PDF invoice
    alert('Invoice download feature would generate a PDF in production');
  };

  const handleShareOrder = () => {
    if (navigator.share && order) {
      navigator.share({
        title: `Order ${order.orderNumber}`,
        text: `I just placed an order for ${order.items.length} items!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Order link copied to clipboard!');
    }
  };

  const handleResendConfirmation = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}/resend-confirmation`, {
        method: 'POST',
      });

      if (response.ok) {
        alert('Confirmation email sent successfully!');
      }
    } catch (error) {
      alert('Failed to send confirmation email');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <CircularProgress size={60} className="mb-6 text-purple-600" />
            <Typography variant="h5" className="font-bold mb-2">
              Loading Your Order...
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Please wait while we fetch your order details
            </Typography>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <Alert 
            severity="error" 
            className="rounded-xl max-w-2xl mx-auto"
            icon={<AlertCircle className="w-5 h-5" />}
          >
            <div className="text-center">
              <Typography variant="h6" className="font-bold mb-2">
                Order Not Found
              </Typography>
              <Typography variant="body2" className="mb-4">
                {error || 'The order you\'re looking for doesn\'t exist.'}
              </Typography>
              <Button
                variant="contained"
                className="bg-linear-to-r from-purple-600 to-pink-500"
                href="/"
              >
                Return to Home
              </Button>
            </div>
          </Alert>
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
          transition={{ duration: 0.5 }}
        >
          {/* Success Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 15 }}
            >
              <div className="w-24 h-24 bg-linear-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
            </motion.div>
            
            <Typography variant="h2" className="text-4xl font-bold mb-4">
              Order Confirmed!
            </Typography>
            
            <Typography variant="h6" className="text-gray-600 mb-2">
              Thank you for your purchase, {order.customerName}!
            </Typography>
            
            <Typography variant="body1" color="textSecondary" className="mb-6">
              Order #{order.orderNumber} • {new Date(order.createdAt).toLocaleDateString()}
            </Typography>
            
            <div className="flex justify-center gap-4">
              <Chip
                label={order.status.toUpperCase()}
                color="success"
                className="px-4 py-2 text-sm font-bold"
                icon={<CheckCircle className="w-4 h-4" />}
              />
              <Chip
                label={`${order.items.reduce((sum, item) => sum + item.quantity, 0)} ITEMS`}
                variant="outlined"
                className="px-4 py-2"
                icon={<Package className="w-4 h-4" />}
              />
            </div>
          </div>

          <Grid container spacing={4}>
            {/* Order Summary */}
            <Grid item xs={12} lg={4}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="rounded-2xl shadow-lg sticky top-24">
                  <CardContent className="p-6">
                    <Typography variant="h6" className="font-bold mb-6">
                      Order Summary
                    </Typography>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">Subtotal</Typography>
                        <Typography variant="body2">${order.subtotal.toFixed(2)}</Typography>
                      </div>
                      
                      <div className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">Shipping</Typography>
                        <Typography variant="body2">${order.shipping.cost.toFixed(2)}</Typography>
                      </div>
                      
                      <div className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">Tax</Typography>
                        <Typography variant="body2">${order.tax.toFixed(2)}</Typography>
                      </div>
                      
                      <Divider className="my-4" />
                      
                      <div className="flex justify-between text-lg font-bold">
                        <Typography variant="body1">Total</Typography>
                        <Typography variant="body1">${order.total.toFixed(2)}</Typography>
                      </div>
                      
                      <div className="mt-4 space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          <span>Payment Method: {order.payment.method}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4" />
                          <span>Shipping: {order.shipping.method}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button
                        fullWidth
                        variant="contained"
                        className="bg-linear-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                        startIcon={<Download className="w-5 h-5" />}
                        onClick={handleDownloadInvoice}
                      >
                        Download Invoice
                      </Button>
                      
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<Share2 className="w-5 h-5" />}
                        onClick={handleShareOrder}
                      >
                        Share Order
                      </Button>
                      
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<Mail className="w-5 h-5" />}
                        onClick={handleResendConfirmation}
                      >
                        Resend Confirmation
                      </Button>
                      
                      <Button
                        fullWidth
                        variant="text"
                        startIcon={<ShoppingBag className="w-5 h-5" />}
                        href="/products"
                      >
                        Continue Shopping
                      </Button>
                      
                      <Button
                        fullWidth
                        variant="text"
                        startIcon={<Home className="w-5 h-5" />}
                        href="/"
                      >
                        Back to Home
                      </Button>
                    </div>

                    <Alert severity="info" className="rounded-xl mt-6">
                      <div className="flex items-start gap-2">
                        <Mail className="w-5 h-5 mt-0.5" />
                        <div>
                          <div className="font-medium">Confirmation Sent</div>
                          <div className="text-sm">
                            We've sent a confirmation email to {order.customerEmail}
                          </div>
                        </div>
                      </div>
                    </Alert>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            {/* Order Details */}
            <Grid item xs={12} lg={8}>
              <div className="space-y-6">
                {/* Order Items */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="rounded-2xl shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Package className="w-6 h-6 text-purple-600" />
                        </div>
                        <Typography variant="h6" className="font-bold">
                          Order Items
                        </Typography>
                      </div>
                      
                      <div className="space-y-4">
                        {order.items.map((item, index) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <div className="flex items-center gap-4 p-4 border rounded-xl hover:shadow-sm transition-shadow">
                              {item.image ? (
                                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                                  <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                  <Package className="w-6 h-6 text-gray-400" />
                                </div>
                              )}
                              
                              <div className="flex-1">
                                <Typography variant="subtitle1" className="font-bold">
                                  {item.title}
                                </Typography>
                                {item.variant && (
                                  <Typography variant="body2" color="textSecondary" className="mb-1">
                                    {item.variant}
                                  </Typography>
                                )}
                                <Typography variant="body2" color="textSecondary">
                                  Quantity: {item.quantity}
                                </Typography>
                              </div>
                              
                              <Typography variant="h6" className="font-bold">
                                ${(item.price * item.quantity).toFixed(2)}
                              </Typography>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Shipping Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="rounded-2xl shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Truck className="w-6 h-6 text-blue-600" />
                        </div>
                        <Typography variant="h6" className="font-bold">
                          Shipping Information
                        </Typography>
                      </div>
                      
                      <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                          <div className="space-y-2">
                            <Typography variant="subtitle2" color="textSecondary">
                              Shipping Address
                            </Typography>
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-start gap-2">
                                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                  <Typography variant="body2" className="font-medium">
                                    {order.shippingAddress.address}
                                  </Typography>
                                  <Typography variant="body2" color="textSecondary">
                                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                                  </Typography>
                                  <Typography variant="body2" color="textSecondary">
                                    {order.shippingAddress.country}
                                  </Typography>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                          <div className="space-y-4">
                            <div>
                              <Typography variant="subtitle2" color="textSecondary">
                                Shipping Method
                              </Typography>
                              <Typography variant="body1" className="font-medium">
                                {order.shipping.method}
                              </Typography>
                            </div>
                            
                            <div>
                              <Typography variant="subtitle2" color="textSecondary">
                                Estimated Delivery
                              </Typography>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <Typography variant="body1" className="font-medium">
                                  {order.shipping.estimatedDelivery}
                                </Typography>
                              </div>
                            </div>
                            
                            <div>
                              <Typography variant="subtitle2" color="textSecondary">
                                Tracking Number
                              </Typography>
                              <Typography variant="body1" className="font-mono font-medium">
                                {order.id.slice(0, 8).toUpperCase()}
                              </Typography>
                            </div>
                          </div>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Next Steps */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card className="rounded-2xl shadow-sm bg-linear-to-r from-gray-50 to-white">
                    <CardContent className="p-6">
                      <Typography variant="h6" className="font-bold mb-6 text-center">
                        What's Next?
                      </Typography>
                      
                      <Grid container spacing={3}>
                        {[
                          {
                            step: '1',
                            title: 'Order Processing',
                            description: 'We\'re preparing your items for shipment. You\'ll receive tracking information once shipped.',
                            icon: Package,
                            color: 'purple',
                          },
                          {
                            step: '2',
                            title: 'Shipping Updates',
                            description: 'Track your order in real-time. Estimated delivery: ' + order.shipping.estimatedDelivery,
                            icon: Truck,
                            color: 'blue',
                          },
                          {
                            step: '3',
                            title: 'Enjoy Your Purchase',
                            description: 'Love your items? Leave a review and help others make better decisions.',
                            icon: CheckCircle,
                            color: 'green',
                          },
                        ].map((step, index) => (
                          <Grid item xs={12} md={4} key={step.step}>
                            <Card className="rounded-xl h-full">
                              <CardContent className="p-4 text-center">
                                <div className="flex items-center gap-3 mb-4 justify-center">
                                  <div className={`w-10 h-10 bg-${step.color}-100 rounded-full flex items-center justify-center`}>
                                    <step.icon className={`w-6 h-6 text-${step.color}-600`} />
                                  </div>
                                  <div className="text-2xl font-bold text-gray-300">0{step.step}</div>
                                </div>
                                
                                <Typography variant="subtitle1" className="font-bold mb-2">
                                  {step.title}
                                </Typography>
                                
                                <Typography variant="body2" color="textSecondary">
                                  {step.description}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </Grid>
          </Grid>
        </motion.div>
      </div>
    </div>
  );
}
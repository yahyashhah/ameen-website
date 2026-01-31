'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import {
  ChevronRight,
  CreditCard,
  Lock,
  Shield,
  Truck,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import {
  Alert,
  Snackbar,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Card,
  Typography,
} from '@mui/material';

const steps = ['Cart', 'Shipping', 'Payment', 'Confirmation'];

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const [shippingInfo, setShippingInfo] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phone: '',
  });

  const [paymentInfo, setPaymentInfo] = useState({
    method: 'card' as 'card' | 'paypal',
    cardNumber: '',
    expiry: '',
    cvv: '',
    nameOnCard: '',
    saveCard: false,
  });

  const shippingCost = cartTotal > 50 ? 0 : 9.99;
  const tax = cartTotal * 0.08;
  const total = cartTotal + shippingCost + tax;

  const handleNext = () => {
    if (activeStep === 0 && items.length === 0) {
      setSnackbar({
        open: true,
        message: 'Your cart is empty',
        severity: 'error',
      });
      return;
    }

    if (activeStep === 1) {
      // Validate shipping info
      const requiredFields = ['firstName', 'lastName', 'email', 'address', 'city', 'zipCode'];
      const missingFields = requiredFields.filter(
        field => !shippingInfo[field as keyof typeof shippingInfo]
      );
      
      if (missingFields.length > 0) {
        setSnackbar({
          open: true,
          message: 'Please fill in all required fields',
          severity: 'error',
        });
        return;
      }
    }

    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleShippingChange = (field: string, value: string) => {
    const key = field as keyof typeof shippingInfo;
    setShippingInfo((prev) => ({ ...prev, [key]: value }));
  };

  const handlePaymentChange = (field: string, value: any) => {
    const key = field as keyof typeof paymentInfo;
    setPaymentInfo((prev) => ({ ...prev, [key]: value }));
  };

  const handlePlaceOrder = async () => {
    setLoading(true);

    try {
      // Create order on backend
      const orderData = {
        items,
        shippingInfo,
        paymentMethod: paymentInfo.method,
        total,
        tax,
        shipping: shippingCost,
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const order = await response.json();

      if (response.ok) {
        // Process payment
        if (paymentInfo.method === 'card') {
          const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
          
          if (!stripe) {
            throw new Error('Stripe failed to load');
          }

          const paymentResponse = await fetch('/api/payments/stripe/create-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              amount: total,
              orderId: order.id,
            }),
          });

          const paymentData = await paymentResponse.json();

          const result = await stripe.confirmCardPayment(paymentData.clientSecret, {
            payment_method: {
              card: {
                token: 'tok_visa',
              },
              billing_details: {
                name: paymentInfo.nameOnCard,
                email: shippingInfo.email,
              },
            },
          });

          if (result.error) {
            throw new Error(result.error.message);
          }
        }

        // Success
        clearCart();
        setActiveStep(3);
        setSnackbar({
          open: true,
          message: 'Order placed successfully!',
          severity: 'success',
        });
      } else {
        throw new Error(order.error || 'Failed to create order');
      }
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.message || 'Payment failed',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <CartStep />;
      case 1:
        return <ShippingStep 
          shippingInfo={shippingInfo} 
          onChange={handleShippingChange} 
        />;
      case 2:
        return <PaymentStep 
          paymentInfo={paymentInfo} 
          onChange={handlePaymentChange} 
        />;
      case 3:
        return <ConfirmationStep />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <span>Home</span>
            <ChevronRight className="w-4 h-4" />
            <span>Cart</span>
            <ChevronRight className="w-4 h-4" />
            <span className="font-medium text-gray-900">Checkout</span>
          </div>

          <h1 className="text-4xl font-bold mb-2">Checkout</h1>
          <p className="text-gray-600 mb-8">Complete your purchase securely</p>

          {/* Progress Stepper */}
          <Stepper 
            activeStep={activeStep} 
            alternativeLabel 
            className="mb-12"
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStepContent(activeStep)}
              </motion.div>

              {/* Navigation Buttons */}
              {activeStep < 3 && (
                <div className="flex justify-between mt-8">
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    variant="outlined"
                    className="px-8 py-3 rounded-xl"
                  >
                    Back
                  </Button>
                  
                  <Button
                    onClick={activeStep === 2 ? handlePlaceOrder : handleNext}
                    variant="contained"
                    className="px-8 py-3 rounded-xl bg-linear-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </span>
                    ) : activeStep === 2 ? (
                      'Place Order'
                    ) : (
                      'Continue'
                    )}
                  </Button>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="sticky top-24"
              >
                <OrderSummary 
                  cartTotal={cartTotal}
                  shipping={shippingCost}
                  tax={tax}
                  total={total}
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
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

// Sub-components
function CartStep() {
  const { items, updateQuantity, removeFromCart } = useCart();

  return (
    <Card className="p-6 rounded-2xl shadow-sm">
      <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>
      
      {items.length === 0 ? (
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
          <p className="text-gray-600 mb-6">Add some products to get started</p>
          <Button
            href="/products"
            variant="contained"
            className="bg-linear-to-r from-purple-600 to-pink-500"
          >
            Browse Products
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 border rounded-xl hover:shadow-sm transition-shadow"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1">
                <h4 className="font-medium">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.variantTitle}</p>
                <div className="text-lg font-bold">${item.price.toFixed(2)}</div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-3 py-1 hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 border-x">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-3 py-1 hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
                
                <Button
                  onClick={() => removeFromCart(item.id)}
                  variant="text"
                  color="error"
                  size="small"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function ShippingStep({ 
  shippingInfo, 
  onChange 
}: { 
  shippingInfo: any; 
  onChange: (field: string, value: string) => void;
}) {
  return (
    <Card className="p-6 rounded-2xl shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <Truck className="w-6 h-6 text-purple-600" />
        <h2 className="text-2xl font-bold">Shipping Information</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextField
          label="First Name"
          value={shippingInfo.firstName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('firstName', e.target.value)}
          fullWidth
          required
        />
        
        <TextField
          label="Last Name"
          value={shippingInfo.lastName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('lastName', e.target.value)}
          fullWidth
          required
        />
        
        <TextField
          label="Email"
          type="email"
          value={shippingInfo.email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('email', e.target.value)}
          fullWidth
          required
          className="md:col-span-2"
        />
        
        <TextField
          label="Address"
          value={shippingInfo.address}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('address', e.target.value)}
          fullWidth
          required
          className="md:col-span-2"
        />
        
        <TextField
          label="City"
          value={shippingInfo.city}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('city', e.target.value)}
          fullWidth
          required
        />
        
        <TextField
          label="State"
          value={shippingInfo.state}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('state', e.target.value)}
          fullWidth
          required
        />
        
        <TextField
          label="ZIP Code"
          value={shippingInfo.zipCode}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('zipCode', e.target.value)}
          fullWidth
          required
        />
        
        <TextField
          label="Country"
          value={shippingInfo.country}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('country', e.target.value)}
          fullWidth
          required
        />
        
        <TextField
          label="Phone"
          value={shippingInfo.phone}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('phone', e.target.value)}
          fullWidth
          required
          className="md:col-span-2"
        />
      </div>
    </Card>
  );
}

function PaymentStep({ 
  paymentInfo, 
  onChange 
}: { 
  paymentInfo: any; 
  onChange: (field: string, value: any) => void;
}) {
  return (
    <Card className="p-6 rounded-2xl shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <CreditCard className="w-6 h-6 text-purple-600" />
        <h2 className="text-2xl font-bold">Payment Method</h2>
      </div>
      
      <RadioGroup
        value={paymentInfo.method}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('method', e.target.value)}
        className="mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4 cursor-pointer hover:border-purple-600 transition-colors">
            <FormControlLabel
              value="card"
              control={<Radio />}
              label={
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5" />
                  <span>Credit/Debit Card</span>
                </div>
              }
              className="w-full"
            />
          </Card>
          
          <Card className="p-4 cursor-pointer hover:border-purple-600 transition-colors">
            <FormControlLabel
              value="paypal"
              control={<Radio />}
              label={
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-blue-600 rounded"></div>
                  <span>PayPal</span>
                </div>
              }
              className="w-full"
            />
          </Card>
        </div>
      </RadioGroup>
      
      {paymentInfo.method === 'card' && (
        <div className="space-y-4">
          <TextField
            label="Card Number"
            value={paymentInfo.cardNumber}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('cardNumber', e.target.value)}
            fullWidth
            required
            placeholder="1234 5678 9012 3456"
          />
          
          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="Expiry Date"
              value={paymentInfo.expiry}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('expiry', e.target.value)}
              fullWidth
              required
              placeholder="MM/YY"
            />
            
            <TextField
              label="CVV"
              value={paymentInfo.cvv}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('cvv', e.target.value)}
              fullWidth
              required
              placeholder="123"
              type="password"
            />
          </div>
          
          <TextField
            label="Name on Card"
            value={paymentInfo.nameOnCard}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('nameOnCard', e.target.value)}
            fullWidth
            required
          />
          
          <FormControlLabel
            control={
              <input
                type="checkbox"
                checked={paymentInfo.saveCard}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('saveCard', e.target.checked)}
                className="w-4 h-4 text-purple-600 focus:ring-purple-500"
              />
            }
            label="Save card for future purchases"
          />
        </div>
      )}
      
      {paymentInfo.method === 'paypal' && (
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded"></div>
          </div>
          <p className="text-gray-600 mb-6">
            You will be redirected to PayPal to complete your payment securely
          </p>
        </div>
      )}
      
      <div className="flex items-center gap-2 mt-8 pt-6 border-t text-sm text-gray-600">
        <Lock className="w-4 h-4" />
        <span>Your payment is secured with SSL encryption</span>
      </div>
    </Card>
  );
}

function ConfirmationStep() {
  return (
    <Card className="p-8 rounded-2xl shadow-sm text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>
      
      <h2 className="text-3xl font-bold mb-4">Order Confirmed!</h2>
      
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Thank you for your purchase. Your order has been received and is being processed.
        You will receive a confirmation email shortly.
      </p>
      
      <div className="space-y-4">
        <Button
          href="/account/orders"
          variant="contained"
          className="bg-linear-to-r from-purple-600 to-pink-500"
        >
          View My Orders
        </Button>
        
        <Button
          href="/"
          variant="outlined"
          className="w-full"
        >
          Continue Shopping
        </Button>
      </div>
    </Card>
  );
}

function OrderSummary({ 
  cartTotal, 
  shipping, 
  tax, 
  total 
}: { 
  cartTotal: number; 
  shipping: number; 
  tax: number; 
  total: number;
}) {
  return (
    <Card className="p-6 rounded-2xl shadow-sm">
      <h3 className="text-xl font-bold mb-6">Order Summary</h3>
      
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">${cartTotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium">
            {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
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
      
      <div className="mt-8 space-y-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Shield className="w-4 h-4" />
          <span>Secure checkout</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Lock className="w-4 h-4" />
          <span>SSL encryption</span>
        </div>
      </div>
    </Card>
  );
}
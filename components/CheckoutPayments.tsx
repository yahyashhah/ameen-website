'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import {
  CreditCard,
  Wallet,
  Lock,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Alert,
  LinearProgress,
} from '@mui/material';

interface CheckoutPaymentsProps {
  amount: number;
  onSuccess: (paymentId: string) => void;
  onError: (error: string) => void;
  formId?: string;
}

export default function CheckoutPayments({ 
  amount, 
  onSuccess, 
  onError,
  formId = 'checkout-form'
}: CheckoutPaymentsProps) {
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>('stripe');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStripePayment = async () => {
    setLoading(true);
    setError('');

    try {
      // Validate card details
      if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name) {
        throw new Error('Please fill in all card details');
      }

      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
      
      if (!stripe) {
        throw new Error('Payment system unavailable');
      }

      // Create payment intent
      const response = await fetch('/api/payments/stripe/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment failed');
      }

      // Confirm payment using a token (test mode)
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: {
            token: 'tok_visa',
          },
          billing_details: {
            name: cardDetails.name,
          },
        },
      });

      if (result.error) {
        throw new Error(result.error.message || 'Payment failed');
      }

      if (result.paymentIntent?.status === 'succeeded') {
        onSuccess(result.paymentIntent.id);
      }
    } catch (err: any) {
      setError(err.message);
      onError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePayPalPayment = async () => {
    setLoading(true);
    setError('');

    try {
      // Create PayPal order
      const response = await fetch('/api/payments/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'PayPal payment failed');
      }

      // For demo purposes, simulate success
      // In production, you would redirect to PayPal
      setTimeout(() => {
        onSuccess(`paypal_${Date.now()}`);
      }, 1500);
    } catch (err: any) {
      setError(err.message);
      onError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (paymentMethod === 'stripe') {
      await handleStripePayment();
    } else {
      await handlePayPalPayment();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="rounded-2xl shadow-sm border-t-4 border-t-purple-600">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Wallet className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <Typography variant="h5" className="font-bold">
                Payment Method
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Choose how you want to pay
              </Typography>
            </div>
          </div>

          {/* Payment Method Selection */}
          <RadioGroup
            value={paymentMethod}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPaymentMethod(e.target.value as 'stripe' | 'paypal')
            }
            className="mb-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className={`p-4 cursor-pointer transition-all ${paymentMethod === 'stripe' ? 'border-2 border-purple-600 bg-purple-50' : 'hover:border-purple-300'}`}>
                <FormControlLabel
                  value="stripe"
                  control={<Radio />}
                  label={
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5" />
                      <div>
                        <div className="font-medium">Credit/Debit Card</div>
                        <div className="text-xs text-gray-500">Visa, Mastercard, Amex</div>
                      </div>
                    </div>
                  }
                  className="w-full"
                />
              </Card>
              
              <Card className={`p-4 cursor-pointer transition-all ${paymentMethod === 'paypal' ? 'border-2 border-purple-600 bg-purple-50' : 'hover:border-purple-300'}`}>
                <FormControlLabel
                  value="paypal"
                  control={<Radio />}
                  label={
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">Pay</span>
                      </div>
                      <div>
                        <div className="font-medium">PayPal</div>
                        <div className="text-xs text-gray-500">Secure online payments</div>
                      </div>
                    </div>
                  }
                  className="w-full"
                />
              </Card>
            </div>
          </RadioGroup>

          {/* Card Details Form */}
          {paymentMethod === 'stripe' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 mb-6"
            >
              <TextField
                label="Card Number"
                value={cardDetails.number}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCardDetails({ ...cardDetails, number: e.target.value })
                }
                placeholder="1234 5678 9012 3456"
                fullWidth
                required
              />
              
              <div className="grid grid-cols-2 gap-4">
                <TextField
                  label="Expiry Date"
                  value={cardDetails.expiry}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setCardDetails({ ...cardDetails, expiry: e.target.value })
                  }
                  placeholder="MM/YY"
                  fullWidth
                  required
                />
                
                <TextField
                  label="CVV"
                  value={cardDetails.cvv}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setCardDetails({ ...cardDetails, cvv: e.target.value })
                  }
                  placeholder="123"
                  type="password"
                  fullWidth
                  required
                />
              </div>
              
              <TextField
                label="Name on Card"
                value={cardDetails.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCardDetails({ ...cardDetails, name: e.target.value })
                }
                fullWidth
                required
              />
            </motion.div>
          )}

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Alert 
                severity="error" 
                icon={<AlertCircle className="w-5 h-5" />}
                className="rounded-xl mb-6"
                onClose={() => setError('')}
              >
                {error}
              </Alert>
            </motion.div>
          )}

          {/* Loading Indicator */}
          {loading && (
            <div className="mb-6">
              <LinearProgress className="rounded-full" />
              <Typography variant="body2" className="text-center mt-2 text-gray-600">
                Processing payment...
              </Typography>
            </div>
          )}

          {/* Payment Button */}
          <form onSubmit={handleSubmit} id={formId}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className="bg-linear-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 py-3 rounded-xl text-lg"
              size="large"
              disabled={loading}
              startIcon={!loading && <Lock className="w-5 h-5" />}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                `Pay $${amount.toFixed(2)}`
              )}
            </Button>
          </form>

          {/* Security Info */}
          <div className="flex items-center justify-center gap-2 mt-6 pt-6 border-t text-sm text-gray-600">
            <Lock className="w-4 h-4" />
            <span>Your payment is secured with SSL encryption</span>
          </div>

          {/* Accepted Cards */}
          <div className="flex justify-center gap-4 mt-4">
            <div className="w-12 h-8 bg-linear-to-r from-blue-900 to-blue-600 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">VISA</span>
            </div>
            <div className="w-12 h-8 bg-linear-to-r from-red-600 to-orange-500 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">MC</span>
            </div>
            <div className="w-12 h-8 bg-linear-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">AMEX</span>
            </div>
            <div className="w-12 h-8 bg-linear-to-r from-gray-800 to-gray-600 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">PP</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
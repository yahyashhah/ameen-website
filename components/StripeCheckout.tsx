'use client';

import { useState } from 'react';

interface StripeCheckoutProps {
  amount: number;
  onSuccess: (paymentId: string) => void;
  onError: (error: string) => void;
}

export default function StripeCheckout({ amount, onSuccess, onError }: StripeCheckoutProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    
    try {
      // In production, this would integrate with Stripe Elements
      // For now, simulate payment
      console.log('Processing Stripe payment for:', amount);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock success
      onSuccess('mock_stripe_payment_id');
    } catch (error: any) {
      onError(error.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-lg p-6">
      <h3 className="font-semibold mb-4">Pay with Card</h3>
      <p className="text-sm text-gray-600 mb-4">
        Stripe integration pending. Add STRIPE_PUBLIC_KEY to environment variables.
      </p>
      
      <div className="space-y-3 mb-4">
        <div>
          <label className="block text-sm mb-1">Card Number</label>
          <input 
            type="text" 
            placeholder="4242 4242 4242 4242" 
            className="w-full border rounded px-3 py-2" 
            disabled={loading}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">Expiry</label>
            <input 
              type="text" 
              placeholder="MM/YY" 
              className="w-full border rounded px-3 py-2" 
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">CVC</label>
            <input 
              type="text" 
              placeholder="123" 
              className="w-full border rounded px-3 py-2" 
              disabled={loading}
            />
          </div>
        </div>
      </div>
      
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full bg-black text-white px-4 py-3 rounded hover:bg-gray-800 disabled:bg-gray-400 transition"
      >
        {loading ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
      </button>
      
      <p className="text-xs text-gray-500 mt-3 text-center">
        Powered by Stripe • Secure payment processing
      </p>
    </div>
  );
}

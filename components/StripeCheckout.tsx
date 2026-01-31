'use client';

import { useState } from 'react';

interface StripeCheckoutProps {
  amount: number;
  onSuccess: (paymentId: string) => void;
  onError: (error: string) => void;
}

// Minimal client for creating a Checkout Session via our API route
async function createStripeCheckout(amount: number) {
  const res = await fetch('/api/checkout/stripe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount }),
  });
  if (!res.ok) throw new Error('Failed to create Stripe session');
  return (await res.json()) as { url?: string; id?: string };
}

export default function StripeCheckout({ amount, onSuccess, onError }: StripeCheckoutProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const { url, id } = await createStripeCheckout(amount);
      if (url) {
        window.location.href = url; // Redirect to Stripe-hosted Checkout
        return;
      }
      if (id) onSuccess(id);
      else throw new Error('Stripe session missing');
    } catch (error: any) {
      onError(error.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-lg p-6">
      <h3 className="font-semibold mb-4">Pay with Card (Stripe)</h3>
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full bg-black text-white px-4 py-3 rounded hover:bg-gray-800 disabled:bg-gray-400 transition"
      >
        {loading ? 'Redirecting…' : `Pay $${amount.toFixed(2)}`}
      </button>
      <p className="text-xs text-gray-500 mt-3 text-center">
        You will be redirected to Stripe for secure checkout.
      </p>
    </div>
  );
}

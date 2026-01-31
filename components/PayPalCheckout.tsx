'use client';

import { useState } from 'react';

interface PayPalCheckoutProps {
  amount: number;
  onSuccess: (paymentId: string) => void;
  onError: (error: string) => void;
}

async function createPayPalOrder(amount: number) {
  const res = await fetch('/api/checkout/paypal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount }),
  });
  if (!res.ok) throw new Error('Failed to create PayPal order');
  return (await res.json()) as { url?: string; id?: string };
}

export default function PayPalCheckout({ amount, onSuccess, onError }: PayPalCheckoutProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const { url, id } = await createPayPalOrder(amount);
      if (url) {
        window.location.href = url; // Redirect to PayPal
        return;
      }
      if (id) onSuccess(id);
      else throw new Error('PayPal order missing');
    } catch (error: any) {
      onError(error.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-lg p-6">
      <h3 className="font-semibold mb-4">Pay with PayPal</h3>
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full bg-[#0070ba] text-white px-4 py-3 rounded hover:bg-[#005ea6] disabled:bg-gray-400 transition flex items-center justify-center gap-2"
      >
        {loading ? 'Redirecting…' : (
          <>
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 00-.794.68l-.04.22-.63 3.993-.028.15a.805.805 0 01-.794.679H7.72a.483.483 0 01-.477-.558L7.418 21h1.518l.95-6.02h1.385c4.678 0 7.75-2.203 8.796-6.502z"/>
              <path d="M2.379 0h5.762c1.23 0 2.137.254 2.726.764.589.51.967 1.32 1.134 2.433l.887 5.59c.012.075.018.15.018.224a.805.805 0 01-.793.681h-2.61L8.17 17.98a.483.483 0 01-.477.559H4.347a.483.483 0 01-.477-.558L6.24.558A.483.483 0 016.717 0h-4.34z"/>
            </svg>
            Pay ${amount.toFixed(2)}
          </>
        )}
      </button>
      <p className="text-xs text-gray-500 mt-3 text-center">You will be redirected to PayPal to complete payment.</p>
    </div>
  );
}

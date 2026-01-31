'use client';

import { useState, FormEvent } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      // In production, this would call your newsletter API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStatus('success');
      setMessage('Thank you for subscribing!');
      setEmail('');
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="bg-gray-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-2xl font-bold mb-3">Stay Updated</h2>
        <p className="text-gray-300  border-md mb-6">
          Get the latest products, exclusive deals, and tech tips delivered to your inbox.
        </p>
        
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={status === 'loading'}
              className="flex-1 px-4 py-3 bg-white border-md rounded text-black focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-white text-black px-6 py-3 rounded font-medium hover:bg-gray-100 disabled:bg-gray-400 transition"
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </div>
          
          {status === 'success' && (
            <p className="mt-3 text-green-400">{message}</p>
          )}
          {status === 'error' && (
            <p className="mt-3 text-red-400">{message}</p>
          )}
        </form>
        
        <p className="text-xs text-gray-400 mt-4">
          By subscribing, you agree to our privacy policy. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      // Route through the auth callback so the code gets exchanged and a session
      // is established before the user lands on /reset-password.
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSent(true);
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="card">
        <h1 className="font-display text-3xl font-semibold text-ink-800">
          Reset your password
        </h1>
        <p className="mt-2 text-ink-600">
          Enter your email and we'll send you a reset link.
        </p>

        {sent ? (
          <div className="mt-6 text-center space-y-3">
            <p className="text-clay-500 font-medium">Check your inbox.</p>
            <p className="text-sm text-ink-400">
              We sent a reset link to <strong>{email}</strong>. It may take a minute to arrive.
            </p>
            <Link href="/login" className="inline-block text-sm text-clay-500 hover:text-clay-600 font-medium mt-2">
              Back to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
              />
            </div>

            {error && (
              <p className="text-sm text-clay-600 bg-clay-50 border border-clay-100 rounded-lg p-3">
                {error}
              </p>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Sending…' : 'Send reset link'}
            </button>

            <p className="text-sm text-ink-400 text-center">
              <Link href="/login" className="text-clay-500 hover:text-clay-600 font-medium">
                Back to login
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

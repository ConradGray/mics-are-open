'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/me';
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push(next);
    router.refresh();
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="card">
        <h1 className="font-display text-3xl font-semibold text-ink-800">
          Welcome back
        </h1>
        <p className="mt-2 text-ink-600">Good to see you again.</p>

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

          <div>
            <label className="label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
            />
          </div>

          {error && (
            <p className="text-sm text-clay-600 bg-clay-50 border border-clay-100 rounded-lg p-3">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <div className="mt-6 space-y-3 text-sm text-center">
          <p className="text-ink-400">
            <Link href="/forgot-password" className="text-clay-500 hover:text-clay-600 font-medium">
              Forgot your password?
            </Link>
          </p>
          <p className="text-ink-400">
            New here?{' '}
            <Link href="/signup" className="text-clay-500 hover:text-clay-600 font-medium">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

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
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://www.themicsareopen.com/auth/callback',
      },
    });
    if (error) {
      setError(error.message);
      setGoogleLoading(false);
    }
    // On success the browser navigates away — no need to setGoogleLoading(false)
  }

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

        {/* Google Sign-In */}
        <div className="mt-6">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading}
            className="btn-ghost w-full gap-3"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {googleLoading ? 'Redirecting…' : 'Continue with Google'}
          </button>
        </div>

        {/* Divider */}
        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#2a2a2a]" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-[#161616] px-3 text-ink-400 uppercase tracking-wider">or continue with email</span>
          </div>
        </div>

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

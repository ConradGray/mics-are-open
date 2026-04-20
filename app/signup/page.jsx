'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function SignUpPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sentEmail, setSentEmail] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/profile/setup`,
      },
    });

    setLoading(false);

    if (error) {
      if (
        error.message.toLowerCase().includes('already registered') ||
        error.message.toLowerCase().includes('already in use') ||
        error.message.toLowerCase().includes('already exists')
      ) {
        setError('An account with this email already exists. Try logging in instead.');
      } else {
        setError(error.message);
      }
      return;
    }

    // If confirmations are OFF in Supabase settings, we'll have a session immediately.
    if (data.session) {
      router.push('/profile/setup');
      router.refresh();
    } else {
      setSentEmail(true);
    }
  }

  if (sentEmail) {
    return (
      <div className="max-w-md mx-auto card mt-8 text-center">
        <h1 className="font-display text-3xl font-semibold text-ink-800">
          Check your email
        </h1>
        <p className="mt-4 text-ink-600 leading-relaxed">
          We sent a confirmation link to <strong>{email}</strong>. Click it to
          finish creating your account.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="card">
        <h1 className="font-display text-3xl font-semibold text-ink-800">
          Join the community
        </h1>
        <p className="mt-2 text-ink-600">
          It takes about 30 seconds. Promise.
        </p>

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
              placeholder="you@somewhere.com"
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
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="At least 8 characters"
            />
          </div>

          {error && (
            <p className="text-sm text-clay-600 bg-clay-50 border border-clay-100 rounded-lg p-3">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-sm text-ink-400 text-center">
          Already a listener?{' '}
          <Link href="/login" className="text-clay-500 hover:text-clay-600 font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

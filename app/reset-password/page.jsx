'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token_hash = searchParams.get('token_hash');
    const type = searchParams.get('type');

    if (token_hash && type) {
      // Token-hash flow: link goes directly to this page with token in the URL.
      // Works in any browser context — no PKCE cookie required.
      supabase.auth.verifyOtp({ token_hash, type }).then(({ error }) => {
        if (error) {
          setError('This reset link has expired or has already been used. Please request a new one.');
        } else {
          setReady(true);
        }
      });
    } else {
      // Fallback: PKCE flow where callback already established a session.
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setReady(true);
        } else {
          setError('Invalid reset link. Please request a new one.');
        }
      });
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push('/me');
    router.refresh();
  }

  if (!ready) {
    return (
      <div className="max-w-md mx-auto mt-8">
        <div className="card text-center space-y-3">
          {error ? (
            <>
              <p className="text-sm text-clay-500">{error}</p>
              <a href="/forgot-password" className="inline-block text-sm text-clay-500 hover:text-clay-600 font-medium">
                Request a new reset link →
              </a>
            </>
          ) : (
            <p className="text-sm text-ink-400">Verifying your reset link…</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="card">
        <h1 className="font-display text-3xl font-semibold text-ink-800">
          Choose a new password
        </h1>
        <p className="mt-2 text-ink-600">Make it something you'll remember.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="label" htmlFor="password">
              New password
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
            />
          </div>

          <div>
            <label className="label" htmlFor="confirm">
              Confirm password
            </label>
            <input
              id="confirm"
              type="password"
              required
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="input"
            />
          </div>

          {error && (
            <p className="text-sm text-clay-600 bg-clay-50 border border-clay-100 rounded-lg p-3">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Saving…' : 'Set new password'}
          </button>
        </form>
      </div>
    </div>
  );
}

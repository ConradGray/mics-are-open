'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Turnstile from '@/components/Turnstile';

const MAX_LENGTH = 280;

export default function PostComposer({ userId }) {
  const router = useRouter();
  const supabase = createClient();

  const [body, setBody] = useState('');
  const [isHotTake, setIsHotTake] = useState(false);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);

  const remaining = MAX_LENGTH - body.length;

  const handleVerify = useCallback((token) => setCaptchaToken(token), []);
  const handleCaptchaError = useCallback(() => setCaptchaToken(null), []);

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = body.trim();

    if (!trimmed) return;
    if (trimmed.length > MAX_LENGTH) {
      setError('Post is too long.');
      return;
    }

    // Verify CAPTCHA server-side first
    if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
      if (!captchaToken) {
        setError('Please complete the CAPTCHA check below.');
        return;
      }

      const res = await fetch('/api/verify-captcha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: captchaToken }),
      });
      const result = await res.json();
      if (!result.success) {
        setError('CAPTCHA verification failed. Please try again.');
        setCaptchaToken(null);
        return;
      }
    }

    setPosting(true);
    setError(null);

    const { error: insertErr } = await supabase.from('tmao_posts').insert({
      author_id: userId,
      body: trimmed,
      status: 'pending',
      is_hot_take: isHotTake,
    });

    setPosting(false);

    if (insertErr) {
      setError(insertErr.message);
      return;
    }

    setBody('');
    setIsHotTake(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 4000);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="card mb-6">
      <textarea
        className="input resize-none"
        rows={3}
        maxLength={MAX_LENGTH}
        value={body}
        onChange={(e) => {
          setBody(e.target.value);
          setSuccess(false);
        }}
        placeholder="What did the show spark for you?"
      />

      {/* Hot Take toggle */}
      <div className="mt-3 mb-1">
        <button
          type="button"
          onClick={() => setIsHotTake((v) => !v)}
          className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
            isHotTake
              ? 'bg-clay-500 text-cream-50 border-clay-500'
              : 'border-clay-500/40 text-clay-500/70 hover:border-clay-500 hover:text-clay-500'
          }`}
        >
          🔥 Hot Take
        </button>
        {isHotTake && (
          <span className="ml-2 text-xs text-ink-400">
            The crew will consider this for Hot Take of the Week.
          </span>
        )}
      </div>

      <Turnstile onVerify={handleVerify} onError={handleCaptchaError} />

      <div className="flex items-center justify-between mt-3">
        <span
          className={`text-xs tabular-nums ${
            remaining <= 20 ? 'text-clay-500 font-semibold' : 'text-ink-400'
          }`}
        >
          {remaining}
        </span>

        <div className="flex items-center gap-3">
          {success && (
            <span className="text-xs text-clay-500 font-medium">
              Posted! The crew will review it soon.
            </span>
          )}
          {error && (
            <span className="text-xs text-clay-600">{error}</span>
          )}
          <button
            type="submit"
            disabled={posting || !body.trim()}
            className="btn-primary text-sm py-2 px-4"
          >
            {posting ? 'Posting…' : 'Post to Open Mic'}
          </button>
        </div>
      </div>
    </form>
  );
}

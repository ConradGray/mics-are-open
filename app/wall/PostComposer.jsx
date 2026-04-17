'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const MAX_LENGTH = 280;

export default function PostComposer({ userId }) {
  const router = useRouter();
  const supabase = createClient();

  const [body, setBody] = useState('');
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const remaining = MAX_LENGTH - body.length;

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = body.trim();

    if (!trimmed) return;
    if (trimmed.length > MAX_LENGTH) {
      setError('Post is too long.');
      return;
    }

    setPosting(true);
    setError(null);

    const { error: insertErr } = await supabase.from('tmao_posts').insert({
      author_id: userId,
      body: trimmed,
      status: 'pending',
    });

    setPosting(false);

    if (insertErr) {
      setError(insertErr.message);
      return;
    }

    setBody('');
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
            {posting ? 'Posting…' : 'Post to the Wall'}
          </button>
        </div>
      </div>
    </form>
  );
}

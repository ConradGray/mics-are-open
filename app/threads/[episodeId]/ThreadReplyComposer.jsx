'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const MAX_LENGTH = 280;

export default function ThreadReplyComposer({ threadId, userId }) {
  const router = useRouter();
  const supabase = createClient();

  const [body, setBody] = useState('');
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState(null);

  const remaining = MAX_LENGTH - body.length;

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = body.trim();
    if (!trimmed) return;

    setPosting(true);
    setError(null);

    const { error: insertErr } = await supabase.from('tmao_thread_replies').insert({
      thread_id: threadId,
      author_id: userId,
      body: trimmed,
    });

    setPosting(false);

    if (insertErr) {
      setError(insertErr.message);
      return;
    }

    setBody('');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="card mb-4">
      <textarea
        className="input resize-none text-sm"
        rows={2}
        maxLength={MAX_LENGTH}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Add to the thread…"
      />
      <div className="flex items-center justify-between mt-2">
        <span
          className={`text-xs tabular-nums ${
            remaining <= 20 ? 'text-clay-500 font-semibold' : 'text-ink-400'
          }`}
        >
          {remaining}
        </span>
        <div className="flex items-center gap-2">
          {error && <span className="text-xs text-clay-600">{error}</span>}
          <button
            type="submit"
            disabled={posting || !body.trim()}
            className="btn-primary text-sm py-1.5 px-3"
          >
            {posting ? 'Posting…' : 'Reply'}
          </button>
        </div>
      </div>
    </form>
  );
}

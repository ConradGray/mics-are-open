'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const EMOJI_SET = ['❤️', '🔥', '😂', '🎯', '💯', '🙌'];

export default function ReactionBar({ postId, replyId, reactions, currentUserId }) {
  const router = useRouter();
  const supabase = createClient();
  const [showPicker, setShowPicker] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Group reactions by emoji: { "❤️": { count: 3, reacted: true }, ... }
  const grouped = {};
  for (const r of reactions) {
    if (!grouped[r.emoji]) grouped[r.emoji] = { count: 0, reacted: false };
    grouped[r.emoji].count++;
    if (r.user_id === currentUserId) grouped[r.emoji].reacted = true;
  }

  async function toggleReaction(emoji) {
    if (!currentUserId) return;

    const existing = grouped[emoji]?.reacted;

    if (existing) {
      // Remove reaction
      const target = postId
        ? { post_id: postId, emoji, user_id: currentUserId }
        : { reply_id: replyId, emoji, user_id: currentUserId };

      let query = supabase.from('tmao_reactions').delete();
      query = query.eq('user_id', currentUserId).eq('emoji', emoji);
      if (postId) query = query.eq('post_id', postId);
      else query = query.eq('reply_id', replyId);

      await query;
    } else {
      // Add reaction
      const row = { user_id: currentUserId, emoji };
      if (postId) row.post_id = postId;
      else row.reply_id = replyId;

      await supabase.from('tmao_reactions').insert(row);
    }

    startTransition(() => {
      router.refresh();
    });
    setShowPicker(false);
  }

  // Only show emojis that have at least 1 reaction
  const activeEmojis = EMOJI_SET.filter((e) => grouped[e]?.count > 0);

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {activeEmojis.map((emoji) => (
        <button
          key={emoji}
          onClick={() => toggleReaction(emoji)}
          disabled={!currentUserId}
          className={`inline-flex items-center gap-1 text-xs rounded-full px-2 py-1 transition ${
            grouped[emoji].reacted
              ? 'bg-clay-50 border border-clay-200 text-clay-600'
              : 'bg-cream-100 border border-cream-200 text-ink-500 hover:border-clay-200'
          } ${!currentUserId ? 'cursor-default' : 'cursor-pointer'}`}
        >
          <span>{emoji}</span>
          <span className="tabular-nums">{grouped[emoji].count}</span>
        </button>
      ))}

      {currentUserId && (
        <div className="relative">
          <button
            onClick={() => setShowPicker(!showPicker)}
            className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-cream-100 border border-cream-200 text-ink-400 hover:border-clay-200 hover:text-clay-500 transition text-xs"
            title="React"
          >
            +
          </button>

          {showPicker && (
            <div className="absolute bottom-full left-0 mb-1 flex gap-1 bg-cream-100 border border-cream-200 rounded-xl shadow-card p-2 z-20">
              {EMOJI_SET.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => toggleReaction(emoji)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-cream-100 transition text-base"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

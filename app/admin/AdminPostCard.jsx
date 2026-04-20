'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function AdminPostCard({ post, currentTab }) {
  const router = useRouter();
  const supabase = createClient();
  const [acting, setActing] = useState(null); // 'approve' | 'reject' | 'delete' | 'winner' | 'hottake'
  const [error, setError] = useState(null);
  const [isHotTake, setIsHotTake] = useState(post.is_hot_take || false);
  const [isWinner, setIsWinner] = useState(post.is_hot_take_winner || false);

  const profile = post.tmao_profiles;

  const time = new Date(post.created_at).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  async function updateStatus(newStatus) {
    setActing(newStatus === 'approved' ? 'approve' : 'reject');
    setError(null);
    const { error: err } = await supabase
      .from('tmao_posts')
      .update({ status: newStatus })
      .eq('id', post.id);
    if (err) {
      setError(err.message);
      setActing(null);
      return;
    }
    router.refresh();
    setActing(null);
  }

  async function toggleHotTake() {
    setActing('hottake');
    setError(null);
    const newVal = !isHotTake;
    const { error: err } = await supabase
      .from('tmao_posts')
      .update({ is_hot_take: newVal, ...(newVal === false ? { is_hot_take_winner: false } : {}) })
      .eq('id', post.id);
    if (err) { setError(err.message); setActing(null); return; }
    setIsHotTake(newVal);
    if (!newVal) setIsWinner(false);
    setActing(null);
  }

  async function makeHotTakeWinner() {
    setActing('winner');
    setError(null);
    // Clear existing winner first
    await supabase.from('tmao_posts').update({ is_hot_take_winner: false }).eq('is_hot_take_winner', true);
    // Set this post as winner
    const { error: err } = await supabase
      .from('tmao_posts')
      .update({ is_hot_take_winner: true })
      .eq('id', post.id);
    if (err) {
      setError(err.message);
      setActing(null);
      return;
    }
    setIsWinner(true);
    router.refresh();
    setActing(null);
  }

  async function deletePost() {
    if (!window.confirm('Delete this post permanently?')) return;
    setActing('delete');
    setError(null);
    const { error: err } = await supabase.from('tmao_posts').delete().eq('id', post.id);
    if (err) {
      setError(err.message);
      setActing(null);
      return;
    }
    router.refresh();
    setActing(null);
  }

  return (
    <div className="card">
      <div className="flex items-start gap-3">
        <Link
          href={profile?.username ? `/u/${profile.username}` : '#'}
          className="relative w-10 h-10 rounded-full bg-cream-200 overflow-hidden flex items-center justify-center shrink-0"
        >
          {profile?.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt=""
              fill
              sizes="40px"
              className="object-cover"
            />
          ) : (
            <span className="font-display text-sm text-clay-500">
              {(profile?.display_name || '?').slice(0, 1).toUpperCase()}
            </span>
          )}
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <Link
              href={profile?.username ? `/u/${profile.username}` : '#'}
              className="font-semibold text-ink-800 text-sm hover:text-clay-500 transition"
            >
              {profile?.display_name || 'Listener'}
            </Link>
            {profile?.username && (
              <span className="text-ink-400 text-xs">@{profile.username}</span>
            )}
            <span className="text-ink-400 text-xs ml-auto shrink-0">{time}</span>
          </div>

          {(isHotTake || isWinner) && (
            <div className="flex items-center gap-2 mt-1">
              {isHotTake && (
                <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-clay-500/20 text-clay-500 border border-clay-500/30">
                  🔥 Hot Take
                </span>
              )}
              {isWinner && (
                <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-clay-500 text-[#0D0D0D]">
                  👑 This week&apos;s winner
                </span>
              )}
            </div>
          )}

          <p className="mt-1.5 text-ink-600 leading-relaxed whitespace-pre-wrap break-words">
            {post.body}
          </p>

          {/* Action buttons */}
          <div className="mt-3 flex items-center gap-2">
            {currentTab === 'pending' && (
              <>
                <button
                  onClick={() => updateStatus('approved')}
                  disabled={!!acting}
                  className="inline-flex items-center gap-1.5 text-xs font-medium rounded-lg px-3 py-1.5 bg-emerald-950/60 text-emerald-400 border border-emerald-700/40 hover:bg-emerald-900/60 transition disabled:opacity-50"
                >
                  {acting === 'approve' ? 'Approving…' : 'Approve'}
                </button>
                <button
                  onClick={() => updateStatus('rejected')}
                  disabled={!!acting}
                  className="inline-flex items-center gap-1.5 text-xs font-medium rounded-lg px-3 py-1.5 bg-red-950/60 text-red-400 border border-red-700/40 hover:bg-red-900/60 transition disabled:opacity-50"
                >
                  {acting === 'reject' ? 'Rejecting…' : 'Reject'}
                </button>
              </>
            )}

            {currentTab === 'rejected' && (
              <button
                onClick={() => updateStatus('approved')}
                disabled={!!acting}
                className="inline-flex items-center gap-1.5 text-xs font-medium rounded-lg px-3 py-1.5 bg-emerald-950/60 text-emerald-400 border border-emerald-700/40 hover:bg-emerald-900/60 transition disabled:opacity-50"
              >
                {acting === 'approve' ? 'Approving…' : 'Approve'}
              </button>
            )}

            {currentTab === 'approved' && (
              <button
                onClick={() => updateStatus('rejected')}
                disabled={!!acting}
                className="inline-flex items-center gap-1.5 text-xs font-medium rounded-lg px-3 py-1.5 bg-red-950/60 text-red-400 border border-red-700/40 hover:bg-red-900/60 transition disabled:opacity-50"
              >
                {acting === 'reject' ? 'Rejecting…' : 'Take down'}
              </button>
            )}

            {currentTab === 'approved' && (
              <button
                onClick={toggleHotTake}
                disabled={!!acting}
                className={`inline-flex items-center gap-1.5 text-xs font-medium rounded-lg px-3 py-1.5 transition disabled:opacity-50 ${
                  isHotTake
                    ? 'bg-clay-500/20 text-clay-500 border border-clay-500/40 hover:bg-red-950/40 hover:text-red-400 hover:border-red-700/40'
                    : 'bg-[#1e1e1e] text-ink-600 border border-[#2a2a2a] hover:bg-clay-500/20 hover:text-clay-500 hover:border-clay-500/40'
                }`}
              >
                {acting === 'hottake' ? 'Updating…' : isHotTake ? '🔥 Unmark Hot Take' : '🔥 Mark as Hot Take'}
              </button>
            )}

            {isHotTake && !isWinner && currentTab === 'approved' && (
              <button
                onClick={makeHotTakeWinner}
                disabled={!!acting}
                className="inline-flex items-center gap-1.5 text-xs font-medium rounded-lg px-3 py-1.5 bg-clay-500/20 text-clay-500 border border-clay-500/40 hover:bg-clay-500 hover:text-[#0D0D0D] transition disabled:opacity-50"
              >
                {acting === 'winner' ? 'Setting…' : '👑 Make Winner'}
              </button>
            )}

            <button
              onClick={deletePost}
              disabled={!!acting}
              className="inline-flex items-center text-xs text-ink-400 hover:text-red-500 transition ml-auto disabled:opacity-50"
            >
              {acting === 'delete' ? 'Deleting…' : 'Delete'}
            </button>
          </div>

          {error && (
            <p className="mt-2 text-xs text-clay-600 bg-clay-50 border border-clay-100 rounded-lg p-2">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

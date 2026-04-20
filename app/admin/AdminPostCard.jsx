'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function AdminPostCard({
  post,
  currentTab,
  isHotTakeTab = false,
  onApprove,
  onReject,
  onDelete,
  onHotTakeToggle,
  onWinner,
}) {
  const supabase = createClient();
  const [acting, setActing] = useState(null);
  const [error, setError] = useState(null);
  const [isHotTake, setIsHotTake] = useState(post.is_hot_take || false);
  const [isWinner, setIsWinner] = useState(post.is_hot_take_winner || false);

  const profile = post.tmao_profiles;
  const time = new Date(post.created_at).toLocaleDateString(undefined, {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  });

  async function handleApprove() {
    setActing('approve');
    setError(null);
    const { error: err } = await supabase.from('tmao_posts').update({ status: 'approved' }).eq('id', post.id);
    if (err) { setError(err.message); setActing(null); return; }
    onApprove?.(post.id);
    setActing(null);
  }

  async function handleReject() {
    setActing('reject');
    setError(null);
    const { error: err } = await supabase.from('tmao_posts').update({ status: 'rejected' }).eq('id', post.id);
    if (err) { setError(err.message); setActing(null); return; }
    onReject?.(post.id);
    setActing(null);
  }

  async function handleDelete() {
    if (!window.confirm('Delete this post permanently?')) return;
    setActing('delete');
    setError(null);
    const { error: err } = await supabase.from('tmao_posts').delete().eq('id', post.id);
    if (err) { setError(err.message); setActing(null); return; }
    onDelete?.(post.id);
    setActing(null);
  }

  async function toggleHotTake() {
    setActing('hottake');
    setError(null);
    const newVal = !isHotTake;
    const { error: err } = await supabase.from('tmao_posts')
      .update({ is_hot_take: newVal, ...(!newVal ? { is_hot_take_winner: false } : {}) })
      .eq('id', post.id);
    if (err) { setError(err.message); setActing(null); return; }
    setIsHotTake(newVal);
    if (!newVal) setIsWinner(false);
    onHotTakeToggle?.(post.id, newVal);
    setActing(null);
  }

  async function makeWinner() {
    setActing('winner');
    setError(null);
    // Clear existing winner
    await supabase.from('tmao_posts').update({ is_hot_take_winner: false }).eq('is_hot_take_winner', true);
    // Set this post
    const { error: err } = await supabase.from('tmao_posts').update({ is_hot_take_winner: true }).eq('id', post.id);
    if (err) { setError(err.message); setActing(null); return; }
    setIsWinner(true);
    onWinner?.(post.id);
    setActing(null);
  }

  return (
    <div className="card">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <Link
          href={profile?.username ? `/u/${profile.username}` : '#'}
          className="relative w-9 h-9 rounded-full bg-cream-200 overflow-hidden flex items-center justify-center shrink-0"
        >
          {profile?.avatar_url ? (
            <Image src={profile.avatar_url} alt="" fill sizes="36px" className="object-cover" />
          ) : (
            <span className="font-display text-sm text-clay-500">
              {(profile?.display_name || '?').slice(0, 1).toUpperCase()}
            </span>
          )}
        </Link>

        <div className="flex-1 min-w-0">
          {/* Meta */}
          <div className="flex items-baseline gap-2 flex-wrap">
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

          {/* Labels */}
          {(isHotTake || isWinner) && (
            <div className="flex items-center gap-2 mt-1 flex-wrap">
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

          {/* Body */}
          <p className="mt-2 text-ink-600 text-sm leading-relaxed whitespace-pre-wrap break-words">
            {post.body}
          </p>

          {/* Actions */}
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            {currentTab === 'pending' && (
              <>
                <button
                  onClick={handleApprove}
                  disabled={!!acting}
                  className="inline-flex items-center gap-1 text-xs font-semibold rounded-lg px-3 py-1.5 bg-emerald-950/60 text-emerald-400 border border-emerald-700/40 hover:bg-emerald-900/60 transition disabled:opacity-40"
                >
                  {acting === 'approve' ? 'Approving…' : '✓ Approve'}
                </button>
                <button
                  onClick={handleReject}
                  disabled={!!acting}
                  className="inline-flex items-center gap-1 text-xs font-semibold rounded-lg px-3 py-1.5 bg-red-950/60 text-red-400 border border-red-700/40 hover:bg-red-900/60 transition disabled:opacity-40"
                >
                  {acting === 'reject' ? 'Rejecting…' : '✕ Reject'}
                </button>
              </>
            )}

            {currentTab === 'rejected' && (
              <button
                onClick={handleApprove}
                disabled={!!acting}
                className="inline-flex items-center gap-1 text-xs font-semibold rounded-lg px-3 py-1.5 bg-emerald-950/60 text-emerald-400 border border-emerald-700/40 hover:bg-emerald-900/60 transition disabled:opacity-40"
              >
                {acting === 'approve' ? 'Approving…' : '✓ Approve'}
              </button>
            )}

            {currentTab === 'approved' && !isHotTakeTab && (
              <button
                onClick={handleReject}
                disabled={!!acting}
                className="inline-flex items-center gap-1 text-xs font-semibold rounded-lg px-3 py-1.5 bg-red-950/60 text-red-400 border border-red-700/40 hover:bg-red-900/60 transition disabled:opacity-40"
              >
                {acting === 'reject' ? 'Taking down…' : 'Take down'}
              </button>
            )}

            {currentTab === 'approved' && (
              <button
                onClick={toggleHotTake}
                disabled={!!acting}
                className={`inline-flex items-center gap-1 text-xs font-semibold rounded-lg px-3 py-1.5 transition disabled:opacity-40 ${
                  isHotTake
                    ? 'bg-clay-500/20 text-clay-500 border border-clay-500/40 hover:bg-red-950/40 hover:text-red-400 hover:border-red-700/40'
                    : 'bg-cream-100 text-ink-500 border border-cream-200 hover:bg-clay-500/20 hover:text-clay-500 hover:border-clay-500/40'
                }`}
              >
                {acting === 'hottake' ? 'Updating…' : isHotTake ? '🔥 Unmark' : '🔥 Hot Take'}
              </button>
            )}

            {isHotTake && !isWinner && currentTab === 'approved' && (
              <button
                onClick={makeWinner}
                disabled={!!acting}
                className="inline-flex items-center gap-1 text-xs font-semibold rounded-lg px-3 py-1.5 bg-clay-500/20 text-clay-500 border border-clay-500/40 hover:bg-clay-500 hover:text-[#0D0D0D] transition disabled:opacity-40"
              >
                {acting === 'winner' ? 'Setting…' : '👑 Make Winner'}
              </button>
            )}

            <button
              onClick={handleDelete}
              disabled={!!acting}
              className="text-xs text-ink-400 hover:text-red-500 transition ml-auto disabled:opacity-40"
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

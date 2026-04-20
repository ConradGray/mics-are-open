'use client';

import Link from 'next/link';
import Image from 'next/image';
import ReactionBar from '../ReactionBar';

export default function ReplyCard({ reply, currentUserId, onReplyTo }) {
  const profile = reply.tmao_profiles;
  const reactions = reply.tmao_reactions || [];
  const ago = timeAgo(reply.created_at);

  return (
    <div className="card py-4 px-5">
      <div className="flex items-start gap-3">
        <Link
          href={profile?.username ? `/u/${profile.username}` : '#'}
          className="relative w-8 h-8 rounded-full bg-cream-200 overflow-hidden flex items-center justify-center shrink-0"
        >
          {profile?.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt=""
              fill
              sizes="32px"
              className="object-cover"
            />
          ) : (
            <span className="font-display text-xs text-clay-500">
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
            <span className="text-ink-400 text-xs">{ago}</span>
          </div>
          <p className="mt-1 text-ink-600 text-sm leading-relaxed whitespace-pre-wrap break-words">
            {reply.body}
          </p>
          <div className="mt-2 flex items-center gap-3">
            <ReactionBar
              replyId={reply.id}
              reactions={reactions}
              currentUserId={currentUserId}
            />
            {onReplyTo && profile?.username && (
              <button
                onClick={() => onReplyTo(profile.username)}
                className="text-xs text-ink-400 hover:text-clay-500 transition ml-auto"
              >
                Reply
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function timeAgo(dateStr) {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffSec = Math.floor((now - then) / 1000);

  if (diffSec < 60) return 'just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h`;
  if (diffSec < 2592000) return `${Math.floor(diffSec / 86400)}d`;

  return new Date(dateStr).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

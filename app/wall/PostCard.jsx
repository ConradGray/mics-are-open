import Link from 'next/link';
import Image from 'next/image';
import ReactionBar from './ReactionBar';

export default function PostCard({ post, currentUserId, isPending = false }) {
  const profile = post.tmao_profiles;
  const replyCount = post.tmao_replies?.length || 0;
  const reactions = post.tmao_reactions || [];

  const ago = timeAgo(post.created_at);

  return (
    <div className={`card ${isPending ? 'opacity-70 border-dashed' : ''}`}>
      {isPending && (
        <span className="inline-block text-xs font-semibold uppercase tracking-wider text-ink-400 bg-cream-100 rounded-full px-2.5 py-1 mb-3">
          Pending review
        </span>
      )}

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
            <span className="text-ink-400 text-xs ml-auto shrink-0">{ago}</span>
          </div>

          <p className="mt-1 text-ink-600 leading-relaxed whitespace-pre-wrap break-words">
            {post.body}
          </p>

          {!isPending && (
            <div className="mt-3 flex items-center gap-4">
              <ReactionBar
                postId={post.id}
                reactions={reactions}
                currentUserId={currentUserId}
              />

              <Link
                href={`/wall/${post.id}`}
                className="text-xs text-ink-400 hover:text-clay-500 transition ml-auto"
              >
                {replyCount > 0
                  ? `${replyCount} ${replyCount === 1 ? 'reply' : 'replies'}`
                  : 'Reply'}
              </Link>
            </div>
          )}
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

'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ThreadReplyComposer from './ThreadReplyComposer';
import ThreadReactionBar from './ThreadReactionBar';

export default function ThreadRepliesSection({
  threadId, userId, replies, reactionsByReply, currentUserId,
}) {
  const [replyTo, setReplyTo] = useState('');
  const composerRef = useRef(null);

  function handleReplyTo(username) {
    setReplyTo(`@${username} `);
    setTimeout(() => {
      composerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      composerRef.current?.focus();
    }, 50);
  }

  return (
    <div>
      {userId ? (
        <ThreadReplyComposer
          ref={composerRef}
          threadId={threadId}
          userId={userId}
          replyTo={replyTo}
          onClear={() => setReplyTo('')}
        />
      ) : (
        <div className="card text-center mb-4">
          <p className="text-ink-500 text-sm">
            <a
              href={`/login?next=/threads/${threadId}`}
              className="text-clay-500 hover:text-clay-600 font-medium"
            >
              Log in
            </a>{' '}
            to join the conversation.
          </p>
        </div>
      )}

      {replies && replies.length > 0 ? (
        <div className="space-y-3">
          {replies.map((reply) => {
            const profile = reply.tmao_profiles;
            const reactions = reactionsByReply[reply.id] || [];
            const ago = timeAgo(reply.created_at);

            return (
              <div key={reply.id} className="card py-4 px-5">
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
                      <ThreadReactionBar
                        threadReplyId={reply.id}
                        reactions={reactions}
                        currentUserId={currentUserId}
                      />
                      {userId && profile?.username && (
                        <button
                          onClick={() => handleReplyTo(profile.username)}
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
          })}
        </div>
      ) : (
        <p className="text-sm text-ink-400 text-center py-4">
          No replies yet. Be the first to weigh in.
        </p>
      )}
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

'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ThreadReplyComposer from './ThreadReplyComposer';
import ThreadReactionBar from './ThreadReactionBar';

// Group flat replies into a tree based on leading @mention.
// A reply that starts with @username is nested under the most recent
// reply written by that user (if one exists before it).
function buildThreadGroups(replies) {
  const groups = [];       // { reply, children: Reply[] }[]
  const byId = {};         // reply.id → group ref
  const latestByUser = {}; // username (lower) → reply.id

  for (const reply of replies) {
    const authorUsername = reply.tmao_profiles?.username?.toLowerCase();
    const mentionMatch = reply.body.match(/^@([\w.]+)/);
    const mentionedUser = mentionMatch?.[1]?.toLowerCase();

    const parentId = mentionedUser ? (latestByUser[mentionedUser] ?? null) : null;

    if (parentId && byId[parentId]) {
      byId[parentId].children.push(reply);
    } else {
      const g = { reply, children: [] };
      groups.push(g);
      byId[reply.id] = g;
    }

    if (authorUsername) {
      latestByUser[authorUsername] = reply.id;
    }
  }

  return groups;
}

function ReplyCard({ reply, reactionsByReply, currentUserId, userId, isNested, isReplying, onReplyTo }) {
  const profile = reply.tmao_profiles;
  const reactions = reactionsByReply[reply.id] || [];
  const ago = timeAgo(reply.created_at);

  return (
    <div className={`card py-4 px-5${isNested ? ' border-l-2 border-clay-300' : ''}`}>
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
                onClick={() => onReplyTo(reply.id, profile.username)}
                className={`text-xs transition ml-auto ${
                  isReplying ? 'text-clay-500' : 'text-ink-400 hover:text-clay-500'
                }`}
              >
                {isReplying ? 'Cancel' : 'Reply'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ThreadRepliesSection({
  threadId, userId, replies, reactionsByReply, currentUserId,
}) {
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [activeReplyTo, setActiveReplyTo] = useState('');
  const inlineRef = useRef(null);

  function handleReplyTo(replyId, username) {
    if (activeReplyId === replyId) {
      setActiveReplyId(null);
      setActiveReplyTo('');
      return;
    }
    setActiveReplyId(replyId);
    setActiveReplyTo(`@${username} `);
    setTimeout(() => {
      inlineRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      inlineRef.current?.focus();
    }, 50);
  }

  function handleClear() {
    setActiveReplyId(null);
    setActiveReplyTo('');
  }

  const groups = buildThreadGroups(replies || []);

  return (
    <div>
      {userId ? (
        <ThreadReplyComposer
          threadId={threadId}
          userId={userId}
          replyTo=""
          onClear={() => {}}
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

      {groups.length > 0 ? (
        <div className="space-y-3">
          {groups.map(({ reply, children }) => {
            const rootReplying = activeReplyId === reply.id;
            return (
              <div key={reply.id}>
                <ReplyCard
                  reply={reply}
                  reactionsByReply={reactionsByReply}
                  currentUserId={currentUserId}
                  userId={userId}
                  isNested={false}
                  isReplying={rootReplying}
                  onReplyTo={handleReplyTo}
                />

                {/* children nested under this reply */}
                {(children.length > 0 || rootReplying) && (
                  <div className="mt-2 ml-11 space-y-2">
                    {children.map((child) => {
                      const childReplying = activeReplyId === child.id;
                      return (
                        <div key={child.id}>
                          <ReplyCard
                            reply={child}
                            reactionsByReply={reactionsByReply}
                            currentUserId={currentUserId}
                            userId={userId}
                            isNested
                            isReplying={childReplying}
                            onReplyTo={handleReplyTo}
                          />
                          {childReplying && userId && (
                            <div className="mt-2">
                              <ThreadReplyComposer
                                ref={inlineRef}
                                threadId={threadId}
                                userId={userId}
                                replyTo={activeReplyTo}
                                onClear={handleClear}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* inline composer for root reply */}
                    {rootReplying && userId && (
                      <ThreadReplyComposer
                        ref={inlineRef}
                        threadId={threadId}
                        userId={userId}
                        replyTo={activeReplyTo}
                        onClear={handleClear}
                      />
                    )}
                  </div>
                )}
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

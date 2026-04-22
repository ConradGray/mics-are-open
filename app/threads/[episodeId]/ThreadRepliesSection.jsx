'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ThreadReplyComposer from './ThreadReplyComposer';
import ThreadReactionBar from './ThreadReactionBar';

/**
 * Group flat replies into { reply, children[] } where a reply whose body
 * starts with @username is nested under the most recent reply written by
 * that user (matching Open Mic's reply-preview-inside-parent-card pattern).
 */
function buildGroups(replies) {
  const groups = [];
  const byId = {};
  const latestByUser = {}; // lowercase username → reply.id

  for (const reply of replies) {
    const authorUser = reply.tmao_profiles?.username?.toLowerCase();
    const mentionMatch = reply.body.match(/^@([\w.]+)/);
    const mentionedUser = mentionMatch?.[1]?.toLowerCase();
    const parentId = mentionedUser ? (latestByUser[mentionedUser] ?? null) : null;

    if (parentId && byId[parentId]) {
      // Add to the root group that owns the parent
      byId[parentId].children.push(reply);
      // Point this reply's id to the same root group so its children land here too
      byId[reply.id] = byId[parentId];
    } else {
      const g = { reply, children: [] };
      groups.push(g);
      byId[reply.id] = g;
    }

    if (authorUser) latestByUser[authorUser] = reply.id;
  }

  return groups;
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

  const groups = buildGroups(replies || []);

  return (
    <div>
      {/* Composer for new top-level replies */}
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
            const profile = reply.tmao_profiles;
            const reactions = reactionsByReply[reply.id] || [];
            const ago = timeAgo(reply.created_at);
            const isActive = activeReplyId === reply.id ||
              children.some(c => activeReplyId === c.id);

            return (
              <div key={reply.id}>
                {/* Parent reply card — mirrors Open Mic PostCard structure */}
                <div className="card py-4 px-5">
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <Link
                      href={profile?.username ? `/u/${profile.username}` : '#'}
                      className="relative w-8 h-8 rounded-full bg-cream-200 overflow-hidden flex items-center justify-center shrink-0"
                    >
                      {profile?.avatar_url ? (
                        <Image src={profile.avatar_url} alt="" fill sizes="32px" className="object-cover" />
                      ) : (
                        <span className="font-display text-xs text-clay-500">
                          {(profile?.display_name || '?').slice(0, 1).toUpperCase()}
                        </span>
                      )}
                    </Link>

                    <div className="flex-1 min-w-0">
                      {/* Name + time */}
                      <div className="flex items-baseline gap-2">
                        <Link
                          href={profile?.username ? `/u/${profile.username}` : '#'}
                          className="font-semibold text-ink-800 text-sm hover:text-clay-500 transition"
                        >
                          {profile?.display_name || 'Listener'}
                        </Link>
                        <span className="text-ink-400 text-xs">{ago}</span>
                      </div>

                      {/* Body */}
                      <p className="mt-1 text-ink-600 text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {reply.body}
                      </p>

                      {/* Reactions + Reply button */}
                      <div className="mt-2 flex items-center gap-3">
                        <ThreadReactionBar
                          threadReplyId={reply.id}
                          reactions={reactions}
                          currentUserId={currentUserId}
                        />
                        {userId && profile?.username && (
                          <button
                            onClick={() => handleReplyTo(reply.id, profile.username)}
                            className={`text-xs transition ml-auto ${
                              activeReplyId === reply.id ? 'text-clay-500' : 'text-ink-400 hover:text-clay-500'
                            }`}
                          >
                            {activeReplyId === reply.id ? 'Cancel' : 'Reply'}
                          </button>
                        )}
                      </div>

                      {/* Nested children — same style as Open Mic first-reply preview */}
                      {children.map((child) => {
                        const cp = child.tmao_profiles;
                        const cr = reactionsByReply[child.id] || [];
                        const cAgo = timeAgo(child.created_at);
                        return (
                          <div key={child.id} className="mt-3 pt-3 border-t border-cream-200">
                            <div className="flex items-start gap-2">
                              {/* Smaller avatar — matches Open Mic nested preview */}
                              <Link
                                href={cp?.username ? `/u/${cp.username}` : '#'}
                                className="relative w-6 h-6 rounded-full bg-cream-200 overflow-hidden flex items-center justify-center shrink-0 mt-0.5"
                              >
                                {cp?.avatar_url ? (
                                  <Image src={cp.avatar_url} alt="" fill sizes="24px" className="object-cover" />
                                ) : (
                                  <span className="font-display text-[10px] text-clay-500">
                                    {(cp?.display_name || '?').slice(0, 1).toUpperCase()}
                                  </span>
                                )}
                              </Link>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-baseline gap-2">
                                  <Link
                                    href={cp?.username ? `/u/${cp.username}` : '#'}
                                    className="text-xs font-semibold text-ink-600 hover:text-clay-500 transition"
                                  >
                                    {cp?.display_name || 'Listener'}
                                  </Link>
                                  <span className="text-ink-400 text-xs">{cAgo}</span>
                                </div>
                                <p className="text-xs text-ink-500 leading-relaxed mt-0.5 whitespace-pre-wrap break-words">
                                  {child.body}
                                </p>
                                <div className="mt-1.5 flex items-center gap-3">
                                  <ThreadReactionBar
                                    threadReplyId={child.id}
                                    reactions={cr}
                                    currentUserId={currentUserId}
                                  />
                                  {userId && cp?.username && (
                                    <button
                                      onClick={() => handleReplyTo(child.id, cp.username)}
                                      className={`text-xs transition ml-auto ${
                                        activeReplyId === child.id ? 'text-clay-500' : 'text-ink-400 hover:text-clay-500'
                                      }`}
                                    >
                                      {activeReplyId === child.id ? 'Cancel' : 'Reply'}
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Inline composer — appears below the whole group when Reply is clicked */}
                {isActive && userId && (
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

  return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

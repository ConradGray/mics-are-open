'use client';

import { useState, useRef } from 'react';
import ReplyComposer from './ReplyComposer';
import ReplyCard from './ReplyCard';

export default function OpenMicRepliesSection({ postId, userId, replies, currentUserId }) {
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
        <ReplyComposer
          ref={composerRef}
          postId={postId}
          userId={userId}
          replyTo={replyTo}
          onClear={() => setReplyTo('')}
        />
      ) : (
        <div className="card text-center mb-4">
          <p className="text-ink-500 text-sm">
            <a
              href={`/login?next=/open-mic/${postId}`}
              className="text-clay-500 hover:text-clay-600 font-medium"
            >
              Log in
            </a>{' '}
            to reply.
          </p>
        </div>
      )}

      {replies && replies.length > 0 ? (
        <div className="space-y-3">
          {replies.map((reply) => (
            <ReplyCard
              key={reply.id}
              reply={reply}
              currentUserId={currentUserId}
              onReplyTo={userId ? handleReplyTo : null}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-ink-400 text-center py-4">
          No replies yet. Start the conversation.
        </p>
      )}
    </div>
  );
}

import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import ThreadReplyComposer from './ThreadReplyComposer';
import ThreadReactionBar from './ThreadReactionBar';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const supabase = createClient();
  const { data: thread } = await supabase
    .from('tmao_threads')
    .select('title, episode_num')
    .eq('id', params.episodeId)
    .maybeSingle();

  if (!thread) return { title: 'Thread not found — The Mics Are Open' };

  const epLabel = thread.episode_num ? `Ep. ${thread.episode_num}: ` : '';
  return { title: `${epLabel}${thread.title} — The Mics Are Open` };
}

export default async function ThreadDetailPage({ params }) {
  const supabase = createClient();

  const { data: thread } = await supabase
    .from('tmao_threads')
    .select('id, episode_num, title, description, embed_url, published_at')
    .eq('id', params.episodeId)
    .maybeSingle();

  if (!thread) notFound();

  const { data: replies } = await supabase
    .from('tmao_thread_replies')
    .select(`
      id, body, created_at, author_id,
      tmao_profiles!tmao_thread_replies_author_fk (
        username, display_name, avatar_url
      ),
      tmao_reactions ( id, emoji, user_id )
    `)
    .eq('thread_id', thread.id)
    .order('created_at', { ascending: true });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const publishedAt = new Date(thread.published_at).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/threads/all"
        className="inline-flex items-center gap-1 text-sm text-ink-400 hover:text-clay-500 transition mb-6"
      >
        ← Previous Episode Threads
      </Link>

      {/* Episode header */}
      <div className="card mb-6">
        {thread.episode_num && (
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-clay-500 mb-2">
            Episode {thread.episode_num}
          </p>
        )}
        <h1 className="font-display text-3xl font-bold text-ink-800 leading-tight">
          {thread.title}
        </h1>
        <p className="text-xs text-ink-400 mt-2">{publishedAt}</p>

        {thread.description && (
          <p className="mt-3 text-sm text-ink-600 leading-relaxed border-t border-cream-200 pt-3">
            {thread.description}
          </p>
        )}

        {/* Audio / Video embed */}
        {thread.embed_url && (
          <div className="mt-4 border-t border-cream-200 pt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-400 mb-2">
              Listen
            </p>
            {/youtube\.com\/embed|youtu\.be/.test(thread.embed_url) ? (
              // YouTube — 16:9 aspect ratio
              <div className="relative w-full rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src={thread.embed_url}
                  className="absolute inset-0 w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={`Episode ${thread.episode_num || ''}: ${thread.title}`}
                />
              </div>
            ) : /open\.spotify\.com\/embed/.test(thread.embed_url) ? (
              // Spotify — tall player
              <iframe
                src={thread.embed_url}
                width="100%"
                height="352"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                className="rounded-xl"
                title={`Episode ${thread.episode_num || ''}: ${thread.title}`}
              />
            ) : (
              // SoundCloud (and fallback)
              <iframe
                src={thread.embed_url}
                width="100%"
                height="166"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                className="rounded-lg"
                title={`Episode ${thread.episode_num || ''}: ${thread.title}`}
              />
            )}
          </div>
        )}
      </div>

      {/* Replies */}
      <div>
        <h2 className="font-display text-xl font-semibold text-ink-800 mb-4">
          {replies?.length
            ? `${replies.length} ${replies.length === 1 ? 'Reply' : 'Replies'}`
            : 'Replies'}
        </h2>

        {user ? (
          <ThreadReplyComposer threadId={thread.id} userId={user.id} />
        ) : (
          <div className="card text-center mb-4">
            <p className="text-ink-500 text-sm">
              <a
                href={`/login?next=/threads/${thread.id}`}
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
              const reactions = reply.tmao_reactions || [];
              const ago = timeAgo(reply.created_at);

              return (
                <div key={reply.id} className="card">
                  <div className="flex items-start gap-3">
                    <Link
                      href={profile?.username ? `/u/${profile.username}` : '#'}
                      className="relative w-9 h-9 rounded-full bg-cream-200 overflow-hidden flex items-center justify-center shrink-0"
                    >
                      {profile?.avatar_url ? (
                        <Image
                          src={profile.avatar_url}
                          alt=""
                          fill
                          sizes="36px"
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
                      <p className="mt-1 text-ink-600 text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {reply.body}
                      </p>
                      <div className="mt-2">
                        <ThreadReactionBar
                          threadReplyId={reply.id}
                          reactions={reactions}
                          currentUserId={user?.id || null}
                        />
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

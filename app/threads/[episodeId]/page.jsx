import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import ThreadRepliesSection from './ThreadRepliesSection';

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
      )
    `)
    .eq('thread_id', thread.id)
    .order('created_at', { ascending: true });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isCrew = false;
  if (user) {
    const { data: profile } = await supabase
      .from('tmao_profiles')
      .select('is_crew')
      .eq('id', user.id)
      .maybeSingle();
    isCrew = profile?.is_crew || false;
  }

  // Fetch reactions for all replies separately (more reliable than nested select)
  const replyIds = (replies || []).map((r) => r.id);
  const { data: allReactions } = replyIds.length > 0
    ? await supabase
        .from('tmao_reactions')
        .select('id, emoji, user_id, thread_reply_id')
        .in('thread_reply_id', replyIds)
    : { data: [] };

  // Group reactions by reply id
  const reactionsByReply = {};
  for (const reaction of allReactions || []) {
    if (!reactionsByReply[reaction.thread_reply_id]) {
      reactionsByReply[reaction.thread_reply_id] = [];
    }
    reactionsByReply[reaction.thread_reply_id].push(reaction);
  }

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
        <ThreadRepliesSection
          threadId={thread.id}
          userId={user?.id || null}
          replies={replies || []}
          reactionsByReply={reactionsByReply}
          currentUserId={user?.id || null}
          isCrew={isCrew}
        />
      </div>
    </div>
  );
}


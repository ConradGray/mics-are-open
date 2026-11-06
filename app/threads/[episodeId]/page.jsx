import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import ThreadRepliesSection from './ThreadRepliesSection';
import Chip from '@/components/Chip';
import { splitHighlight } from '@/lib/episodes';

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

  const { lead, hl } = splitHighlight(thread.title);

  return (
    <div className="page-full">
      <section className="bleed pt-10 lg:pt-16 pb-7">
        <div className="wrap">
          <Link
            href="/threads/all"
            className="tmao-label inline-block mb-[22px] border-b-2 border-clay-500 pb-1 hover:text-clay-500 transition"
          >
            ← Previous Episode Threads
          </Link>
          <br />
          {thread.episode_num ? (
            <Chip value={`#${thread.episode_num}`} label={`Episode ${thread.episode_num}`} />
          ) : (
            <Chip value="TMAO" label="Episode thread" />
          )}
          <h1 className="display mt-[18px] max-w-[11em] text-[clamp(44px,12vw,120px)]">
            {lead}<span className="hl">{hl}</span>
          </h1>
          <p className="tmao-label mt-4 text-ink-600">{publishedAt}</p>
        </div>
      </section>

      {/* Player — the episode's own embed, no overlay or text on top */}
      {thread.embed_url && (
        <section className="bleed pb-9">
          <div className="wrap">
            {/youtube\.com\/embed|youtu\.be/.test(thread.embed_url) ? (
              // YouTube — 16:9 aspect ratio
              <div className="relative w-full overflow-hidden border border-[#26262A] bg-black" style={{ paddingBottom: '56.25%' }}>
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
                
                title={`Episode ${thread.episode_num || ''}: ${thread.title}`}
              />
            )}
          </div>
        </section>
      )}

      <section className="bleed pb-[72px] lg:pb-[110px]">
        <div className="wrap grid gap-9">
          <div>
            <p className="section-label">Listen</p>
            {thread.description && (
              <p className="font-semibold text-[clamp(17px,4.4vw,22px)] text-ink-700 max-w-[720px] whitespace-pre-line">
                {thread.description}
              </p>
            )}
            <div className="flex flex-wrap gap-[18px] mt-6">
              {[
                ['https://www.youtube.com/playlist?list=PLURaeuNWMwdy894eBMVPwR67ZDQpSWwsg', 'YouTube'],
                ['https://open.spotify.com/show/6aU9hxLKdMIEzBfQ2IhYt6', 'Spotify'],
                ['https://podcasts.apple.com/gb/podcast/the-mics-are-open/id1461697859', 'Apple Podcasts'],
              ].map(([href, label]) => (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                   className="tmao-label font-bold opacity-85 border-b-2 border-clay-500 pb-1 hover:text-clay-500">
                  {label}
                </a>
              ))}
            </div>
          </div>

          <div className="bg-[#141416] border border-[#26262A] p-[22px] md:p-8 max-w-[900px]">
            <h2 className="display text-[clamp(30px,7vw,48px)] mb-4">
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
      </section>
    </div>
  );
}

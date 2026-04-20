import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Episode Threads — The Mics Are Open',
};

export default async function ThreadsPage() {
  const supabase = createClient();

  const { data: threads } = await supabase
    .from('tmao_threads')
    .select(`
      id, episode_num, title, description, embed_url, published_at,
      tmao_thread_replies ( id )
    `)
    .order('published_at', { ascending: false });

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <p className="uppercase tracking-[0.3em] text-[9px] font-bold text-clay-500 mb-3 flex items-center gap-3">
          <span className="inline-block w-8 h-px bg-clay-500" />
          Weekly ritual
        </p>
        <div className="w-10 h-0.5 bg-clay-500 mb-4" />
        <h1 className="font-display text-[clamp(48px,7vw,80px)] leading-[0.90] text-ink-800">
          Episode<br />Threads
        </h1>
        <p className="mt-3 text-sm text-ink-600 leading-relaxed">
          Every episode, a new thread. Dig in, react, talk back.
        </p>
      </div>

      {threads && threads.length > 0 ? (
        <div>
          {/* ── Latest thread — featured ── */}
          {(() => {
            const latest = threads[0];
            const replyCount = latest.tmao_thread_replies?.length || 0;
            const date = new Date(latest.published_at).toLocaleDateString(undefined, {
              month: 'long', day: 'numeric', year: 'numeric',
            });
            return (
              <div className="mb-8">
                <p className="uppercase tracking-[0.2em] text-[9px] font-bold text-clay-500 mb-3 flex items-center gap-2">
                  <span className="inline-block w-5 h-px bg-clay-500" />
                  This week
                </p>
                <Link
                  href={`/threads/${latest.id}`}
                  className="card block border border-clay-500/30 hover:border-clay-500/70 transition group"
                >
                  {latest.episode_num && (
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-clay-500 mb-2">
                      Episode {latest.episode_num}
                    </p>
                  )}
                  <h2 className="font-display text-3xl font-semibold text-ink-800 group-hover:text-clay-500 transition leading-tight mb-2">
                    {latest.title}
                  </h2>
                  {latest.description && (
                    <p className="text-sm text-ink-500 leading-relaxed mb-4">
                      {latest.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-ink-400">
                      {date} · {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
                    </p>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-clay-500 group-hover:translate-x-0.5 transition-transform">
                      Join the conversation →
                    </span>
                  </div>
                </Link>
              </div>
            );
          })()}

          {/* ── Older threads ── */}
          {threads.length > 1 && (
            <div>
              <p className="uppercase tracking-[0.2em] text-[9px] font-bold text-ink-400 mb-3 flex items-center gap-2">
                <span className="inline-block w-5 h-px bg-ink-300" />
                Previous episodes
              </p>
              <div className="space-y-2">
                {threads.slice(1).map((thread) => {
                  const replyCount = thread.tmao_thread_replies?.length || 0;
                  const date = new Date(thread.published_at).toLocaleDateString(undefined, {
                    month: 'short', day: 'numeric', year: 'numeric',
                  });
                  return (
                    <Link
                      key={thread.id}
                      href={`/threads/${thread.id}`}
                      className="card block hover:border-clay-500/40 transition group py-3"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          {thread.episode_num && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-clay-500 mr-2">
                              Ep. {thread.episode_num}
                            </span>
                          )}
                          <span className="font-semibold text-ink-700 text-sm group-hover:text-clay-500 transition">
                            {thread.title}
                          </span>
                          <p className="text-[11px] text-ink-400 mt-0.5">
                            {date} · {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
                          </p>
                        </div>
                        <span className="text-clay-500 group-hover:translate-x-0.5 transition-transform shrink-0">→</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="card text-center">
          <p className="text-ink-400 text-sm">
            No threads yet. The first episode drops soon.
          </p>
        </div>
      )}
    </div>
  );
}

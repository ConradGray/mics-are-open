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
        <div className="space-y-4">
          {threads.map((thread) => {
            const replyCount = thread.tmao_thread_replies?.length || 0;
            const date = new Date(thread.published_at).toLocaleDateString(undefined, {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <Link
                key={thread.id}
                href={`/threads/${thread.id}`}
                className="card block hover:border-clay-500/40 transition group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {thread.episode_num && (
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-clay-500 mb-1">
                        Episode {thread.episode_num}
                      </p>
                    )}
                    <h2 className="font-display text-xl font-semibold text-ink-800 group-hover:text-clay-500 transition leading-snug">
                      {thread.title}
                    </h2>
                    {thread.description && (
                      <p className="mt-1 text-sm text-ink-500 line-clamp-2">
                        {thread.description}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-ink-400">
                      {date} · {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
                    </p>
                  </div>

                  <span className="text-clay-500 text-lg group-hover:translate-x-0.5 transition-transform shrink-0 mt-1">
                    →
                  </span>
                </div>
              </Link>
            );
          })}
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

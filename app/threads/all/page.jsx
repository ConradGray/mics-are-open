import { createClient } from '@/lib/supabase/server';
import Chip from '@/components/Chip';
import EpisodeCard from '@/components/EpisodeCard';
import CommunityCta from '@/components/CommunityCta';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'All Episodes — The Mics Are Open',
};

export default async function AllThreadsPage() {
  const supabase = createClient();

  const { data: threads } = await supabase
    .from('tmao_threads')
    .select(`
      id, episode_num, title, description, embed_url, published_at,
      tmao_thread_replies ( id )
    `)
    .order('published_at', { ascending: false });

  const latestNum = threads?.[0]?.episode_num;

  return (
    <div className="page-full">
      <section className="bleed pt-12 lg:pt-20 pb-7">
        <div className="wrap">
          <Chip value={latestNum ? `#${latestNum}` : 'TMAO'} label="Weekly ritual" />
          <h1 className="display mt-[18px] text-[clamp(46px,12vw,120px)]">
            Episode <span className="hl">Threads</span>
          </h1>
          <p className="mt-[18px] max-w-[560px] font-semibold text-ink-700 text-[clamp(15px,3.8vw,18px)]">
            Every episode, a new thread. Dig in, react, talk back.
          </p>
        </div>
      </section>

      <section className="bleed pb-[72px] lg:pb-[110px]">
        <div className="wrap">
          {threads && threads.length > 0 ? (
            <div className="grid gap-3.5 md:grid-cols-2 lg:grid-cols-3">
              {threads.map((thread, i) => (
                <EpisodeCard key={thread.id} thread={thread} index={i} feature={i === 0} />
              ))}
            </div>
          ) : (
            <div className="card text-center">
              <p className="text-ink-400 text-sm">No threads yet. The first episode drops soon.</p>
            </div>
          )}
        </div>
      </section>

      <CommunityCta />
    </div>
  );
}

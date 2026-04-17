import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function HomePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch Hot Take of the Week winner
  const { data: hotTakeWinner } = await supabase
    .from('tmao_posts')
    .select('id, body, author_id, profiles:tmao_profiles(username, display_name)')
    .eq('is_hot_take_winner', true)
    .eq('status', 'approved')
    .maybeSingle();

  return (
    <div className="flex flex-col">

      {/* ── Hero ────────────────────────────────────────── */}
      <div className="pt-12 pb-16 md:pt-20 md:pb-24">
        <p className="uppercase tracking-[0.3em] text-[10px] font-bold text-clay-500 mb-5 flex items-center gap-3">
          <span className="inline-block w-8 h-px bg-clay-500" />
          Kenya&rsquo;s #1 Podcast &nbsp;·&nbsp; Every Friday
        </p>

        <h1 className="font-display text-[clamp(64px,10vw,120px)] leading-[0.90] text-ink-800 mb-6">
          THE MICS<br />ARE OPEN
        </h1>

        <p className="max-w-lg text-base text-ink-600 leading-relaxed mb-10">
          More than a podcast — it&rsquo;s a room full of people who heard the same
          thing and felt something about it. Make a profile, drop something on Open Mic, and
          meet the rest of us.
        </p>

        <div className="flex gap-3 flex-wrap">
          {user ? (
            <Link href="/open-mic" className="btn-primary">
              Open Mic →
            </Link>
          ) : (
            <>
              <Link href="/signup" className="btn-primary">
                Join the community
              </Link>
              <Link href="/login" className="btn-ghost">
                I already have an account
              </Link>
            </>
          )}
        </div>
      </div>

      {/* ── Stats bar ───────────────────────────────────── */}
      <div className="grid grid-cols-3 border border-cream-200 mb-16">
        {[
          ['335+', 'Episodes'],
          ['Every', 'Friday'],
          ['#1', 'In Kenya'],
        ].map(([val, lbl]) => (
          <div key={lbl} className="px-8 py-5 border-r border-cream-200 last:border-r-0">
            <p className="font-display text-4xl text-ink-800 leading-none">{val}</p>
            <p className="text-[9px] font-bold uppercase tracking-[2.5px] text-clay-500 mt-1">{lbl}</p>
          </div>
        ))}
      </div>

      {/* ── Hot Take of the Week ────────────────────────── */}
      <div className="mb-16">
        <p className="uppercase tracking-[0.3em] text-[9px] font-bold text-clay-500 mb-3 flex items-center gap-2">
          🔥 Hot Take of the Week
        </p>
        <div className="w-10 h-0.5 bg-clay-500 mb-6" />

        {hotTakeWinner ? (
          <Link
            href={`/open-mic/${hotTakeWinner.id}`}
            className="block card border-clay-500/40 hover:border-clay-500 transition group"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-clay-500 text-cream-50">
                👑 Winner
              </span>
              <span className="text-xs text-ink-400">
                @{hotTakeWinner.profiles?.username || 'listener'}
              </span>
            </div>
            <p className="text-ink-800 leading-relaxed text-base">
              {hotTakeWinner.body}
            </p>
            <p className="mt-4 text-xs font-semibold text-clay-500 group-hover:underline">
              Read the thread →
            </p>
          </Link>
        ) : (
          <div className="card border-cream-200 text-center py-8">
            <p className="text-ink-400 text-sm">No winner this week yet.</p>
            <p className="text-ink-600 text-sm mt-1">
              Drop your hot take on{' '}
              <Link href="/open-mic" className="text-clay-500 hover:underline font-medium">
                Open Mic
              </Link>{' '}
              — the crew picks every week.
            </p>
          </div>
        )}
      </div>

      {/* ── Feature cards ───────────────────────────────── */}
      <div className="mb-4">
        <p className="uppercase tracking-[0.3em] text-[9px] font-bold text-clay-500 mb-3">
          What&rsquo;s here
        </p>
        <div className="w-10 h-0.5 bg-clay-500 mb-8" />
      </div>

      <section className="grid gap-5 md:grid-cols-3">
        <FeatureCard
          badge="Now live"
          title="Profiles"
          body="Name, place, photo, and a line about how you found the show."
        />
        <FeatureCard
          badge="Now live"
          title="Open Mic"
          body="A rolling feed of listener thoughts, reactions, and moments from the show."
          href="/open-mic"
        />
        <FeatureCard
          badge="Coming soon"
          title="Episode Threads"
          body="Keep talking about the episode long after it ends."
        />
      </section>
    </div>
  );
}

function FeatureCard({ badge, title, body, href }) {
  const Wrapper = href ? Link : 'div';
  const isLive = badge === 'Now live';
  return (
    <Wrapper
      href={href}
      className={`card text-left group ${href ? 'cursor-pointer' : ''} ${
        isLive && href ? 'hover:border-clay-500 transition' : ''
      }`}
    >
      <span
        className={`inline-block text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
          isLive
            ? 'bg-clay-50 text-clay-500 border border-clay-500/30'
            : 'bg-cream-200 text-ink-400 border border-cream-200'
        }`}
      >
        {badge}
      </span>
      <h3 className="mt-4 font-display text-3xl text-ink-800">
        {title}
      </h3>
      <p className="mt-2 text-sm text-ink-600 leading-relaxed">{body}</p>
      {isLive && href && (
        <p className="mt-4 text-xs font-semibold text-clay-500 group-hover:underline">
          Open →
        </p>
      )}
    </Wrapper>
  );
}

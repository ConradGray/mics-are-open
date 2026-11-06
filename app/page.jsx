import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import Chip from '@/components/Chip';
import EpisodeCard from '@/components/EpisodeCard';
import CommunityCta from '@/components/CommunityCta';
import { splitHighlight } from '@/lib/episodes';

export default async function HomePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch Hot Take of the Week — explicitly picked winner
  const { data: hotTakeWinner } = await supabase
    .from('tmao_posts')
    .select(`id, body, author_id,
      tmao_profiles!tmao_posts_author_profile_fk ( username, display_name )`)
    .eq('status', 'approved')
    .eq('is_hot_take_winner', true)
    .maybeSingle();

  // Fetch Listener Spotlight
  const { data: spotlightRow } = await supabase
    .from('tmao_spotlight')
    .select('profile_id, set_at')
    .eq('id', 1)
    .maybeSingle();

  let spotlight = null;
  if (spotlightRow?.profile_id) {
    const { data: sp } = await supabase
      .from('tmao_profiles')
      .select('id, username, display_name, location, bio, avatar_url')
      .eq('id', spotlightRow.profile_id)
      .maybeSingle();
    spotlight = sp;
  }

  // Latest episode threads for the "This Week" hero + recent row.
  // Read-only; same table and columns the /threads/all page already selects.
  const { data: recentThreads } = await supabase
    .from('tmao_threads')
    .select('id, episode_num, title, description, embed_url, published_at, tmao_thread_replies ( id )')
    .order('published_at', { ascending: false })
    .limit(4);

  const latest = recentThreads?.[0] || null;
  const previous = (recentThreads || []).slice(1, 4);
  const latestTitle = latest ? splitHighlight(latest.title) : null;
  const latestDate = latest
    ? new Date(latest.published_at).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  return (
    <div className="page-full flex flex-col">

      {/* ── This Week — thumbnail-style panel for the latest episode ──
          Faces rule: the photo sits in its own frame with no overlay;
          all text lives on the solid black panel. */}
      <section className="bleed split-hero">
        <div className="photo fade-bottom">
          <Image src="/collage/c1.jpg" alt="The Mics Are Open hosts in the studio" fill priority sizes="(min-width:1000px) 60vw, 100vw" className="object-cover" style={{ objectPosition: '50% 40%' }} />
        </div>
        <div className="panel">
          <span className="tmao-label inline-block bg-[#FFD21F] text-[#0A0A0B] px-2.5 py-1.5 mb-3.5">This week</span>
          <br />
          {latest ? (
            <>
              <Chip value={latest.episode_num ? `#${latest.episode_num}` : 'NEW'} label="Every Friday" />
              <h1 className="display mt-4 text-[clamp(44px,12vw,84px)] lg:text-[clamp(44px,5.4vw,84px)]">
                {latestTitle.lead}<span className="hl">{latestTitle.hl}</span>
              </h1>
              <p className="tmao-label mt-4 text-ink-700">{latestDate}</p>
              {latest.description && (
                <p className="mt-3.5 max-w-[600px] font-semibold text-ink-700 text-[clamp(15px,3.8vw,18px)] line-clamp-4">
                  {latest.description}
                </p>
              )}
              <div className="flex flex-wrap gap-2.5 mt-6">
                <Link href={`/threads/${latest.id}`} className="btn-primary">Watch &amp; reply →</Link>
                <Link href="/listen" className="btn-ghost">Listen</Link>
              </div>
            </>
          ) : (
            <>
              <Chip value="#1" label="Every Friday" />
              <h1 className="display mt-4 text-[clamp(44px,12vw,84px)] lg:text-[clamp(44px,5.4vw,84px)]">
                The Mics <span className="hl">Are Open</span>
              </h1>
            </>
          )}
        </div>
      </section>

      {/* ── Intro + stats ───────────────────────────────── */}
      <section className="bleed py-[72px] lg:py-[110px]">
        <div className="wrap">
          <p className="section-label">Kenya&rsquo;s #1 Podcast · Every Friday</p>
          <h2 className="display text-[clamp(34px,8.5vw,72px)]">The Mics <span className="hl">Are Open</span></h2>
          <p className="text-ink-700 text-[17px] max-w-[640px] mt-5 mb-2.5">
            Seven years of Fridays, and the conversation never stops. Make a profile,
            drop your take on Open Mic, and find the people who felt the same thing you did.
          </p>
          <p className="text-ink-700 text-[17px] max-w-[640px] mb-7">
            <span className="font-bold text-white">7 years and counting.</span>{' '}
            We built this site for you — it&rsquo;s been 7 great years and this is your website.
          </p>
          <div className="flex gap-2.5 flex-wrap">
            {user ? (
              <Link href="/open-mic" className="btn-primary">Open Mic →</Link>
            ) : (
              <>
                <Link href="/signup" className="btn-primary">Join the community</Link>
                <Link href="/login" className="btn-ghost">I already have an account</Link>
              </>
            )}
          </div>
          <div className="stats mt-11">
            <div><strong>#1</strong><span className="tmao-label block mt-2.5">In Kenya</span></div>
            <div><strong>500+</strong><span className="tmao-label block mt-2.5">Episodes &amp; Minisodes</span></div>
            <div><strong>Every</strong><span className="tmao-label block mt-2.5">Friday</span></div>
            <div><strong>7 yrs</strong><span className="tmao-label block mt-2.5">And counting</span></div>
          </div>
        </div>
      </section>

      {/* ── Recent episode threads ──────────────────────── */}
      {previous.length > 0 && (
        <section className="bleed pb-[72px] lg:pb-[110px]">
          <div className="wrap">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
              <div>
                <p className="section-label">Weekly ritual</p>
                <h2 className="display text-[clamp(34px,8.5vw,72px)]">Episode <span className="hl">Threads</span></h2>
              </div>
              <Link href="/threads/all" className="tmao-label border-b-2 border-clay-500 pb-1 font-extrabold">All episodes →</Link>
            </div>
            <div className="grid gap-3.5 md:grid-cols-2 lg:grid-cols-3">
              {previous.map((t, i) => <EpisodeCard key={t.id} thread={t} index={i + 1} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── What's here: Hot Take, Spotlight, features ──── */}
      <section className="bleed pb-[72px] lg:pb-[110px]">
        <div className="wrap">
          <p className="section-label">What&rsquo;s here</p>
          <h2 className="display text-[clamp(34px,8.5vw,72px)] mb-7">This is <span className="hl-y">your website.</span></h2>

          <div className="grid gap-3.5 md:grid-cols-2 lg:grid-cols-3">
            {/* Hot Take of the Week */}
            {hotTakeWinner ? (
              <Link href={`/open-mic/${hotTakeWinner.id}`} className="block bg-clay-500 p-6 group">
                <Chip small tone="y" value="🔥" label="Hot Take of the Week" className="mb-4" />
                <p className="tmao-label text-white mb-2">👑 Winner · @{hotTakeWinner.tmao_profiles?.username || 'listener'}</p>
                <p className="font-extrabold text-white text-[clamp(19px,5vw,24px)] leading-snug">{hotTakeWinner.body}</p>
                <span className="inline-block mt-4 tmao-label font-extrabold border-b-2 border-white pb-1">Read the thread →</span>
              </Link>
            ) : (
              <div className="card">
                <Chip small tone="y" value="🔥" label="Hot Take of the Week" className="mb-4" />
                <p className="text-ink-600 text-sm">No winner this week yet.</p>
                <p className="text-ink-500 text-sm mt-1">
                  Drop your hot take on{' '}
                  <Link href="/open-mic" className="text-clay-500 hover:underline font-semibold">Open Mic</Link>{' '}
                  — the crew picks every week.
                </p>
              </div>
            )}

            {/* Listener Spotlight */}
            {spotlight ? (
              <Link href={`/u/${spotlight.username}`} className="card block hover:border-clay-500 transition group">
                <Chip small tone="p" value="⭐" label="Listener Spotlight" className="mb-4" />
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-full bg-[#26262A] overflow-hidden flex items-center justify-center shrink-0">
                    {spotlight.avatar_url ? (
                      <Image src={spotlight.avatar_url} alt={spotlight.display_name || spotlight.username} fill sizes="64px" className="object-cover" />
                    ) : (
                      <span className="display text-2xl text-clay-500">
                        {(spotlight.display_name || spotlight.username || '?').slice(0, 1).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[clamp(22px,6vw,30px)]">{spotlight.display_name || spotlight.username}</h3>
                    {spotlight.username && <p className="tmao-label text-ink-600 mt-1.5 text-[10px]">@{spotlight.username}</p>}
                  </div>
                </div>
                {spotlight.location && <p className="text-ink-500 text-sm mt-3">📍 {spotlight.location}</p>}
                {spotlight.bio && (
                  <p className="mt-3 text-ink-700 text-sm leading-relaxed line-clamp-3">&ldquo;{spotlight.bio}&rdquo;</p>
                )}
                <span className="inline-block mt-4 tmao-label font-extrabold border-b-2 border-clay-500 pb-1">View profile →</span>
              </Link>
            ) : (
              <div className="card">
                <Chip small tone="p" value="⭐" label="Listener Spotlight" className="mb-4" />
                <p className="text-ink-600 text-sm">No spotlight this week yet.</p>
                <p className="text-ink-500 text-sm mt-1">Check back soon.</p>
              </div>
            )}

            <FeatureCard tone="r" value="Live" label="Now live" title="Profiles" body="Name, place, photo, and a line about how you found the show." href={user ? '/me' : '/signup'} cta={user ? 'My profile →' : 'Join TMAO →'} />
            <FeatureCard tone="y" value="Live" label="Now live" title="Open Mic" body="A rolling feed of listener thoughts, reactions, and moments from the show." href="/open-mic" />
            <FeatureCard tone="p" value="Live" label="Now live" title="Episode Threads" body="Keep talking about the episode long after it ends." href="/threads" />
            <FeatureCard tone="r" value="#1" label="Kenya’s Podcast" title="The crew" body="G Money, Calvin, Ashley and Andy Young." href="/about" cta="About →" />
          </div>
        </div>
      </section>

      {/* ── Studio strip (photos in their own frames, chip below) ── */}
      <section className="bleed grid md:grid-cols-[1.4fr_1fr] gap-1.5">
        <figure className="bg-[#0A0A0B]">
          <div className="photo aspect-video">
            <Image src="/collage/c3.jpg" alt="Studio session" fill sizes="(min-width:768px) 58vw, 100vw" className="object-cover" />
          </div>
          <figcaption className="p-3"><Chip small value="Fri" label="Every Friday" /></figcaption>
        </figure>
        <figure className="bg-[#0A0A0B]">
          <div className="photo aspect-video">
            <Image src="/collage/c5.jpg" alt="Studio session" fill sizes="(min-width:768px) 42vw, 100vw" className="object-cover" />
          </div>
        </figure>
      </section>

      <CommunityCta />
    </div>
  );
}

function FeatureCard({ tone, value, label, title, body, href, cta = 'Open →' }) {
  return (
    <Link href={href} className="card block hover:border-clay-500 transition group">
      <Chip small tone={tone} value={value} label={label} className="mb-4" />
      <h3 className="text-[clamp(26px,6.8vw,40px)]">{title}</h3>
      <p className="mt-3 text-ink-700 text-sm leading-relaxed">{body}</p>
      <span className="inline-block mt-4 tmao-label font-extrabold border-b-2 border-clay-500 pb-1">{cta}</span>
    </Link>
  );
}
